'use client';

import { AppShell } from '@/components/layout/app-shell';
import ResourcePanel, { type PanelConfig } from '@/components/menu/ResourcePanel';

export default function SectionPage({
  title,
  pageKey,
  config,
  breadcrumb,
}: {
  title: string;
  pageKey: string;
  config: PanelConfig;
  breadcrumb?: string[];
}) {
  return (
    <AppShell title={title} breadcrumb={breadcrumb}>
      <div className="legacy-dashboard dashboard-body" data-page={pageKey}>
        <div className="section-content rounded-xl border bg-card p-4">
          <ResourcePanel config={config} />
        </div>
      </div>
    </AppShell>
  );
}
