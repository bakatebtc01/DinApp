import { query } from "../db";
import { v4 as uuidv4 } from "uuid";
import * as qrService from "./qrService";
import * as ledgerService from "./ledgerService";
import * as receiptService from "./receiptService";
import * as vendorService from "./vendorService";
import * as pinService from "./pinService";
import * as otpService from "./otpService";
import logger from "../utils/logger";

interface QRPaymentParams {
  qrPayload: string;
  payerWalletId: string;
  payerUserId: string;
  amount?: number; // Required for static QR
  otp: string;
  pin: string;
  payerPhone: string;
  payerName?: string;
  payeeName?: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  receipt?: receiptService.Receipt;
  audioMessage?: string;
  error?: string;
}

/**
 * Process a QR payment with full confirmation flow.
 */
export const processQRPayment = async (
  params: QRPaymentParams,
): Promise<PaymentResult> => {
  const {
    qrPayload,
    payerWalletId,
    payerUserId,
    amount: providedAmount,
    otp,
    pin,
    payerPhone,
    payerName,
    payeeName,
  } = params;

  try {
    // 1. Decode and validate QR
    const qrCode = await qrService.decodeQRPayload(qrPayload);
    if (!qrCode) {
      return {
        success: false,
        error: "Invalid, expired, or already used QR code",
      };
    }

    // 2. Determine amount
    const amount =
      qrCode.qr_type === "dynamic" ? qrCode.amount : providedAmount;
    if (!amount || amount <= 0) {
      return { success: false, error: "Invalid payment amount" };
    }

    // 3. Verify OTP
    const otpValid = await otpService.verifyOtp(payerPhone, otp);
    if (!otpValid) {
      return { success: false, error: "Invalid or expired OTP" };
    }

    // 4. Verify PIN
    const pinValid = await pinService.verifyPin(payerUserId, pin);
    if (!pinValid) {
      return { success: false, error: "Invalid PIN" };
    }

    // 5. Execute the transfer
    const transactionId = await ledgerService.executeTransfer({
      fromWalletId: payerWalletId,
      toWalletId: qrCode.merchant_wallet_id,
      amount: amount as number,
      transactionType: "transfer",
      description: qrCode.description || "QR Payment",
      referenceId: qrCode.id,
    });

    // 6. Mark QR as used (for dynamic QR)
    if (qrCode.qr_type === "dynamic") {
      await qrService.markQRAsUsed(qrCode.id, transactionId);
    }

    // 7. Create receipt
    const receipt = await receiptService.createReceipt({
      transactionId,
      payerWalletId,
      payeeWalletId: qrCode.merchant_wallet_id,
      amount: amount as number,
      currency: qrCode.currency,
      description: qrCode.description || "QR Payment",
      payerName: payerName || "User",
      payeeName: payeeName || "Merchant",
    });

    // 8. Get audio confirmation message
    const audioMessage = await receiptService.getAudioConfirmationMessage(
      receipt.id,
    );

    // 9. Update vendor reputation
    await vendorService.recordSuccessfulTransaction(qrCode.merchant_wallet_id);

    logger.info(`QR Payment successful: ${transactionId}`);

    return {
      success: true,
      transactionId,
      receipt,
      audioMessage,
    };
  } catch (error: any) {
    logger.error("QR Payment failed:", error);

    if (error.message === "Insufficient balance") {
      return { success: false, error: "Insufficient balance" };
    }

    return { success: false, error: "Payment failed. Please try again." };
  }
};

/**
 * Queue a payment for offline retry.
 */
export const queueOfflinePayment = async (
  payerWalletId: string,
  payeeWalletId: string,
  amount: number,
  qrCodeId?: string,
  deviceId?: string,
): Promise<string> => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const sql = `
    INSERT INTO payment_queue (
      payer_wallet_id, payee_wallet_id, amount, qr_code_id, 
      device_id, expires_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id;
  `;

  const res = await query(sql, [
    payerWalletId,
    payeeWalletId,
    amount,
    qrCodeId || null,
    deviceId || null,
    expiresAt,
  ]);

  logger.info(`Payment queued for offline retry: ${res.rows[0].id}`);
  return res.rows[0].id;
};

/**
 * Process queued offline payments.
 */
export const processQueuedPayments = async (): Promise<number> => {
  const sql = `
    SELECT * FROM payment_queue 
    WHERE status = 'pending' 
      AND retry_count < max_retries 
      AND expires_at > NOW()
    ORDER BY created_at ASC
    LIMIT 10;
  `;

  const res = await query(sql, []);
  let processed = 0;

  for (const item of res.rows) {
    try {
      await query(
        `UPDATE payment_queue SET status = 'processing', last_attempt_at = NOW() WHERE id = $1`,
        [item.id],
      );

      const transactionId = await ledgerService.executeTransfer({
        fromWalletId: item.payer_wallet_id,
        toWalletId: item.payee_wallet_id,
        amount: parseFloat(item.amount),
        transactionType: "transfer",
        description: "Offline payment retry",
      });

      await query(
        `UPDATE payment_queue SET status = 'completed', completed_at = NOW(), transaction_id = $2 WHERE id = $1`,
        [item.id, transactionId],
      );

      processed++;
      logger.info(`Queued payment processed: ${item.id} -> ${transactionId}`);
    } catch (error: any) {
      await query(
        `UPDATE payment_queue SET status = 'pending', retry_count = retry_count + 1, error_message = $2 WHERE id = $1`,
        [item.id, error.message],
      );
    }
  }

  return processed;
};
