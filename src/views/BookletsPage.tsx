import React, { useState, useEffect } from 'react';
import { useStore, Booklet } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ArrowLeft, Users, Download, Edit2, Plus, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const offersSidebarSections = [
  {
    label: 'Offers',
    items: [
      { label: 'Offers', href: '/offers/list' },
      { label: 'Booklets', href: '/offers/bookletlist' },
      { label: 'Offer QR', href: '/offers/qr' },
    ],
  },
  {
    label: 'Loyalty',
    items: [
      { label: 'Plans', href: '/loyalty/plans' },
      { label: 'Redemption', href: '/loyalty/redemption' },
      { label: 'Settings', href: '/loyalty/setting' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { label: 'Insights', href: '/feedback/insights' },
      { label: 'Settings', href: '/feedback/setting' },
      { label: 'Responses', href: '/feedback/responses' },
      { label: 'Comments', href: '/feedback/comments' },
      { label: 'Item Rating Report', href: '/feedback/ratings' },
    ],
  },
];

export const BookletsPage: React.FC = () => {
  const { booklets, addBooklet, addToast } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [bookletName, setBookletName] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookletName.trim()) {
      addToast('Booklet name is required', 'warning');
      return;
    }

    const newBooklet: Booklet = {
      id: Math.random().toString(36).substring(2, 9),
      name: bookletName.trim(),
    };
    addBooklet(newBooklet);
    addToast(`Booklet "${newBooklet.name}" created successfully`, 'success');
    setBookletName('');
    setIsFormOpen(false);
  };

  const handleAction = (action: string, bookletName: string) => {
    addToast(`${action} action triggered for "${bookletName}"`, 'info');
  };

  const columns: Column<Booklet>[] = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => <span className="font-bold text-gray-800">{row.name}</span>,
    },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAction('View Members', row.name)}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors"
            title="View Members"
          >
            <Users className="w-3.5 h-3.5" />
            View Members
          </button>
          <button
            onClick={() => handleAction('Export', row.name)}
            className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg transition-colors border border-gray-200"
            title="Export"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            onClick={() => handleAction('Edit', row.name)}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={offersSidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)]">
        <PageHeader title="Booklets">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </PageHeader>

        {isFormOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full overflow-hidden p-6 animate-scale-up"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-lg font-bold text-gray-900">New Booklet</h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Booklet Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bookletName}
                  onChange={(e) => setBookletName(e.target.value)}
                  placeholder="e.g. Bronze Members Booklet"
                  className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        <DataTable
          columns={columns}
          data={booklets}
          isLoading={isLoading}
          searchPlaceholder="Search booklets..."
          searchKey="name"
        />
      </main>
    </div>
  );
};
