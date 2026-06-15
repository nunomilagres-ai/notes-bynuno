-- Migration: add recurrence to note_reminders
-- Run: npx wrangler d1 execute notes-bynuno-db --file=./schema_migrate_recurrence.sql

ALTER TABLE note_reminders ADD COLUMN recurrence TEXT DEFAULT NULL;
-- recurrence: NULL | 'daily' | 'weekly' | 'monthly' | 'yearly'