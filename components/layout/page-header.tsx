'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-4 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">{title}</h1>
        {subtitle && <p className="max-w-2xl text-sm text-[#6b7280]">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

interface PageHeaderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  disabled?: boolean;
}

export function PageHeaderButton({
  children,
  onClick,
  variant = 'default',
  disabled,
}: PageHeaderButtonProps) {
  return (
    <Button variant={variant} size="sm" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}
