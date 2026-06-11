'use client';

import { AppShell } from '@/components/layout/app-shell';
import MenuMasterContent from '@/components/menu/MenuMasterContent';

export function MenuSlugClient({ slug }: { slug: string }) {
  return (
    <AppShell title="Menu" breadcrumb={['Menu', slug]}>
      <div className="min-w-0 flex-1 overflow-auto rounded-xl border border-[#e5e7eb] bg-white p-4">
        <MenuMasterContent slug={slug} />
      </div>
    </AppShell>
  );
}
