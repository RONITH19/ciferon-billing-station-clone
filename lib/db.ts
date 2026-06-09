import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';
import { seedDatabase } from './seed';

// Singleton DB connection. The file lives in <project>/data/shobox.db.
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'shobox.db');

declare global {
  // eslint-disable-next-line no-var
  var __shobox_db__: Database.Database | undefined;
  // eslint-disable-next-line no-var
  var __shobox_schema__: number | undefined;
}

// Bump when the schema changes so a cached dev connection re-runs migrations.
const SCHEMA_VERSION = 2;

function createConnection(): Database.Database {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS otps (
      email      TEXT PRIMARY KEY,
      code       TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS outlets (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS super_categories (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS categories (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      name                TEXT NOT NULL,
      online_display_name TEXT NOT NULL DEFAULT '--',
      item_count          INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sub_categories (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      name     TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS items (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT NOT NULL,
      display_name TEXT NOT NULL DEFAULT '',
      category     TEXT NOT NULL DEFAULT '',
      short_code   TEXT NOT NULL DEFAULT '--',
      base_price   REAL NOT NULL DEFAULT 0,
      tax          TEXT NOT NULL DEFAULT 'GST 0%',
      mrp          REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS addons (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT NOT NULL,
      display_name TEXT NOT NULL DEFAULT '',
      items        TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS variants (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS submenu (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      name      TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      unit          TEXT NOT NULL DEFAULT 'pcs',
      quantity      REAL NOT NULL DEFAULT 0,
      reorder_level REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS customers (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      phone       TEXT NOT NULL DEFAULT '',
      email       TEXT NOT NULL DEFAULT '',
      visits      INTEGER NOT NULL DEFAULT 0,
      total_spend REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS locations (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      name    TEXT NOT NULL,
      address TEXT NOT NULL DEFAULT '',
      city    TEXT NOT NULL DEFAULT '',
      phone   TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS staff (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      name  TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      role  TEXT NOT NULL DEFAULT 'Cashier'
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS orders (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      customer   TEXT NOT NULL DEFAULT 'Walk-in',
      total      REAL NOT NULL DEFAULT 0,
      item_count INTEGER NOT NULL DEFAULT 0,
      status     TEXT NOT NULL DEFAULT 'Paid'
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id  INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      qty       INTEGER NOT NULL DEFAULT 1,
      price     REAL NOT NULL DEFAULT 0
    );
  `);
}

export function getDb(): Database.Database {
  if (!global.__shobox_db__) {
    global.__shobox_db__ = createConnection();
  }
  const db = global.__shobox_db__;

  // Run migrations whenever the schema version changes. This is what makes the
  // app self-heal: if a dev server cached a connection with an older schema,
  // the next request creates any missing tables (all use IF NOT EXISTS) and
  // seeds the new ones. Cheap to re-run; guarded so it only fires on change.
  if (global.__shobox_schema__ !== SCHEMA_VERSION) {
    migrate(db);
    seedDatabase(db);
    global.__shobox_schema__ = SCHEMA_VERSION;
  }

  return db;
}
