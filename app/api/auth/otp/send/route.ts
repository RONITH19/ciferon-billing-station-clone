import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Generates a 6-digit OTP, stores it (valid 5 min) and returns it in the
// response since there is no email server in a local setup. The UI shows it.
export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const db = getDb();
  db.prepare(
    `INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at`,
  ).run(email, code, expiresAt);

  // devCode is returned only because there's no mail transport locally.
  return NextResponse.json({ ok: true, devCode: code });
}
