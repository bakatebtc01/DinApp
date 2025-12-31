import fs from "fs";
import path from "path";
import pool from "./index";
import logger from "../utils/logger";

const runMigrations = async () => {
  const marketingclient = await pool.connect();
  try {
    const migrationFile = path.join(
      __dirname,
      "migrations",
      "001_create_users_table.sql",
    );
    const sql = fs.readFileSync(migrationFile, "utf8");

    // We only want the "Up" part. In a real runner we'd parse this.
    // For this simple setup, we'll split by '-- Down Migration'
    const upSql = sql.split("-- Down Migration")[0];

    logger.info("Running migration: 001_create_users_table.sql");
    await marketingclient.query(upSql);
    logger.info("Migration successful.");
  } catch (err) {
    logger.error("Migration failed:", err);
  } finally {
    marketingclient.release();
  }
};

if (require.main === module) {
  runMigrations().then(() => process.exit(0));
}

export default runMigrations;
