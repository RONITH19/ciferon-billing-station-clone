'use client';

import { apiMe } from './api-client';

// Auth is now backed by an httpOnly session cookie set by the API. The client
// cannot read the cookie directly, so it asks the server via /api/auth/me.
export async function checkAuth(): Promise<boolean> {
  const { authenticated } = await apiMe();
  return authenticated;
}
