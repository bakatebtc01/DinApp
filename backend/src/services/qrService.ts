import { query } from "../db";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import logger from "../utils/logger";

export type QRType = "static" | "dynamic";

export interface QRCodeData {
  id: string;
  merchant_wallet_id: string;
  qr_type: QRType;
  amount: number | null;
  currency: string;
  description: string | null;
  qr_payload: string;
  status: string;
  expires_at: Date | null;
}

interface CreateQRParams {
  merchantWalletId: string;
  qrType: QRType;
  amount?: number;
  currency?: string;
  description?: string;
  expiresInMinutes?: number;
}

/**
 * Generate a QR code for payments.
 * Static: Fixed merchant, any amount
 * Dynamic: Fixed merchant, fixed amount, expires
 */
export const createQRCode = async (
  params: CreateQRParams,
): Promise<{ qrCode: QRCodeData; qrImage: string }> => {
  const {
    merchantWalletId,
    qrType,
    amount,
    currency = "PGK",
    description,
    expiresInMinutes = 15,
  } = params;

  const qrId = uuidv4();

  // Create payload that encodes payment info
  const payload = {
    v: 1, // version
    id: qrId,
    m: merchantWalletId, // merchant
    t: qrType,
    a: amount || null,
    c: currency,
    ts: Date.now(),
  };

  const qrPayload = Buffer.from(JSON.stringify(payload)).toString("base64");

  // Calculate expiry for dynamic QR
  const expiresAt =
    qrType === "dynamic"
      ? new Date(Date.now() + expiresInMinutes * 60 * 1000)
      : null;

  const sql = `
    INSERT INTO qr_codes (id, merchant_wallet_id, qr_type, amount, currency, description, qr_payload, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const res = await query(sql, [
    qrId,
    merchantWalletId,
    qrType,
    amount || null,
    currency,
    description || null,
    qrPayload,
    expiresAt,
  ]);

  // Generate QR image as base64
  const qrImage = await QRCode.toDataURL(qrPayload, {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  logger.info(`QR Code created: ${qrId} | Type: ${qrType}`);

  return {
    qrCode: res.rows[0],
    qrImage,
  };
};

/**
 * Decode and validate a QR payload.
 */
export const decodeQRPayload = async (
  qrPayload: string,
): Promise<QRCodeData | null> => {
  try {
    const sql = `SELECT * FROM qr_codes WHERE qr_payload = $1;`;
    const res = await query(sql, [qrPayload]);

    if (!res.rows.length) {
      return null;
    }

    const qr = res.rows[0];

    // Check if expired
    if (qr.expires_at && new Date(qr.expires_at) < new Date()) {
      await query(`UPDATE qr_codes SET status = 'expired' WHERE id = $1`, [
        qr.id,
      ]);
      return null;
    }

    // Check if already used (for dynamic)
    if (qr.status === "used") {
      return null;
    }

    return qr;
  } catch (error) {
    logger.error("Error decoding QR:", error);
    return null;
  }
};

/**
 * Mark QR as used after successful payment.
 */
export const markQRAsUsed = async (
  qrId: string,
  transactionId: string,
): Promise<void> => {
  const sql = `
    UPDATE qr_codes 
    SET status = 'used', used_at = NOW(), transaction_id = $2 
    WHERE id = $1;
  `;
  await query(sql, [qrId, transactionId]);
};

/**
 * Get QR codes for a merchant.
 */
export const getQRCodesByMerchant = async (
  merchantWalletId: string,
): Promise<QRCodeData[]> => {
  const sql = `
    SELECT * FROM qr_codes 
    WHERE merchant_wallet_id = $1 
    ORDER BY created_at DESC 
    LIMIT 50;
  `;
  const res = await query(sql, [merchantWalletId]);
  return res.rows;
};
