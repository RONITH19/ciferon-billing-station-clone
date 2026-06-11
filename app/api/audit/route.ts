import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';

export async function GET() {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const rows = getDb()
    .prepare(
      `SELECT a.id, a.actor, a.action, a.resource, a.resource_id AS resourceId, a.created_at AS createdAt
       FROM audit_log a ORDER BY a.created_at DESC LIMIT 100`,
    )
    .all();
  return NextResponse.json({ data: rows });
}
