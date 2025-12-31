import { query } from "../db";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  phone_country_code: string;
  phone_number: string;
  kyc_tier: number;
  is_verified: boolean;
  device_id?: string;
}

export const createUser = async (
  countryCode: string,
  phoneNumber: string,
  deviceId?: string,
): Promise<User> => {
  const sql = `
    INSERT INTO users (phone_country_code, phone_number, device_id)
    VALUES ($1, $2, $3)
    RETURNING id, phone_country_code, phone_number, kyc_tier, is_verified, device_id;
  `;
  const res = await query(sql, [countryCode, phoneNumber, deviceId]);
  return res.rows[0];
};

export const findUserByPhone = async (
  countryCode: string,
  phoneNumber: string,
): Promise<User | null> => {
  const sql = `
    SELECT * FROM users 
    WHERE phone_country_code = $1 AND phone_number = $2;
  `;
  const res = await query(sql, [countryCode, phoneNumber]);
  return res.rows[0] || null;
};

export const verifyUser = async (userId: string): Promise<void> => {
  const sql = `UPDATE users SET is_verified = TRUE, updated_at = NOW() WHERE id = $1;`;
  await query(sql, [userId]);
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const sql = `SELECT * FROM users WHERE id = $1;`;
  const res = await query(sql, [userId]);
  return res.rows[0] || null;
};
