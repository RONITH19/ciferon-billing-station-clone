'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiMe } from '@/lib/api-client';

export function PlatformAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    apiMe().then((m) => {
      if (!m.authenticated) {
        router.replace('/');
      } else {
        setReady(true);
      }
    });
  }, [router]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
