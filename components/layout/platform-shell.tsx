'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { PrimaryRail } from '@/components/layout/primary-rail';
import { SectionSidebar } from '@/components/layout/section-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { CommandPalette } from '@/components/layout/command-palette';
import { usePlatformShell } from '@/components/layout/platform-shell-context';
import { domainLabel, isChromelessRoute, resolveDomain } from '@/lib/workflow-nav';

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { meta } = usePlatformShell();
  const [paletteOpen, setPaletteOpen] = useState(false);

  if (isChromelessRoute(pathname)) {
    return <>{children}</>;
  }

  const domain = resolveDomain(pathname);
  const title = meta.title === 'RestaurantOS' ? domainLabel(domain) : meta.title;
  const hideSectionNav = meta.hideSectionNav;
  const hideHeader = meta.hideHeader;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <PrimaryRail />
      <SectionSidebar hidden={hideSectionNav} />
      <div className="flex min-w-0 flex-1 flex-col">
        {!hideHeader && (
          <AppHeader
            title={title}
            breadcrumb={meta.breadcrumb}
            onOpenSearch={() => setPaletteOpen(true)}
          />
        )}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={
            meta.fullWidth
              ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
              : 'flex min-h-0 flex-1 flex-col overflow-y-auto p-6'
          }
        >
          {children}
        </motion.main>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
