'use client';

import { cn } from '@/lib/utils';

interface ActionToolbarProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export function ActionToolbar({ children, className, label = 'Actions' }: ActionToolbarProps) {
  return (
    <div
      className={cn(
        'mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-2',
        className,
      )}
      role="toolbar"
      aria-label={label}
    >
      {children}
    </div>
  );
}
