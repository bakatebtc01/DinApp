import pool, { query } from "../db";
import { v4 as uuidv4 } from "uuid";
import * as streamingService from "./streamingService";
import * as walletService from "./walletService";
import logger from "../utils/logger";

// Revenue split constants
const CREATOR_SHARE = 0.55; // 55%
const PLATFORM_SHARE = 0.45; // 45%

export interface Gift {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  price: number;
  currency: string;
  effect_type: string | null;
  is_active: boolean;
  is_premium: boolean;
}

export interface GiftTransaction {
  id: string;
  session_id: string;
  gift_id: string;
  sender_wallet_id: string;
  receiver_wallet_id: string;
  quantity: number;
  total_amount: number;
  creator_amount: number;
  platform_amount: number;
  transaction_id: string;
}

/**
 * Get all active gifts from catalog.
 */
export const getGiftCatalog = async (): Promise<Gift[]> => {
  const sql = `
    SELECT * FROM gift_catalog 
    WHERE is_active = TRUE 
    ORDER BY sort_order ASC;
  `;
  const res = await query(sql, []);
  return res.rows;
};

/**
 * Get a specific gift by ID.
 */
export const getGift = async (giftId: string): Promise<Gift | null> => {
  const sql = `SELECT * FROM gift_catalog WHERE id = $1;`;
  const res = await query(sql, [giftId]);
  return res.rows[0] || null;
};

interface SendGiftParams {
  sessionId: string;
  giftId: string;
  senderWalletId: string;
  quantity?: number;
  message?: string;
}

/**
 * Send a gift during a livestream with 55/45 revenue split.
 * This is atomic - wallet debit, gift record, and session update all succeed or fail together.
 */
export const sendGift = async (
  params: SendGiftParams,
): Promise<GiftTransaction> => {
  const { sessionId, giftId, senderWalletId, quantity = 1, message } = params;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Get session and validate it's live
    const sessionRes = await client.query(
      `SELECT * FROM livestream_sessions WHERE id = $1 AND status = 'live' FOR UPDATE`,
      [sessionId],
    );
    if (!sessionRes.rows.length) {
      throw new Error("Session not found or not live");
    }
    const session = sessionRes.rows[0];

    // 2. Get gift details
    const giftRes = await client.query(
      `SELECT * FROM gift_catalog WHERE id = $1 AND is_active = TRUE`,
      [giftId],
    );
    if (!giftRes.rows.length) {
      throw new Error("Gift not found or not available");
    }
    const gift = giftRes.rows[0];

    // 3. Calculate amounts
    const totalAmount = parseFloat(gift.price) * quantity;
    const creatorAmount = totalAmount * CREATOR_SHARE;
    const platformAmount = totalAmount * PLATFORM_SHARE;

    // 4. Get sender wallet and lock it
    const senderRes = await client.query(
      `SELECT * FROM wallets WHERE id = $1 FOR UPDATE`,
      [senderWalletId],
    );
    if (!senderRes.rows.length) {
      throw new Error("Sender wallet not found");
    }
    const senderWallet = senderRes.rows[0];

    if (parseFloat(senderWallet.balance) < totalAmount) {
      throw new Error("Insufficient balance");
    }

    // 5. Get or create platform revenue wallet
    // For simplicity, we'll transfer directly to creator and track platform share
    const creatorWalletId = session.creator_wallet_id;

    // 6. Debit sender wallet
    const newSenderBalance = parseFloat(senderWallet.balance) - totalAmount;
    await client.query(
      `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2`,
      [newSenderBalance, senderWalletId],
    );

    // 7. Credit creator wallet (only creator share goes to creator)
    const creatorRes = await client.query(
      `SELECT balance FROM wallets WHERE id = $1 FOR UPDATE`,
      [creatorWalletId],
    );
    const newCreatorBalance =
      parseFloat(creatorRes.rows[0].balance) + creatorAmount;
    await client.query(
      `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2`,
      [newCreatorBalance, creatorWalletId],
    );

    // 8. Create transaction ID for ledger
    const transactionId = uuidv4();

    // 9. Create ledger entries (debit sender)
    await client.query(
      `INSERT INTO ledger_entries 
        (transaction_id, wallet_id, entry_type, transaction_type, amount, description, balance_after)
       VALUES ($1, $2, 'debit', 'gift', $3, $4, $5)`,
      [
        transactionId,
        senderWalletId,
        totalAmount,
        `Gift: ${gift.name} x${quantity}`,
        newSenderBalance,
      ],
    );

    // 10. Create ledger entries (credit creator - their share)
    await client.query(
      `INSERT INTO ledger_entries 
        (transaction_id, wallet_id, entry_type, transaction_type, amount, description, balance_after)
       VALUES ($1, $2, 'credit', 'gift', $3, $4, $5)`,
      [
        transactionId,
        creatorWalletId,
        creatorAmount,
        `Gift received: ${gift.name} x${quantity} (55%)`,
        newCreatorBalance,
      ],
    );

    // 11. Create ledger entry for platform fee (tracked but not transferred to separate wallet in this simple version)
    // In production, this would go to a platform revenue wallet
    await client.query(
      `INSERT INTO ledger_entries 
        (transaction_id, wallet_id, entry_type, transaction_type, amount, description, balance_after)
       VALUES ($1, $2, 'credit', 'platform_fee', $3, $4, $5)`,
      [
        transactionId,
        creatorWalletId,
        platformAmount,
        `Platform fee: ${gift.name} x${quantity} (45%)`,
        newCreatorBalance,
      ],
    );

    // 12. Create gift transaction record
    const giftTxRes = await client.query(
      `INSERT INTO gift_transactions (
        session_id, gift_id, sender_wallet_id, receiver_wallet_id,
        quantity, unit_price, total_amount, currency,
        creator_amount, platform_amount, transaction_id, message
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        sessionId,
        giftId,
        senderWalletId,
        creatorWalletId,
        quantity,
        gift.price,
        totalAmount,
        gift.currency,
        creatorAmount,
        platformAmount,
        transactionId,
        message || null,
      ],
    );

    // 13. Update session earnings
    await client.query(
      `UPDATE livestream_sessions SET
        total_gifts_received = total_gifts_received + $2,
        total_gift_value = total_gift_value + $3,
        creator_earnings = creator_earnings + $4,
        platform_earnings = platform_earnings + $5,
        updated_at = NOW()
       WHERE id = $1`,
      [sessionId, quantity, totalAmount, creatorAmount, platformAmount],
    );

    await client.query("COMMIT");

    logger.info(
      `Gift sent: ${gift.name} x${quantity} | Creator: ${creatorAmount} | Platform: ${platformAmount}`,
    );

    return giftTxRes.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error("Send gift failed:", error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get gift history for a session.
 */
export const getSessionGifts = async (
  sessionId: string,
  limit: number = 100,
): Promise<GiftTransaction[]> => {
  const sql = `
    SELECT gt.*, gc.name as gift_name, gc.icon_url, gc.effect_type
    FROM gift_transactions gt
    JOIN gift_catalog gc ON gt.gift_id = gc.id
    WHERE gt.session_id = $1
    ORDER BY gt.created_at DESC
    LIMIT $2;
  `;
  const res = await query(sql, [sessionId, limit]);
  return res.rows;
};

/**
 * Get total earnings for a creator.
 */
export const getCreatorEarnings = async (
  creatorWalletId: string,
): Promise<{
  totalGifts: number;
  totalValue: number;
  creatorEarnings: number;
  platformFees: number;
}> => {
  const sql = `
    SELECT 
      COALESCE(SUM(total_gifts_received), 0) as total_gifts,
      COALESCE(SUM(total_gift_value), 0) as total_value,
      COALESCE(SUM(creator_earnings), 0) as creator_earnings,
      COALESCE(SUM(platform_earnings), 0) as platform_fees
    FROM livestream_sessions
    WHERE creator_wallet_id = $1;
  `;
  const res = await query(sql, [creatorWalletId]);
  return {
    totalGifts: parseInt(res.rows[0].total_gifts) || 0,
    totalValue: parseFloat(res.rows[0].total_value) || 0,
    creatorEarnings: parseFloat(res.rows[0].creator_earnings) || 0,
    platformFees: parseFloat(res.rows[0].platform_fees) || 0,
  };
};
