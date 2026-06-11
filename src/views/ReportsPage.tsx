import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ArrowRight, BarChart3, TrendingUp, DollarSign, Activity, RefreshCw } from 'lucide-react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface ReportCardProps {
  title: string;
  description: string;
  onView: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, onView }) => (
  <div className="bg-white p-5 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 hover-scale transition-all-300 flex flex-col justify-between">
    <div>
      <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{description}</p>
    </div>
    <div className="mt-4 flex justify-end">
      <button
        onClick={onView}
        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:translate-x-0.5 transition-all select-none"
      >
        View
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

interface Summary {
  metrics: { totalSales: number; orderCount: number; avgOrderValue: number; itemsSold: number };
  salesByDay: { day: string; total: number; orders: number }[];
  topItems: { name: string; qty: number; revenue: number }[];
}

export const ReportsPage: React.FC = () => {
  const { addToast } = useStore();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/summary')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setSummary(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chartData = summary?.salesByDay.map(d => ({
    name: d.day.slice(5).replace('-', ' '),
    sales: d.total,
    orders: d.orders,
  })) ?? [];

  const m = summary?.metrics;

  const handleView = (name: string) => {
    setSelectedReport(name);
    addToast(`Loading report: "${name}"`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in scrollbar-thin">
      <PageHeader title="Reports" subtitle="Analyze restaurant revenue, menu performance, and KDS logs">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
        >
          Back to Dashboard
        </Link>
      </PageHeader>

      {/* Visual Analytics Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              14-Day Sales Overview
            </h3>
            {loading ? (
              <RefreshCw className="w-4 h-4 text-gray-300 animate-spin" />
            ) : (
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {m?.orderCount ?? 0} orders total
              </span>
            )}
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Sales']} />
                <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-tr from-sobos-navy to-sobos-navyLight text-white rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
              All-Time Revenue
            </span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Billing</h4>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">
              ₹{(m?.totalSales ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </h2>
            <p className="text-xs text-green-400 mt-2 font-semibold">
              {m?.itemsSold ?? 0} items sold total
            </p>
          </div>
          <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-gray-400 font-semibold">
            <span>Orders: {m?.orderCount ?? 0}</span>
            <span>Avg Ticket: ₹{Math.round(m?.avgOrderValue ?? 0)}</span>
          </div>
        </div>
      </div>

      {/* Reports Directory Sections */}
      <div className="flex flex-col gap-8">
        
        {/* Discount Reports */}
        <div>
          <div className="border-b border-gray-150 pb-2 mb-4">
            <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
              Discount Report
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Discount related report</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard
              title="Itemwise Discount"
              description="Summary of all items where discount is applied. View which items are discounted most frequently."
              onView={() => handleView('Itemwise Discount')}
            />
            <ReportCard
              title="Orderwise Discounts"
              description="Summary of all orders where discount is applied. Break down by order type and promotional campaigns."
              onView={() => handleView('Orderwise Discounts')}
            />
          </div>
        </div>

        {/* KDS Report */}
        <div>
          <div className="border-b border-gray-150 pb-2 mb-4">
            <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
              KDS Report
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">KDS Operation and fulfillment metrics</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard
              title="KDS Operation"
              description="KDS action by User. Analyzes ticket prep speed, average bump time, and user efficiency logs."
              onView={() => handleView('KDS Operation')}
            />
          </div>
        </div>

        {/* Additional sections (Sales and Inventory) */}
        <div>
          <div className="border-b border-gray-150 pb-2 mb-4">
            <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
              Financial and Stock Summary
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Aggregated audit and sales books</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard
              title="Sales Book Summary"
              description="Daily audit details, cash drawers, card terminals, and electronic payout settlements."
              onView={() => handleView('Sales Book Summary')}
            />
            <ReportCard
              title="Wastage Audit Ledger"
              description="Monthly review of raw stock wastage, ingredient expiry losses, and cost evaluations."
              onView={() => handleView('Wastage Audit Ledger')}
            />
          </div>
        </div>

      </div>

      {/* Render selected report preview stub */}
      {selectedReport && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-3xl p-6 animate-scale-up">
          <div className="flex items-center justify-between border-b border-blue-150 pb-3 mb-4">
            <h4 className="text-base font-bold text-blue-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Report Live View: {selectedReport}
            </h4>
            <button
              onClick={() => setSelectedReport(null)}
              className="text-xs font-bold text-blue-500 hover:text-blue-700 bg-white border border-blue-200 px-3 py-1 rounded-xl shadow-sm"
            >
              Close Preview
            </button>
          </div>
          <p className="text-xs text-blue-700 mb-4 font-semibold">
            Showing real-time metrics for <strong>{selectedReport}</strong> from your SQLite database.
          </p>
          <div className="h-48 w-full bg-white rounded-2xl border border-blue-100 flex items-center justify-center p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                <YAxis fontSize={10} stroke="#94a3b8" tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Sales']} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
