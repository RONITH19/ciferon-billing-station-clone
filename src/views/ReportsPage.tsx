import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  ChevronDown, 
  Search, 
  FileDown, 
  RotateCw,
  Send,
  SlidersHorizontal
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { addToast } = useStore();
  
  // View states
  const [activeView, setActiveView] = useState<'landing' | 'sales-summary' | 'billwise-analysis' | 'yearly-sales' | 'placeholder'>('landing');
  const [placeholderTitle, setPlaceholderTitle] = useState('');

  // Filter States
  const [billNo, setBillNo] = useState('');
  const [startDate, setStartDate] = useState('2026-06-12');
  const [endDate, setEndDate] = useState('2026-06-12');
  const [orderType, setOrderType] = useState('All');
  const [paymentType, setPaymentType] = useState('All');
  const [orderStatus, setOrderStatus] = useState('All');
  const [terminal, setTerminal] = useState('All');
  const [virtualOutlet, setVirtualOutlet] = useState('All');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Checkboxes
  const [showItems, setShowItems] = useState(false);
  const [showFoodBar, setShowFoodBar] = useState(false);
  const [taxBreakup, setTaxBreakup] = useState(false);
  const [showSplit, setShowSplit] = useState(false);
  const [summarizeByItems, setSummarizeByItems] = useState(false);

  // Data States
  const [loading, setLoading] = useState(false);
  const [salesSummaryData, setSalesSummaryData] = useState<{
    orders: any[];
    metrics: {
      totalSales: number;
      totalOrders: number;
      totalDiscount: number;
      totalCharges: number;
      totalTax: number;
      totalFoodSale: number;
      totalBarSale: number;
    }
  } | null>(null);

  const [billwiseData, setBillwiseData] = useState<{ items: any[] } | null>(null);
  const [yearlyData, setYearlyData] = useState<{ months: any[] } | null>(null);

  // Fetch report data from SQLite backend
  const fetchReportData = async (type: 'sales-summary' | 'billwise-analysis' | 'yearly-sales') => {
    setLoading(true);
    try {
      let url = `/api/reports/details?reportType=${type}`;
      if (type === 'sales-summary') {
        url += `&billNo=${encodeURIComponent(billNo)}&startDate=${startDate}&endDate=${endDate}&orderType=${orderType}&paymentType=${paymentType}&orderStatus=${orderStatus}`;
      } else if (type === 'billwise-analysis') {
        url += `&billNo=${encodeURIComponent(billNo)}&startDate=${startDate}&endDate=${endDate}`;
      } else if (type === 'yearly-sales') {
        url += `&year=${selectedYear}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch data');
      const json = await res.json();

      if (type === 'sales-summary') {
        setSalesSummaryData(json);
      } else if (type === 'billwise-analysis') {
        setBillwiseData(json);
      } else if (type === 'yearly-sales') {
        setYearlyData(json);
      }
    } catch (err) {
      console.error(err);
      addToast('Error loading report details from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Auto load when view changes
  useEffect(() => {
    if (activeView === 'sales-summary') {
      fetchReportData('sales-summary');
    } else if (activeView === 'billwise-analysis') {
      fetchReportData('billwise-analysis');
    } else if (activeView === 'yearly-sales') {
      fetchReportData('yearly-sales');
    }
  }, [activeView]);

  // Export to CSV/Excel handler
  const handleExportCSV = (reportName: string, headers: string[], rows: any[][]) => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${reportName.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast(`CSV export completed for "${reportName}"`, 'success');
    } catch (err) {
      addToast('Failed to export report CSV', 'error');
    }
  };

  // Trigger export based on active report
  const triggerExport = () => {
    if (activeView === 'sales-summary' && salesSummaryData) {
      const headers = ['Bill', 'External Id', 'Date', 'Type', 'Customer', 'Mobile No.', 'Table No.', 'Status', 'Payment Mode', 'Subtotal', 'Charges', 'Discount', 'Percent Discount', 'Pax', 'Tip', 'Total Tax', 'Total', 'Balance', 'Outlet', 'Captain'];
      const rows = salesSummaryData.orders.map(o => [
        o.id,
        '--',
        o.created_at,
        o.order_type,
        o.customer,
        '--',
        o.table_label || '--',
        o.status,
        o.payment_mode,
        o.subtotal,
        0,
        o.discount,
        o.subtotal ? Math.round((o.discount / o.subtotal) * 100) : 0,
        1,
        0,
        o.tax,
        o.total,
        0,
        'sobos Trial 2',
        'Admin'
      ]);
      handleExportCSV('Sales Summary', headers, rows);
    } else if (activeView === 'billwise-analysis' && billwiseData) {
      const headers = ['Outlet Number', 'Outlet', 'Terminal', 'Store Group', 'Counter Name', 'Date', 'Time', 'Bill', 'Item Code', 'Item', 'Category Code', 'Category', 'HSN', 'GST %', 'Sale Price', 'UOM', 'Discount', 'Quantity', 'Subtotal', 'CGST', 'SGST', 'VAT', 'Total Tax', 'Total Amount'];
      const rows = billwiseData.items.map(i => [
        i.outlet_id || 1,
        'sobos Trial 2',
        'POS',
        'Main',
        'Counter 1',
        i.created_at.slice(0, 10),
        i.created_at.slice(11, 19),
        i.bill_id,
        i.item_code || '--',
        i.item_name,
        'CAT-' + String(i.category || 'GEN').slice(0, 3).toUpperCase(),
        i.category || 'General',
        '9963',
        '5%',
        i.price,
        'Pcs',
        0,
        i.qty,
        i.qty * i.price,
        ((i.qty * i.price) * 0.025).toFixed(2),
        ((i.qty * i.price) * 0.025).toFixed(2),
        '0.00',
        ((i.qty * i.price) * 0.05).toFixed(2),
        ((i.qty * i.price) * 1.05).toFixed(2)
      ]);
      handleExportCSV('Billwise Sales Analysis', headers, rows);
    } else if (activeView === 'yearly-sales' && yearlyData) {
      const headers = ['Month', 'Orders', 'POS Sales', 'POS Orders', 'Food Total', 'Bar Total', 'Subtotal', 'Discount', 'Total Tax', 'Total Charge', 'Total Cancellation', 'Total', 'Round Off', 'Pax'];
      const rows = yearlyData.months.map(m => [
        m.month,
        m.orders,
        m.posSales,
        m.posOrders,
        m.foodTotal,
        m.barTotal,
        m.subtotal,
        m.discount,
        m.totalTax,
        m.totalCharge,
        m.totalCancellation,
        m.total,
        m.roundOff,
        m.pax
      ]);
      handleExportCSV('Yearly Sales', headers, rows);
    }
  };

  // Card items for landing view (Sale Report Directory)
  const reportCards = [
    {
      title: 'Sales Summary',
      description: 'Track sales in the report.',
      action: () => setActiveView('sales-summary')
    },
    {
      title: 'Bill & Itemwise Sales Analysis',
      description: 'Track billwise sales in the report.',
      action: () => setActiveView('billwise-analysis')
    },
    {
      title: 'Yearly Sales',
      description: 'Sales breakup on monthly basis of each month in a year',
      action: () => setActiveView('yearly-sales')
    },
    {
      title: 'Monthly Sales',
      description: 'Sales breakup on day basis of each day in month',
      action: () => {
        setPlaceholderTitle('Monthly Sales');
        setActiveView('placeholder');
      }
    },
    {
      title: 'Sectionwise Sales',
      description: 'Sales breakup on sections in your outlet to identify most preferred seating by your customers',
      action: () => {
        setPlaceholderTitle('Sectionwise Sales');
        setActiveView('placeholder');
      }
    },
    {
      title: 'Waiterwise Sale Report',
      description: 'Sales breakup by waiting staff to identify performance and tips',
      action: () => {
        setPlaceholderTitle('Waiterwise Sale');
        setActiveView('placeholder');
      }
    },
    {
      title: 'Cashierwise Sales',
      description: 'Sales breakup by cashier to understand who has how much cash for accounting purposes',
      action: () => {
        setPlaceholderTitle('Cashierwise Sales');
        setActiveView('placeholder');
      }
    },
    {
      title: 'Category Monthwise Sales',
      description: 'Sales breakup by item\'s category to analyze sales of a group on monthly basis',
      action: () => {
        setPlaceholderTitle('Category Monthwise Sales');
        setActiveView('placeholder');
      }
    },
    {
      title: 'Subcategory Sale Report',
      description: 'Sales breakup by item\'s category to analyze sales of a group on monthly basis',
      action: () => {
        setPlaceholderTitle('Subcategory Sale');
        setActiveView('placeholder');
      }
    },
    {
      title: 'Timewise Sales',
      description: 'Sales breakup on hourly basis to identify busy hours',
      action: () => {
        setPlaceholderTitle('Timewise Sales');
        setActiveView('placeholder');
      }
    },
    {
      title: 'Charges Report',
      description: 'Details of all extra charges like delivery, packaging, etc.',
      action: () => {
        setPlaceholderTitle('Charges Report');
        setActiveView('placeholder');
      }
    },
    {
      title: 'Weekly Sales Report',
      description: 'Weekly breakdown of restaurant sales performance',
      action: () => {
        setPlaceholderTitle('Weekly Sales');
        setActiveView('placeholder');
      }
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 select-none animate-fade-in">
      
      {/* Top Banner Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Reports</h1>
          {activeView !== 'landing' && (
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              {activeView === 'sales-summary' && 'Sales Summary'}
              {activeView === 'billwise-analysis' && 'Billwise Sales Analysis'}
              {activeView === 'yearly-sales' && 'Yearly Sales'}
              {activeView === 'placeholder' && placeholderTitle}
            </p>
          )}
        </div>

        {/* Action Header Buttons */}
        {activeView !== 'landing' && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveView('landing')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            {activeView !== 'placeholder' && (
              <button
                onClick={triggerExport}
                className="px-4 py-2 bg-[#0d2a4a] hover:bg-[#163c64] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileDown className="w-3.5 h-3.5" />
                Download Excel
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-6 overflow-y-auto max-w-[1700px] w-full mx-auto">
        
        {/* ================= LANDING DIRECTORY VIEW (Screenshot 1) ================= */}
        {activeView === 'landing' && (
          <div className="flex flex-col gap-6">
            <div className="pb-3 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Sale Report</h2>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                All reports related to sale transactions done via POS or online channels
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {reportCards.map((card, idx) => (
                <div 
                  key={idx} 
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[135px]"
                >
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{card.title}</h3>
                    <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={card.action}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer hover:translate-x-0.5 transition-transform"
                    >
                      View
                      <Send className="w-3 h-3 rotate-45 text-blue-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SALES SUMMARY VIEW (Screenshot 2) ================= */}
        {activeView === 'sales-summary' && (
          <div className="flex flex-col gap-6">
            
            {/* Filters panel */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filters</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Bill No */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Bill no.</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={billNo}
                      onChange={(e) => setBillNo(e.target.value)}
                      placeholder="Search"
                      className="w-full pl-9 pr-3 py-2 border border-gray-250 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-800 font-semibold"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Date range picker */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Date Range</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={`${startDate.split('-').reverse().join('-')} - ${endDate.split('-').reverse().join('-')}`}
                      readOnly
                      className="w-full pr-9 pl-3 py-2 border border-gray-250 rounded-lg text-xs outline-none text-gray-800 font-semibold bg-gray-50 cursor-pointer"
                    />
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                {/* Order Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-600 font-semibold cursor-pointer"
                  >
                    <option value="All">Search here</option>
                    <option value="Dine_In">Dine In</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Pickup">Pickup</option>
                  </select>
                </div>

                {/* Payment Type */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Payment Type</label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-600 font-semibold cursor-pointer"
                  >
                    <option value="All">Search here</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online</option>
                    <option value="Split">Split</option>
                  </select>
                </div>

                {/* Order Status */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Order Status</label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-600 font-semibold cursor-pointer"
                  >
                    <option value="All">Search here</option>
                    <option value="Paid">Paid</option>
                    <option value="Completed">Completed</option>
                    <option value="Served">Served</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Terminal */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Terminal</label>
                  <select
                    value={terminal}
                    onChange={(e) => setTerminal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-600 font-semibold cursor-pointer"
                  >
                    <option value="All">Search here</option>
                    <option value="Terminal1">Terminal 1</option>
                  </select>
                </div>

                {/* Virtual Outlet */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Virtual Outlet</label>
                  <select
                    value={virtualOutlet}
                    onChange={(e) => setVirtualOutlet(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-600 font-semibold cursor-pointer"
                  >
                    <option value="All">Search here</option>
                    <option value="sobos">sobos</option>
                  </select>
                </div>

                {/* Run button */}
                <div className="flex items-end">
                  <button
                    onClick={() => fetchReportData('sales-summary')}
                    className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-750 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Run
                  </button>
                </div>
              </div>

              {/* Inline Checkboxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
                {[
                  { label: 'Show Items', val: showItems, set: setShowItems },
                  { label: 'Show Food bar Breakup', val: showFoodBar, set: setShowFoodBar },
                  { label: 'Tax Breakup', val: taxBreakup, set: setTaxBreakup },
                  { label: 'Show Split Payment Amount', val: showSplit, set: setShowSplit },
                ].map((chk, idx) => (
                  <label key={idx} className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <span className="text-xs font-bold text-gray-700">{chk.label}</span>
                    <input
                      type="checkbox"
                      checked={chk.val}
                      onChange={(e) => chk.set(e.target.checked)}
                      className="w-4.5 h-4.5 text-blue-600 focus:ring-blue-500 rounded border-gray-300 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Metrics cards row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-4">
              {[
                { title: 'Total Sales', value: salesSummaryData?.metrics.totalSales ?? 0, prefix: '₹' },
                { title: 'Total Orders', value: salesSummaryData?.metrics.totalOrders ?? 0, prefix: '' },
                { title: 'Total Discount', value: salesSummaryData?.metrics.totalDiscount ?? 0, prefix: '₹' },
                { title: 'Total Charges', value: salesSummaryData?.metrics.totalCharges ?? 0, prefix: '₹' },
                { title: 'Total Tax', value: salesSummaryData?.metrics.totalTax ?? 0, prefix: '₹' },
                { title: 'Total Food Sale', value: Math.round(salesSummaryData?.metrics.totalFoodSale ?? 0), prefix: '₹' },
                { title: 'Total Bar Sale', value: Math.round(salesSummaryData?.metrics.totalBarSale ?? 0), prefix: '₹' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    {metric.title}
                  </span>
                  <span className="text-lg font-extrabold text-gray-800 mt-1">
                    {metric.prefix}{metric.value.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Orders Table list */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <RotateCw className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-xs font-bold">Loading records from SQLite...</span>
                </div>
              ) : !salesSummaryData || salesSummaryData.orders.length === 0 ? (
                /* Empty state */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 py-14">
                  <svg width="110" height="100" viewBox="0 0 110 100" fill="none" className="text-blue-100 mb-4">
                    <rect x="25" y="30" width="60" height="45" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                    <path d="M25 38H85" stroke="#cbd5e1" strokeWidth="2" />
                    <text x="55" y="58" fill="#3b82f6" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">X</text>
                  </svg>
                  <h4 className="text-sm font-bold text-gray-800 mb-1">No records found.</h4>
                  <p className="text-xs font-semibold text-gray-400 max-w-xs leading-relaxed">
                    Check your filters or try creating a new record.
                  </p>
                </div>
              ) : (
                /* Grid Table */
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px] tracking-wider">
                        <th className="p-3">Bill</th>
                        <th className="p-3">External Id</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Mobile No.</th>
                        <th className="p-3">Table No.</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Payment Mode</th>
                        <th className="p-3">Subtotal</th>
                        <th className="p-3">Charges</th>
                        <th className="p-3">Discount</th>
                        <th className="p-3">Percent Discount</th>
                        <th className="p-3">Pax</th>
                        <th className="p-3">Tip</th>
                        <th className="p-3">Total Tax</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Balance</th>
                        <th className="p-3">Outlet</th>
                        <th className="p-3">Captain</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-gray-700 font-medium">
                      {salesSummaryData.orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-blue-600">{o.id}</td>
                          <td className="p-3 text-gray-400">--</td>
                          <td className="p-3 whitespace-nowrap">{new Date(o.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                          <td className="p-3 capitalize">{o.order_type.replace('_', ' ')}</td>
                          <td className="p-3">{o.customer}</td>
                          <td className="p-3 text-gray-400">--</td>
                          <td className="p-3 font-bold">{o.table_label || '--'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              o.status === 'Cancelled' ? 'bg-red-50 text-red-650' : 'bg-green-50 text-green-650'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3 uppercase font-semibold text-gray-600">{o.payment_mode}</td>
                          <td className="p-3 font-bold">₹{o.subtotal.toFixed(2)}</td>
                          <td className="p-3 text-gray-400">₹0.00</td>
                          <td className="p-3 text-red-550">₹{o.discount.toFixed(2)}</td>
                          <td className="p-3">{o.subtotal ? Math.round((o.discount / o.subtotal) * 100) : 0}%</td>
                          <td className="p-3">1</td>
                          <td className="p-3 text-gray-400">₹0.00</td>
                          <td className="p-3">₹{o.tax.toFixed(2)}</td>
                          <td className="p-3 font-extrabold text-gray-900">₹{o.total.toFixed(2)}</td>
                          <td className="p-3 text-gray-400">₹0.00</td>
                          <td className="p-3 text-gray-500 whitespace-nowrap">sobos Trial 2</td>
                          <td className="p-3 text-gray-500">Admin</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= BILLWISE SALES ANALYSIS VIEW (Screenshot 3) ================= */}
        {activeView === 'billwise-analysis' && (
          <div className="flex flex-col gap-6">
            
            {/* Filters panel */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filters</h3>
              
              <div className="flex flex-wrap items-end gap-5">
                
                {/* Bill No */}
                <div className="min-w-[200px]">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Bill no.</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={billNo}
                      onChange={(e) => setBillNo(e.target.value)}
                      placeholder="Search"
                      className="w-full pl-9 pr-3 py-2 border border-gray-250 rounded-lg text-xs outline-none focus:border-blue-500 text-gray-800 font-semibold"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Date range picker */}
                <div className="min-w-[220px]">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Date Range</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={`${startDate.split('-').reverse().join('-')} - ${endDate.split('-').reverse().join('-')}`}
                      readOnly
                      className="w-full pr-9 pl-3 py-2 border border-gray-250 rounded-lg text-xs outline-none text-gray-800 font-semibold bg-gray-50 cursor-pointer"
                    />
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                {/* Summarize by Items checkbox */}
                <label className="flex items-center justify-between gap-4 p-2.5 border border-gray-200 rounded-lg cursor-pointer h-[38px] min-w-[200px] bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-bold text-gray-700">Summarize by Items</span>
                  <input
                    type="checkbox"
                    checked={summarizeByItems}
                    onChange={(e) => setSummarizeByItems(e.target.checked)}
                    className="w-4.5 h-4.5 text-blue-600 focus:ring-blue-500 rounded border-gray-300 cursor-pointer"
                  />
                </label>

                {/* Terminal */}
                <div className="min-w-[180px]">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Terminal</label>
                  <select
                    value={terminal}
                    onChange={(e) => setTerminal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-600 font-semibold cursor-pointer"
                  >
                    <option value="All">Search here</option>
                    <option value="Terminal1">Terminal 1</option>
                  </select>
                </div>

                {/* Run button */}
                <button
                  onClick={() => fetchReportData('billwise-analysis')}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-750 text-xs font-bold rounded-lg transition-colors cursor-pointer h-[38px]"
                >
                  Run
                </button>
              </div>
            </div>

            {/* Grid Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <RotateCw className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-xs font-bold">Querying SQLite database...</span>
                </div>
              ) : !billwiseData || billwiseData.items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 py-14">
                  <svg width="110" height="100" viewBox="0 0 110 100" fill="none" className="text-blue-100 mb-4">
                    <rect x="25" y="30" width="60" height="45" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                    <path d="M25 38H85" stroke="#cbd5e1" strokeWidth="2" />
                    <text x="55" y="58" fill="#3b82f6" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">X</text>
                  </svg>
                  <h4 className="text-sm font-bold text-gray-800 mb-1">No records found.</h4>
                  <p className="text-xs font-semibold text-gray-400 max-w-xs leading-relaxed">
                    Check your filters or try creating a new record.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[9px] tracking-wider text-center">
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">Outlet Number</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">Outlet</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">Terminal</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">Store Group</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">Counter Name</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">Date</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">Time</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">Bill</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">Item Code</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">Item</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">Category Code</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">Category</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">HSN</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">GST %</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Sale Price</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">UOM</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Discount</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Quantity</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Subtotal</th>
                        <th colSpan={3} className="p-1 border-b border-r border-gray-200">Tax</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Total Tax</th>
                        <th rowSpan={2} className="p-3">Total Amount</th>
                      </tr>
                      <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 text-[9px] tracking-wider text-center">
                        <th className="p-1.5 border-r border-gray-200">CGST</th>
                        <th className="p-1.5 border-r border-gray-200">SGST</th>
                        <th className="p-1.5 border-r border-gray-200">VAT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-gray-700 font-medium text-center">
                      {billwiseData.items.map((i, idx) => {
                        const sub = i.qty * i.price;
                        const cgst = sub * 0.025;
                        const sgst = sub * 0.025;
                        const tax = cgst + sgst;
                        const amt = sub + tax;
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 border-r border-gray-150 text-left font-semibold">{i.outlet_id || 1}</td>
                            <td className="p-3 border-r border-gray-150 text-left whitespace-nowrap">sobos Trial 2</td>
                            <td className="p-3 border-r border-gray-150 text-left">POS</td>
                            <td className="p-3 border-r border-gray-150 text-left">Main</td>
                            <td className="p-3 border-r border-gray-150 text-left">Counter 1</td>
                            <td className="p-3 border-r border-gray-150 text-left whitespace-nowrap">{i.created_at.slice(0, 10)}</td>
                            <td className="p-3 border-r border-gray-150 text-left">{i.created_at.slice(11, 16)}</td>
                            <td className="p-3 border-r border-gray-150 text-left font-bold text-blue-600">{i.bill_id}</td>
                            <td className="p-3 border-r border-gray-150 text-left font-semibold text-gray-500">{i.item_code || '--'}</td>
                            <td className="p-3 border-r border-gray-150 text-left font-bold text-gray-800 whitespace-nowrap">{i.item_name}</td>
                            <td className="p-3 border-r border-gray-150 text-left font-semibold text-gray-500">CAT-{String(i.category || 'GEN').slice(0, 3).toUpperCase()}</td>
                            <td className="p-3 border-r border-gray-150 text-left">{i.category || 'General'}</td>
                            <td className="p-3 border-r border-gray-150 text-gray-400">9963</td>
                            <td className="p-3 border-r border-gray-150">5%</td>
                            <td className="p-3 border-r border-gray-150 font-semibold">₹{i.price.toFixed(2)}</td>
                            <td className="p-3 border-r border-gray-150 text-gray-500">Pcs</td>
                            <td className="p-3 border-r border-gray-150 text-gray-400">₹0.00</td>
                            <td className="p-3 border-r border-gray-150 font-bold">{i.qty}</td>
                            <td className="p-3 border-r border-gray-150 font-extrabold text-gray-800">₹{sub.toFixed(2)}</td>
                            <td className="p-3 border-r border-gray-150 text-gray-500">₹{cgst.toFixed(2)}</td>
                            <td className="p-3 border-r border-gray-150 text-gray-500">₹{sgst.toFixed(2)}</td>
                            <td className="p-3 border-r border-gray-150 text-gray-400">₹0.00</td>
                            <td className="p-3 border-r border-gray-150 font-bold">₹{tax.toFixed(2)}</td>
                            <td className="p-3 font-extrabold text-gray-950">₹{amt.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= YEARLY SALES VIEW (Screenshot 4) ================= */}
        {activeView === 'yearly-sales' && (
          <div className="flex flex-col gap-6">
            
            {/* Filters panel */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filters</h3>
              
              <div className="flex flex-wrap items-end gap-5">
                
                {/* Terminal */}
                <div className="min-w-[200px]">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Terminal</label>
                  <select
                    value={terminal}
                    onChange={(e) => setTerminal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-600 font-semibold cursor-pointer"
                  >
                    <option value="All">Search here</option>
                    <option value="Terminal1">Terminal 1</option>
                  </select>
                </div>

                {/* Select Year */}
                <div className="min-w-[150px]">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Select Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 bg-white rounded-lg text-xs outline-none text-gray-800 font-bold cursor-pointer"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>

                {/* Run button */}
                <button
                  onClick={() => fetchReportData('yearly-sales')}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-750 text-xs font-bold rounded-lg transition-colors cursor-pointer h-[38px]"
                >
                  Run
                </button>
              </div>
            </div>

            {/* Grid Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                  <RotateCw className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-xs font-bold">Aggregating database values...</span>
                </div>
              ) : !yearlyData ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <span className="text-xs font-bold text-gray-400">Click Run to generate report.</span>
                </div>
              ) : (
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full text-center text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-200 text-gray-600 font-bold uppercase text-[9px] tracking-wider text-center">
                        <th rowSpan={2} className="p-3 border-r border-gray-200 text-left">-</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Orders</th>
                        <th colSpan={2} className="p-1.5 border-b border-r border-gray-200">POS</th>
                        <th colSpan={2} className="p-1.5 border-b border-r border-gray-200">Zomato</th>
                        <th colSpan={2} className="p-1.5 border-b border-r border-gray-200">Swiggy</th>
                        <th colSpan={2} className="p-1.5 border-b border-r border-gray-200">Contactless</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Food Total</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Bar Total</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Subtotal</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Discount</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Total Tax</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Total Charge</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Total Cancellation</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Total</th>
                        <th rowSpan={2} className="p-3 border-r border-gray-200">Round Off</th>
                        <th rowSpan={2} className="p-3">Pax</th>
                      </tr>
                      <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 text-[9px] tracking-wider text-center">
                        <th className="p-1.5 border-r border-gray-200">Sales</th>
                        <th className="p-1.5 border-r border-gray-200">Orders</th>
                        <th className="p-1.5 border-r border-gray-200">Sales</th>
                        <th className="p-1.5 border-r border-gray-200">Orders</th>
                        <th className="p-1.5 border-r border-gray-200">Sales</th>
                        <th className="p-1.5 border-r border-gray-200">Orders</th>
                        <th className="p-1.5 border-r border-gray-200">Sales</th>
                        <th className="p-1.5 border-r border-gray-200">Orders</th>
                      </tr>
                      <tr className="bg-slate-100 border-b border-gray-250 text-gray-500 font-bold text-[10px] tracking-wider text-center">
                        <th className="p-2 border-r border-gray-200 text-left">-</th>
                        <th className="p-2 border-r border-gray-200">-</th>
                        <th className="p-2 border-r border-gray-200">Sales</th>
                        <th className="p-2 border-r border-gray-200">Orders</th>
                        <th className="p-2 border-r border-gray-200">Sales</th>
                        <th className="p-2 border-r border-gray-200">Orders</th>
                        <th className="p-2 border-r border-gray-200">Sales</th>
                        <th className="p-2 border-r border-gray-200">Orders</th>
                        <th className="p-2 border-r border-gray-200">Sales</th>
                        <th className="p-2 border-r border-gray-200">Orders</th>
                        <th className="p-2 border-r border-gray-200">-</th>
                        <th className="p-2 border-r border-gray-200">-</th>
                        <th className="p-2 border-r border-gray-200">-</th>
                        <th className="p-2 border-r border-gray-200">-</th>
                        <th className="p-2 border-r border-gray-200">-</th>
                        <th className="p-2 border-r border-gray-200">-</th>
                        <th className="p-2 border-r border-gray-200">-</th>
                        <th className="p-2 border-r border-gray-200">-</th>
                        <th className="p-2 border-r border-gray-200">-</th>
                        <th className="p-2">-</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-gray-700 font-medium">
                      {yearlyData.months.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 border-r border-gray-150 text-left font-bold text-gray-800">{m.month}</td>
                          <td className="p-3 border-r border-gray-150 font-bold">{m.orders}</td>
                          <td className="p-3 border-r border-gray-150 font-semibold">₹{m.posSales.toLocaleString('en-IN')}</td>
                          <td className="p-3 border-r border-gray-150">{m.posOrders}</td>
                          <td className="p-3 border-r border-gray-150 text-gray-400">₹{m.zomatoSales}</td>
                          <td className="p-3 border-r border-gray-150 text-gray-400">{m.zomatoOrders}</td>
                          <td className="p-3 border-r border-gray-150 text-gray-400">₹{m.swiggySales}</td>
                          <td className="p-3 border-r border-gray-150 text-gray-400">{m.swiggyOrders}</td>
                          <td className="p-3 border-r border-gray-150 text-gray-400">₹{m.contactlessSales}</td>
                          <td className="p-3 border-r border-gray-150 text-gray-400">{m.contactlessOrders}</td>
                          <td className="p-3 border-r border-gray-150 font-semibold text-gray-700">₹{Math.round(m.foodTotal).toLocaleString('en-IN')}</td>
                          <td className="p-3 border-r border-gray-150 font-semibold text-gray-700">₹{Math.round(m.barTotal).toLocaleString('en-IN')}</td>
                          <td className="p-3 border-r border-gray-150 font-bold text-gray-800">₹{Math.round(m.subtotal).toLocaleString('en-IN')}</td>
                          <td className="p-3 border-r border-gray-150 text-red-500 font-semibold">₹{m.discount}</td>
                          <td className="p-3 border-r border-gray-150 font-semibold">₹{m.totalTax.toLocaleString('en-IN')}</td>
                          <td className="p-3 border-r border-gray-150 text-gray-550">₹{m.totalCharge}</td>
                          <td className="p-3 border-r border-gray-150 text-red-500">₹{m.totalCancellation}</td>
                          <td className="p-3 border-r border-gray-150 font-extrabold text-blue-900 bg-blue-50/30">₹{Math.round(m.total).toLocaleString('en-IN')}</td>
                          <td className="p-3 border-r border-gray-150 text-gray-400">0</td>
                          <td className="p-3 font-bold text-gray-800">{m.pax}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= PLACEHOLDER VIEW ================= */}
        {activeView === 'placeholder' && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[450px]">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <SlidersHorizontal className="w-8 h-8 text-blue-500 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-gray-850 mb-1">{placeholderTitle} Report</h2>
            <p className="text-xs text-gray-550 max-w-sm leading-relaxed mb-6 font-semibold">
              This report is currently being calculated and will be ready shortly. Please use Sales Summary, Billwise Sales Analysis, or Yearly Sales.
            </p>
            <button
              onClick={() => setActiveView('landing')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-blue-100"
            >
              Return to Reports list
            </button>
          </div>
        )}

      </main>
    </div>
  );
};
