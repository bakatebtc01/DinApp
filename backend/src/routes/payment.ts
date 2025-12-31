import { Router, Request, Response, NextFunction } from "express";
import * as paymentController from "../controllers/paymentController";
import { authLimiter } from "../utils/rateLimiter";

const router = Router();

// QR Code routes
router.post(
  "/qr/generate",
  authLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    paymentController.generateQR(req, res).catch(next);
  },
);

router.post("/qr/decode", (req: Request, res: Response, next: NextFunction) => {
  paymentController.decodeQR(req, res).catch(next);
});

// Payment routes
router.post(
  "/pay",
  authLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    paymentController.processPayment(req, res).catch(next);
  },
);

// Receipt routes
router.get(
  "/receipt/:receiptNumber",
  (req: Request, res: Response, next: NextFunction) => {
    paymentController.getReceipt(req, res).catch(next);
  },
);

router.get(
  "/receipt/:receiptId/print",
  (req: Request, res: Response, next: NextFunction) => {
    paymentController.getPrintableReceipt(req, res).catch(next);
  },
);

router.get(
  "/receipt/:receiptId/audio",
  (req: Request, res: Response, next: NextFunction) => {
    paymentController.getAudioConfirmation(req, res).catch(next);
  },
);

// Vendor routes
router.get(
  "/vendor/:merchantWalletId/reputation",
  (req: Request, res: Response, next: NextFunction) => {
    paymentController.getVendorReputation(req, res).catch(next);
  },
);

router.post(
  "/vendor/rate",
  authLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    paymentController.rateVendor(req, res).catch(next);
  },
);

router.get("/vendor/top", (req: Request, res: Response, next: NextFunction) => {
  paymentController.getTopVendors(req, res).catch(next);
});

export default router;
