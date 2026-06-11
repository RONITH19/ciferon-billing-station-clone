import React, { useState, useEffect } from 'react';
import { SubSidebar } from '../components/SubSidebar';
import { inventorySidebarSections } from './InventoryLandingPage';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

interface PurchaseReturn {
  id: string;
  date: string;
  vendor: string;
  amount: number;
}

export const PurchaseReturnsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [returnsList, setReturnsList] = useState<PurchaseReturn[]>([]);
  const { addToast } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNew = () => {
    addToast('New Purchase Return form is not available in trial mode.', 'warning');
  };

  const columns: Column<PurchaseReturn>[] = [
    { header: 'Return ID', accessor: 'id' },
    { header: 'Date', accessor: 'date' },
    { header: 'Vendor', accessor: 'vendor' },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => <span>₹{row.amount.toFixed(2)}</span>,
    },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={inventorySidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)]">
        <PageHeader title="Purchase Returns">
          <Link
            to="/inventory/landing"
            className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </PageHeader>

        <DataTable
          columns={columns}
          data={returnsList}
          isLoading={isLoading}
          searchPlaceholder="Search purchase returns..."
        />
      </main>
    </div>
  );
};
