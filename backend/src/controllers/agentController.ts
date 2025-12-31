import { Request, Response } from "express";
import * as agentService from "../services/agentService";
import logger from "../utils/logger";

export const onboardAgent = async (req: Request, res: Response) => {
  try {
    const { userId, licenseNumber, region } = req.body;
    if (!userId || !licenseNumber) {
      return res.status(400).json({ error: "Missing userId or licenseNumber" });
    }

    const profile = await agentService.onboardAgent(
      userId,
      licenseNumber,
      region,
    );
    res.status(201).json(profile);
  } catch (error) {
    logger.error("Agent Onboard error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const processPayout = async (req: Request, res: Response) => {
  try {
    const { agentWalletId, userWalletId, amount, otp, pin, userPhone, userId } =
      req.body;

    const transactionId = await agentService.processPayout(
      agentWalletId,
      userWalletId,
      amount,
      otp,
      pin,
      userPhone,
      userId,
    );

    res.status(200).json({
      message: "Payout confirmed successfully",
      transactionId,
    });
  } catch (error: any) {
    logger.error("Payout error:", error);
    res.status(400).json({ error: error.message });
  }
};
