import Database from 'better-sqlite3';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'data', 'sobos.db');
console.log('Connecting to database:', DB_PATH);

const db = new Database(DB_PATH);

// Get all tables
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

console.log(`Found ${tables.length} tables:`);
for (const table of tables) {
  const tableName = table.name;
  try {
    const row = db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get();
    console.log(`- ${tableName}: ${row.count} rows`);
  } catch (err) {
    console.error(`- ${tableName}: Error counting rows: ${err.message}`);
  }
}

db.close();
