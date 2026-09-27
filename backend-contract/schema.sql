PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  display_name TEXT,
  target_score INTEGER NOT NULL DEFAULT 990,
  payload_json TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS devices (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  label TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS sync_events (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  entity_id TEXT,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  server_created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sync_events_user_seq ON sync_events(user_id, seq);
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  session_id TEXT,
  part INTEGER,
  correct INTEGER NOT NULL,
  selected INTEGER,
  time_ms INTEGER,
  created_at TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  total INTEGER,
  correct INTEGER,
  duration_sec INTEGER,
  payload_json TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS skill_stats (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  mastery REAL,
  accuracy REAL,
  attempts INTEGER,
  updated_at TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  PRIMARY KEY(user_id,id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS error_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS app_settings (
  user_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(user_id,key),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS accounts (
  user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  email_norm TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  username_norm TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user','admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','blocked')),
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_algo TEXT NOT NULL DEFAULT 'pbkdf2-sha256',
  password_params_json TEXT NOT NULL DEFAULT '{"iterations":600000,"hash":"SHA-256"}',
  password_temporary INTEGER NOT NULL DEFAULT 0,
  temporary_password_expires_at TEXT,
  must_change_password INTEGER NOT NULL DEFAULT 0,
  password_changed_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_accounts_role_status ON accounts(role,status);
CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expiry ON auth_sessions(expires_at);
CREATE TABLE IF NOT EXISTS reset_requests (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK(status IN ('pending','issued','completed','expired','cancelled')),
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reset_requests_status ON reset_requests(status,created_at);
CREATE INDEX IF NOT EXISTS idx_reset_requests_user ON reset_requests(user_id);
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  subject TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_started_at TEXT NOT NULL,
  blocked_until TEXT
);
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT,
  target_user_id TEXT,
  action TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON admin_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_actor ON admin_audit_log(actor_user_id);
CREATE TABLE IF NOT EXISTS schema_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
INSERT OR REPLACE INTO schema_meta(key,value) VALUES ('schema_version','2');
INSERT OR REPLACE INTO schema_meta(key,value) VALUES ('auth_version','2');
