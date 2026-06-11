'use client';

import SectionPage from '@/components/SectionPage';
import type { PanelConfig, Row } from '@/components/menu/ResourcePanel';

const config: PanelConfig = {
  title: 'Inventory',
  resource: 'inventory',
  colsClass: 'cols-inventory',
  pageSize: 20,
  showExport: true,
  columns: [
    { header: 'Item', key: 'name' },
    { header: 'Unit', key: 'unit', muted: true },
    { header: 'Quantity', key: 'quantity', center: true },
    { header: 'Reorder Level', key: 'reorderLevel', center: true },
    {
      header: 'Status',
      key: 'status',
      center: true,
      sortable: false,
      render: (row: Row) => {
        const low = Number(row.quantity) <= Number(row.reorderLevel);
        return (
          <span className={low ? 'status-pill status-inactive' : 'status-pill status-active'}>
            {low ? 'Low stock' : 'In stock'}
          </span>
        );
      },
    },
  ],
  formFields: [
    { key: 'name', label: 'Item Name', required: true },
    { key: 'unit', label: 'Unit (kg, ltr, pcs…)' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'reorderLevel', label: 'Reorder Level', type: 'number' },
  ],
};

export default function InventoryPage() {
  return <SectionPage title="Inventory" pageKey="inventory" config={config} />;
}
