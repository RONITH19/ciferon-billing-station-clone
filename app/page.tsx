'use client';

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { checkAuth } from '@/lib/auth';
import { apiLogin } from '@/lib/api-client';
import { DEMO_LOGIN_USERS, DEMO_PASSWORD } from '@/lib/demo-users.constants';

// Dynamically import the React SPA with SSR disabled
const ReactApp = dynamic(() => import('@/src/App').then((mod) => mod.App), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500 font-sans">
      Loading sobos Billing Station...
    </div>
  ),
});

export default function RootPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    checkAuth().then((ok) => {
      setAuthenticated(ok);
    });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const form = event.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setBusy(true);
    try {
      await apiLogin(email, password);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
      setBusy(false);
    }
  };

  if (authenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500 font-sans">
        Checking session...
      </div>
    );
  }

  if (authenticated) {
    return <ReactApp />;
  }

  return (
    <main className="page">
      <div className="card">
        <section className="login-panel">
          <h1 className="login-title">Sign in</h1>
          <p className="login-subtitle">to access sobos Billing Station</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-input"
              autoComplete="email"
              defaultValue={DEMO_LOGIN_USERS[0]?.email ?? ''}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-input"
              autoComplete="current-password"
              defaultValue={DEMO_PASSWORD}
              required
            />
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? 'Signing in…' : 'Login into sobos'}
            </button>
          </form>

          <div className="mt-4 rounded-md border border-[#e5e7eb] bg-[#f8fafc] p-3 text-left text-xs text-[#6b7280]">
            <p className="mb-2 font-semibold text-[#111827]">Demo accounts (password: {DEMO_PASSWORD})</p>
            <ul className="space-y-1">
              {DEMO_LOGIN_USERS.map((u) => (
                <li key={u.email}>
                  <span className="font-medium text-[#111827]">{u.role}</span>
                  {' — '}
                  {u.email}
                </li>
              ))}
            </ul>
          </div>

          <Link href="/otp" className="otp-link">
            Login with OTP
          </Link>

          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">Or</span>
            <span className="divider-line" />
          </div>

          <p className="support-text">Call us on 9112239021 for further assistance</p>
        </section>

        <section className="promo-panel">
          <div className="illustration">
            <Image src="/assets/illustration.svg" alt="" width={280} height={175} />
          </div>

          <h2 className="promo-title">
            An experience <span className="highlight">you&apos;ll love</span>
          </h2>
          <p className="promo-text">
            Our refreshed approach to restaurant software has enabled over 8500+ restaurants big and small across the globe to exceed guest and staff expectations.
          </p>
        </section>
      </div>

      <footer className="page-footer">&copy; 2023, Webmilez Infotech Pvt. Ltd. All Rights Reserved.</footer>
    </main>
  );
}
