import { Request, Response } from "express";
import * as qrService from "../services/qrService";
import * as paymentService from "../services/paymentService";
import * as receiptService from "../services/receiptService";
import * as vendorService from "../services/vendorService";
import logger from "../utils/logger";

// QR Code endpoints
export const generateQR = async (req: Request, res: Response) => {
  try {
    const {
      merchantWalletId,
      qrType,
      amount,
      currency,
      description,
      expiresInMinutes,
    } = req.body;

    if (!merchantWalletId || !qrType) {
      return res
        .status(400)
        .json({ error: "Missing merchantWalletId or qrType" });
    }

    if (!["static", "dynamic"].includes(qrType)) {
      return res
        .status(400)
        .json({ error: "Invalid qrType. Must be static or dynamic" });
    }

    if (qrType === "dynamic" && !amount) {
      return res
        .status(400)
        .json({ error: "Amount is required for dynamic QR" });
    }

    const result = await qrService.createQRCode({
      merchantWalletId,
      qrType,
      amount,
      currency,
      description,
      expiresInMinutes,
    });

    res.status(201).json({
      message: "QR code generated",
      qrCode: result.qrCode,
      qrImage: result.qrImage,
    });
  } catch (error) {
    logger.error("Generate QR error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const decodeQR = async (req: Request, res: Response) => {
  try {
    const { qrPayload } = req.body;

    if (!qrPayload) {
      return res.status(400).json({ error: "Missing qrPayload" });
    }

    const qrCode = await qrService.decodeQRPayload(qrPayload);
    if (!qrCode) {
      return res
        .status(404)
        .json({ error: "Invalid, expired, or used QR code" });
    }

    res.status(200).json({ qrCode });
  } catch (error) {
    logger.error("Decode QR error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Payment endpoints
export const processPayment = async (req: Request, res: Response) => {
  try {
    const {
      qrPayload,
      payerWalletId,
      payerUserId,
      amount,
      otp,
      pin,
      payerPhone,
      payerName,
      payeeName,
    } = req.body;

    if (
      !qrPayload ||
      !payerWalletId ||
      !payerUserId ||
      !otp ||
      !pin ||
      !payerPhone
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await paymentService.processQRPayment({
      qrPayload,
      payerWalletId,
      payerUserId,
      amount,
      otp,
      pin,
      payerPhone,
      payerName,
      payeeName,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.status(200).json({
      message: "Payment successful",
      transactionId: result.transactionId,
      receipt: result.receipt,
      audioMessage: result.audioMessage,
    });
  } catch (error) {
    logger.error("Process payment error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Receipt endpoints
export const getReceipt = async (req: Request, res: Response) => {
  try {
    const { receiptNumber } = req.params;

    const receipt = await receiptService.getReceiptByNumber(receiptNumber);
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    res.status(200).json({ receipt });
  } catch (error) {
    logger.error("Get receipt error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPrintableReceipt = async (req: Request, res: Response) => {
  try {
    const { receiptId } = req.params;

    const printData = await receiptService.generatePrintableReceipt(receiptId);

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(printData);
  } catch (error: any) {
    logger.error("Get printable receipt error:", error);
    if (error.message === "Receipt not found") {
      return res.status(404).json({ error: "Receipt not found" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAudioConfirmation = async (req: Request, res: Response) => {
  try {
    const { receiptId } = req.params;

    const audioMessage =
      await receiptService.getAudioConfirmationMessage(receiptId);

    res.status(200).json({
      audioMessage,
      // In production, could return audio file URL or TTS data
    });
  } catch (error: any) {
    logger.error("Get audio confirmation error:", error);
    if (error.message === "Receipt not found") {
      return res.status(404).json({ error: "Receipt not found" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Vendor endpoints
export const getVendorReputation = async (req: Request, res: Response) => {
  try {
    const { merchantWalletId } = req.params;

    const reputation = await vendorService.getReputation(merchantWalletId);
    if (!reputation) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    res.status(200).json({ reputation });
  } catch (error) {
    logger.error("Get vendor reputation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const rateVendor = async (req: Request, res: Response) => {
  try {
    const { merchantWalletId, payerWalletId, transactionId, rating, comment } =
      req.body;

    if (!merchantWalletId || !payerWalletId || !transactionId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await vendorService.addRating(
      merchantWalletId,
      payerWalletId,
      transactionId,
      rating,
      comment,
    );
    res.status(200).json({ message: "Rating submitted" });
  } catch (error: any) {
    logger.error("Rate vendor error:", error);
    if (error.message.includes("between 1 and 5")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTopVendors = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const vendors = await vendorService.getTopVendors(limit);
    res.status(200).json({ vendors });
  } catch (error) {
    logger.error("Get top vendors error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
