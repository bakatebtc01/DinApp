import { query } from "../db";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";

export interface Receipt {
  id: string;
  transaction_id: string;
  payer_wallet_id: string;
  payee_wallet_id: string;
  amount: number;
  currency: string;
  receipt_number: string;
  payer_name: string;
  payee_name: string;
  confirmed_at: Date;
  audio_played: boolean;
}

interface CreateReceiptParams {
  transactionId: string;
  payerWalletId: string;
  payeeWalletId: string;
  amount: number;
  currency?: string;
  description?: string;
  payerName?: string;
  payeeName?: string;
}

/**
 * Generate a unique receipt number.
 * Format: DIN-YYYYMMDD-XXXXX
 */
const generateReceiptNumber = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `DIN-${dateStr}-${random}`;
};

/**
 * Create a receipt for a completed transaction.
 */
export const createReceipt = async (
  params: CreateReceiptParams,
): Promise<Receipt> => {
  const {
    transactionId,
    payerWalletId,
    payeeWalletId,
    amount,
    currency = "PGK",
    description,
    payerName,
    payeeName,
  } = params;

  const receiptNumber = generateReceiptNumber();

  const sql = `
    INSERT INTO receipts (
      transaction_id, payer_wallet_id, payee_wallet_id, 
      amount, currency, description, receipt_number, 
      payer_name, payee_name
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const res = await query(sql, [
    transactionId,
    payerWalletId,
    payeeWalletId,
    amount,
    currency,
    description || null,
    receiptNumber,
    payerName || "User",
    payeeName || "Merchant",
  ]);

  logger.info(
    `Receipt created: ${receiptNumber} for transaction ${transactionId}`,
  );
  return res.rows[0];
};

/**
 * Get receipt by transaction ID.
 */
export const getReceiptByTransaction = async (
  transactionId: string,
): Promise<Receipt | null> => {
  const sql = `SELECT * FROM receipts WHERE transaction_id = $1;`;
  const res = await query(sql, [transactionId]);
  return res.rows[0] || null;
};

/**
 * Get receipt by receipt number.
 */
export const getReceiptByNumber = async (
  receiptNumber: string,
): Promise<Receipt | null> => {
  const sql = `SELECT * FROM receipts WHERE receipt_number = $1;`;
  const res = await query(sql, [receiptNumber]);
  return res.rows[0] || null;
};

/**
 * Mark audio confirmation as played.
 */
export const markAudioPlayed = async (receiptId: string): Promise<void> => {
  const sql = `
    UPDATE receipts 
    SET audio_played = TRUE, audio_played_at = NOW() 
    WHERE id = $1;
  `;
  await query(sql, [receiptId]);
  logger.info(`Audio confirmation played for receipt: ${receiptId}`);
};

/**
 * Record a print event.
 */
export const recordPrint = async (receiptId: string): Promise<void> => {
  const sql = `
    UPDATE receipts 
    SET print_count = print_count + 1, last_printed_at = NOW() 
    WHERE id = $1;
  `;
  await query(sql, [receiptId]);
};

/**
 * Generate printable receipt data.
 */
export const generatePrintableReceipt = async (
  receiptId: string,
): Promise<string> => {
  const sql = `SELECT * FROM receipts WHERE id = $1;`;
  const res = await query(sql, [receiptId]);

  if (!res.rows.length) {
    throw new Error("Receipt not found");
  }

  const receipt = res.rows[0];

  // Simple text-based receipt for thermal printers
  const printData = `
================================
        DINAPP RECEIPT
================================
Receipt No: ${receipt.receipt_number}
Date: ${new Date(receipt.confirmed_at).toLocaleString()}
--------------------------------
From: ${receipt.payer_name}
To: ${receipt.payee_name}
--------------------------------
Amount: ${receipt.currency} ${parseFloat(receipt.amount).toFixed(2)}
${receipt.description ? `Note: ${receipt.description}` : ""}
--------------------------------
Transaction ID:
${receipt.transaction_id}
================================
   Payment Confirmed ✓
================================
`;

  await recordPrint(receiptId);
  return printData;
};

/**
 * Get audio confirmation message.
 */
export const getAudioConfirmationMessage = async (
  receiptId: string,
): Promise<string> => {
  const sql = `SELECT * FROM receipts WHERE id = $1;`;
  const res = await query(sql, [receiptId]);

  if (!res.rows.length) {
    throw new Error("Receipt not found");
  }

  const receipt = res.rows[0];
  await markAudioPlayed(receiptId);

  // Message for text-to-speech
  return `Payment confirmed. ${receipt.payer_name} has paid ${receipt.currency} ${parseFloat(receipt.amount).toFixed(2)} to ${receipt.payee_name}. Receipt number ${receipt.receipt_number}. Thank you for using DinApp.`;
};
