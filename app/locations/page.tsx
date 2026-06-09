'use client';

import SectionPage from '@/components/SectionPage';
import type { PanelConfig } from '@/components/menu/ResourcePanel';

const config: PanelConfig = {
  title: 'Locations',
  resource: 'locations',
  colsClass: 'cols-locations',
  columns: [
    { header: 'Name', key: 'name' },
    { header: 'Address', key: 'address', muted: true },
    { header: 'City', key: 'city', muted: true },
    { header: 'Phone', key: 'phone', muted: true },
  ],
  formFields: [
    { key: 'name', label: 'Location Name', required: true },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'phone', label: 'Phone' },
  ],
};

export default function LocationsPage() {
  return <SectionPage title="Locations" pageKey="locations" config={config} />;
}
