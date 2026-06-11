'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import ManageLink from '@/components/ManageLink';
import { ConfirmModal, FormModal } from '@/components/menu/FormModal';
import { PageHeader, PageHeaderButton } from '@/components/layout/page-header';
import { Skeleton } from '@/components/ui/skeleton';
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
    <AppShell title="Outlets" breadcrumb={['Settings', 'Outlets']}>
      <PageHeader
        title="Outlets"
        subtitle="Manage restaurant locations and outlet switching."
        actions={
          <PageHeaderButton onClick={() => setCreating(true)}>New Outlet</PageHeaderButton>
        }
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : outlets.length === 0 ? (
        <p className="text-sm text-[#6b7280]">No outlets yet. Create one to get started.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:max-w-4xl">
          {outlets.map((outlet) => (
            <article
              key={outlet.id}
              className="flex flex-col rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-[#111827]">{outlet.name}</h3>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-sm font-medium text-[#111827] hover:underline"
                    onClick={() => setEditing(outlet)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-sm font-medium text-red-600 hover:underline"
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
    </AppShell>
  );
}
