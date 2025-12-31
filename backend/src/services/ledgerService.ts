import pool, { query } from '../db';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import * as complianceService from './complianceService';
import * as userService from './userService';

export type TransactionType =
    | 'transfer'
    | 'gift'
    | 'subscription'
    | 'loan_disbursement'
    | 'loan_repayment'
    | 'platform_fee'
    | 'agent_payout'
    | 'agent_deposit'
    | 'escrow_lock'
    | 'escrow_release';

export interface LedgerEntry {
    id: string;
    transaction_id: string;
    wallet_id: string;
    entry_type: 'debit' | 'credit';
    transaction_type: TransactionType;
    amount: number;
    currency: string;
    fx_rate: number;
    balance_after: number;
    description?: string;
    created_at: Date;
}

interface TransferParams {
    fromWalletId: string;
    toWalletId: string;
    amount: number;
    transactionType: TransactionType;
    description?: string;
    referenceId?: string;
    fxRate?: number;
}

/**
 * Execute a double-entry transfer between two wallets.
 * This is atomic - both entries succeed or both fail.
 */
export const executeTransfer = async (params: TransferParams): Promise<string> => {
    const {
        fromWalletId,
        toWalletId,
        amount,
        transactionType,
        description,
        referenceId,
        fxRate = 1.0,
    } = params;

    if (amount <= 0) {
        throw new Error('Amount must be positive');
    }

    const client = await pool.connect();
    const transactionId = uuidv4();

    try {
        await client.query('BEGIN');

        // Lock both wallets to prevent race conditions
        const lockSql = `
      SELECT id, balance FROM wallets 
      WHERE id IN ($1, $2) 
      FOR UPDATE;
    `;
        const lockedWallets = await client.query(lockSql, [fromWalletId, toWalletId]);

        const fromWallet = lockedWallets.rows.find((w: any) => w.id === fromWalletId);
        const toWallet = lockedWallets.rows.find((w: any) => w.id === toWalletId);

        if (!fromWallet || !toWallet) {
            throw new Error('One or both wallets not found');
        }

        if (parseFloat(fromWallet.balance) < amount) {
            throw new Error('Insufficient balance');
        }

        // Compliance & Risk Check
        const isAllowed = await complianceService.checkVelocityLimits(fromWallet.user_id, amount);
        if (!isAllowed) {
            throw new Error('Transaction blocked: Velocity limit exceeded or wallet frozen');
        }

        // Calculate new balances
        const newFromBalance = parseFloat(fromWallet.balance) - amount;
        const newToBalance = parseFloat(toWallet.balance) + amount;

        // Update wallet balances
        await client.query(
            `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2`,
            [newFromBalance, fromWalletId]
        );
        await client.query(
            `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2`,
            [newToBalance, toWalletId]
        );

        // Create DEBIT entry (money leaving fromWallet)
        await client.query(
            `INSERT INTO ledger_entries 
        (transaction_id, wallet_id, entry_type, transaction_type, amount, fx_rate, reference_id, description, balance_after)
       VALUES ($1, $2, 'debit', $3, $4, $5, $6, $7, $8)`,
            [transactionId, fromWalletId, transactionType, amount, fxRate, referenceId, description, newFromBalance]
        );

        // Create CREDIT entry (money entering toWallet)
        await client.query(
            `INSERT INTO ledger_entries 
        (transaction_id, wallet_id, entry_type, transaction_type, amount, fx_rate, reference_id, description, balance_after)
       VALUES ($1, $2, 'credit', $3, $4, $5, $6, $7, $8)`,
            [transactionId, toWalletId, transactionType, amount, fxRate, referenceId, description, newToBalance]
        );

        await client.query('COMMIT');

        // Post-transaction record velocity
        await complianceService.recordTransactionVelocity(fromWallet.user_id, amount);

        logger.info(`Transfer complete: ${transactionId} | ${amount} from ${fromWalletId} to ${toWalletId}`);

        return transactionId;

    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Transfer failed:', error);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Get transaction history for a wallet.
 */
export const getTransactionHistory = async (
    walletId: string,
    limit: number = 50,
    offset: number = 0
): Promise<LedgerEntry[]> => {
    const sql = `
    SELECT * FROM ledger_entries 
    WHERE wallet_id = $1 
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;
    const res = await query(sql, [walletId, limit, offset]);
    return res.rows;
};

/**
 * Get ledger entries for audit export.
 */
export const getAuditExport = async (
    startDate: Date,
    endDate: Date,
    transactionType?: TransactionType
): Promise<LedgerEntry[]> => {
    let sql = `
    SELECT le.*, w.user_id, w.wallet_type 
    FROM ledger_entries le
    JOIN wallets w ON le.wallet_id = w.id
    WHERE le.created_at BETWEEN $1 AND $2
  `;
    const params: any[] = [startDate, endDate];

    if (transactionType) {
        sql += ` AND le.transaction_type = $3`;
        params.push(transactionType);
    }

    sql += ` ORDER BY le.created_at ASC;`;

    const res = await query(sql, params);
    return res.rows;
};

/**
 * Get current FX rate (stub - in production, call external API).
 */
export const getCurrentFxRate = async (
    fromCurrency: string,
    toCurrency: string
): Promise<number> => {
    // Stub: Return 1.0 for same currency, mock rates otherwise
    if (fromCurrency === toCurrency) return 1.0;

    // Mock rates for sandbox
    const mockRates: Record<string, number> = {
        'PGK_USD': 0.27,
        'USD_PGK': 3.70,
        'PGK_AUD': 0.41,
        'AUD_PGK': 2.44,
    };

    const key = `${fromCurrency}_${toCurrency}`;
    return mockRates[key] || 1.0;
};
