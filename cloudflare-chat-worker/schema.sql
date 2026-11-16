-- Cloudflare D1 SQLite Schema for Couple Messages
CREATE TABLE IF NOT EXISTS couple_messages (
  id TEXT PRIMARY KEY,
  couple_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  status TEXT DEFAULT 'sent',
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_couple_messages_lookup ON couple_messages(couple_id, created_at DESC);
