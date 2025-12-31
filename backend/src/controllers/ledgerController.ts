import { Request, Response } from "express";
import * as ledgerService from "../services/ledgerService";
import logger from "../utils/logger";

export const transfer = async (req: Request, res: Response) => {
  try {
    const {
      fromWalletId,
      toWalletId,
      amount,
      transactionType,
      description,
      referenceId,
    } = req.body;

    if (!fromWalletId || !toWalletId || !amount || !transactionType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }

    // Lock FX rate at transaction time
    const fxRate = await ledgerService.getCurrentFxRate("PGK", "PGK");

    const transactionId = await ledgerService.executeTransfer({
      fromWalletId,
      toWalletId,
      amount,
      transactionType,
      description,
      referenceId,
      fxRate,
    });

    res.status(200).json({
      message: "Transfer successful",
      transactionId,
      fxRate,
    });
  } catch (error: any) {
    logger.error("Transfer error:", error);

    if (error.message === "Insufficient balance") {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const { walletId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const transactions = await ledgerService.getTransactionHistory(
      walletId,
      limit,
      offset,
    );
    res.status(200).json({ transactions });
  } catch (error) {
    logger.error("Get transaction history error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAuditExport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, transactionType } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    const entries = await ledgerService.getAuditExport(
      start,
      end,
      transactionType as ledgerService.TransactionType | undefined,
    );

    // Return as JSON (in production, could also support CSV)
    res.status(200).json({
      exportDate: new Date().toISOString(),
      period: { startDate, endDate },
      totalEntries: entries.length,
      entries,
    });
  } catch (error) {
    logger.error("Audit export error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFxRate = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res
        .status(400)
        .json({ error: "from and to currencies are required" });
    }

    const rate = await ledgerService.getCurrentFxRate(
      from as string,
      to as string,
    );
    res
      .status(200)
      .json({ from, to, rate, timestamp: new Date().toISOString() });
  } catch (error) {
    logger.error("Get FX rate error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
