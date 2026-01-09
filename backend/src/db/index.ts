import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { mockQuery } from './mockDb';

dotenv.config();

const useMock = process.env.USE_MOCK_DB === 'true';

const pool = new Pool({
    connectionString: useMock ? undefined : process.env.DATABASE_URL,
});

if (!useMock) {
    pool.on('connect', () => {
        logger.info('Database connected successfully.');
    });

    pool.on('error', (err) => {
        logger.error('Unexpected error on idle client', err);
        process.exit(-1);
    });
} else {
    logger.warn('⚠️ RUNNING IN MOCK DATABASE MODE (In-Memory)');
}

export const query = (text: string, params?: any[]) => {
    if (useMock) return mockQuery(text, params);
    return pool.query(text, params);
};

export default pool;
