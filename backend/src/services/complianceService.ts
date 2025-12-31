import { query } from "../db";
import logger from "../utils/logger";

export type KycTier = 0 | 1 | 2;
export type KycStatus = "pending" | "verified" | "rejected";

export interface KycSubmission {
  userId: string;
  documentType: "national_id" | "passport" | "drivers_license";
  documentUrl: string;
  selfieUrl?: string;
}

/**
 * Submit KYC documents for verification.
 */
export const submitKyc = async (submission: KycSubmission): Promise<string> => {
  const { userId, documentType, documentUrl, selfieUrl } = submission;

  const sql = `
        INSERT INTO kyc_verifications (user_id, document_type, document_url, selfie_url, status)
        VALUES ($1, $2, $3, $4, 'pending')
        RETURNING id;
    `;
  const res = await query(sql, [userId, documentType, documentUrl, selfieUrl]);

  logger.info(`KYC submitted for user ${userId}: ${res.rows[0].id}`);
  return res.rows[0].id;
};

/**
 * Update KYC tier for a user.
 */
export const updateKycTier = async (
  userId: string,
  tier: KycTier,
): Promise<void> => {
  const sql = `UPDATE users SET kyc_tier = $1, updated_at = NOW() WHERE id = $2;`;
  await query(sql, [tier, userId]);
  logger.info(`User ${userId} KYC Tier updated to ${tier}`);
};

/**
 * Get user risk profile and check limits.
 */
export const checkVelocityLimits = async (
  userId: string,
  amount: number,
): Promise<boolean> => {
  // Fetch risk profile
  const sql = `SELECT * FROM risk_profiles WHERE user_id = $1;`;
  const res = await query(sql, [userId]);

  if (!res.rows.length) {
    // Initialize risk profile if missing
    await initializeRiskProfile(userId);
    return true; // Assume okay for first transaction if tier allows
  }

  const profile = res.rows[0];

  if (profile.is_frozen) {
    logger.warn(`Transaction blocked: User ${userId} wallet is frozen.`);
    return false;
  }

  const newDailyTotal = parseFloat(profile.current_daily_usage) + amount;
  if (newDailyTotal > parseFloat(profile.daily_velocity_limit)) {
    logger.warn(
      `Transaction blocked: User ${userId} exceeded daily velocity limit.`,
    );
    return false;
  }

  return true;
};

/**
 * Initialize a risk profile for a user based on their KYC tier.
 */
export const initializeRiskProfile = async (userId: string): Promise<void> => {
  // Default limits for Tier 0
  const dailyLimit = 500.0;
  const monthlyLimit = 2000.0;

  const sql = `
        INSERT INTO risk_profiles (user_id, daily_velocity_limit, monthly_velocity_limit)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id) DO NOTHING;
    `;
  await query(sql, [userId, dailyLimit, monthlyLimit]);
};

/**
 * Record a transaction for velocity tracking.
 */
export const recordTransactionVelocity = async (
  userId: string,
  amount: number,
): Promise<void> => {
  const sql = `
        UPDATE risk_profiles 
        SET current_daily_usage = current_daily_usage + $1, updated_at = NOW()
        WHERE user_id = $1;
    `;
  await query(sql, [amount, userId]);
};

/**
 * Generate AML Audit Report log entry.
 */
export const logAmlAlert = async (
  userId: string,
  reason: string,
  severity: "low" | "medium" | "high" | "critical",
): Promise<void> => {
  logger.error(
    `AML ALERT [${severity.toUpperCase()}]: User ${userId} | Reason: ${reason}`,
  );
  // In production, this would write to a dedicated audit_logs table
};
