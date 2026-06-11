'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { apiReportSummary, type ReportSummary } from '@/lib/api-client';

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
}

function SalesChart({ data }: { data: ReportSummary['salesByDay'] }) {
  const max = Math.max(1, ...data.map((d) => d.total));
  return (
    <div className="chart-card">
      <h3 className="chart-title">Sales — last 14 days</h3>
      <div className="bar-chart">
        {data.map((d) => {
          const h = Math.round((d.total / max) * 100);
          const label = new Date(d.day).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          return (
            <div className="bar-col" key={d.day} title={`${label}: ${inr(d.total)} (${d.orders} orders)`}>
              <div className="bar-fill" style={{ height: `${h}%` }} />
              <span className="bar-label">{new Date(d.day).getDate()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopItems({ data }: { data: ReportSummary['topItems'] }) {
  const max = Math.max(1, ...data.map((d) => d.qty));
  return (
    <div className="chart-card">
      <h3 className="chart-title">Top selling items</h3>
      <div className="top-items">
        {data.length === 0 && <p className="empty-state-text">No sales yet.</p>}
        {data.map((d) => (
          <div className="top-item-row" key={d.name}>
            <span className="top-item-name" title={d.name}>{d.name}</span>
            <div className="top-item-bar-track">
              <div className="top-item-bar" style={{ width: `${(d.qty / max) * 100}%` }} />
            </div>
            <span className="top-item-qty">{d.qty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiReportSummary()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load reports.'));
  }, []);

  return (
    <AppShell title="Sales Reports" breadcrumb={['Reports', 'Sales']}>
      <div className="legacy-dashboard dashboard-body" data-page="reports">
        <main className="dashboard-content section-content">
            {error && <p className="form-error">{error}</p>}
            {!data && !error && (
              <div className="loading-state">
                <div className="loading-spinner" aria-label="Loading" />
              </div>
            )}
            {data && (
              <>
                <div className="stat-grid">
                  <StatCard label="Total Sales" value={inr(data.metrics.totalSales)} sub="Paid orders" />
                  <StatCard label="Orders" value={String(data.metrics.orderCount)} />
                  <StatCard label="Avg Order Value" value={inr(data.metrics.avgOrderValue)} />
                  <StatCard label="Items Sold" value={String(data.metrics.itemsSold)} />
                  <StatCard label="Customers" value={String(data.counts.customers)} />
                  <StatCard
                    label="Low Stock"
                    value={String(data.counts.lowStock)}
                    sub={`of ${data.counts.inventory} items`}
                  />
                </div>

                <div className="chart-row">
                  <SalesChart data={data.salesByDay} />
                  <TopItems data={data.topItems} />
                </div>

                <div className="chart-card">
                  <h3 className="chart-title">Recent orders</h3>
                  <div className="data-table">
                    <div className="data-table-head cols-orders">
                      <div className="data-col">Order</div>
                      <div className="data-col">Customer</div>
                      <div className="data-col">Date</div>
                      <div className="data-col data-col-center">Items</div>
                      <div className="data-col data-col-center">Total</div>
                      <div className="data-col data-col-center">Status</div>
                    </div>
                    <div className="data-table-body">
                      {data.recentOrders.map((o) => (
                        <div className="data-table-row cols-orders" key={o.id}>
                          <div className="data-col">#{o.id}</div>
                          <div className="data-col">{o.customer}</div>
                          <div className="data-col data-col-muted">
                            {new Date(o.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <div className="data-col data-col-center">{o.itemCount}</div>
                          <div className="data-col data-col-center">{inr(o.total)}</div>
                          <div className="data-col data-col-center">
                            <span
                              className={
                                o.status === 'Paid'
                                  ? 'status-pill status-active'
                                  : 'status-pill status-inactive'
                              }
                            >
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
      </div>
    </AppShell>
  );
}
