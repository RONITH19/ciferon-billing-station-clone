import React, { useState, useEffect } from 'react';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { inventorySidebarSections } from './InventoryLandingPage';
import { useStore } from '../store';
import { Calendar, Check, AlertCircle } from 'lucide-react';

interface ExpiryItem {
  id: string;
  name: string;
  expiryDate: string;
  daysRemaining: number;
  qty: string;
  status: 'Near Expiry' | 'Expired' | 'Safe';
  consumed: boolean;
}

export const ExpiryItemDetailsPage: React.FC = () => {
  const { addToast } = useStore();
  
  const [dateRange, setDateRange] = useState('11-06-2026 - 11-06-2026');
  const [showCalendar, setShowCalendar] = useState(false);
  const [consumedFilter, setConsumedFilter] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock list of expiry items
  const [expiryItems, setExpiryItems] = useState<ExpiryItem[]>([
    { id: 'exp-1', name: 'AMUL PROCESSED CHEESE', expiryDate: '18 Jun 2026', daysRemaining: 7, qty: '5 Pcs (0.5Kg)', status: 'Near Expiry', consumed: false },
    { id: 'exp-2', name: 'KIM JUMBO BREAD', expiryDate: '14 Jun 2026', daysRemaining: 3, qty: '2 Pcs', status: 'Near Expiry', consumed: false },
    { id: 'exp-3', name: 'Pepsi Bottle', expiryDate: '08 Jun 2026', daysRemaining: -3, qty: '12 Bottles', status: 'Expired', consumed: false },
    { id: 'exp-4', name: 'Chicken Thali Packets', expiryDate: '25 Jun 2026', daysRemaining: 14, qty: '10 Packs', status: 'Safe', consumed: false },
    { id: 'exp-5', name: 'Noodles Pack', expiryDate: '01 Jul 2026', daysRemaining: 20, qty: '4 Packets', status: 'Safe', consumed: false },
  ]);

  const handleMarkConsumed = (id: string) => {
    setExpiryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, consumed: true } : item))
    );
    addToast('Item marked as consumed successfully', 'success');
  };

  const handleApplyRange = (rangeText: string) => {
    setDateRange(rangeText);
    setShowCalendar(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast(`Applied Date Range: ${rangeText}`, 'success');
    }, 600);
  };

  const visibleItems = expiryItems.filter((item) => {
    if (consumedFilter) return item.consumed;
    return !item.consumed;
  });

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={inventorySidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <PageHeader title="Expiry Item Details" subtitle="Track product shelf life and manage close-to-expiry ingredients" />

        {/* Filters Panel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm flex flex-col md:flex-row items-center gap-6 bg-gray-50/20 relative z-10">
          
          {/* Expiry Date Range Selector */}
          <div className="flex flex-col gap-1.5 w-full md:w-auto relative">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Expiry Date Range
            </label>
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2.5 px-4 py-2.5 border border-gray-250 bg-white hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 cursor-pointer select-none transition-all shadow-sm"
            >
              <span className="min-w-[160px]">{dateRange}</span>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>

            {/* Custom Screenshot-Style Date Range Picker Dropdown */}
            {showCalendar && (
              <div className="absolute top-[64px] left-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-4 flex flex-col md:flex-row gap-4 animate-scale-up md:w-[620px]">
                {/* Left Ranges List */}
                <div className="w-36 border-r border-gray-150 pr-3 flex flex-col gap-1 select-none">
                  {['Today', 'Yesterday', 'Last 7 Days', 'Last 15 Days', 'Last 30 Days', 'This Month', 'Last Month'].map((range) => {
                    const isToday = range === 'Today';
                    return (
                      <button
                        key={range}
                        type="button"
                        onClick={() => {
                          if (range === 'Today') handleApplyRange('11-06-2026 - 11-06-2026');
                          else if (range === 'Yesterday') handleApplyRange('10-06-2026 - 10-06-2026');
                          else if (range === 'Last 7 Days') handleApplyRange('04-06-2026 - 11-06-2026');
                          else if (range === 'Last 15 Days') handleApplyRange('27-05-2026 - 11-06-2026');
                          else if (range === 'Last 30 Days') handleApplyRange('12-05-2026 - 11-06-2026');
                          else if (range === 'This Month') handleApplyRange('01-06-2026 - 30-06-2026');
                          else if (range === 'Last Month') handleApplyRange('01-05-2026 - 31-05-2026');
                        }}
                        className={`text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                          isToday
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-100'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
                        }`}
                      >
                        {range}
                      </button>
                    );
                  })}
                </div>

                {/* Calendar grids */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex gap-4">
                    {/* June 2026 */}
                    <div className="flex-1 text-center">
                      <h4 className="text-xs font-bold text-gray-800 mb-2">Jun 2026</h4>
                      <div className="grid grid-cols-7 gap-1 text-[10px] text-gray-500 font-bold mb-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <span key={d}>{d}</span>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-[10px] text-gray-700 font-medium">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const dateNum = i + 1;
                          const isTodayVal = dateNum === 11;
                          return (
                            <span
                              key={i}
                              className={`p-1.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors ${
                                isTodayVal ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200' : ''
                              }`}
                            >
                              {dateNum}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* July 2026 */}
                    <div className="flex-1 text-center">
                      <h4 className="text-xs font-bold text-gray-800 mb-2">Jul 2026</h4>
                      <div className="grid grid-cols-7 gap-1 text-[10px] text-gray-500 font-bold mb-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <span key={d}>{d}</span>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-[10px] text-gray-700 font-medium">
                        {Array.from({ length: 31 }).map((_, i) => (
                          <span
                            key={i}
                            className="p-1.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            {i + 1}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Calendar Footer Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-150 mt-1">
                    <button
                      type="button"
                      onClick={() => setShowCalendar(false)}
                      className="px-3.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-all"
                    >
                      CANCEL
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyRange('11-06-2026 - 11-06-2026')}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 transition-all"
                    >
                      APPLY
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Consumed Product Checkbox */}
          <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm select-none cursor-pointer">
            <span className="text-sm font-semibold text-gray-700">Consumed Product</span>
            <input
              type="checkbox"
              checked={consumedFilter}
              onChange={(e) => setConsumedFilter(e.target.checked)}
              className="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />
          </div>

          {/* Screenshot-Style Green Loading Spinner Display */}
          {loading && (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-5 h-5 rounded-full border-2 border-green-100 border-t-green-500 animate-spin" />
              <span className="text-xs text-gray-400 font-bold">Refreshing list...</span>
            </div>
          )}
        </div>

        {/* Expiry Items List Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 select-none">
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Material Name</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Days Remaining</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {visibleItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400 font-semibold select-none">
                    No items found matching filter criteria.
                  </td>
                </tr>
              ) : (
                visibleItems.map((item) => {
                  const isExpired = item.daysRemaining <= 0;
                  const isNearExpiry = item.daysRemaining > 0 && item.daysRemaining <= 7;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-650">{item.expiryDate}</td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        {isExpired ? (
                          <span className="text-red-600 font-bold">
                            Expired ({Math.abs(item.daysRemaining)} days ago)
                          </span>
                        ) : (
                          <span className={isNearExpiry ? 'text-amber-600 font-bold' : 'text-green-600 font-bold'}>
                            {item.daysRemaining} days left
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">{item.qty}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isExpired
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : isNearExpiry
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-green-50 text-green-700 border-green-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.consumed ? (
                          <span className="text-xs font-bold text-green-600 inline-flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Consumed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkConsumed(item.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-250 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
                          >
                            Mark Consumed
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
