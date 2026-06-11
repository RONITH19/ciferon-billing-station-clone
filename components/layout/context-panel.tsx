'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContextPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  width?: number;
}

export function ContextPanel({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
  width = 320,
}: ContextPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.2 }}
          style={{ width }}
          className={cn(
            'flex h-full shrink-0 flex-col border-l border-[#e5e7eb] bg-white',
            className,
          )}
        >
          <div className="flex items-start justify-between gap-2 border-b border-[#e5e7eb] px-4 py-3">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-[#111827]">{title}</h2>
              {subtitle && (
                <p className="truncate text-xs text-[#6b7280]">{subtitle}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">{children}</ScrollArea>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
