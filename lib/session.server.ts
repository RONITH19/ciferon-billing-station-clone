import { createHmac, timingSafeEqual } from 'crypto';

function secret(): string {
  return process.env.SESSION_SECRET ?? 'restaurantos-local-dev-secret-change-in-prod';
}

export function encodeSessionSigned(email: string): string {
  const payload = encodeURIComponent(email);
  const sig = createHmac('sha256', secret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifySessionSigned(value: string): string | null {
  const dot = value.lastIndexOf('.');
  if (dot < 0) return null;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = createHmac('sha256', secret()).update(payload).digest('hex');
  try {
    if (sig.length !== expected.length) return null;
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const email = decodeURIComponent(payload);
    return email.includes('@') ? email : null;
  } catch {
    return null;
  }
}
