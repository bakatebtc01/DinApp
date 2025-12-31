import { query } from "../db";
import logger from "../utils/logger";

export type WalletType =
  | "personal"
  | "creator"
  | "merchant"
  | "agent"
  | "escrow"
  | "platform";

export interface Wallet {
  id: string;
  user_id: string;
  wallet_type: WalletType;
  currency: string;
  balance: number;
  status: string;
  created_at: Date;
}

export const createWallet = async (
  userId: string,
  walletType: WalletType,
  currency: string = "PGK",
): Promise<Wallet> => {
  const sql = `
    INSERT INTO wallets (user_id, wallet_type, currency)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const res = await query(sql, [userId, walletType, currency]);
  logger.info(`Wallet created: ${walletType} for user ${userId}`);
  return res.rows[0];
};

export const getWalletsByUserId = async (userId: string): Promise<Wallet[]> => {
  const sql = `SELECT * FROM wallets WHERE user_id = $1 ORDER BY created_at;`;
  const res = await query(sql, [userId]);
  return res.rows;
};

export const getWalletById = async (
  walletId: string,
): Promise<Wallet | null> => {
  const sql = `SELECT * FROM wallets WHERE id = $1;`;
  const res = await query(sql, [walletId]);
  return res.rows[0] || null;
};

export const getWalletByUserAndType = async (
  userId: string,
  walletType: WalletType,
): Promise<Wallet | null> => {
  const sql = `SELECT * FROM wallets WHERE user_id = $1 AND wallet_type = $2;`;
  const res = await query(sql, [userId, walletType]);
  return res.rows[0] || null;
};

export const freezeWallet = async (walletId: string): Promise<boolean> => {
  const sql = `UPDATE wallets SET status = 'frozen', updated_at = NOW() WHERE id = $1;`;
  await query(sql, [walletId]);
  logger.warn(`Wallet frozen: ${walletId}`);
  return true;
};

export const unfreezeWallet = async (walletId: string): Promise<boolean> => {
  const sql = `UPDATE wallets SET status = 'active', updated_at = NOW() WHERE id = $1;`;
  await query(sql, [walletId]);
  logger.info(`Wallet unfrozen: ${walletId}`);
  return true;
};

// Auto-create default personal wallet on user signup
export const createDefaultWalletForUser = async (
  userId: string,
): Promise<Wallet> => {
  return createWallet(userId, "personal", "PGK");
};
