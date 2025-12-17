-- Migration: Create clickinfo table
-- Description: Initial table to store click tracking information

CREATE TABLE IF NOT EXISTS clickinfo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp INTEGER NOT NULL,
  user_id TEXT,
  page_url TEXT NOT NULL,
  element_id TEXT,
  element_class TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index on timestamp for efficient querying
CREATE INDEX IF NOT EXISTS idx_clickinfo_timestamp ON clickinfo(timestamp);

-- Create index on user_id for user-specific queries
CREATE INDEX IF NOT EXISTS idx_clickinfo_user_id ON clickinfo(user_id);
