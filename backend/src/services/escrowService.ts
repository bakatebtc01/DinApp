import { query } from "../db";
import logger from "../utils/logger";
import * as ledgerService from "./ledgerService";

/**
 * Lock funds in an escrow wallet.
 */
export const lockFunds = async (
  sourceWalletId: string,
  escrowWalletId: string,
  amount: number,
  purpose: string,
  referenceId?: string,
): Promise<string> => {
  // 1. Move funds from source to escrow
  const transactionId = await ledgerService.executeTransfer({
    fromWalletId: sourceWalletId,
    toWalletId: escrowWalletId,
    amount: amount,
    transactionType: "escrow_lock",
    description: `Escrow Lock: ${purpose}`,
    referenceId: referenceId,
  });

  // 2. Create record in escrow_records
  const sql = `
        INSERT INTO escrow_records (
            escrow_wallet_id, source_wallet_id, amount, purpose, reference_id, status
        )
        VALUES ($1, $2, $3, $4, $5, 'locked');
    `;
  await query(sql, [
    escrowWalletId,
    sourceWalletId,
    amount,
    purpose,
    referenceId,
  ]);

  logger.info(
    `Funds locked in escrow ${escrowWalletId}: ${amount} (Ref: ${referenceId})`,
  );
  return transactionId;
};

/**
 * Release funds from escrow to a destination wallet.
 */
export const releaseFunds = async (
  escrowWalletId: string,
  destinationWalletId: string,
  amount: number,
  referenceId: string,
): Promise<string> => {
  // 1. Move funds from escrow to destination
  const transactionId = await ledgerService.executeTransfer({
    fromWalletId: escrowWalletId,
    toWalletId: destinationWalletId,
    amount: amount,
    transactionType: "escrow_release",
    description: `Escrow Release for Ref: ${referenceId}`,
  });

  // 2. Update status
  const sql = `
        UPDATE escrow_records 
        SET status = 'released', destination_wallet_id = $2, updated_at = NOW()
        WHERE escrow_wallet_id = $1 AND reference_id = $3 AND status = 'locked';
    `;
  await query(sql, [escrowWalletId, destinationWalletId, referenceId]);

  logger.info(
    `Funds released from escrow ${escrowWalletId} to ${destinationWalletId}`,
  );
  return transactionId;
};

/**
 * Refund funds from escrow back to the source wallet.
 */
export const refundEscrow = async (
  escrowWalletId: string,
  referenceId: string,
): Promise<string> => {
  // 1. Find source wallet
  const findSql = `SELECT source_wallet_id, amount FROM escrow_records WHERE escrow_wallet_id = $1 AND reference_id = $2 AND status = 'locked';`;
  const res = await query(findSql, [escrowWalletId, referenceId]);

  if (!res.rows.length)
    throw new Error("Escrow record not found or already processed");

  const { source_wallet_id, amount } = res.rows[0];

  // 2. Move funds back
  const transactionId = await ledgerService.executeTransfer({
    fromWalletId: escrowWalletId,
    toWalletId: source_wallet_id,
    amount: parseFloat(amount),
    transactionType: "transfer", // Generic refund transfer
    description: `Escrow Refund for Ref: ${referenceId}`,
  });

  // 3. Update status
  const sql = `
        UPDATE escrow_records SET status = 'refunded', updated_at = NOW()
        WHERE escrow_wallet_id = $1 AND reference_id = $2;
    `;
  await query(sql, [escrowWalletId, referenceId]);

  logger.info(
    `Funds refunded from escrow ${escrowWalletId} to ${source_wallet_id}`,
  );
  return transactionId;
};
