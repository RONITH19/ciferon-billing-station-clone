import React, { useState } from 'react';
import { SubSidebar } from '../components/SubSidebar';
import { settingsSidebarSections } from './MessageSettingsPage';
import { PageHeader } from '../components/PageHeader';
import { InfoBanner } from '../components/InfoBanner';
import { ArrowLeft, Play, Search, Calendar, Filter, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

export const CancelOrdersPage: React.FC = () => {
  const { addToast } = useStore();
  const [billNo, setBillNo] = useState('');
  const [dateRange, setDateRange] = useState('2026-06-11');
  const [orderType, setOrderType] = useState('All');
  const [paymentType, setPaymentType] = useState('All');
  const [orderStatus, setOrderStatus] = useState('All');
  const [terminal, setTerminal] = useState('All');

  const reasons = [
    'Test Table',
    'Customer cancel the Order',
    'Delivery Boy Not Available',
    'Items Not Available',
    'Restaurant Closed',
    'Change in mode of Payment',
    'Order Cancel After Preparation',
    'Order Cancel Before Preparation',
    'Delay in placing the order by captain',
  ];

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(`Searching cancel log for Bill No: "${billNo || 'ANY'}" on terminal "${terminal}"`, 'info');
  };

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={settingsSidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <PageHeader title="Cancel Orders">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel: Info + Warnings (col-span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Cancel Orders
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                This function will help you to cancel the orders. Filter details by terminal and run the lookup queries to check cancellation logs.
              </p>
            </div>

            {/* Warning info banners */}
            <div className="flex flex-col gap-3">
              <InfoBanner
                type="info"
                message="Once you done with the above activity, it will not recover or retrive. It will get removed from server directly"
              />
              <InfoBanner
                type="info"
                message="Sobos will not be responsible for any data loss."
              />
              <InfoBanner
                type="info"
                message="Be carefull while performing this action."
              />
            </div>
          </div>

          {/* Right panel: Filters + Reasons (col-span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Filters Form */}
            <form onSubmit={handleRun} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                Cancellation Filters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Bill No.
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="text"
                      value={billNo}
                      onChange={(e) => setBillNo(e.target.value)}
                      placeholder="Search bill number..."
                      className="w-full pl-9 pr-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Date Range
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="date"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Order Type
                  </label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white font-medium"
                  >
                    <option value="All">All Types</option>
                    <option value="DineIn">Dine In</option>
                    <option value="TakeAway">Take Away</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Payment Type
                  </label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white font-medium"
                  >
                    <option value="All">All Payments</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Order Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white font-medium"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Terminal
                  </label>
                  <select
                    value={terminal}
                    onChange={(e) => setTerminal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white font-medium"
                  >
                    <option value="All">All Terminals</option>
                    <option value="POS-01">POS Terminal 01</option>
                    <option value="POS-02">POS Terminal 02</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 transition-all select-none"
                >
                  <Play className="w-3.5 h-3.5" />
                  Run
                </button>
              </div>
            </form>

            {/* Reasons List Section */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-150 bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-gray-500" />
                  System Cancellation Reasons
                </h3>
              </div>
              <div className="divide-y divide-gray-150 max-h-[300px] overflow-y-auto scrollbar-thin">
                {reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="px-6 py-3.5 text-xs font-semibold text-gray-700 hover:bg-gray-50/30 transition-colors"
                  >
                    <span className="text-gray-400 mr-2">#{idx + 1}</span>
                    {reason}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};
