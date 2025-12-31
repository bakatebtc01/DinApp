import { Router, Request, Response, NextFunction } from 'express';
import * as authController from '../controllers/authController';
import { authLimiter, otpLimiter } from '../utils/rateLimiter';

const router = Router();

router.post('/signup', authLimiter, (req: Request, res: Response, next: NextFunction) => {
    authController.signup(req, res).catch(next);
});

router.post('/verify-otp', otpLimiter, (req: Request, res: Response, next: NextFunction) => {
    authController.verifyOtp(req, res).catch(next);
});

router.post('/set-pin', authLimiter, (req: Request, res: Response, next: NextFunction) => {
    authController.setPin(req, res).catch(next);
});

export default router;
