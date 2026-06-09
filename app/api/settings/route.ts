import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';

const ALLOWED_KEYS = ['restaurantName', 'currency', 'taxRate', 'address', 'phone', 'gstNumber'];

export async function GET() {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM settings').all() as {
    key: string;
    value: string;
  }[];
  const data: Record<string, string> = {};
  for (const r of rows) data[r.key] = r.value;
  return NextResponse.json({ data });
}

export async function PUT(request: Request) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const db = getDb();
  const upsert = db.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  );
  const tx = db.transaction(() => {
    for (const key of ALLOWED_KEYS) {
      if (key in body) upsert.run(key, String(body[key] ?? ''));
    }
  });
  tx();

  const rows = db.prepare('SELECT key, value FROM settings').all() as {
    key: string;
    value: string;
  }[];
  const data: Record<string, string> = {};
  for (const r of rows) data[r.key] = r.value;
  return NextResponse.json({ data });
}
