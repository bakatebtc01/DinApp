import { Request, Response } from 'express';
import { query } from '../db';
import logger from '../utils/logger';

export const getPlatformStats = async (req: Request, res: Response) => {
    try {
        // Mock stats for MVP
        const stats = {
            totalUsers: 1500,
            activeWallets: 1200,
            totalRevenue: 25000.50,
            totalTransactions: 8500
        };
        res.status(200).json(stats);
    } catch (error) {
        logger.error('Stats error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const sql = `SELECT * FROM ledger_entries ORDER BY created_at DESC LIMIT 50;`;
        const resDb = await query(sql);
        res.status(200).json(resDb.rows);
    } catch (error) {
        logger.error('Transaction list error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
