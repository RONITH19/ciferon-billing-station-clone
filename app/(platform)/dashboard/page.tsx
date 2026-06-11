'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { apiReportSummary, type ReportSummary } from '@/lib/api-client';
import { formatInr } from '@/lib/utils';

function MetricCard({
  label,
  value,
  sub,
  delay,
}: {
  label: string;
  value: string;
  sub?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['report-summary'],
    queryFn: apiReportSummary,
    refetchInterval: 30_000,
  });

  const summary = data as ReportSummary & { kitchenStatus?: { status: string; count: number }[]; activeTables?: number };

  return (
    <AppShell title="Dashboard" breadcrumb={['Operations', 'Command Center']}>
      <div className="min-h-0 min-w-0 flex-1 space-y-6">
      {isLoading || !summary ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard delay={0} label="Revenue (14d)" value={formatInr(summary.metrics.totalSales)} sub={`${summary.metrics.orderCount} orders`} />
            <MetricCard delay={0.05} label="Avg ticket" value={formatInr(summary.metrics.avgOrderValue)} />
            <MetricCard delay={0.1} label="Items sold" value={String(summary.metrics.itemsSold)} />
            <MetricCard delay={0.15} label="Low stock" value={String(summary.counts.lowStock)} sub={`${summary.counts.inventory} SKUs tracked`} />
            <MetricCard delay={0.2} label="Active tables" value={String(summary.activeTables ?? 0)} />
            <MetricCard delay={0.25} label="Menu items" value={String(summary.counts.items)} sub={`${summary.counts.categories} categories`} />
            <MetricCard delay={0.3} label="Customers" value={String(summary.counts.customers)} />
            <MetricCard delay={0.35} label="Staff" value={String(summary.counts.staff)} />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <motion.div
              className="xl:col-span-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Revenue overview</CardTitle>
                </CardHeader>
                <CardContent className="h-72 min-h-[288px]">
                  <ResponsiveContainer width="100%" height="100%" minHeight={288}>
                    <BarChart data={summary.salesByDay}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" tickFormatter={(v) => v.slice(8)} fontSize={12} />
                      <YAxis tickFormatter={(v) => `₹${v / 1000}k`} fontSize={12} />
                      <Tooltip formatter={(v) => formatInr(Number(v ?? 0))} />
                      <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Kitchen status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(summary.kitchenStatus ?? []).length === 0 && (
                    <p className="text-sm text-muted-foreground">No active kitchen orders.</p>
                  )}
                  {(summary.kitchenStatus ?? []).map((k) => (
                    <div key={k.status} className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm font-medium">{k.status}</span>
                      <Badge variant="secondary">{k.count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top selling items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {summary.topItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <span className="truncate pr-4">{item.name}</span>
                    <span className="shrink-0 text-muted-foreground">{item.qty} · {formatInr(item.revenue)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {summary.recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                    <div>
                      <p className="font-medium">Order #{o.id}</p>
                      <p className="text-muted-foreground">
                        {o.customer}
                        {o.tableLabel ? ` · ${o.tableLabel}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatInr(o.total)}</p>
                      <Badge variant="outline">{o.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}
