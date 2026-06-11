'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  SECTION_NAV,
  domainLabel,
  resolveDomain,
} from '@/lib/workflow-nav';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OutletSwitcher } from '@/components/layout/outlet-switcher';

interface SectionSidebarProps {
  hidden?: boolean;
}

export function SectionSidebar({ hidden }: SectionSidebarProps) {
  const pathname = usePathname();
  const domain = resolveDomain(pathname);
  const groups = SECTION_NAV[domain];
  const title = domainLabel(domain);

  if (hidden) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={domain}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.2 }}
        className="flex h-screen w-60 shrink-0 flex-col border-r border-[#e5e7eb] bg-white"
        aria-label={`${title} navigation`}
      >
        <div className="border-b border-[#e5e7eb] px-4 py-4">
          <h2 className="text-sm font-semibold text-[#111827]">{title}</h2>
          <p className="mt-0.5 text-xs text-[#6b7280]">Workflows & tasks</p>
          <div className="mt-3">
            <OutletSwitcher />
          </div>
        </div>

        <ScrollArea className="flex-1 px-2 py-3">
          {groups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#6b7280]">
                {group.label}
              </p>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== '/dashboard' &&
                      item.href !== '/menu' &&
                      item.href !== '/crm' &&
                      item.href !== '/inventory' &&
                      pathname.startsWith(`${item.href}/`));
                  return (
                    <Link
                      key={`${group.label}-${item.label}-${item.href}`}
                      href={item.href}
                      className={cn(
                        'block rounded-lg px-2.5 py-2 text-sm transition-colors',
                        active
                          ? 'bg-[#f8fafc] font-medium text-[#111827] ring-1 ring-[#e5e7eb]'
                          : 'text-[#6b7280] hover:bg-[#f8fafc] hover:text-[#111827]',
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </ScrollArea>
      </motion.aside>
    </AnimatePresence>
  );
}
