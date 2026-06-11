'use client';

import { cn } from '@/lib/utils';

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        'mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white p-3',
        className,
      )}
    >
      {children}
    </div>
  );
}
