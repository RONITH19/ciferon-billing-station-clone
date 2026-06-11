'use client';

import {
  ArrowLeftRight,
  BarChart3,
  ChefHat,
  Coffee,
  FileText,
  FolderTree,
  Grid3X3,
  IndianRupee,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Truck,
  UserCog,
  Users,
  UtensilsCrossed,
  Warehouse,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NAV_GROUPS } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { OutletSwitcher } from '@/components/layout/outlet-switcher';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Receipt,
  ShoppingBag,
  ChefHat,
  Grid3X3,
  Package,
  ArrowLeftRight,
  FileText,
  Truck,
  UtensilsCrossed,
  FolderTree,
  Coffee,
  Users,
  Star,
  MessageSquare,
  BarChart3,
  Warehouse,
  IndianRupee,
  Store,
  UserCog,
  MapPin,
  Settings,
};

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      className="flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <div className={cn('flex h-14 items-center gap-2 px-3', collapsed && 'justify-center')}>
        {!collapsed && (
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold tracking-tight">RestaurantOS</span>
            <span className="truncate text-xs text-sidebar-foreground/60">Billing Station</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!collapsed && (
        <div className="px-3 pb-2">
          <OutletSwitcher />
        </div>
      )}

      <Separator className="bg-sidebar-border" />

      <ScrollArea className="flex-1 px-2 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {group.label}
              </p>
            )}
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = ICONS[item.icon] ?? LayoutDashboard;
                const active =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`)) ||
                  (item.href === '/menu' && pathname.startsWith('/menu'));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors',
                      active
                        ? 'bg-sidebar-accent text-white'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white',
                      collapsed && 'justify-center px-0',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </ScrollArea>
    </motion.aside>
  );
}
