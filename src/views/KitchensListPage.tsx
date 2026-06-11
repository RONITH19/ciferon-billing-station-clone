import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, Kitchen } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { Edit2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const KitchensListPage: React.FC = () => {
  const { kitchens } = useStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const menuSidebarSections = [
    {
      label: 'Outlet Settings',
      items: [
        { label: 'Charges', href: '/catalogue/charges' },
        { label: 'Kitchens', href: '/catalogue/kitchens' },
      ],
    },
  ];

  const columns: Column<Kitchen>[] = [
    {
      header: 'Kitchen Name',
      render: (row) => <span className="font-bold text-gray-800">{row.name}</span>,
    },
    {
      header: 'Description',
      accessor: 'description',
    },
    {
      header: 'Main Printer',
      render: (row) => (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
          {row.mainPrinterName} ({row.mainPrinterType})
        </span>
      ),
    },
    {
      header: 'Prints Status',
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            row.disablePrints
              ? 'bg-red-50 text-red-600 border border-red-100'
              : 'bg-green-50 text-green-600 border border-green-100'
          }`}
        >
          {row.disablePrints ? 'Disabled' : 'Enabled'}
        </span>
      ),
    },
    {
      header: 'Action',
      render: (row) => (
        <button
          onClick={() => navigate(`/catalogue/printers/update/${row.id}`)}
          className="p-1.5 bg-gray-50 hover:bg-gray-100 text-blue-600 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit Kitchen
        </button>
      ),
    },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={menuSidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)]">
        <PageHeader title="Kitchens">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <Link
            to="/catalogue/kitchens/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
          >
            New
          </Link>
        </PageHeader>

        <DataTable
          columns={columns}
          data={kitchens}
          isLoading={isLoading}
          searchPlaceholder="Search kitchens..."
          searchKey="name"
        />
      </main>
    </div>
  );
};
