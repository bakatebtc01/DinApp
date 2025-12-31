import { Router } from 'express';
import * as adminController from '../controllers/adminController';

const router = Router();

router.get('/stats', adminController.getPlatformStats);
router.get('/transactions', adminController.getTransactions);

export default router;
