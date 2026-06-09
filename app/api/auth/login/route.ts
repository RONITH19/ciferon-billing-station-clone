import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { setSession } from '@/lib/session';

// Demo auth: any email + non-empty password is accepted. The user record is
// created on first login so we have a real row in SQLite, then a session
// cookie is issued.
export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const password = body.password ?? '';

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: 'Please enter your password.' }, { status: 400 });
  }

  const db = getDb();
  db.prepare('INSERT OR IGNORE INTO users (email) VALUES (?)').run(email);

  await setSession(email);
  return NextResponse.json({ ok: true, email });
}
