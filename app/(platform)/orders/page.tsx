'use client';

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import {
  ContextPanel,
  FilterBar,
  PageHeader,
  PageHeaderButton,
  WorkspaceLayout,
} from '@/components/layout';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderCard } from '@/components/orders/order-card';
import { OrderDetailPanel } from '@/components/orders/order-detail-panel';
import { AllOrdersTable } from '@/components/orders/all-orders-table';
import { apiGetOrder, apiListOrders, apiUpdateOrderStatus } from '@/lib/api-client';
import {
  filterLiveOrders,
  groupOrdersByColumn,
  OPS_COLUMNS,
  type OpsOrder,
} from '@/lib/orders-ops';

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [advancingId, setAdvancingId] = useState<number | null>(null);
  const [tab, setTab] = useState('live');
  const qc = useQueryClient();

  const { data: orders = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['orders', 'live', search],
    queryFn: async () =>
      (await apiListOrders({ q: search || undefined })).data as OpsOrder[],
    refetchInterval: 5000,
  });

  const liveOrders = useMemo(() => filterLiveOrders(orders), [orders]);
  const columns = useMemo(() => groupOrdersByColumn(liveOrders), [liveOrders]);

  const { data: detail, isLoading: detailLoading } = useQuery({
    queryKey: ['order', selectedId],
    queryFn: () => apiGetOrder(selectedId!),
    enabled: selectedId != null,
  });

  async function advanceStatus(id: number, status: string) {
    setAdvancingId(id);
    try {
      await apiUpdateOrderStatus(id, status);
      await qc.invalidateQueries({ queryKey: ['orders'] });
      await qc.invalidateQueries({ queryKey: ['order', id] });
    } finally {
      setAdvancingId(null);
    }
  }

  const detailOrder = detail?.data.order as
    | { status: string; customer: string; tableLabel: string; total: number }
    | undefined;
  const detailItems = (detail?.data.items ?? []) as Array<{
    itemName: string;
    qty: number;
    price: number;
    notes?: string;
  }>;
  const detailTimeline = (detail?.data.timeline ?? []) as Array<{
    from_status: string;
    to_status: string;
    changed_at: string;
    changed_by?: string;
  }>;

  return (
    <AppShell title="Live Operations" breadcrumb={['Operations', 'Orders']}>
      <WorkspaceLayout
        contextOpen={selectedId != null}
        contextPanel={
          selectedId != null ? (
            <ContextPanel
              open
              onClose={() => setSelectedId(null)}
              title={`Order #${selectedId}`}
              subtitle={detailOrder?.tableLabel ? `Table ${detailOrder.tableLabel}` : undefined}
            >
              <OrderDetailPanel
                orderId={selectedId}
                order={detailOrder ?? null}
                items={detailItems}
                timeline={detailTimeline}
                loading={detailLoading}
                advancing={advancingId === selectedId}
                onAdvance={(status) => advanceStatus(selectedId, status)}
              />
            </ContextPanel>
          ) : undefined
        }
      >
        <PageHeader
          title="Live Operations Center"
          subtitle="Restaurant status at a glance — advance orders inline without opening detail views."
          actions={
            <PageHeaderButton variant="outline" onClick={() => refetch()}>
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </span>
            </PageHeaderButton>
          }
        />

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="live">Live Board</TabsTrigger>
            <TabsTrigger value="all">All Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-0">
            <FilterBar>
              <Input
                placeholder="Search table, customer, order #…"
                className="max-w-sm border-[#e5e7eb] bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="ml-auto text-xs text-[#6b7280]">
                {liveOrders.length} active · auto-refresh 5s
              </span>
            </FilterBar>

            {isLoading ? (
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid min-h-[420px] grid-cols-1 gap-3 lg:grid-cols-5">
                {OPS_COLUMNS.map((col) => {
                  const colOrders = columns[col.id];
                  return (
                    <section
                      key={col.id}
                      className="flex flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#f8fafc]"
                    >
                      <div className="border-b border-[#e5e7eb] bg-white px-3 py-2.5">
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm font-semibold text-[#111827]">{col.title}</h2>
                          <span className="rounded-full bg-[#f8fafc] px-2 py-0.5 text-xs font-medium text-[#6b7280] ring-1 ring-[#e5e7eb]">
                            {colOrders.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2 overflow-y-auto p-2">
                        {colOrders.length === 0 && (
                          <p className="py-8 text-center text-xs text-[#6b7280]">No orders</p>
                        )}
                        {colOrders.map((order, i) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            index={i}
                            selected={selectedId === order.id}
                            onSelect={setSelectedId}
                            onAdvance={advanceStatus}
                            advancing={advancingId === order.id}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-0">
            <AllOrdersTable
              orders={orders}
              loading={isLoading}
              search={search}
              onSearchChange={setSearch}
              onSelect={setSelectedId}
            />
          </TabsContent>
        </Tabs>
      </WorkspaceLayout>
    </AppShell>
  );
}
