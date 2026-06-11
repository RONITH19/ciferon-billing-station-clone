// Edge-safe session helpers (middleware). Signature verification runs on the server in session.server.ts.
export const SESSION_COOKIE = 'sobos_session';
export const SESSION_MAX_AGE = 60 * 60 * 8;

export function decodeSession(value: string | undefined): string | null {
  if (!value) return null;
  const dot = value.lastIndexOf('.');
  const payload = dot >= 0 ? value.slice(0, dot) : value;
  try {
    const email = decodeURIComponent(payload);
    return email.includes('@') ? email : null;
  } catch {
    return null;
  }
}
