ALTER TABLE accounts ADD COLUMN password_temporary INTEGER NOT NULL DEFAULT 0;
ALTER TABLE accounts ADD COLUMN temporary_password_expires_at TEXT;
ALTER TABLE accounts ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS reset_requests (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK(status IN ('pending','issued','completed','expired','cancelled')),
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reset_requests_status ON reset_requests(status,created_at);
CREATE INDEX IF NOT EXISTS idx_reset_requests_user ON reset_requests(user_id);
