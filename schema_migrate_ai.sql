-- Migration: make note dates optional and add AI suggestion tracking
-- Run: wrangler d1 execute notes-bynuno-db --file=./schema_migrate_ai.sql

-- Notes: created_date and updated_date already allow NULL in SQLite
-- No structural change needed — the API already handles NULL dates gracefully.

-- Verify tables exist (safe no-op if already correct)
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;