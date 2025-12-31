import { query } from "../db";
import logger from "../utils/logger";

export type StreamStatus = "scheduled" | "live" | "ended" | "cancelled";

export interface LivestreamSession {
  id: string;
  creator_wallet_id: string;
  creator_user_id: string;
  title: string;
  description: string | null;
  status: StreamStatus;
  scheduled_at: Date | null;
  started_at: Date | null;
  ended_at: Date | null;
  viewer_count: number;
  peak_viewers: number;
  total_gifts_received: number;
  total_gift_value: number;
  creator_earnings: number;
  platform_earnings: number;
}

interface CreateSessionParams {
  creatorWalletId: string;
  creatorUserId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  scheduledAt?: Date;
}

/**
 * Create a new livestream session.
 */
export const createSession = async (
  params: CreateSessionParams,
): Promise<LivestreamSession> => {
  const {
    creatorWalletId,
    creatorUserId,
    title,
    description,
    thumbnailUrl,
    scheduledAt,
  } = params;

  const sql = `
    INSERT INTO livestream_sessions (
      creator_wallet_id, creator_user_id, title, description, 
      thumbnail_url, scheduled_at
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const res = await query(sql, [
    creatorWalletId,
    creatorUserId,
    title,
    description || null,
    thumbnailUrl || null,
    scheduledAt || null,
  ]);

  logger.info(`Livestream session created: ${res.rows[0].id}`);
  return res.rows[0];
};

/**
 * Start a livestream session.
 */
export const startSession = async (
  sessionId: string,
): Promise<LivestreamSession> => {
  const sql = `
    UPDATE livestream_sessions 
    SET status = 'live', started_at = NOW(), updated_at = NOW()
    WHERE id = $1 AND status IN ('scheduled')
    RETURNING *;
  `;

  const res = await query(sql, [sessionId]);
  if (!res.rows.length) {
    throw new Error("Session not found or cannot be started");
  }

  logger.info(`Livestream started: ${sessionId}`);
  return res.rows[0];
};

/**
 * End a livestream session.
 */
export const endSession = async (
  sessionId: string,
): Promise<LivestreamSession> => {
  const sql = `
    UPDATE livestream_sessions 
    SET status = 'ended', ended_at = NOW(), updated_at = NOW()
    WHERE id = $1 AND status = 'live'
    RETURNING *;
  `;

  const res = await query(sql, [sessionId]);
  if (!res.rows.length) {
    throw new Error("Session not found or not live");
  }

  logger.info(`Livestream ended: ${sessionId}`);
  return res.rows[0];
};

/**
 * Get session by ID.
 */
export const getSession = async (
  sessionId: string,
): Promise<LivestreamSession | null> => {
  const sql = `SELECT * FROM livestream_sessions WHERE id = $1;`;
  const res = await query(sql, [sessionId]);
  return res.rows[0] || null;
};

/**
 * Get active (live) sessions.
 */
export const getLiveSessions = async (
  limit: number = 20,
): Promise<LivestreamSession[]> => {
  const sql = `
    SELECT * FROM livestream_sessions 
    WHERE status = 'live'
    ORDER BY viewer_count DESC, started_at DESC
    LIMIT $1;
  `;
  const res = await query(sql, [limit]);
  return res.rows;
};

/**
 * Get sessions by creator.
 */
export const getSessionsByCreator = async (
  creatorWalletId: string,
  limit: number = 20,
): Promise<LivestreamSession[]> => {
  const sql = `
    SELECT * FROM livestream_sessions 
    WHERE creator_wallet_id = $1
    ORDER BY created_at DESC
    LIMIT $2;
  `;
  const res = await query(sql, [creatorWalletId, limit]);
  return res.rows;
};

/**
 * Update viewer count (called from real-time connection handler).
 */
export const updateViewerCount = async (
  sessionId: string,
  viewerCount: number,
): Promise<void> => {
  const sql = `
    UPDATE livestream_sessions 
    SET 
      viewer_count = $2,
      peak_viewers = GREATEST(peak_viewers, $2),
      updated_at = NOW()
    WHERE id = $1;
  `;
  await query(sql, [sessionId, viewerCount]);
};

/**
 * Update session earnings after a gift.
 */
export const updateSessionEarnings = async (
  sessionId: string,
  giftValue: number,
  creatorAmount: number,
  platformAmount: number,
): Promise<void> => {
  const sql = `
    UPDATE livestream_sessions 
    SET 
      total_gifts_received = total_gifts_received + 1,
      total_gift_value = total_gift_value + $2,
      creator_earnings = creator_earnings + $3,
      platform_earnings = platform_earnings + $4,
      updated_at = NOW()
    WHERE id = $1;
  `;
  await query(sql, [sessionId, giftValue, creatorAmount, platformAmount]);
};
