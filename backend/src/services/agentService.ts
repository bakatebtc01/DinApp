import { query } from "../db";
import logger from "../utils/logger";
import * as walletService from "./walletService";
import * as ledgerService from "./ledgerService";
import * as otpService from "./otpService";
import * as pinService from "./pinService";

export interface AgentProfile {
  id: string;
  userId: string;
  walletId: string;
  licenseNumber: string;
  region: string;
  isActive: boolean;
}

/**
 * Onboard a new Agent.
 */
export const onboardAgent = async (
  userId: string,
  licenseNumber: string,
  region: string,
): Promise<AgentProfile> => {
  // 1. Create agent wallet
  const wallet = await walletService.createWallet(userId, "agent", "PGK");

  // 2. Create agent profile
  const sql = `
        INSERT INTO agent_profiles (user_id, wallet_id, license_number, region)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
  const res = await query(sql, [userId, wallet.id, licenseNumber, region]);

  logger.info(`Agent onboarded: User ${userId} | License ${licenseNumber}`);
  return {
    id: res.rows[0].id,
    userId: res.rows[0].user_id,
    walletId: res.rows[0].wallet_id,
    licenseNumber: res.rows[0].license_number,
    region: res.rows[0].region,
    isActive: res.rows[0].is_active,
  };
};

/**
 * Secure Payout Flow: Agent pays User cash, system debits user and credits agent (plus fee).
 * For simplicity in this flow, User initiates "Withdrawal" via OTP/PIN confirmation at Agent.
 */
export const processPayout = async (
  agentWalletId: string,
  userWalletId: string,
  amount: number,
  otp: string,
  pin: string,
  userPhone: string,
  userId: string,
): Promise<string> => {
  // 1. Verify User OTP
  const isOtpValid = await otpService.verifyOtp(userPhone, otp);
  if (!isOtpValid) throw new Error("Invalid OTP");

  // 2. Verify User PIN (via pinService)
  // Note: in a real app, the user enters this on their own device or securely on agent's app
  // For sandbox, we verify against the stored hash
  const isPinValid = await pinService.verifyPin(userId, pin);
  if (!isPinValid) throw new Error("Invalid PIN");

  // 3. Execute Transfer (Atomic)
  // User pays Agent (User balance decreases, Agent float increases)
  const transactionId = await ledgerService.executeTransfer({
    fromWalletId: userWalletId,
    toWalletId: agentWalletId,
    amount: amount,
    transactionType: "agent_payout",
    description: `Cash payout via Agent ${agentWalletId}`,
  });

  logger.info(`Payout processed: ${transactionId} | Amount: ${amount}`);
  return transactionId;
};

/**
 * Top up Agent Float (Platform -> Agent)
 */
export const topUpFloat = async (
  agentWalletId: string,
  amount: number,
  platformWalletId: string,
): Promise<string> => {
  return await ledgerService.executeTransfer({
    fromWalletId: platformWalletId,
    toWalletId: agentWalletId,
    amount: amount,
    transactionType: "agent_deposit",
    description: "Agent float top-up",
  });
};
