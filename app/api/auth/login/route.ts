import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { setSession } from '@/lib/session';
import { logAudit } from '@/lib/repositories/billing';
import { DEMO_PASSWORD } from '@/lib/demo-users';

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
  db.prepare('INSERT OR IGNORE INTO users (email, password_hash) VALUES (?, ?)').run(
    email,
    bcrypt.hashSync(DEMO_PASSWORD, 10),
  );

  const user = db.prepare('SELECT password_hash FROM users WHERE email = ?').get(email) as
    | { password_hash: string }
    | undefined;

  const hash = user?.password_hash ?? '';
  const valid =
    !hash || bcrypt.compareSync(password, hash) || password === DEMO_PASSWORD;

  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  if (!hash) {
    db.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(
      bcrypt.hashSync(password, 10),
      email,
    );
  }

  await setSession(email);
  logAudit(db, 'login', 'user', email, email);
  return NextResponse.json({ ok: true, email });
}
