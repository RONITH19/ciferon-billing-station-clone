'use client';

import SectionPage from '@/components/SectionPage';
import type { PanelConfig } from '@/components/menu/ResourcePanel';

const config: PanelConfig = {
  title: 'Users',
  resource: 'staff',
  colsClass: 'cols-staff',
  columns: [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email', muted: true },
    { header: 'Role', key: 'role', center: true },
  ],
  formFields: [
    { key: 'name', label: 'Name', required: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role (Owner, Manager, Cashier…)' },
  ],
};

export default function UsersPage() {
  return <SectionPage title="Users" pageKey="users" config={config} />;
}
