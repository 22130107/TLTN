-- Cloudflare D1 SQLite Schema for Couple Feature

CREATE TABLE IF NOT EXISTS couples (
  id TEXT PRIMARY KEY,
  user_1 TEXT NOT NULL,
  user_2 TEXT NOT NULL,
  anniversary_date TEXT NOT NULL,
  nickname_1 TEXT,
  nickname_2 TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS couple_requests (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS couple_messages (
  id TEXT PRIMARY KEY,
  couple_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  status TEXT DEFAULT 'sent',
  created_at INTEGER NOT NULL
);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_couples_users ON couples(user_1, user_2, status);
CREATE INDEX IF NOT EXISTS idx_couples_user1 ON couples(user_1, status);
CREATE INDEX IF NOT EXISTS idx_couples_user2 ON couples(user_2, status);
CREATE INDEX IF NOT EXISTS idx_requests_receiver ON couple_requests(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_requests_sender ON couple_requests(sender_id, status);
CREATE INDEX IF NOT EXISTS idx_messages_couple ON couple_messages(couple_id, created_at DESC);
