import { Router } from 'express';
import * as agentController from '../controllers/agentController';

const router = Router();

router.post('/onboard', agentController.onboardAgent);
router.post('/payout', agentController.processPayout);

export default router;
