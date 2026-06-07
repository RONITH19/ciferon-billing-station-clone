'use client';

import AuthGuard from '@/components/AuthGuard';

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="dashboard-body" data-page="menu">
        {children}
      </div>
    </AuthGuard>
  );
}
