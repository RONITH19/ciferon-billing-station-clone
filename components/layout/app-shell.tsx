'use client';

import { useLayoutEffect } from 'react';
import { usePlatformShell } from '@/components/layout/platform-shell-context';

interface AppShellProps {
  title: string;
  breadcrumb?: string[];
  children: React.ReactNode;
  fullWidth?: boolean;
  hideHeader?: boolean;
  hideSectionNav?: boolean;
}

/**
 * Registers page metadata with PlatformShell (chrome lives in platform layout).
 */
export function AppShell({
  title,
  breadcrumb,
  children,
  fullWidth,
  hideHeader,
  hideSectionNav,
}: AppShellProps) {
  const { setMeta } = usePlatformShell();

  useLayoutEffect(() => {
    setMeta({
      title,
      breadcrumb: breadcrumb ?? [],
      fullWidth: fullWidth ?? false,
      hideHeader: hideHeader ?? false,
      hideSectionNav: hideSectionNav ?? false,
    });
  }, [title, breadcrumb, fullWidth, hideHeader, hideSectionNav, setMeta]);

  return <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>;
}
