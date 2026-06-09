'use client';

import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import ResourcePanel, { type PanelConfig } from '@/components/menu/ResourcePanel';

// Shared layout for the simple CRUD sections (inventory, CRM, locations, users).
export default function SectionPage({
  title,
  pageKey,
  config,
}: {
  title: string;
  pageKey: string;
  config: PanelConfig;
}) {
  return (
    <AuthGuard>
      <div className="dashboard-body" data-page={pageKey}>
        <DashboardShell title={title}>
          <main className="dashboard-content section-content">
            <ResourcePanel config={config} />
          </main>
        </DashboardShell>
      </div>
    </AuthGuard>
  );
}
