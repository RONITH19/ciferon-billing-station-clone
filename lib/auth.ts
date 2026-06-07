export const AUTH_KEY = 'shobox_logged_in';

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function setLoggedIn(): void {
  sessionStorage.setItem(AUTH_KEY, 'true');
}
