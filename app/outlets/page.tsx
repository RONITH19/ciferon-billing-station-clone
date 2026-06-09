'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import DashboardShell from '@/components/DashboardShell';
import ManageLink from '@/components/ManageLink';
import { ConfirmModal, FormModal } from '@/components/menu/FormModal';
import { apiCreate, apiDelete, apiList, apiUpdate } from '@/lib/api-client';

interface Outlet {
  id: number;
  name: string;
  [key: string]: unknown;
}

export default function OutletsPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Outlet | null>(null);
  const [deleting, setDeleting] = useState<Outlet | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setOutlets(await apiList<Outlet>('outlets'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AuthGuard>
      <div className="dashboard-body" data-page="outlets">
        <DashboardShell title="Outlets">
          <main className="dashboard-content">
            <div className="content-heading-row">
              <h2 className="content-heading">Outlets</h2>
              <button type="button" className="btn-new" onClick={() => setCreating(true)}>
                New Outlet
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner" aria-label="Loading" />
              </div>
            ) : outlets.length === 0 ? (
              <p className="empty-state-text">No outlets yet. Create one to get started.</p>
            ) : (
              <div className="outlet-grid">
                {outlets.map((outlet) => (
                  <article key={outlet.id} className="outlet-card">
                    <h3 className="outlet-card-title">{outlet.name}</h3>
                    <div className="outlet-card-footer">
                      <div className="outlet-card-actions">
                        <button
                          type="button"
                          className="row-action-btn"
                          onClick={() => setEditing(outlet)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="row-action-btn row-action-delete"
                          onClick={() => setDeleting(outlet)}
                        >
                          Delete
                        </button>
                      </div>
                      <ManageLink href="/menu" />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </DashboardShell>

        {creating && (
          <FormModal
            title="New Outlet"
            fields={[{ key: 'name', label: 'Outlet Name', required: true }]}
            initial={{}}
            onClose={() => setCreating(false)}
            onSubmit={async (v) => {
              await apiCreate('outlets', v);
              await load();
            }}
          />
        )}
        {editing && (
          <FormModal
            title="Edit Outlet"
            fields={[{ key: 'name', label: 'Outlet Name', required: true }]}
            initial={editing}
            onClose={() => setEditing(null)}
            onSubmit={async (v) => {
              await apiUpdate('outlets', editing.id, v);
              await load();
            }}
          />
        )}
        {deleting && (
          <ConfirmModal
            message={`Delete outlet "${deleting.name}"?`}
            onCancel={() => setDeleting(null)}
            onConfirm={async () => {
              await apiDelete('outlets', deleting.id);
              setDeleting(null);
              await load();
            }}
          />
        )}
      </div>
    </AuthGuard>
  );
}
