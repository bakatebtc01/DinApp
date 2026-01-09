-- Up Migration
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);

-- Down Migration
-- ALTER TABLE users DROP COLUMN password_hash;
