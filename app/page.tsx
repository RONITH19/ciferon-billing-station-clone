'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect } from 'react';
import { isLoggedIn, setLoggedIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace('/outlets');
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    setLoggedIn();
    router.push('/outlets');
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
            <button type="submit" className="btn-primary">
              Login into shobox
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
