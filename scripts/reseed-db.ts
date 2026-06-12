import { getDb } from '../lib/db';
import { seedDatabase } from '../lib/seed';
import { seedLoginUsers } from '../lib/demo-users';

console.log('Connecting to database...');
const db = getDb();

console.log('Disabling foreign key constraints for truncate...');
db.pragma('foreign_keys = OFF');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all() as { name: string }[];

console.log('Truncating all tables...');
const truncateTx = db.transaction(() => {
  for (const table of tables) {
    const tableName = table.name;
    db.prepare(`DELETE FROM "${tableName}"`).run();
    console.log(`- Truncated table: ${tableName}`);
  }
  // Clear sqlite sequence to reset auto-increment IDs
  try {
    db.prepare(`DELETE FROM sqlite_sequence`).run();
    console.log('- Cleared sqlite_sequence');
  } catch (e) {
    // sqlite_sequence might not exist if no autoincrement was ever used
  }
});
truncateTx();

console.log('Enabling foreign key constraints...');
db.pragma('foreign_keys = ON');

console.log('Re-running database migrations and seeding...');
seedDatabase(db);
seedLoginUsers(db);

console.log('Counting rows in each table to verify:');
const tablesAfter = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all() as { name: string }[];
let zeroCountTables = 0;
for (const table of tablesAfter) {
  const tableName = table.name;
  try {
    const row = db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get() as { count: number };
    console.log(`- ${tableName}: ${row.count} rows`);
    if (row.count === 0) {
      zeroCountTables++;
      console.warn(`⚠️ Table "${tableName}" is EMPTY!`);
    }
  } catch (err) {
    console.error(`- ${tableName}: Error counting rows: ${err.message}`);
  }
}

db.close();

if (zeroCountTables > 0) {
  console.error(`Warning: ${zeroCountTables} tables are still empty!`);
  process.exit(1);
} else {
  console.log('Database re-seeding completed successfully! All tables have mock data.');
}
