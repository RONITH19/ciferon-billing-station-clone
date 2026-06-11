export const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { href: '/billing', label: 'Billing', icon: 'Receipt' },
      { href: '/orders', label: 'Orders', icon: 'ShoppingBag' },
      { href: '/kds', label: 'Kitchen Display', icon: 'ChefHat' },
      { href: '/tables', label: 'Tables', icon: 'Grid3X3' },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { href: '/inventory', label: 'Inventory', icon: 'Package' },
      { href: '/inventory/movements', label: 'Stock Movement', icon: 'ArrowLeftRight' },
      { href: '/inventory/purchase-orders', label: 'Purchase Orders', icon: 'FileText' },
      { href: '/inventory/vendors', label: 'Vendors', icon: 'Truck' },
    ],
  },
  {
    label: 'Menu',
    items: [
      { href: '/menu', label: 'Menu Master', icon: 'UtensilsCrossed' },
      { href: '/menu/categories', label: 'Categories', icon: 'FolderTree' },
      { href: '/menu/items', label: 'Products', icon: 'Coffee' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { href: '/crm', label: 'Customers', icon: 'Users' },
      { href: '/crm/loyalty', label: 'Loyalty', icon: 'Star' },
      { href: '/crm/feedback', label: 'Feedback', icon: 'MessageSquare' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { href: '/reports', label: 'Sales', icon: 'BarChart3' },
      { href: '/reports/inventory', label: 'Inventory', icon: 'Warehouse' },
      { href: '/reports/finance', label: 'Finance', icon: 'IndianRupee' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { href: '/outlets', label: 'Outlets', icon: 'Store' },
      { href: '/users', label: 'Users', icon: 'UserCog' },
      { href: '/locations', label: 'Locations', icon: 'MapPin' },
      { href: '/settings', label: 'Settings', icon: 'Settings' },
    ],
  },
] as const;

export const COMMAND_PAGES = NAV_GROUPS.flatMap((g) =>
  g.items.map((item) => ({ ...item, group: g.label })),
);
