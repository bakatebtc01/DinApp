import { Router, Request, Response, NextFunction } from "express";
import * as walletController from "../controllers/walletController";
import { authLimiter } from "../utils/rateLimiter";

const router = Router();

// Create a new wallet
router.post(
  "/",
  authLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    walletController.createWallet(req, res).catch(next);
  },
);

// Get all wallets for a user
router.get(
  "/user/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    walletController.getMyWallets(req, res).catch(next);
  },
);

// Get wallet details
router.get("/:walletId", (req: Request, res: Response, next: NextFunction) => {
  walletController.getWalletDetails(req, res).catch(next);
});

// Freeze wallet (admin action)
router.post(
  "/:walletId/freeze",
  (req: Request, res: Response, next: NextFunction) => {
    walletController.freezeWallet(req, res).catch(next);
  },
);

export default router;
