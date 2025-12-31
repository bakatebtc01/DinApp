import { Request, Response } from 'express';
import * as streamingService from '../services/streamingService';
import * as giftingService from '../services/giftingService';
import logger from '../utils/logger';

// Livestream Session endpoints
export const createSession = async (req: Request, res: Response) => {
    try {
        const { creatorWalletId, creatorUserId, title, description, thumbnailUrl, scheduledAt } = req.body;

        if (!creatorWalletId || !creatorUserId || !title) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const session = await streamingService.createSession({
            creatorWalletId,
            creatorUserId,
            title,
            description,
            thumbnailUrl,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        });

        res.status(201).json({ message: 'Session created', session });

    } catch (error) {
        logger.error('Create session error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const startSession = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;

        const session = await streamingService.startSession(sessionId);
        res.status(200).json({ message: 'Stream started', session });

    } catch (error: any) {
        logger.error('Start session error:', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const endSession = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;

        const session = await streamingService.endSession(sessionId);
        res.status(200).json({ message: 'Stream ended', session });

    } catch (error: any) {
        logger.error('End session error:', error);
        if (error.message.includes('not found')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getSession = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;

        const session = await streamingService.getSession(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.status(200).json({ session });

    } catch (error) {
        logger.error('Get session error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getLiveSessions = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 20;
        const sessions = await streamingService.getLiveSessions(limit);
        res.status(200).json({ sessions });

    } catch (error) {
        logger.error('Get live sessions error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getCreatorSessions = async (req: Request, res: Response) => {
    try {
        const { creatorWalletId } = req.params;
        const limit = parseInt(req.query.limit as string) || 20;

        const sessions = await streamingService.getSessionsByCreator(creatorWalletId, limit);
        res.status(200).json({ sessions });

    } catch (error) {
        logger.error('Get creator sessions error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Gift endpoints
export const getGiftCatalog = async (req: Request, res: Response) => {
    try {
        const gifts = await giftingService.getGiftCatalog();
        res.status(200).json({ gifts });

    } catch (error) {
        logger.error('Get gift catalog error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const sendGift = async (req: Request, res: Response) => {
    try {
        const { sessionId, giftId, senderWalletId, quantity, message } = req.body;

        if (!sessionId || !giftId || !senderWalletId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const transaction = await giftingService.sendGift({
            sessionId,
            giftId,
            senderWalletId,
            quantity,
            message,
        });

        res.status(200).json({
            message: 'Gift sent successfully',
            transaction,
            revenueSplit: {
                creatorShare: '55%',
                platformShare: '45%',
                creatorAmount: transaction.creator_amount,
                platformAmount: transaction.platform_amount,
            },
        });

    } catch (error: any) {
        logger.error('Send gift error:', error);

        if (error.message === 'Insufficient balance') {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        if (error.message.includes('not found') || error.message.includes('not live')) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getSessionGifts = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const limit = parseInt(req.query.limit as string) || 100;

        const gifts = await giftingService.getSessionGifts(sessionId, limit);
        res.status(200).json({ gifts });

    } catch (error) {
        logger.error('Get session gifts error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getCreatorEarnings = async (req: Request, res: Response) => {
    try {
        const { creatorWalletId } = req.params;

        const earnings = await giftingService.getCreatorEarnings(creatorWalletId);
        res.status(200).json({
            earnings,
            revenueSplit: {
                creatorShare: '55%',
                platformShare: '45%',
            },
        });

    } catch (error) {
        logger.error('Get creator earnings error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
