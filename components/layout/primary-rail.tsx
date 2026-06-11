'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { RAIL_ITEMS, resolveDomain, type RailDomain } from '@/lib/workflow-nav';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function PrimaryRail() {
  const pathname = usePathname();
  const activeDomain = resolveDomain(pathname);

  return (
    <TooltipProvider delayDuration={200}>
      <motion.aside
        initial={false}
        className="flex h-screen w-16 shrink-0 flex-col border-r border-border bg-[#12263a] text-white"
        aria-label="Primary navigation"
      >
        <div className="flex h-14 items-center justify-center border-b border-white/10">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm font-bold tracking-tight transition hover:bg-white/15"
            title="RestaurantOS"
          >
            R
          </Link>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-1 px-2 py-3">
          {RAIL_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeDomain === item.id;
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="rail-active"
                        className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-white"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <Icon className="h-[18px] w-[18px]" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </motion.aside>
    </TooltipProvider>
  );
}

export function useActiveDomain(): RailDomain {
  const pathname = usePathname();
  return resolveDomain(pathname);
}
