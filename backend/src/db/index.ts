import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    logger.info('Database connected successfully.');
});

pool.on('error', (err) => {
    logger.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
