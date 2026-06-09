import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { setSession } from '@/lib/session';

export async function POST(request: Request) {
  let body: { email?: string; otp?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const otp = (body.otp ?? '').trim();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!otp) {
    return NextResponse.json({ error: 'Please enter the OTP.' }, { status: 400 });
  }

  const db = getDb();
  const row = db.prepare('SELECT code, expires_at FROM otps WHERE email = ?').get(email) as
    | { code: string; expires_at: string }
    | undefined;

  if (!row || row.code !== otp) {
    return NextResponse.json({ error: 'Invalid OTP.' }, { status: 401 });
  }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'OTP has expired. Request a new one.' }, { status: 401 });
  }

  db.prepare('DELETE FROM otps WHERE email = ?').run(email);
  db.prepare('INSERT OR IGNORE INTO users (email) VALUES (?)').run(email);

  await setSession(email);
  return NextResponse.json({ ok: true, email });
}
