import React, { useState } from 'react';
import { SubSidebar } from '../components/SubSidebar';
import { offersSidebarSections } from './BookletsPage';
import { Calendar, ChevronDown, Check, X } from 'lucide-react';

export const FeedbackInsightsPage: React.FC = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Today');
  const [dateStr, setDateStr] = useState('12-06-2026 - 12-06-2026');

  const handleRangeSelect = (range: string, dateDisplay: string) => {
    setSelectedRange(range);
    setDateStr(dateDisplay);
    setIsDatePickerOpen(false);
  };

  return (
    <div className="flex h-full animate-fade-in select-none">
      <SubSidebar sections={offersSidebarSections} />

      <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-slate-50 h-[calc(100vh-60px)] relative">
        {/* Header with Date Picker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Feedback</h1>
            <p className="text-xs text-gray-500">Feedback Insights</p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <span>{dateStr}</span>
              <Calendar className="w-4 h-4 text-gray-400" />
            </button>

            {/* Premium Date Range Picker Dropdown (Image 8) */}
            {isDatePickerOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[1000] flex flex-col md:flex-row p-4 gap-4 animate-scale-up min-w-[580px]">
                {/* Quick ranges */}
                <div className="w-32 flex flex-col gap-1 text-[11px] font-bold text-gray-500 border-r border-gray-100 pr-3">
                  {[
                    { label: 'Today', dates: '12-06-2026 - 12-06-2026' },
                    { label: 'Yesterday', dates: '11-06-2026 - 11-06-2026' },
                    { label: 'Last 7 Days', dates: '06-06-2026 - 12-06-2026' },
                    { label: 'Last 15 Days', dates: '28-05-2026 - 12-06-2026' },
                    { label: 'Last 30 Days', dates: '13-05-2026 - 12-06-2026' },
                    { label: 'This Month', dates: '01-06-2026 - 12-06-2026' },
                    { label: 'Last Month', dates: '01-05-2026 - 31-05-2026' },
                  ].map((range) => (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => handleRangeSelect(range.label, range.dates)}
                      className={`text-left px-2 py-1.5 rounded-lg transition-colors ${
                        selectedRange === range.label
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-50 text-gray-650'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>

                {/* Calendar Months preview */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex gap-4">
                    {/* June Calendar */}
                    <div className="flex-1">
                      <div className="text-center text-xs font-bold text-gray-800 mb-2">Jun 2026</div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-gray-400 mb-1">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                      </div>
                      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-gray-600">
                        {Array.from({ length: 31 }).map((_, idx) => {
                          const dayNum = idx - 1; // offset for starts on Monday
                          if (dayNum < 1) return <div key={idx} />;
                          const isSelected = dayNum === 12;
                          return (
                            <div
                              key={idx}
                              className={`p-1 rounded-md ${
                                isSelected ? 'bg-blue-600 text-white font-bold' : ''
                              }`}
                            >
                              {dayNum}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* July Calendar */}
                    <div className="flex-1">
                      <div className="text-center text-xs font-bold text-gray-800 mb-2">Jul 2026</div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-gray-400 mb-1">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                      </div>
                      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-gray-600">
                        {Array.from({ length: 35 }).map((_, idx) => {
                          const dayNum = idx - 2; // offset
                          if (dayNum < 1 || dayNum > 31) return <div key={idx} />;
                          return <div key={idx}>{dayNum}</div>;
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-2.5">
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(false)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-750 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      CANCEL
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(false)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      APPLY
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overall Ratings Card Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {[
            { title: 'OVERALL USER RATING', score: '0', color: 'bg-violet-600' },
            { title: 'OVERALL FOOD RATING', score: '0', color: 'bg-sky-500' },
            { title: 'OVERALL SERVICE RATING', score: '0', color: 'bg-rose-500' },
            { title: 'OVERALL CLEANLINESS RATING', score: '0', color: 'bg-slate-800' },
          ].map((card, idx) => (
            <div key={idx} className={`${card.color} text-white rounded-lg p-5 shadow-sm flex flex-col justify-between min-h-[110px]`}>
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider block">
                {card.title}
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold">{card.score}</span>
              </div>
              <span className="text-[9px] font-semibold opacity-70 mt-1 block">
                Based on 0 reviews
              </span>
            </div>
          ))}
        </div>

        {/* Star Rating Distribution Row */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-gray-700">
                <span>{stars}</span>
                <span className="text-amber-500">&#9733;</span>
              </div>
              <div className="text-sm font-bold text-gray-400 mt-1">--</div>
            </div>
          ))}
        </div>

        {/* Bottom Columns: Progress Track & Previous Responses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Progress Track */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-5 shadow-sm min-h-[380px] flex flex-col">
            <h3 className="text-sm font-bold text-gray-750 border-b border-gray-100 pb-2.5 mb-4">
              Progress track
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <svg width="100" height="90" viewBox="0 0 100 90" fill="none" className="text-blue-100 mb-4">
                <rect x="20" y="25" width="60" height="45" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                <path d="M20 32H80" stroke="#cbd5e1" strokeWidth="2" />
                <text x="48" y="52" fill="#3b82f6" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">X</text>
              </svg>
              <h4 className="text-sm font-bold text-gray-800 mb-1">No records found.</h4>
              <p className="text-xs font-semibold text-gray-400 max-w-xs leading-relaxed">
                Check your filters or try creating a new record.
              </p>
            </div>
          </div>

          {/* Previous Responses */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm min-h-[380px] flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-750 border-b border-gray-100 pb-2.5 mb-4">
                Previous Responses
              </h3>
              <div className="flex flex-col items-center justify-center text-center py-10">
                <svg width="80" height="70" viewBox="0 0 80 70" fill="none" className="text-blue-100 mb-3">
                  <rect x="15" y="15" width="50" height="40" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                  <path d="M15 22H65" stroke="#cbd5e1" strokeWidth="2" />
                </svg>
                <h4 className="text-xs font-bold text-gray-800 mb-1">No records found.</h4>
                <p className="text-[10px] font-semibold text-gray-400 max-w-xs leading-relaxed">
                  Check your filters or try creating a new record.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="w-full mt-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
            >
              View All
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
