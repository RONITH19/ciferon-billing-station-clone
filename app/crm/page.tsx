'use client';

import SectionPage from '@/components/SectionPage';
import type { PanelConfig, Row } from '@/components/menu/ResourcePanel';

const config: PanelConfig = {
  title: 'CRM',
  resource: 'customers',
  colsClass: 'cols-customers',
  pageSize: 20,
  showExport: true,
  columns: [
    { header: 'Name', key: 'name' },
    { header: 'Phone', key: 'phone', muted: true },
    { header: 'Email', key: 'email', muted: true },
    { header: 'Visits', key: 'visits', center: true },
    {
      header: 'Total Spend',
      key: 'totalSpend',
      center: true,
      render: (row: Row) => `₹${Number(row.totalSpend).toLocaleString('en-IN')}`,
    },
  ],
  formFields: [
    { key: 'name', label: 'Customer Name', required: true },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'visits', label: 'Visits', type: 'number' },
    { key: 'totalSpend', label: 'Total Spend', type: 'number' },
  ],
};

export default function CrmPage() {
  return <SectionPage title="CRM" pageKey="crm" config={config} />;
}
