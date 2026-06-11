import bcrypt from 'bcryptjs';
import type Database from 'better-sqlite3';
import { DEMO_LOGIN_USERS, DEMO_PASSWORD } from './demo-users.constants';

export { DEMO_LOGIN_USERS, DEMO_PASSWORD } from './demo-users.constants';
export type { DemoLoginUser } from './demo-users.constants';

/**
 * Upserts demo users into `users` (auth) and `staff` (RBAC).
 * Safe to run on every schema migration — idempotent.
 */
export function seedLoginUsers(db: Database.Database) {
  const hash = bcrypt.hashSync(DEMO_PASSWORD, 10);

  const upsertUser = db.prepare(`
    INSERT INTO users (email, password_hash) VALUES (?, ?)
    ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash
  `);

  const findStaff = db.prepare(
    'SELECT id FROM staff WHERE lower(trim(email)) = lower(trim(?)) LIMIT 1',
  );
  const insertStaff = db.prepare(
    'INSERT INTO staff (name, email, role, mobile, designation) VALUES (?, ?, ?, ?, ?)',
  );
  const updateStaff = db.prepare(
    'UPDATE staff SET name = ?, role = ?, mobile = ?, designation = ? WHERE id = ?',
  );

  for (const user of DEMO_LOGIN_USERS) {
    const email = user.email.toLowerCase();
    upsertUser.run(email, hash);

    const existing = findStaff.get(email) as { id: number } | undefined;
    if (existing) {
      updateStaff.run(user.name, user.role, user.mobile, user.designation, existing.id);
    } else {
      insertStaff.run(user.name, email, user.role, user.mobile, user.designation);
    }
  }
}
