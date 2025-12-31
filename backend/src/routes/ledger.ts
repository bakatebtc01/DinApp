import { Router, Request, Response, NextFunction } from 'express';
import * as ledgerController from '../controllers/ledgerController';
import { authLimiter } from '../utils/rateLimiter';

const router = Router();

// Execute a transfer
router.post('/transfer', authLimiter, (req: Request, res: Response, next: NextFunction) => {
    ledgerController.transfer(req, res).catch(next);
});

// Get transaction history for a wallet
router.get('/history/:walletId', (req: Request, res: Response, next: NextFunction) => {
    ledgerController.getTransactionHistory(req, res).catch(next);
});

// Audit export (admin/regulator endpoint)
router.get('/audit/export', (req: Request, res: Response, next: NextFunction) => {
    ledgerController.getAuditExport(req, res).catch(next);
});

// Get current FX rate
router.get('/fx-rate', (req: Request, res: Response, next: NextFunction) => {
    ledgerController.getFxRate(req, res).catch(next);
});

export default router;
