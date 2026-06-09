// Pure, runtime-agnostic session token helpers (safe for the Edge middleware).
// The token is just the URL-encoded email — adequate for a local demo app.
export const SESSION_COOKIE = 'shobox_session';
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export function encodeSession(email: string): string {
  return encodeURIComponent(email);
}

export function decodeSession(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const email = decodeURIComponent(value);
    return email.includes('@') ? email : null;
  } catch {
    return null;
  }
}
