import { Router } from 'express';
import * as complianceController from '../controllers/complianceController';

const router = Router();

router.post('/kyc/submit', complianceController.submitKyc);
router.get('/alerts', complianceController.getAmlAlerts);

export default router;
