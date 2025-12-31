import { Router, Request, Response, NextFunction } from "express";
import * as streamingController from "../controllers/streamingController";
import { authLimiter } from "../utils/rateLimiter";

const router = Router();

// Livestream Session routes
router.post(
  "/session",
  authLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    streamingController.createSession(req, res).catch(next);
  },
);

router.post(
  "/session/:sessionId/start",
  authLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    streamingController.startSession(req, res).catch(next);
  },
);

router.post(
  "/session/:sessionId/end",
  authLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    streamingController.endSession(req, res).catch(next);
  },
);

router.get(
  "/session/:sessionId",
  (req: Request, res: Response, next: NextFunction) => {
    streamingController.getSession(req, res).catch(next);
  },
);

router.get("/live", (req: Request, res: Response, next: NextFunction) => {
  streamingController.getLiveSessions(req, res).catch(next);
});

router.get(
  "/creator/:creatorWalletId/sessions",
  (req: Request, res: Response, next: NextFunction) => {
    streamingController.getCreatorSessions(req, res).catch(next);
  },
);

// Gift routes
router.get("/gifts", (req: Request, res: Response, next: NextFunction) => {
  streamingController.getGiftCatalog(req, res).catch(next);
});

router.post(
  "/gift/send",
  authLimiter,
  (req: Request, res: Response, next: NextFunction) => {
    streamingController.sendGift(req, res).catch(next);
  },
);

router.get(
  "/session/:sessionId/gifts",
  (req: Request, res: Response, next: NextFunction) => {
    streamingController.getSessionGifts(req, res).catch(next);
  },
);

router.get(
  "/creator/:creatorWalletId/earnings",
  (req: Request, res: Response, next: NextFunction) => {
    streamingController.getCreatorEarnings(req, res).catch(next);
  },
);

export default router;
