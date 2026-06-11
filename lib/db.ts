import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';
import { seedDatabase } from './seed';
import { seedLoginUsers } from './demo-users';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'sobos.db');

declare global {
  // eslint-disable-next-line no-var
  var __sobos_db__: Database.Database | undefined;
  // eslint-disable-next-line no-var
  var __sobos_schema__: number | undefined;
}

const SCHEMA_VERSION = 6;

function createConnection(): Database.Database {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}

function migrateBase(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL DEFAULT '',
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
      mrp          REAL NOT NULL DEFAULT 0,
      est_prep_time INTEGER NOT NULL DEFAULT 15
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

function addColumnIfMissing(db: Database.Database, table: string, column: string, definition: string) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

function migrateV3(db: Database.Database) {
  addColumnIfMissing(db, 'users', 'password_hash', "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(db, 'items', 'est_prep_time', 'INTEGER NOT NULL DEFAULT 15');

  addColumnIfMissing(db, 'orders', 'outlet_id', 'INTEGER');
  addColumnIfMissing(db, 'orders', 'session_id', 'INTEGER');
  addColumnIfMissing(db, 'orders', 'table_id', 'INTEGER');
  addColumnIfMissing(db, 'orders', 'table_label', "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(db, 'orders', 'order_type', "TEXT NOT NULL DEFAULT 'dine_in'");
  addColumnIfMissing(db, 'orders', 'subtotal', 'REAL NOT NULL DEFAULT 0');
  addColumnIfMissing(db, 'orders', 'tax', 'REAL NOT NULL DEFAULT 0');
  addColumnIfMissing(db, 'orders', 'discount', 'REAL NOT NULL DEFAULT 0');
  addColumnIfMissing(db, 'orders', 'confirmed_at', 'TEXT');
  addColumnIfMissing(db, 'orders', 'preparing_at', 'TEXT');
  addColumnIfMissing(db, 'orders', 'ready_at', 'TEXT');
  addColumnIfMissing(db, 'orders', 'served_at', 'TEXT');
  addColumnIfMissing(db, 'orders', 'notes', "TEXT NOT NULL DEFAULT ''");

  addColumnIfMissing(db, 'order_items', 'item_id', 'INTEGER');
  addColumnIfMissing(db, 'order_items', 'modifiers_json', "TEXT NOT NULL DEFAULT '[]'");
  addColumnIfMissing(db, 'order_items', 'notes', "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(db, 'order_items', 'station', "TEXT NOT NULL DEFAULT 'kitchen'");

  db.exec(`
    CREATE TABLE IF NOT EXISTS restaurant_tables (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      outlet_id  INTEGER NOT NULL DEFAULT 1,
      number     TEXT NOT NULL,
      capacity   INTEGER NOT NULL DEFAULT 4,
      section    TEXT NOT NULL DEFAULT 'Main Hall',
      status     TEXT NOT NULL DEFAULT 'available',
      pos_x      REAL NOT NULL DEFAULT 0,
      pos_y      REAL NOT NULL DEFAULT 0,
      shape      TEXT NOT NULL DEFAULT 'square'
    );

    CREATE TABLE IF NOT EXISTS table_sessions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      table_id    INTEGER NOT NULL,
      outlet_id   INTEGER NOT NULL DEFAULT 1,
      status      TEXT NOT NULL DEFAULT 'active',
      opened_at   TEXT NOT NULL DEFAULT (datetime('now')),
      closed_at   TEXT,
      guest_count INTEGER NOT NULL DEFAULT 2
    );

    CREATE TABLE IF NOT EXISTS order_status_log (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id    INTEGER NOT NULL,
      from_status TEXT NOT NULL,
      to_status   TEXT NOT NULL,
      changed_at  TEXT NOT NULL DEFAULT (datetime('now')),
      changed_by  TEXT NOT NULL DEFAULT 'system'
    );

    CREATE TABLE IF NOT EXISTS payments (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id   INTEGER NOT NULL,
      method     TEXT NOT NULL DEFAULT 'cash',
      amount     REAL NOT NULL DEFAULT 0,
      status     TEXT NOT NULL DEFAULT 'captured',
      reference  TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS held_orders (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      outlet_id  INTEGER NOT NULL DEFAULT 1,
      label      TEXT NOT NULL DEFAULT 'Held Order',
      cart_json  TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS stations (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      outlet_id     INTEGER NOT NULL DEFAULT 1,
      name          TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      color         TEXT NOT NULL DEFAULT '#3b82f6'
    );

    CREATE TABLE IF NOT EXISTS vendors (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      name    TEXT NOT NULL,
      phone   TEXT NOT NULL DEFAULT '',
      email   TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS purchase_orders (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id   INTEGER,
      status      TEXT NOT NULL DEFAULT 'draft',
      total       REAL NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      received_at TEXT
    );

    CREATE TABLE IF NOT EXISTS stock_movements (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      inventory_id INTEGER NOT NULL,
      type        TEXT NOT NULL,
      quantity    REAL NOT NULL,
      reason      TEXT NOT NULL DEFAULT '',
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      name    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recipe_ingredients (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id     INTEGER NOT NULL,
      inventory_id  INTEGER NOT NULL,
      quantity      REAL NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS loyalty_points (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      points      INTEGER NOT NULL DEFAULT 0,
      reason      TEXT NOT NULL DEFAULT '',
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      actor       TEXT NOT NULL DEFAULT 'system',
      action      TEXT NOT NULL,
      resource    TEXT NOT NULL,
      resource_id TEXT NOT NULL DEFAULT '',
      detail_json TEXT NOT NULL DEFAULT '{}',
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Backfill subtotal from total for legacy rows
  db.exec(`UPDATE orders SET subtotal = total WHERE subtotal = 0 AND total > 0`);
}

function migrateV4(db: Database.Database) {
  // Add columns to customers table
  addColumnIfMissing(db, 'customers', 'last_visited', "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(db, 'customers', 'total_orders', 'INTEGER NOT NULL DEFAULT 0');
  addColumnIfMissing(db, 'customers', 'balance', 'REAL NOT NULL DEFAULT 0');

  // Add columns to staff table
  addColumnIfMissing(db, 'staff', 'mobile', "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(db, 'staff', 'designation', "TEXT NOT NULL DEFAULT ''");

  // Add columns to vendors table
  addColumnIfMissing(db, 'vendors', 'mobile', "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(db, 'vendors', 'gst_no', "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(db, 'vendors', 'balance', 'REAL NOT NULL DEFAULT 0');
  addColumnIfMissing(db, 'vendors', 'department', "TEXT NOT NULL DEFAULT ''");

  // Add columns to inventory table
  addColumnIfMissing(db, 'inventory', 'category', "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(db, 'inventory', 'avg_cost_unit', 'REAL NOT NULL DEFAULT 0');
  addColumnIfMissing(db, 'inventory', 'available_p', "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(db, 'inventory', 'available_s', "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing(db, 'inventory', 'alert', "TEXT NOT NULL DEFAULT ''");

  // Create new tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS charges (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      name  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS departments (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      name  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS booklets (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      name  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bank_accounts (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      name   TEXT NOT NULL,
      mobile TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS credit_sales (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_no     TEXT NOT NULL,
      customer       TEXT NOT NULL,
      total_amount   REAL NOT NULL DEFAULT 0,
      balance_amount REAL NOT NULL DEFAULT 0,
      date           TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS credit_purchases (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_no     TEXT NOT NULL,
      vendor_name    TEXT NOT NULL,
      total_amount   REAL NOT NULL DEFAULT 0,
      balance_amount REAL NOT NULL DEFAULT 0,
      date           TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      expense_no   TEXT NOT NULL,
      date         TEXT NOT NULL,
      paid_to      TEXT NOT NULL,
      grand_total  REAL NOT NULL DEFAULT 0,
      items_count  INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS kitchens (
      id                  INTEGER PRIMARY KEY AUTOINCREMENT,
      name                TEXT NOT NULL,
      description         TEXT NOT NULL DEFAULT '',
      disable_prints      INTEGER NOT NULL DEFAULT 0,
      main_printer_name   TEXT NOT NULL DEFAULT '',
      main_printer_type   TEXT NOT NULL DEFAULT '',
      alt_printer_name    TEXT NOT NULL DEFAULT '',
      alt_printer_type    TEXT NOT NULL DEFAULT '',
      dine_in_token_printer TEXT NOT NULL DEFAULT '',
      pickup_printer_name TEXT NOT NULL DEFAULT '',
      delivery_printer_name TEXT NOT NULL DEFAULT '',
      menu_items_json     TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS produced_stocks (
      id     TEXT PRIMARY KEY,
      date   TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sobos_purchase_orders (
      id                     TEXT PRIMARY KEY,
      ledger                 TEXT NOT NULL,
      number                 TEXT NOT NULL DEFAULT '',
      date                   TEXT NOT NULL,
      created_on             TEXT NOT NULL,
      expected_delivery_date TEXT NOT NULL,
      total_amount           REAL NOT NULL DEFAULT 0,
      status                 TEXT NOT NULL DEFAULT 'PO Generated'
    );

    CREATE TABLE IF NOT EXISTS purchase_invoices (
      id                TEXT PRIMARY KEY,
      bill_ref_no       TEXT NOT NULL DEFAULT '',
      vendor_name       TEXT NOT NULL,
      number            TEXT NOT NULL DEFAULT '',
      invoice_date      TEXT NOT NULL,
      created_on        TEXT NOT NULL,
      payment_due_date  TEXT NOT NULL DEFAULT '',
      grand_total       REAL NOT NULL DEFAULT 0,
      status            TEXT NOT NULL DEFAULT 'Received',
      balance           REAL NOT NULL DEFAULT 0,
      settlement        TEXT NOT NULL DEFAULT 'Pay'
    );
  `);
}

function migrateV6(db: Database.Database) {
  seedLoginUsers(db);
}

function migrate(db: Database.Database) {
  migrateBase(db);
  migrateV3(db);
  migrateV4(db);
  migrateV6(db);
}

export function getDb(): Database.Database {
  if (!global.__sobos_db__) {
    global.__sobos_db__ = createConnection();
  }
  const db = global.__sobos_db__;

  if (global.__sobos_schema__ !== SCHEMA_VERSION) {
    migrate(db);
    seedDatabase(db);
    global.__sobos_schema__ = SCHEMA_VERSION;
  }

  return db;
}

/** Completed order statuses for reporting */
export const COMPLETED_STATUSES = "('Paid', 'Completed', 'Served')";
