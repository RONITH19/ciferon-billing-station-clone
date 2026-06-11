'use client';

import { PlatformAuthGuard } from '@/components/layout/platform-auth-guard';
import { PlatformShellProvider } from '@/components/layout/platform-shell-context';
import { PlatformShell } from '@/components/layout/platform-shell';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlatformAuthGuard>
      <PlatformShellProvider>
        <PlatformShell>{children}</PlatformShell>
      </PlatformShellProvider>
    </PlatformAuthGuard>
  );
}
