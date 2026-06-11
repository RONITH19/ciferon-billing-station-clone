'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiSendOtp, apiVerifyOtp } from '@/lib/api-client';

export default function OtpPage() {
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const form = event.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const otp = (form.elements.namedItem('otp') as HTMLInputElement | null)?.value.trim();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setBusy(true);
    try {
      if (!otpSent) {
        const res = await apiSendOtp(email);
        setOtpSent(true);
        setDevCode(res.devCode);
        return;
      }
      if (!otp) {
        setError('Please enter the OTP.');
        return;
      }
      await apiVerifyOtp(email, otp);
      router.push('/outlets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page">
      <div className="card">
        <section className="login-panel">
          <h1 className="login-title">Sign in</h1>
          <p className="login-subtitle">to access sobos Billing Station</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" className="form-input" autoComplete="email" required />
            <div className="otp-field" hidden={!otpSent}>
              <input type="text" name="otp" placeholder="Enter OTP" className="form-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} />
            </div>
            {devCode && (
              <p className="form-hint">
                Demo OTP (no email server): <strong>{devCode}</strong>
              </p>
            )}
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? 'Please wait…' : otpSent ? 'Verify OTP' : 'Send OTP'}
            </button>
          </form>

          <Link href="/" className="otp-link">
            Login with Email &amp; Password
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
