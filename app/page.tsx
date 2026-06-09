'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { checkAuth } from '@/lib/auth';
import { apiLogin } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    checkAuth().then((ok) => {
      if (ok) router.replace('/outlets');
    });
  }, [router]);

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
      router.push('/outlets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
      setBusy(false);
    }
  };

  return (
    <main className="page">
      <div className="card">
        <section className="login-panel">
          <h1 className="login-title">Sign in</h1>
          <p className="login-subtitle">to access shobox Billing Station</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" className="form-input" autoComplete="email" required />
            <input type="password" name="password" placeholder="Password" className="form-input" autoComplete="current-password" required />
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? 'Signing in…' : 'Login into shobox'}
            </button>
          </form>

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
