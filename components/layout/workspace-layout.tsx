'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  className?: string;
  /** Optional right context panel slot */
  contextPanel?: React.ReactNode;
  contextOpen?: boolean;
}

export function WorkspaceLayout({
  children,
  className,
  contextPanel,
  contextOpen,
}: WorkspaceLayoutProps) {
  return (
    <div className={cn('flex min-h-0 flex-1', contextOpen && contextPanel && 'gap-0')}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={cn('flex min-w-0 flex-1 flex-col', className)}
      >
        {children}
      </motion.div>
      {contextPanel}
    </div>
  );
}
