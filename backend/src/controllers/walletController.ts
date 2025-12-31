import { Request, Response } from 'express';
import * as walletService from '../services/walletService';
import logger from '../utils/logger';

export const createWallet = async (req: Request, res: Response) => {
    try {
        const { userId, walletType, currency } = req.body;

        if (!userId || !walletType) {
            return res.status(400).json({ error: 'Missing userId or walletType' });
        }

        const validTypes = ['personal', 'creator', 'merchant', 'agent'];
        if (!validTypes.includes(walletType)) {
            return res.status(400).json({ error: 'Invalid wallet type' });
        }

        // Check if wallet already exists
        const existing = await walletService.getWalletByUserAndType(userId, walletType);
        if (existing) {
            return res.status(409).json({ error: 'Wallet of this type already exists', wallet: existing });
        }

        const wallet = await walletService.createWallet(userId, walletType, currency || 'PGK');
        res.status(201).json({ message: 'Wallet created', wallet });

    } catch (error) {
        logger.error('Create wallet error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getMyWallets = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        const wallets = await walletService.getWalletsByUserId(userId);
        res.status(200).json({ wallets });

    } catch (error) {
        logger.error('Get wallets error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getWalletDetails = async (req: Request, res: Response) => {
    try {
        const { walletId } = req.params;

        const wallet = await walletService.getWalletById(walletId);
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        res.status(200).json({ wallet });

    } catch (error) {
        logger.error('Get wallet details error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const freezeWallet = async (req: Request, res: Response) => {
    try {
        const { walletId } = req.params;

        await walletService.freezeWallet(walletId);
        res.status(200).json({ message: 'Wallet frozen' });

    } catch (error) {
        logger.error('Freeze wallet error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
