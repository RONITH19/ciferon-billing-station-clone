'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiLogout, apiMe } from '@/lib/api-client';

export default function DashboardHeader({ title }: { title: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    apiMe().then((m) => setEmail(m.email ?? ''));
  }, []);

  const logout = async () => {
    await apiLogout();
    router.replace('/');
  };

  const initial = email ? email[0].toUpperCase() : 'U';

  return (
    <header className="dashboard-header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <button type="button" className="header-icon-btn" title="Quick actions" aria-label="Quick actions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 16.5 12 14l7.5 2.5" />
            <path d="M12 14V4" />
            <path d="M9 6l3-2 3 2" />
            <path d="M7 20h10" />
          </svg>
        </button>
        <a href="tel:9112239021" className="header-support">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 11a9 9 0 1 1 18 0" />
            <path d="M7 11a5 5 0 0 1 10 0v1a2 2 0 0 1-2 2h-1" />
            <path d="M10 18h4" />
          </svg>
          Support
        </a>
        <div className="header-user">
          <button
            type="button"
            className="header-avatar"
            title={email || 'User profile'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {initial}
          </button>
          {menuOpen && (
            <div className="header-menu">
              {email && <span className="header-menu-email">{email}</span>}
              <button type="button" className="header-menu-item" onClick={logout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
