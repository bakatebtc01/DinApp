import pool, { query } from '../db';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

// Revenue split constants (same as gifts)
const CREATOR_SHARE = 0.55; // 55%
const PLATFORM_SHARE = 0.45; // 45%

export interface SubscriptionTier {
    id: string;
    creator_wallet_id: string;
    tier_level: number;
    name: string;
    description: string | null;
    monthly_price: number;
    currency: string;
    benefits: string[];
    badge_icon: string | null;
    badge_color: string | null;
    is_active: boolean;
}

export interface Subscription {
    id: string;
    subscriber_wallet_id: string;
    creator_wallet_id: string;
    tier_id: string;
    status: string;
    current_period_start: Date;
    current_period_end: Date;
    auto_renew: boolean;
    cancelled_at: Date | null;
}

// =============== TIER MANAGEMENT ===============

/**
 * Create subscription tiers for a creator.
 */
export const createTier = async (
    creatorWalletId: string,
    tierLevel: number,
    name: string,
    monthlyPrice: number,
    description?: string,
    benefits?: string[],
    badgeIcon?: string,
    badgeColor?: string
): Promise<SubscriptionTier> => {
    const sql = `
    INSERT INTO subscription_tiers (
      creator_wallet_id, tier_level, name, description, 
      monthly_price, benefits, badge_icon, badge_color
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

    const res = await query(sql, [
        creatorWalletId,
        tierLevel,
        name,
        description || null,
        monthlyPrice,
        JSON.stringify(benefits || []),
        badgeIcon || null,
        badgeColor || null,
    ]);

    logger.info(`Subscription tier created: ${name} (Level ${tierLevel})`);
    return res.rows[0];
};

/**
 * Get tiers for a creator.
 */
export const getCreatorTiers = async (creatorWalletId: string): Promise<SubscriptionTier[]> => {
    const sql = `
    SELECT * FROM subscription_tiers 
    WHERE creator_wallet_id = $1 AND is_active = TRUE
    ORDER BY tier_level ASC;
  `;
    const res = await query(sql, [creatorWalletId]);
    return res.rows;
};

/**
 * Get a specific tier by ID.
 */
export const getTier = async (tierId: string): Promise<SubscriptionTier | null> => {
    const sql = `SELECT * FROM subscription_tiers WHERE id = $1;`;
    const res = await query(sql, [tierId]);
    return res.rows[0] || null;
};

// =============== SUBSCRIPTION MANAGEMENT ===============

/**
 * Subscribe to a creator's tier.
 */
export const subscribe = async (
    subscriberWalletId: string,
    tierId: string
): Promise<Subscription> => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Get tier details
        const tierRes = await client.query(
            `SELECT * FROM subscription_tiers WHERE id = $1 AND is_active = TRUE`,
            [tierId]
        );
        if (!tierRes.rows.length) {
            throw new Error('Subscription tier not found');
        }
        const tier = tierRes.rows[0];

        // 2. Check if already subscribed to this creator
        const existingRes = await client.query(
            `SELECT * FROM subscriptions 
       WHERE subscriber_wallet_id = $1 AND creator_wallet_id = $2 AND status = 'active'`,
            [subscriberWalletId, tier.creator_wallet_id]
        );
        if (existingRes.rows.length) {
            throw new Error('Already subscribed to this creator');
        }

        // 3. Get subscriber wallet and lock it
        const walletRes = await client.query(
            `SELECT * FROM wallets WHERE id = $1 FOR UPDATE`,
            [subscriberWalletId]
        );
        if (!walletRes.rows.length) {
            throw new Error('Subscriber wallet not found');
        }
        const wallet = walletRes.rows[0];

        const amount = parseFloat(tier.monthly_price);
        if (parseFloat(wallet.balance) < amount) {
            throw new Error('Insufficient balance');
        }

        // 4. Calculate revenue split
        const creatorAmount = amount * CREATOR_SHARE;
        const platformAmount = amount * PLATFORM_SHARE;

        // 5. Debit subscriber
        const newSubscriberBalance = parseFloat(wallet.balance) - amount;
        await client.query(
            `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2`,
            [newSubscriberBalance, subscriberWalletId]
        );

        // 6. Credit creator (their share only)
        const creatorRes = await client.query(
            `SELECT balance FROM wallets WHERE id = $1 FOR UPDATE`,
            [tier.creator_wallet_id]
        );
        const newCreatorBalance = parseFloat(creatorRes.rows[0].balance) + creatorAmount;
        await client.query(
            `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2`,
            [newCreatorBalance, tier.creator_wallet_id]
        );

        // 7. Create transaction ID
        const transactionId = uuidv4();

        // 8. Create ledger entries
        await client.query(
            `INSERT INTO ledger_entries 
        (transaction_id, wallet_id, entry_type, transaction_type, amount, description, balance_after)
       VALUES ($1, $2, 'debit', 'subscription', $3, $4, $5)`,
            [transactionId, subscriberWalletId, amount, `Subscription: ${tier.name}`, newSubscriberBalance]
        );

        await client.query(
            `INSERT INTO ledger_entries 
        (transaction_id, wallet_id, entry_type, transaction_type, amount, description, balance_after)
       VALUES ($1, $2, 'credit', 'subscription', $3, $4, $5)`,
            [transactionId, tier.creator_wallet_id, creatorAmount, `Subscription revenue: ${tier.name} (55%)`, newCreatorBalance]
        );

        // 9. Calculate billing period
        const periodStart = new Date();
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        // 10. Create subscription
        const subRes = await client.query(
            `INSERT INTO subscriptions (
        subscriber_wallet_id, creator_wallet_id, tier_id,
        current_period_start, current_period_end
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
            [subscriberWalletId, tier.creator_wallet_id, tierId, periodStart, periodEnd]
        );

        // 11. Create billing record
        await client.query(
            `INSERT INTO subscription_billing (
        subscription_id, amount, creator_amount, platform_amount,
        billing_period_start, billing_period_end, status, transaction_id, paid_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'paid', $7, NOW())`,
            [subRes.rows[0].id, amount, creatorAmount, platformAmount, periodStart, periodEnd, transactionId]
        );

        await client.query('COMMIT');

        logger.info(`New subscription: ${subscriberWalletId} -> ${tier.creator_wallet_id} (${tier.name})`);
        return subRes.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        logger.error('Subscribe failed:', error);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Cancel a subscription.
 */
export const cancelSubscription = async (
    subscriptionId: string,
    cancelImmediately: boolean = false
): Promise<Subscription> => {
    const sql = cancelImmediately
        ? `UPDATE subscriptions SET 
         status = 'cancelled', cancelled_at = NOW(), updated_at = NOW()
       WHERE id = $1 RETURNING *`
        : `UPDATE subscriptions SET 
         cancel_at_period_end = TRUE, cancelled_at = NOW(), updated_at = NOW()
       WHERE id = $1 RETURNING *`;

    const res = await query(sql, [subscriptionId]);
    if (!res.rows.length) {
        throw new Error('Subscription not found');
    }

    logger.info(`Subscription cancelled: ${subscriptionId} (immediate: ${cancelImmediately})`);
    return res.rows[0];
};

/**
 * Get subscriber's active subscriptions.
 */
export const getMySubscriptions = async (subscriberWalletId: string): Promise<Subscription[]> => {
    const sql = `
    SELECT s.*, st.name as tier_name, st.badge_icon, st.badge_color
    FROM subscriptions s
    JOIN subscription_tiers st ON s.tier_id = st.id
    WHERE s.subscriber_wallet_id = $1 AND s.status = 'active'
    ORDER BY s.created_at DESC;
  `;
    const res = await query(sql, [subscriberWalletId]);
    return res.rows;
};

/**
 * Get creator's subscribers.
 */
export const getCreatorSubscribers = async (creatorWalletId: string): Promise<Subscription[]> => {
    const sql = `
    SELECT s.*, st.name as tier_name, st.tier_level
    FROM subscriptions s
    JOIN subscription_tiers st ON s.tier_id = st.id
    WHERE s.creator_wallet_id = $1 AND s.status = 'active'
    ORDER BY st.tier_level DESC, s.created_at DESC;
  `;
    const res = await query(sql, [creatorWalletId]);
    return res.rows;
};

/**
 * Check if user has an active subscription to a creator.
 */
export const hasActiveSubscription = async (
    subscriberWalletId: string,
    creatorWalletId: string
): Promise<{ hasSubscription: boolean; tier?: SubscriptionTier }> => {
    const sql = `
    SELECT s.*, st.*
    FROM subscriptions s
    JOIN subscription_tiers st ON s.tier_id = st.id
    WHERE s.subscriber_wallet_id = $1 
      AND s.creator_wallet_id = $2 
      AND s.status = 'active'
      AND s.current_period_end > NOW();
  `;
    const res = await query(sql, [subscriberWalletId, creatorWalletId]);

    if (res.rows.length) {
        return { hasSubscription: true, tier: res.rows[0] };
    }
    return { hasSubscription: false };
};

// =============== BILLING ENGINE ===============

/**
 * Process renewals for subscriptions due.
 * This should be run by a scheduled job.
 */
export const processRenewals = async (): Promise<{ processed: number; failed: number }> => {
    const client = await pool.connect();
    let processed = 0;
    let failed = 0;

    try {
        // Get subscriptions due for renewal
        const dueRes = await client.query(`
      SELECT s.*, st.monthly_price, st.name as tier_name
      FROM subscriptions s
      JOIN subscription_tiers st ON s.tier_id = st.id
      WHERE s.status = 'active'
        AND s.auto_renew = TRUE
        AND s.cancel_at_period_end = FALSE
        AND s.current_period_end <= NOW()
    `);

        for (const sub of dueRes.rows) {
            try {
                await client.query('BEGIN');

                // Lock subscriber wallet
                const walletRes = await client.query(
                    `SELECT * FROM wallets WHERE id = $1 FOR UPDATE`,
                    [sub.subscriber_wallet_id]
                );
                const wallet = walletRes.rows[0];

                const amount = parseFloat(sub.monthly_price);

                if (parseFloat(wallet.balance) < amount) {
                    // Insufficient funds - mark subscription as expired
                    await client.query(
                        `UPDATE subscriptions SET status = 'expired', updated_at = NOW() WHERE id = $1`,
                        [sub.id]
                    );

                    // Create failed billing record
                    await client.query(
                        `INSERT INTO subscription_billing (
              subscription_id, amount, creator_amount, platform_amount,
              billing_period_start, billing_period_end, status, error_message
            ) VALUES ($1, $2, $3, $4, $5, $6, 'failed', 'Insufficient balance')`,
                        [sub.id, amount, amount * CREATOR_SHARE, amount * PLATFORM_SHARE,
                        sub.current_period_end, new Date(sub.current_period_end.getTime() + 30 * 24 * 60 * 60 * 1000)]
                    );

                    await client.query('COMMIT');
                    failed++;
                    continue;
                }

                // Process payment
                const creatorAmount = amount * CREATOR_SHARE;
                const platformAmount = amount * PLATFORM_SHARE;
                const transactionId = uuidv4();

                // Debit subscriber
                const newSubscriberBalance = parseFloat(wallet.balance) - amount;
                await client.query(
                    `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2`,
                    [newSubscriberBalance, sub.subscriber_wallet_id]
                );

                // Credit creator
                const creatorRes = await client.query(
                    `SELECT balance FROM wallets WHERE id = $1 FOR UPDATE`,
                    [sub.creator_wallet_id]
                );
                const newCreatorBalance = parseFloat(creatorRes.rows[0].balance) + creatorAmount;
                await client.query(
                    `UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2`,
                    [newCreatorBalance, sub.creator_wallet_id]
                );

                // Ledger entries
                await client.query(
                    `INSERT INTO ledger_entries 
            (transaction_id, wallet_id, entry_type, transaction_type, amount, description, balance_after)
           VALUES ($1, $2, 'debit', 'subscription', $3, $4, $5)`,
                    [transactionId, sub.subscriber_wallet_id, amount, `Subscription renewal: ${sub.tier_name}`, newSubscriberBalance]
                );

                await client.query(
                    `INSERT INTO ledger_entries 
            (transaction_id, wallet_id, entry_type, transaction_type, amount, description, balance_after)
           VALUES ($1, $2, 'credit', 'subscription', $3, $4, $5)`,
                    [transactionId, sub.creator_wallet_id, creatorAmount, `Subscription revenue: ${sub.tier_name} (55%)`, newCreatorBalance]
                );

                // Update subscription period
                const newPeriodStart = sub.current_period_end;
                const newPeriodEnd = new Date(newPeriodStart);
                newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);

                await client.query(
                    `UPDATE subscriptions SET 
             current_period_start = $2, current_period_end = $3, updated_at = NOW()
           WHERE id = $1`,
                    [sub.id, newPeriodStart, newPeriodEnd]
                );

                // Create billing record
                await client.query(
                    `INSERT INTO subscription_billing (
            subscription_id, amount, creator_amount, platform_amount,
            billing_period_start, billing_period_end, status, transaction_id, paid_at
          ) VALUES ($1, $2, $3, $4, $5, $6, 'paid', $7, NOW())`,
                    [sub.id, amount, creatorAmount, platformAmount, newPeriodStart, newPeriodEnd, transactionId]
                );

                await client.query('COMMIT');
                processed++;

                logger.info(`Subscription renewed: ${sub.id}`);

            } catch (error) {
                await client.query('ROLLBACK');
                failed++;
                logger.error(`Renewal failed for ${sub.id}:`, error);
            }
        }

    } finally {
        client.release();
    }

    logger.info(`Renewal job complete: ${processed} processed, ${failed} failed`);
    return { processed, failed };
};

/**
 * Get subscription earnings for a creator.
 */
export const getCreatorSubscriptionEarnings = async (creatorWalletId: string): Promise<{
    totalSubscribers: number;
    monthlyRevenue: number;
    creatorEarnings: number;
    platformFees: number;
}> => {
    const sql = `
    SELECT 
      COUNT(DISTINCT s.id) as total_subscribers,
      COALESCE(SUM(st.monthly_price), 0) as monthly_revenue,
      COALESCE(SUM(st.monthly_price * 0.55), 0) as creator_earnings,
      COALESCE(SUM(st.monthly_price * 0.45), 0) as platform_fees
    FROM subscriptions s
    JOIN subscription_tiers st ON s.tier_id = st.id
    WHERE s.creator_wallet_id = $1 AND s.status = 'active';
  `;
    const res = await query(sql, [creatorWalletId]);
    return {
        totalSubscribers: parseInt(res.rows[0].total_subscribers) || 0,
        monthlyRevenue: parseFloat(res.rows[0].monthly_revenue) || 0,
        creatorEarnings: parseFloat(res.rows[0].creator_earnings) || 0,
        platformFees: parseFloat(res.rows[0].platform_fees) || 0,
    };
};
