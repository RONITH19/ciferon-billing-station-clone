import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store';
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  BarChart3,
  Calendar,
  Send,
  ArrowRight,
  Clock,
  Activity,
  CheckCircle,
  ThumbsUp,
  PieChart,
  HelpCircle,
  AlertTriangle,
  Layers,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashSummary {
  metrics: {
    totalSales: number;
    orderCount: number;
    avgOrderValue: number;
    itemsSold: number;
  };
  counts: {
    categories: number;
    items: number;
    customers: number;
    inventory: number;
    lowStock: number;
    staff: number;
    locations: number;
  };
  salesByDay: { day: string; total: number; orders: number }[];
  topItems: { name: string; qty: number; revenue: number }[];
  recentOrders: {
    id: number;
    createdAt: string;
    customer: string;
    total: number;
    itemCount: number;
    status: string;
    tableLabel: string;
  }[];
  kitchenStatus: {
    confirmed: number;
    preparing: number;
    ready: number;
    served: number;
  };
  activeTables: number;
}

const fmt = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${Math.round(n)}`;
};

const elapsedLabel = (createdAt: string) => {
  const ms = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return '< 1 min';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''}`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
};

const statusColor: Record<string, string> = {
  Paid: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
  Preparing: 'bg-amber-50 text-amber-700 border-amber-200',
  Ready: 'bg-blue-50 text-blue-700 border-blue-200',
  Served: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const DashboardPage: React.FC = () => {
  const { currentOutlet, addToast } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'live'>('overview');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashSummary | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports/summary');
      if (res.ok) {
        const data: DashSummary = await res.json();
        setSummary(data);
        setLastUpdated(new Date());
      }
    } catch {
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadSummary();
    // Auto-refresh live tab every 30 seconds
    const interval = setInterval(() => {
      if (activeTab === 'live') loadSummary();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadSummary, activeTab]);

  // Compute chart data – last 15 days
  const chartData = summary?.salesByDay.map((d) => ({
    name: d.day.slice(5).replace('-', ' '),
    sales: d.total,
  })) ?? [];

  const m = summary?.metrics;
  const kc = summary?.kitchenStatus;
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  return (
    <div className="flex flex-col min-h-full bg-gray-50 select-none animate-fade-in pb-10">

      {/* Top Tab Bar & Filter Header Row */}
      <div className="bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between shadow-sm flex-wrap gap-3">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-sm font-bold pb-2 border-b-2 transition-all relative ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Business Overview
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => { setActiveTab('live'); loadSummary(); }}
            className={`text-sm font-bold pb-2 border-b-2 transition-all relative ${
              activeTab === 'live'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Live Status
            {activeTab === 'live' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Date & Refresh */}
        <div className="flex items-center gap-2">
          <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-gray-700 flex items-center gap-2 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>{todayStr}</span>
          </div>
          <button
            onClick={loadSummary}
            title="Refresh"
            className={`p-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 rounded-xl shadow-sm transition-colors ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {loading && !summary && (
        <div className="flex flex-col items-center justify-center flex-grow py-24 gap-3">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
          <p className="text-sm font-semibold text-gray-400">Loading real-time data...</p>
        </div>
      )}

      {/* Main Content Pane */}
      {(!loading || summary) && (
        <div className="p-4 md:p-6 flex-grow">
          {activeTab === 'overview' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left Column (9 cols / ~75%) */}
              <div className="lg:col-span-9 flex flex-col gap-6">

                {/* Welcome Banner */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5 select-none">
                      Welcome, Sobos <span className="animate-bounce">👋</span>
                    </h1>
                    {lastUpdated && (
                      <p className="text-xs text-gray-400 mt-1 font-semibold">
                        Last synced: {lastUpdated.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  {currentOutlet && (
                    <span className="text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-xl">
                      {currentOutlet.name}
                    </span>
                  )}
                </div>

                {/* Metric Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                  {/* Metric 1 - Sales */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="flex-grow">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Sales</span>
                      <h3 className="text-2xl font-black text-gray-800 mt-1 leading-none">
                        {fmt(m?.totalSales ?? 0)}
                      </h3>
                      <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400 font-bold">
                        <span>POS + Online</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-100 shadow-sm flex-shrink-0 ml-3">
                      <ThumbsUp className="w-4 h-4 fill-red-500" />
                    </div>
                  </div>

                  {/* Metric 2 - Orders */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="flex-grow">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
                      <h3 className="text-2xl font-black text-gray-800 mt-1 leading-none">{m?.orderCount ?? 0}</h3>
                      <span className="text-[10px] font-bold text-gray-400 block mt-3">Total orders created</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 shadow-sm flex-shrink-0 ml-3">
                      <PieChart className="w-4 h-4 fill-orange-500" />
                    </div>
                  </div>

                  {/* Metric 3 - Avg Order Value */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="flex-grow">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Avg Order Value</span>
                      <h3 className="text-2xl font-black text-gray-800 mt-1 leading-none">
                        {fmt(m?.avgOrderValue ?? 0)}
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400 block mt-3">Per order avg</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm flex-shrink-0 ml-3">
                      <CreditCard className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>

                  {/* Metric 4 - Items Sold */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="flex-grow">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Items Sold</span>
                      <h3 className="text-2xl font-black text-gray-800 mt-1 leading-none">{m?.itemsSold ?? 0}</h3>
                      <span className="text-[10px] font-bold text-gray-400 block mt-3">Units sold total</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shadow-sm flex-shrink-0 ml-3">
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>

                </div>

                {/* Performance Chart Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-4 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Performance</span>
                      <h2 className="text-sm font-extrabold text-gray-800 mt-0.5">Last 14 Days Sales</h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
                      Daily Revenue (₹)
                    </div>
                  </div>

                  {/* Recharts Bar Chart */}
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                        <YAxis
                          stroke="#94a3b8"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                          itemStyle={{ color: '#fff' }}
                          labelStyle={{ fontWeight: 'bold', color: '#94a3b8' }}
                          formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Sales']}
                        />
                        <Bar dataKey="sales" fill="#4fd1c5" radius={[4, 4, 0, 0]} barSize={8} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="text-sm font-extrabold text-gray-800">Recent Orders</h3>
                    <span className="text-xs text-gray-400 font-semibold">Last 10 transactions</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase">
                          <th className="px-4 py-2.5">Order ID</th>
                          <th className="px-4 py-2.5">Customer</th>
                          <th className="px-4 py-2.5">Table</th>
                          <th className="px-4 py-2.5">Items</th>
                          <th className="px-4 py-2.5">Total</th>
                          <th className="px-4 py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                        {(summary?.recentOrders ?? []).length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-gray-400 text-xs">
                              No orders yet. Orders will appear here after the first sale.
                            </td>
                          </tr>
                        )}
                        {(summary?.recentOrders ?? []).map((o) => (
                          <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-bold text-blue-600">#{o.id}</td>
                            <td className="px-4 py-3">{o.customer || 'Walk-in'}</td>
                            <td className="px-4 py-3">{o.tableLabel || '—'}</td>
                            <td className="px-4 py-3">{o.itemCount}</td>
                            <td className="px-4 py-3 font-bold text-gray-900">₹{o.total.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor[o.status] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Split Cards: Order-wise Breakup & Credit Transactions */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                  {/* Top Items (col-span-7) */}
                  <div className="md:col-span-7 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[190px]">
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-4 border-b pb-2">
                        <Layers className="w-4 h-4 text-purple-500" />
                        Top Selling Items
                      </h4>

                      {(summary?.topItems ?? []).length === 0 ? (
                        <p className="text-xs text-gray-400 py-4 text-center">No sales data yet</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {(summary?.topItems ?? []).slice(0, 5).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-gray-700 truncate flex-1 mr-3">{item.name}</span>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-gray-400 font-semibold">{item.qty} sold</span>
                                <span className="font-bold text-gray-800">₹{item.revenue.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <p className="text-[10px] font-semibold text-gray-400 mt-4 border-t pt-2 leading-relaxed select-none">
                      Based on total quantity sold across all orders
                    </p>
                  </div>

                  {/* Credit Transactions (col-span-5) */}
                  <div className="md:col-span-5 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[190px]">
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-5 border-b pb-2">
                        <TrendingUp className="w-4 h-4 text-yellow-500" />
                        Credit Transactions
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="pl-3 border-l-4 border-emerald-500">
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">
                            Credit Sales
                          </span>
                          <span className="text-base font-black text-gray-800 mt-1 block">
                            {summary?.counts.customers ?? 0}
                          </span>
                          <span className="text-[9px] text-gray-400 font-semibold">customers</span>
                        </div>

                        <div className="pl-3 border-l-4 border-red-500">
                          <span className="text-[10px] font-bold text-gray-400 block uppercase">
                            Low Stock
                          </span>
                          <span className="text-base font-black text-gray-800 mt-1 block">
                            {summary?.counts.lowStock ?? 0}
                          </span>
                          <span className="text-[9px] text-gray-400 font-semibold">items below level</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-6">
                      <button
                        onClick={() => addToast('Opening accounting module...', 'info')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        View Gross Values
                      </button>
                    </div>
                  </div>

                </div>

                {/* Revenue Leakage & Discounts */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                  {/* Revenue Leakage (col-span-8) */}
                  <div className="md:col-span-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-4 border-b pb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Database Overview
                    </h4>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      {[
                        { label: 'Menu Categories', count: summary?.counts.categories ?? 0, isRed: false },
                        { label: 'Menu Items', count: summary?.counts.items ?? 0, isRed: false },
                        { label: 'Customers', count: summary?.counts.customers ?? 0, isRed: false },
                        { label: 'Inventory Items', count: summary?.counts.inventory ?? 0, isRed: false },
                        { label: 'Low Stock Alerts', count: summary?.counts.lowStock ?? 0, isRed: true },
                        { label: 'Staff Members', count: summary?.counts.staff ?? 0, isRed: false },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2.5 border-l-4 rounded-r-xl bg-gray-50/30 ${
                            item.isRed ? 'border-red-500' : 'border-emerald-500'
                          }`}
                        >
                          <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                          <span className="text-xs font-bold text-gray-900">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Discounts & Taxes (col-span-4) */}
                  <div className="md:col-span-4 flex flex-col gap-4">
                    {/* Kitchen Summary Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-3">Kitchen Status</span>
                      <div className="flex flex-col gap-1 text-[10px] text-gray-500 font-semibold">
                        {[
                          { label: 'Confirmed', val: kc?.confirmed ?? 0, color: 'bg-blue-500' },
                          { label: 'Preparing', val: kc?.preparing ?? 0, color: 'bg-amber-500' },
                          { label: 'Ready', val: kc?.ready ?? 0, color: 'bg-emerald-500' },
                          { label: 'Served', val: kc?.served ?? 0, color: 'bg-gray-400' },
                        ].map((s) => (
                          <div key={s.label} className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${s.color}`} />
                            <span>{s.label}: {s.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Tables */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between flex-1">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Tables</span>
                        <span className="text-3xl font-black text-gray-800 mt-2 block">
                          {summary?.activeTables ?? 0}
                        </span>
                      </div>
                      <ShoppingBag className="w-8 h-8 text-gray-200" />
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Column (3 cols / ~25%) */}
              <div className="lg:col-span-3 flex flex-col gap-5">

                {/* SMS Credit Card */}
                <div className="bg-[#1b1c3e] text-white p-5 rounded-2xl shadow-md relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider block">Sms Credit Balance</span>
                      <h2 className="text-3xl font-black tracking-tight mt-1">412</h2>
                    </div>
                    <button
                      onClick={() => addToast('Opening SMS portal...', 'info')}
                      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 group-hover:scale-105 transition-all"
                    >
                      <Send className="w-4 h-4 transform -rotate-45" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-4 leading-relaxed font-bold">
                    This credits are used to send SMS to your customers
                  </p>
                </div>

                {/* Whatsapp Credit Card */}
                <div className="bg-[#1b1c3e] text-white p-5 rounded-2xl shadow-md relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider block">Whatsapp Credit Balance</span>
                      <h2 className="text-3xl font-black tracking-tight mt-1">940</h2>
                    </div>
                    <button
                      onClick={() => addToast('Opening Whatsapp portal...', 'info')}
                      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 group-hover:scale-105 transition-all"
                    >
                      <Send className="w-4 h-4 transform -rotate-45" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-4 leading-relaxed font-bold">
                    This credits are used to send WhatsApp to your customers
                  </p>
                </div>

                {/* Status List */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-800 border-b pb-2 mb-3">Features Status</h3>
                  <div className="flex flex-col gap-2.5 select-none">
                    {[
                      { label: 'POS', active: true },
                      { label: 'KDS', active: true },
                      { label: 'Inventory', active: true },
                      { label: 'Customers', active: true },
                      { label: 'Offers', active: true },
                      { label: 'Loyalty', active: true },
                      { label: 'Admin Panel', active: true },
                      { label: 'Reports', active: true },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 pl-3 border-l-2 ${item.active ? 'border-blue-500' : 'border-gray-300'}`}>
                          <span className="text-xs font-bold text-gray-700">{item.label}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${item.active ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                          {item.active ? 'Live' : 'Off'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sales Breakup */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-800 border-b pb-2 mb-3">Sales Breakup</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between pl-3 border-l-2 border-blue-500">
                      <span className="text-xs font-bold text-gray-700">Total Revenue</span>
                      <span className="text-xs font-black text-gray-800">{fmt(m?.totalSales ?? 0)}</span>
                    </div>
                    <div className="flex items-center justify-between pl-3 border-l-2 border-blue-500">
                      <span className="text-xs font-bold text-gray-700">Total Orders</span>
                      <span className="text-xs font-black text-gray-800">{m?.orderCount ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between pl-3 border-l-2 border-blue-500">
                      <span className="text-xs font-bold text-gray-700">Items Sold</span>
                      <span className="text-xs font-black text-gray-800">{m?.itemsSold ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between pl-3 border-l-2 border-teal-500">
                      <span className="text-xs font-bold text-gray-700">Avg per Order</span>
                      <span className="text-xs font-black text-gray-800">{fmt(m?.avgOrderValue ?? 0)}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* Live Status tab content: Real-time Restaurant Command Center */
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

              {/* Left Column (col-span-8) */}
              <div className="xl:col-span-8 flex flex-col gap-6">

                {/* Kitchen Queue Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Confirmed', count: kc?.confirmed ?? 0, color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
                    { label: 'Preparing', count: kc?.preparing ?? 0, color: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
                    { label: 'Ready', count: kc?.ready ?? 0, color: 'green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
                    { label: 'Served', count: kc?.served ?? 0, color: 'gray', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' },
                  ].map((s) => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center`}>
                      <span className={`text-3xl font-black ${s.text}`}>{s.count}</span>
                      <p className={`text-[10px] font-bold uppercase mt-1 ${s.text}`}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Active Preparation Queue */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-orange-500 animate-pulse" />
                      Active Preparation Queue
                    </h3>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                  </div>

                  {/* Show real in-prep orders */}
                  <div className="flex flex-col gap-3">
                    {(summary?.recentOrders ?? []).filter(o => ['Preparing', 'Confirmed'].includes(o.status)).length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-400 font-semibold">
                        ✅ No active preparation items — all caught up!
                      </div>
                    ) : (
                      (summary?.recentOrders ?? []).filter(o => ['Preparing', 'Confirmed'].includes(o.status)).map((o) => {
                        const mins = Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 60000);
                        const isLate = mins > 15;
                        return (
                          <div
                            key={o.id}
                            className={`flex items-center justify-between p-3.5 rounded-xl border ${isLate ? 'bg-red-50/40 border-red-100' : 'bg-orange-50/40 border-orange-100'}`}
                          >
                            <div className="flex items-center gap-3">
                              <Clock className={`w-5 h-5 ${isLate ? 'text-red-600 animate-pulse' : 'text-orange-600'}`} />
                              <div>
                                <div className="text-xs font-bold text-gray-800">
                                  Order #{o.id} {o.tableLabel ? `(${o.tableLabel})` : ''}
                                </div>
                                <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                  {o.customer} — {o.itemCount} item{o.itemCount > 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${isLate ? 'text-red-600 bg-red-50 border-red-200' : 'text-orange-600 bg-orange-50 border-orange-200'}`}>
                              {mins} min{mins > 1 ? 's' : ''}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Live Order Status Tracking */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-extrabold text-gray-800 border-b pb-3 mb-4">
                    Real-time Order Status Tracker
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase">
                          <th className="px-4 py-2.5">Order ID</th>
                          <th className="px-4 py-2.5">Customer</th>
                          <th className="px-4 py-2.5">Table</th>
                          <th className="px-4 py-2.5">Elapsed</th>
                          <th className="px-4 py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                        {(summary?.recentOrders ?? []).length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-gray-400">No orders yet</td>
                          </tr>
                        )}
                        {(summary?.recentOrders ?? []).map((o) => (
                          <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-bold text-blue-600">#{o.id}</td>
                            <td className="px-4 py-3">{o.customer || 'Walk-in'}</td>
                            <td className="px-4 py-3">{o.tableLabel || '—'}</td>
                            <td className="px-4 py-3 text-gray-500">{elapsedLabel(o.createdAt)}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor[o.status] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column (col-span-4) */}
              <div className="xl:col-span-4 flex flex-col gap-5">

                {/* Active Tables Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-xs font-extrabold text-gray-800 border-b pb-2 mb-3 uppercase tracking-wider">
                    Active Tables
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-5xl font-black text-blue-600">{summary?.activeTables ?? 0}</span>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-semibold">tables occupied</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">right now</p>
                    </div>
                  </div>
                </div>

                {/* Device Status */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-xs font-extrabold text-gray-800 border-b pb-2 mb-3 uppercase tracking-wider">
                    Device Terminals Status
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold mb-4">
                    Check KOT and receipt printing terminals connection status across active outlets.
                  </p>
                  <div className="flex flex-col gap-3 font-bold text-xs">
                    <div className="flex items-center justify-between text-gray-700 pl-3 border-l-2 border-emerald-500">
                      <span>Main Kitchen Printer</span>
                      <span className="text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full text-[10px]">Online</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-700 pl-3 border-l-2 border-emerald-500">
                      <span>Dine-In Token Printer</span>
                      <span className="text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full text-[10px]">Online</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-700 pl-3 border-l-2 border-red-500">
                      <span>Bar Receipt Printer</span>
                      <span className="text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full text-[10px]">Offline</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToast('Pinging all POS terminals...', 'info')}
                    className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    Ping All Terminals
                  </button>
                </div>

                {/* Live Ops Feed */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-xs font-extrabold text-gray-800 border-b pb-2 mb-3">
                    Live Operations Feed
                  </h4>
                  <div className="flex flex-col gap-3 text-[11px] font-semibold text-gray-500">
                    {(summary?.recentOrders ?? []).slice(0, 5).map((o) => (
                      <div key={o.id} className="flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          o.status === 'Paid' ? 'bg-green-500' :
                          o.status === 'Cancelled' ? 'bg-red-500' :
                          o.status === 'Preparing' ? 'bg-amber-500' :
                          'bg-blue-500'
                        }`} />
                        <span>
                          Order #{o.id} by {o.customer || 'Walk-in'} — {o.status} ({elapsedLabel(o.createdAt)} ago)
                        </span>
                      </div>
                    ))}
                    {(summary?.recentOrders ?? []).length === 0 && (
                      <p className="text-gray-400 text-center py-2">No recent activity</p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
