'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/lib/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    checkAuth().then((ok) => {
      if (!active) return;
      if (!ok) {
        router.replace('/');
        return;
      }
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}
