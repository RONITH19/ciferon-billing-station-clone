import React, { useState, useEffect } from 'react';
import { useStore, FeedbackComment } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { offersSidebarSections } from './BookletsPage';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ArrowLeft, Calendar, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeedbackCommentsPage: React.FC = () => {
  const { feedbackComments, addToast } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('2026-06-11');
  const [endDate, setEndDate] = useState('2026-06-11');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRun = () => {
    setIsLoading(true);
    addToast(`Running comments lookup for date range ${startDate} to ${endDate}`, 'info');
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const columns: Column<FeedbackComment>[] = [
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => <span className="font-bold text-gray-800">{row.customer}</span>,
    },
    {
      header: 'Comments',
      accessor: 'comments',
      render: (row) => <span className="text-gray-500 italic">{row.comments || '-'}</span>,
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => <span className="font-semibold text-gray-600">{row.date}</span>,
    },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={offersSidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)]">
        <PageHeader title="Feedback Comments">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </PageHeader>

        {/* Date Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-6 flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                From Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                To Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white font-medium"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={handleRun}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 transition-all select-none h-[38px] md:h-auto"
          >
            <Play className="w-3.5 h-3.5" />
            Run
          </button>
        </div>

        <DataTable
          columns={columns}
          data={feedbackComments}
          isLoading={isLoading}
          searchable={false}
          itemsPerPage={5}
        />
      </main>
    </div>
  );
};
