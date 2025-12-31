import { query } from "../db";
import logger from "../utils/logger";

export interface VendorReputation {
  id: string;
  merchant_wallet_id: string;
  total_transactions: number;
  successful_transactions: number;
  disputed_transactions: number;
  average_rating: number;
  trust_score: number;
  is_verified: boolean;
  is_flagged: boolean;
}

/**
 * Initialize reputation record for a new merchant.
 */
export const initializeReputation = async (
  merchantWalletId: string,
): Promise<VendorReputation> => {
  const sql = `
    INSERT INTO vendor_reputation (merchant_wallet_id)
    VALUES ($1)
    ON CONFLICT (merchant_wallet_id) DO NOTHING
    RETURNING *;
  `;
  const res = await query(sql, [merchantWalletId]);

  if (!res.rows.length) {
    // Already exists, fetch it
    return getReputation(merchantWalletId) as Promise<VendorReputation>;
  }

  return res.rows[0];
};

/**
 * Get reputation for a merchant.
 */
export const getReputation = async (
  merchantWalletId: string,
): Promise<VendorReputation | null> => {
  const sql = `SELECT * FROM vendor_reputation WHERE merchant_wallet_id = $1;`;
  const res = await query(sql, [merchantWalletId]);
  return res.rows[0] || null;
};

/**
 * Record a successful transaction.
 */
export const recordSuccessfulTransaction = async (
  merchantWalletId: string,
): Promise<void> => {
  const sql = `
    UPDATE vendor_reputation 
    SET 
      total_transactions = total_transactions + 1,
      successful_transactions = successful_transactions + 1,
      trust_score = LEAST(100, trust_score + 0.1),
      updated_at = NOW()
    WHERE merchant_wallet_id = $1;
  `;
  await query(sql, [merchantWalletId]);
};

/**
 * Record a disputed transaction.
 */
export const recordDisputedTransaction = async (
  merchantWalletId: string,
): Promise<void> => {
  const sql = `
    UPDATE vendor_reputation 
    SET 
      disputed_transactions = disputed_transactions + 1,
      trust_score = GREATEST(0, trust_score - 5),
      updated_at = NOW()
    WHERE merchant_wallet_id = $1;
  `;
  await query(sql, [merchantWalletId]);
  logger.warn(`Dispute recorded for merchant: ${merchantWalletId}`);
};

/**
 * Add a rating for a merchant.
 */
export const addRating = async (
  merchantWalletId: string,
  payerWalletId: string,
  transactionId: string,
  rating: number,
  comment?: string,
): Promise<void> => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Insert rating
  const insertSql = `
    INSERT INTO vendor_ratings (merchant_wallet_id, payer_wallet_id, transaction_id, rating, comment)
    VALUES ($1, $2, $3, $4, $5);
  `;
  await query(insertSql, [
    merchantWalletId,
    payerWalletId,
    transactionId,
    rating,
    comment || null,
  ]);

  // Update reputation with new average
  const updateSql = `
    UPDATE vendor_reputation 
    SET 
      total_ratings = total_ratings + 1,
      rating_sum = rating_sum + $2,
      average_rating = (rating_sum + $2)::DECIMAL / (total_ratings + 1),
      updated_at = NOW()
    WHERE merchant_wallet_id = $1;
  `;
  await query(updateSql, [merchantWalletId, rating]);

  logger.info(`Rating ${rating}/5 added for merchant: ${merchantWalletId}`);
};

/**
 * Flag a vendor for review.
 */
export const flagVendor = async (
  merchantWalletId: string,
  reason: string,
): Promise<void> => {
  const sql = `
    UPDATE vendor_reputation 
    SET is_flagged = TRUE, flag_reason = $2, updated_at = NOW()
    WHERE merchant_wallet_id = $1;
  `;
  await query(sql, [merchantWalletId, reason]);
  logger.warn(`Vendor flagged: ${merchantWalletId} | Reason: ${reason}`);
};

/**
 * Verify a vendor (admin action).
 */
export const verifyVendor = async (merchantWalletId: string): Promise<void> => {
  const sql = `
    UPDATE vendor_reputation 
    SET is_verified = TRUE, updated_at = NOW()
    WHERE merchant_wallet_id = $1;
  `;
  await query(sql, [merchantWalletId]);
  logger.info(`Vendor verified: ${merchantWalletId}`);
};

/**
 * Get top vendors by rating.
 */
export const getTopVendors = async (
  limit: number = 10,
): Promise<VendorReputation[]> => {
  const sql = `
    SELECT * FROM vendor_reputation 
    WHERE is_flagged = FALSE AND total_transactions >= 5
    ORDER BY average_rating DESC, trust_score DESC
    LIMIT $1;
  `;
  const res = await query(sql, [limit]);
  return res.rows;
};
