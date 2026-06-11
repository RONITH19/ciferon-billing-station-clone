import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  ChefHat,
  Grid3X3,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  Users,
  UtensilsCrossed,
} from 'lucide-react';

export type RailDomain =
  | 'dashboard'
  | 'billing'
  | 'tables'
  | 'kitchen'
  | 'orders'
  | 'inventory'
  | 'menu'
  | 'crm'
  | 'reports'
  | 'settings';

export interface RailItem {
  id: RailDomain;
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface SectionNavItem {
  label: string;
  href: string;
}

export interface SectionNavGroup {
  label: string;
  items: SectionNavItem[];
}

/** 64px primary rail — domain switcher only */
export const RAIL_ITEMS: RailItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'billing', label: 'Billing', href: '/billing', icon: Receipt },
  { id: 'tables', label: 'Tables', href: '/tables', icon: Grid3X3 },
  { id: 'kitchen', label: 'Kitchen', href: '/kds', icon: ChefHat },
  { id: 'orders', label: 'Orders', href: '/orders', icon: ShoppingBag },
  { id: 'inventory', label: 'Inventory', href: '/inventory', icon: Package },
  { id: 'menu', label: 'Menu', href: '/menu', icon: UtensilsCrossed },
  { id: 'crm', label: 'CRM', href: '/crm', icon: Users },
  { id: 'reports', label: 'Reports', href: '/reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
];

/** 240px contextual section navigation per domain */
export const SECTION_NAV: Record<RailDomain, SectionNavGroup[]> = {
  dashboard: [
    {
      label: 'Operations',
      items: [{ label: 'Command Center', href: '/dashboard' }],
    },
  ],
  billing: [
    {
      label: 'POS',
      items: [{ label: 'Take Order', href: '/billing' }],
    },
  ],
  tables: [
    {
      label: 'Floor',
      items: [{ label: 'Floor Plan', href: '/tables' }],
    },
  ],
  kitchen: [
    {
      label: 'Display',
      items: [{ label: 'Kitchen Display', href: '/kds' }],
    },
  ],
  orders: [
    {
      label: 'Live Ops',
      items: [{ label: 'Live Operations', href: '/orders' }],
    },
  ],
  inventory: [
    {
      label: 'Stock Operations',
      items: [
        { label: 'Receive Stock', href: '/inventory' },
        { label: 'Transfer Stock', href: '/inventory/movements' },
        { label: 'Return Stock', href: '/inventory/movements' },
        { label: 'Adjust Stock', href: '/inventory/movements' },
      ],
    },
    {
      label: 'Procurement',
      items: [
        { label: 'Purchase Orders', href: '/inventory/purchase-orders' },
        { label: 'GRN', href: '/inventory/purchase-orders' },
        { label: 'Vendors', href: '/inventory/vendors' },
      ],
    },
    {
      label: 'Production',
      items: [
        { label: 'Recipes', href: '/inventory' },
        { label: 'Consumption', href: '/inventory' },
      ],
    },
    {
      label: 'Monitoring',
      items: [
        { label: 'Stock Health', href: '/inventory' },
        { label: 'Low Stock', href: '/inventory' },
      ],
    },
    {
      label: 'Settings',
      items: [{ label: 'Inventory Items', href: '/inventory' }],
    },
  ],
  menu: [
    {
      label: 'Operate',
      items: [
        { label: 'Availability', href: '/menu' },
        { label: 'Scheduling', href: '/menu' },
        { label: 'Outlet Mapping', href: '/menu' },
      ],
    },
    {
      label: 'Build',
      items: [
        { label: 'Categories', href: '/menu/categories' },
        { label: 'Products', href: '/menu/items' },
        { label: 'Modifiers', href: '/menu/addons' },
      ],
    },
    {
      label: 'Optimize',
      items: [
        { label: 'Popular Items', href: '/menu/items' },
        { label: 'Performance', href: '/menu/items' },
        { label: 'Menu Engineering', href: '/menu/items' },
      ],
    },
  ],
  crm: [
    {
      label: 'Engage',
      items: [
        { label: 'Customers', href: '/crm' },
        { label: 'Loyalty', href: '/crm/loyalty' },
        { label: 'Campaigns', href: '/crm' },
        { label: 'Feedback', href: '/crm/feedback' },
      ],
    },
    {
      label: 'Insights',
      items: [
        { label: 'Top Customers', href: '/crm' },
        { label: 'Repeat Rate', href: '/crm' },
      ],
    },
  ],
  reports: [
    {
      label: 'Business Health',
      items: [
        { label: 'Overview', href: '/reports' },
        { label: 'Inventory', href: '/reports/inventory' },
        { label: 'Finance', href: '/reports/finance' },
      ],
    },
  ],
  settings: [
    {
      label: 'Restaurant',
      items: [
        { label: 'General', href: '/settings' },
        { label: 'Outlets', href: '/outlets' },
        { label: 'Users', href: '/users' },
        { label: 'Locations', href: '/locations' },
      ],
    },
  ],
};

const DOMAIN_PREFIXES: { domain: RailDomain; prefix: string }[] = [
  { domain: 'billing', prefix: '/billing' },
  { domain: 'tables', prefix: '/tables' },
  { domain: 'kitchen', prefix: '/kds' },
  { domain: 'orders', prefix: '/orders' },
  { domain: 'inventory', prefix: '/inventory' },
  { domain: 'menu', prefix: '/menu' },
  { domain: 'crm', prefix: '/crm' },
  { domain: 'reports', prefix: '/reports' },
  { domain: 'settings', prefix: '/settings' },
  { domain: 'settings', prefix: '/outlets' },
  { domain: 'settings', prefix: '/users' },
  { domain: 'settings', prefix: '/locations' },
  { domain: 'dashboard', prefix: '/dashboard' },
];

export function resolveDomain(pathname: string): RailDomain {
  for (const { domain, prefix } of DOMAIN_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return domain;
    }
  }
  return 'dashboard';
}

export function domainLabel(domain: RailDomain): string {
  return RAIL_ITEMS.find((r) => r.id === domain)?.label ?? 'Dashboard';
}

/** Flat list for command palette search */
export const COMMAND_WORKFLOW_PAGES = RAIL_ITEMS.flatMap((rail) => {
  const groups = SECTION_NAV[rail.id];
  const sectionItems = groups.flatMap((g) =>
    g.items.map((item) => ({
      href: item.href,
      label: item.label,
      group: `${rail.label} · ${g.label}`,
      icon: rail.id,
    })),
  );
  return [
    { href: rail.href, label: rail.label, group: rail.label, icon: rail.id },
    ...sectionItems,
  ];
});

/** Routes that render without platform chrome (fullscreen) */
export const CHROMELESS_ROUTES = ['/kds'];

export function isChromelessRoute(pathname: string): boolean {
  return CHROMELESS_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}
