import { Request, Response } from "express";
import * as subscriptionService from "../services/subscriptionService";
import logger from "../utils/logger";

// Tier endpoints
export const createTier = async (req: Request, res: Response) => {
  try {
    const {
      creatorWalletId,
      tierLevel,
      name,
      monthlyPrice,
      description,
      benefits,
      badgeIcon,
      badgeColor,
    } = req.body;

    if (!creatorWalletId || !tierLevel || !name || !monthlyPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (tierLevel < 1 || tierLevel > 3) {
      return res
        .status(400)
        .json({ error: "Tier level must be between 1 and 3" });
    }

    const tier = await subscriptionService.createTier(
      creatorWalletId,
      tierLevel,
      name,
      monthlyPrice,
      description,
      benefits,
      badgeIcon,
      badgeColor,
    );

    res.status(201).json({ message: "Subscription tier created", tier });
  } catch (error: any) {
    logger.error("Create tier error:", error);
    if (error.message.includes("duplicate")) {
      return res
        .status(409)
        .json({ error: "Tier level already exists for this creator" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCreatorTiers = async (req: Request, res: Response) => {
  try {
    const { creatorWalletId } = req.params;

    const tiers = await subscriptionService.getCreatorTiers(creatorWalletId);
    res.status(200).json({
      tiers,
      revenueSplit: { creatorShare: "55%", platformShare: "45%" },
    });
  } catch (error) {
    logger.error("Get tiers error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Subscription endpoints
export const subscribe = async (req: Request, res: Response) => {
  try {
    const { subscriberWalletId, tierId } = req.body;

    if (!subscriberWalletId || !tierId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const subscription = await subscriptionService.subscribe(
      subscriberWalletId,
      tierId,
    );

    res.status(201).json({
      message: "Subscription created",
      subscription,
      revenueSplit: { creatorShare: "55%", platformShare: "45%" },
    });
  } catch (error: any) {
    logger.error("Subscribe error:", error);

    if (error.message === "Insufficient balance") {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    if (error.message.includes("Already subscribed")) {
      return res.status(409).json({ error: error.message });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.params;
    const { immediately } = req.body;

    const subscription = await subscriptionService.cancelSubscription(
      subscriptionId,
      immediately === true,
    );

    res.status(200).json({
      message: immediately
        ? "Subscription cancelled immediately"
        : "Subscription will cancel at period end",
      subscription,
    });
  } catch (error: any) {
    logger.error("Cancel subscription error:", error);
    if (error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMySubscriptions = async (req: Request, res: Response) => {
  try {
    const { subscriberWalletId } = req.params;

    const subscriptions =
      await subscriptionService.getMySubscriptions(subscriberWalletId);
    res.status(200).json({ subscriptions });
  } catch (error) {
    logger.error("Get my subscriptions error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCreatorSubscribers = async (req: Request, res: Response) => {
  try {
    const { creatorWalletId } = req.params;

    const subscribers =
      await subscriptionService.getCreatorSubscribers(creatorWalletId);
    res.status(200).json({ subscribers });
  } catch (error) {
    logger.error("Get creator subscribers error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkSubscription = async (req: Request, res: Response) => {
  try {
    const { subscriberWalletId, creatorWalletId } = req.params;

    const result = await subscriptionService.hasActiveSubscription(
      subscriberWalletId,
      creatorWalletId,
    );
    res.status(200).json(result);
  } catch (error) {
    logger.error("Check subscription error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCreatorSubscriptionEarnings = async (
  req: Request,
  res: Response,
) => {
  try {
    const { creatorWalletId } = req.params;

    const earnings =
      await subscriptionService.getCreatorSubscriptionEarnings(creatorWalletId);
    res.status(200).json({
      earnings,
      revenueSplit: { creatorShare: "55%", platformShare: "45%" },
    });
  } catch (error) {
    logger.error("Get subscription earnings error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Admin endpoint to trigger renewal processing
export const processRenewals = async (req: Request, res: Response) => {
  try {
    const result = await subscriptionService.processRenewals();
    res.status(200).json({
      message: "Renewal processing complete",
      ...result,
    });
  } catch (error) {
    logger.error("Process renewals error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
