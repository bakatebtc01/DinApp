import fs from "fs";
import path from "path";
import { PoolClient } from "pg";
import pool from "./index";
import logger from "../utils/logger";

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

const ensureMigrationsTable = async (client: PoolClient) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const listMigrationFiles = (): string[] => {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));
};

  const client = await pool.connect();

    await ensureMigrationsTable(client);

    const appliedResult = await client.query<{ filename: string }>(
      "SELECT filename FROM schema_migrations",
    const applied = new Set(appliedResult.rows.map((row) => row.filename));

    const migrationFiles = listMigrationFiles();
    logger.info(`Found ${migrationFiles.length} migration files.`);

    for (const migrationFile of migrationFiles) {
      if (applied.has(migrationFile)) {
        logger.info(`Skipping already applied migration: ${migrationFile}`);
        continue;
      }

      const migrationPath = path.join(MIGRATIONS_DIR, migrationFile);
      const sql = fs.readFileSync(migrationPath, "utf8");
      const upSql = sql.split("-- Down Migration")[0].trim();
      if (!upSql) {
        logger.warn(`Skipping empty migration: ${migrationFile}`);
        continue;
      }
      logger.info(`Running migration: ${migrationFile}`);
      await client.query("BEGIN");
      await client.query(upSql);
      await client.query(
        "INSERT INTO schema_migrations (filename) VALUES ($1)",
        [migrationFile],
      );
      await client.query("COMMIT");
      logger.info(`Migration successful: ${migrationFile}`);
    }
    await client.query("ROLLBACK");
    throw err;
    client.release();
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
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
