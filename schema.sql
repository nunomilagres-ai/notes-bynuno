-- schema.sql — notes.bynuno.com D1 database

-- ─── Utilizadores (sync com bynuno.com hub) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  avatar_url   TEXT,
  created_date TEXT NOT NULL,
  updated_date TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ─── Temas / Agregadores ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS note_topics (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  emoji        TEXT NOT NULL DEFAULT '📋',
  color        TEXT NOT NULL DEFAULT '#E8A838',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_date TEXT NOT NULL,
  updated_date TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_topics_user ON note_topics(user_id);

-- ─── Notas ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notes (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id     TEXT REFERENCES note_topics(id) ON DELETE SET NULL,
  title        TEXT NOT NULL DEFAULT 'Nova nota',
  content      TEXT NOT NULL DEFAULT '',
  pinned       INTEGER NOT NULL DEFAULT 0,
  created_date TEXT NOT NULL,
  updated_date TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notes_user    ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_topic   ON notes(topic_id);
CREATE INDEX IF NOT EXISTS idx_notes_updated ON notes(updated_date DESC);

-- ─── Lembretes / Tarefas ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS note_reminders (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note_id      TEXT REFERENCES notes(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  body         TEXT,
  due_date     TEXT NOT NULL,
  completed    INTEGER NOT NULL DEFAULT 0,
  notified     INTEGER NOT NULL DEFAULT 0,
  created_date TEXT NOT NULL,
  updated_date TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reminders_user    ON note_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due     ON note_reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_reminders_note    ON note_reminders(note_id);