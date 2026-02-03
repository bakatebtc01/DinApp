import { Pool } from "pg";
import dotenv from "dotenv";
import logger from "../utils/logger";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const isMock = process.env.MOCK_DB === "true";

let pool: Pool | any;

if (isMock) {
  logger.info("Using MOCK DATABASE (In-Memory)");

  // In-memory store
  const mockUsers: any[] = [];

  pool = {
    on: (event: string, cb: Function) => {
      if (event === "connect") cb();
    },
    query: async (text: string, params: any[] = []) => {
      const normalizedText = text.trim().replace(/\s+/g, " ").toUpperCase();
      
      // INSERT USER
      if (normalizedText.includes("INSERT INTO USERS")) {
        const id = uuidv4();
        const newUser = {
          id,
          phone_country_code: params[0],
          phone_number: params[1],
          email: params[2],
          password_hash: params[3],
          full_name: params[4],
          dob: params[5],
          device_id: params[6],
          kyc_tier: 1,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        };
        mockUsers.push(newUser);
        return { rows: [newUser] };
      }

      // SELECT BY EMAIL
      if (normalizedText.includes("SELECT * FROM USERS WHERE EMAIL")) {
        const email = params[0];
        const user = mockUsers.find(u => u.email === email);
        return { rows: user ? [user] : [] };
      }

      // SELECT BY PHONE
      if (normalizedText.includes("SELECT * FROM USERS WHERE PHONE_COUNTRY_CODE")) {
        const cc = params[0];
        const ph = params[1];
        const user = mockUsers.find(u => u.phone_country_code === cc && u.phone_number === ph);
        return { rows: user ? [user] : [] };
      }
      
      // SELECT BY ID
      if (normalizedText.includes("SELECT * FROM USERS WHERE ID")) {
          const id = params[0];
          const user = mockUsers.find(u => u.id === id);
          return { rows: user ? [user] : [] };
      }

      // UPDATE VERIFIED
      if (normalizedText.includes("UPDATE USERS SET IS_VERIFIED")) {
        const id = params[0];
        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            mockUsers[userIndex].is_verified = true;
            mockUsers[userIndex].updated_at = new Date();
        }
        return { rows: [] };
      }

      logger.warn(`Mock DB: Unhandled query: ${text}`);
      return { rows: [] };
    }
  };

} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  pool.on("connect", () => {
    logger.info("Database connected successfully.");
  });

  pool.on("error", (err: Error) => {
    logger.error("Unexpected error on idle client", err);
    process.exit(-1);
  });
}

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
