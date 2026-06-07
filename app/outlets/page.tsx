'use client';

import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import ManageLink from '@/components/ManageLink';

const outlets = ['Ciferon Trial 2', 'Warehouse - Trial'];

export default function OutletsPage() {
  return (
    <AuthGuard>
      <div className="dashboard-body" data-page="outlets">
        <DashboardShell title="Outlets">
          <main className="dashboard-content">
            <h2 className="content-heading">Ciferon Trial 2</h2>

            <div className="outlet-grid">
              {outlets.map((name) => (
                <article key={name} className="outlet-card">
                  <h3 className="outlet-card-title">{name}</h3>
                  <div className="outlet-card-footer">
                    <ManageLink href="#" />
                  </div>
                </article>
              ))}
            </div>
          </main>
        </DashboardShell>
      </div>
    </AuthGuard>
  );
}
