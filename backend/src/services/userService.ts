import { query } from "../db";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  phone_country_code: string;
  phone_number: string;
  email?: string;
  password_hash?: string;
  full_name?: string;
  dob?: string;
  kyc_tier: number;
  is_verified: boolean;
  device_id?: string;
}

export const createUser = async (
  countryCode: string,
  phoneNumber: string,
  email: string,
  passwordHash: string,
  fullName: string,
  dob: string,
  deviceId?: string,
): Promise<User> => {
  const sql = `
    INSERT INTO users (phone_country_code, phone_number, email, password_hash, full_name, dob, device_id, kyc_tier, is_verified)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 1, FALSE)
    RETURNING id, phone_country_code, phone_number, email, full_name, dob, kyc_tier, is_verified, device_id;
  `;
  const res = await query(sql, [countryCode, phoneNumber, email, passwordHash, fullName, dob, deviceId]);
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

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const sql = `SELECT * FROM users WHERE email = $1;`;
  const res = await query(sql, [email]);
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
