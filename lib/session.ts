import { cookies } from 'next/headers';
import { SESSION_COOKIE, SESSION_MAX_AGE, encodeSession, decodeSession } from './session-token';

export { SESSION_COOKIE, decodeSession } from './session-token';

export async function setSession(email: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSession(email), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionEmail(): Promise<string | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}
