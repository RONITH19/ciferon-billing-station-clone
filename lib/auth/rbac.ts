import { getSessionEmail } from '@/lib/session';
import { getDb } from '@/lib/db';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  Owner: ['*'],
  Manager: ['orders.*', 'menu.*', 'inventory.*', 'reports.*'],
  Cashier: ['orders.create', 'orders.read', 'billing.*'],
  Steward: ['orders.read', 'tables.*'],
};

export async function getActorRole(): Promise<{ email: string; role: string } | null> {
  const email = await getSessionEmail();
  if (!email) return null;
  const row = getDb()
    .prepare('SELECT role FROM staff WHERE email = ? LIMIT 1')
    .get(email) as { role: string } | undefined;
  return { email, role: row?.role ?? 'Cashier' };
}

export async function requirePermission(permission: string): Promise<string> {
  const actor = await getActorRole();
  if (!actor) throw new Error('Unauthorized');
  const perms = ROLE_PERMISSIONS[actor.role] ?? ROLE_PERMISSIONS.Cashier;
  if (perms.includes('*')) return actor.email;
  if (perms.includes(permission)) return actor.email;
  const wildcard = permission.split('.')[0] + '.*';
  if (perms.includes(wildcard)) return actor.email;
  throw new Error('Forbidden');
}
