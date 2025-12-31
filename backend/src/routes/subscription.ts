import { Router, Request, Response, NextFunction } from 'express';
import * as subscriptionController from '../controllers/subscriptionController';
import { authLimiter } from '../utils/rateLimiter';

const router = Router();

// Tier routes
router.post('/tier', authLimiter, (req: Request, res: Response, next: NextFunction) => {
    subscriptionController.createTier(req, res).catch(next);
});

router.get('/tier/creator/:creatorWalletId', (req: Request, res: Response, next: NextFunction) => {
    subscriptionController.getCreatorTiers(req, res).catch(next);
});

// Subscription routes
router.post('/subscribe', authLimiter, (req: Request, res: Response, next: NextFunction) => {
    subscriptionController.subscribe(req, res).catch(next);
});

router.post('/:subscriptionId/cancel', authLimiter, (req: Request, res: Response, next: NextFunction) => {
    subscriptionController.cancelSubscription(req, res).catch(next);
});

router.get('/my/:subscriberWalletId', (req: Request, res: Response, next: NextFunction) => {
    subscriptionController.getMySubscriptions(req, res).catch(next);
});

router.get('/creator/:creatorWalletId/subscribers', (req: Request, res: Response, next: NextFunction) => {
    subscriptionController.getCreatorSubscribers(req, res).catch(next);
});

router.get('/check/:subscriberWalletId/:creatorWalletId', (req: Request, res: Response, next: NextFunction) => {
    subscriptionController.checkSubscription(req, res).catch(next);
});

router.get('/creator/:creatorWalletId/earnings', (req: Request, res: Response, next: NextFunction) => {
    subscriptionController.getCreatorSubscriptionEarnings(req, res).catch(next);
});

// Admin route for renewal processing (should be protected in production)
router.post('/admin/process-renewals', (req: Request, res: Response, next: NextFunction) => {
    subscriptionController.processRenewals(req, res).catch(next);
});

export default router;
