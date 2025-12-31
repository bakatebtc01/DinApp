import bcrypt from 'bcrypt';
import { query } from '../db';
import logger from '../utils/logger';

const SALT_ROUNDS = 10;

export const setPin = async (userId: string, pin: string): Promise<boolean> => {
    if (!/^\d{6}$/.test(pin)) {
        throw new Error('PIN must be exactly 6 digits.');
    }

    const hash = await bcrypt.hash(pin, SALT_ROUNDS);
    const sql = `UPDATE users SET pin_hash = $1, updated_at = NOW() WHERE id = $2;`;
    await query(sql, [hash, userId]);
    logger.info(`PIN set for user ${userId}`);
    return true;
};

export const verifyPin = async (userId: string, pin: string): Promise<boolean> => {
    const sql = `SELECT pin_hash FROM users WHERE id = $1;`;
    const res = await query(sql, [userId]);

    if (!res.rows.length || !res.rows[0].pin_hash) {
        return false;
    }

    return bcrypt.compare(pin, res.rows[0].pin_hash);
};
