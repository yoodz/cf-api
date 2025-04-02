-- migrations/0000_initial_migration.sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);