'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiListTables, apiOpenTableSession, apiCloseSession } from '@/lib/api-client';
import { useOutletStore } from '@/lib/stores/outlet-store';
import { cn } from '@/lib/utils';

interface TableRow {
  id: number;
  number: string;
  capacity: number;
  section: string;
  status: string;
  posX: number;
  posY: number;
  shape: string;
  sessionId?: number | null;
}

const STATUS_STYLE: Record<string, string> = {
  available: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  occupied: 'border-red-300 bg-red-50 text-red-900',
  reserved: 'border-blue-300 bg-blue-50 text-blue-900',
  cleaning: 'border-amber-300 bg-amber-50 text-amber-900',
};

export default function TablesPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { outletId } = useOutletStore();

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables', outletId],
    queryFn: async () => (await apiListTables(outletId ?? 1)).data as TableRow[],
  });

  const sections = [...new Set(tables.map((t) => t.section))].filter(Boolean);

  async function handleTableClick(table: TableRow) {
    if (table.status === 'occupied' && table.sessionId) {
      router.push(
        `/billing?tableId=${table.id}&sessionId=${table.sessionId}&label=${encodeURIComponent(table.number)}`,
      );
      return;
    }
    if (table.status === 'available') {
      const { sessionId } = await apiOpenTableSession(table.id, outletId ?? 1);
      qc.invalidateQueries({ queryKey: ['tables'] });
      router.push(
        `/billing?tableId=${table.id}&sessionId=${sessionId}&label=${encodeURIComponent(table.number)}`,
      );
    }
  }

  async function closeTable(table: TableRow) {
    if (table.sessionId) {
      await apiCloseSession(table.sessionId);
      qc.invalidateQueries({ queryKey: ['tables'] });
    }
  }

  return (
    <AppShell title="Tables" breadcrumb={['Operations', 'Floor plan']}>
      <PageHeader
        title="Floor Plan"
        subtitle="Open a table session to start billing, or return to an occupied table."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(STATUS_STYLE).map(([status, cls]) => (
          <Badge key={status} variant="outline" className={cn('capitalize', cls)}>
            {status}
          </Badge>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && tables.length === 0 && (
        <p className="text-sm text-[#6b7280]">No tables configured for this outlet.</p>
      )}

      {sections.map((section) => (
        <div key={section} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#6b7280]">
            {section}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {tables
              .filter((t) => t.section === section)
              .map((table, i) => (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    'relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 p-4 shadow-sm transition hover:shadow-md',
                    STATUS_STYLE[table.status] ?? STATUS_STYLE.available,
                    table.shape === 'round' && 'aspect-square max-w-[140px] rounded-full',
                  )}
                  onClick={() => handleTableClick(table)}
                >
                  <span className="text-xl font-bold">{table.number}</span>
                  <span className="mt-1 text-xs opacity-70">{table.capacity} seats</span>
                  {table.status === 'occupied' && table.sessionId && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute bottom-2 right-2 h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTable(table);
                      }}
                    >
                      Close
                    </Button>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </AppShell>
  );
}
