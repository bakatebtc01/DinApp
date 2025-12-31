import { Request, Response } from 'express';
import * as complianceService from '../services/complianceService';
import logger from '../utils/logger';

export const submitKyc = async (req: Request, res: Response) => {
    try {
        const { userId, documentType, documentUrl, selfieUrl } = req.body;

        const submissionId = await complianceService.submitKyc({
            userId, documentType, documentUrl, selfieUrl
        });

        res.status(201).json({ message: 'KYC submitted', submissionId });
    } catch (error) {
        logger.error('KYC Submit error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAmlAlerts = async (req: Request, res: Response) => {
    // Stub for admin dashboard
    res.status(200).json({ alerts: [] });
};
