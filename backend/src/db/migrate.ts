import fs from "fs";
import path from "path";
import pool from "./index";
import logger from "../utils/logger";

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

const getMigrationFiles = (): string[] => {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));
};

const runMigrations = async () => {
  const client = await pool.connect();

  try {
    const migrationFiles = getMigrationFiles();
    logger.info(`Found ${migrationFiles.length} migration files.`);

    for (const migrationFile of migrationFiles) {
      const migrationPath = path.join(MIGRATIONS_DIR, migrationFile);
      const sql = fs.readFileSync(migrationPath, "utf8");
      const upSql = sql.split("-- Down Migration")[0].trim();

      if (!upSql) {
        logger.warn(`Skipping ${migrationFile}: empty up migration.`);
        continue;
      }

      logger.info(`Running migration: ${migrationFile}`);
      await client.query("BEGIN");
      await client.query(upSql);
      await client.query("COMMIT");
      logger.info(`Migration successful: ${migrationFile}`);
    }
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("Migration failed:", err);
    throw err;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default runMigrations;
