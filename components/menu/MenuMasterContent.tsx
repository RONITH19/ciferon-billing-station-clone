'use client';

import ResourcePanel, { type PanelConfig, type Row } from './ResourcePanel';

const CONFIGS: Record<string, PanelConfig> = {
  'super-categories': {
    title: 'Super Categories',
    resource: 'super-categories',
    colsClass: 'cols-super',
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'DisplayOrder', key: 'displayOrder', sortable: false },
    ],
    formFields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'displayOrder', label: 'Display Order', type: 'number' },
    ],
  },
  categories: {
    title: 'Categories',
    resource: 'categories',
    colsClass: 'cols-categories',
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'Online Display Name', key: 'onlineDisplayName', muted: true },
      { header: 'No. Of Items', key: 'itemCount', center: true },
    ],
    formFields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'onlineDisplayName', label: 'Online Display Name' },
      { key: 'itemCount', label: 'No. Of Items', type: 'number' },
    ],
  },
  'sub-categories': {
    title: 'Sub-Categories',
    resource: 'sub-categories',
    colsClass: 'cols-sub',
    pageSize: 20,
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'Category', key: 'category', muted: true },
    ],
    formFields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'category', label: 'Category' },
    ],
  },
  items: {
    title: 'Items',
    resource: 'items',
    colsClass: 'cols-items',
    scroll: true,
    showExport: true,
    showClone: true,
    pageSize: 20,
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'Online Display Name', key: 'displayName' },
      { header: 'Category', key: 'category', muted: true },
      { header: 'Short Code', key: 'shortCode', muted: true },
      { header: 'Base Price', key: 'basePrice', center: true },
      { header: 'Tax', key: 'tax', center: true },
      { header: 'MRP', key: 'mrp', center: true },
    ],
    formFields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'displayName', label: 'Online Display Name' },
      { key: 'category', label: 'Category' },
      { key: 'shortCode', label: 'Short Code' },
      { key: 'basePrice', label: 'Base Price', type: 'number' },
      { key: 'tax', label: 'Tax' },
      { key: 'mrp', label: 'MRP', type: 'number' },
    ],
  },
  addons: {
    title: 'Addons',
    resource: 'addons',
    colsClass: 'cols-addons',
    searchable: false,
    showExport: true,
    exportFirst: true,
    pageSize: 20,
    columns: [
      { header: 'Name', key: 'name' },
      { header: 'Display Name', key: 'displayName' },
      {
        header: 'Items',
        key: 'items',
        muted: true,
        sortable: false,
        render: (row: Row) => {
          const items = String(row.items ?? '');
          const parts = items.split(', ');
          if (parts.length > 2) {
            return <span>{parts.slice(0, 2).join(', ')}…</span>;
          }
          return <span>{items}</span>;
        },
      },
    ],
    formFields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'displayName', label: 'Display Name' },
      { key: 'items', label: 'Items (comma separated)' },
    ],
  },
  variants: {
    title: 'Variants',
    resource: 'variants',
    colsClass: 'cols-variants',
    columns: [{ header: 'Name', key: 'name' }],
    formFields: [{ key: 'name', label: 'Name', required: true }],
  },
  submenu: {
    title: 'Submenu',
    resource: 'submenu',
    colsClass: 'cols-submenu',
    columns: [
      { header: 'Name', key: 'name' },
      {
        header: 'Status',
        key: 'isActive',
        center: true,
        sortable: false,
        render: (row: Row) => (
          <span className={row.isActive ? 'status-pill status-active' : 'status-pill status-inactive'}>
            {row.isActive ? 'Active' : 'Inactive'}
          </span>
        ),
      },
    ],
    formFields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'isActive', label: 'Active (1 = yes, 0 = no)', type: 'number' },
    ],
  },
};

export default function MenuMasterContent({ slug }: { slug: string }) {
  const config = CONFIGS[slug];
  if (!config) return null;
  return <ResourcePanel config={config} />;
}
