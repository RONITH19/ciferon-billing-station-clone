import React, { useState, useEffect } from 'react';
import { useStore, ProducedStock } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { inventorySidebarSections } from './InventoryLandingPage';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Printer, Edit2, Trash2, ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProducedStocksPage: React.FC = () => {
  const { producedStocks, addProducedStock, deleteProducedStock, addToast } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddNew = () => {
    const nextIdNum = producedStocks.length + 5;
    const newStock: ProducedStock = {
      id: `SRL-${nextIdNum}`,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Open',
    };
    addProducedStock(newStock);
    addToast(`Produced stock ${newStock.id} created`, 'success');
  };

  const handlePrint = (id: string) => {
    addToast(`Sending print job for produced stock record ${id} to printer...`, 'success');
  };

  const handleEdit = (id: string) => {
    addToast(`Editing produced stock ${id}`, 'info');
  };

  const handleOpenDelete = (id: string) => {
    setSelectedStockId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStockId) {
      deleteProducedStock(selectedStockId);
      addToast(`Produced stock ${selectedStockId} deleted`, 'success');
    }
    setIsDeleteOpen(false);
    setSelectedStockId(null);
  };

  const columns: Column<ProducedStock>[] = [
    {
      header: '#',
      accessor: 'id',
      render: (row) => (
        <span
          onClick={() => handleEdit(row.id)}
          className="text-blue-600 font-bold hover:underline cursor-pointer"
        >
          {row.id}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
    },
    {
      header: 'Status',
      render: (row) => (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
          {row.status}
        </span>
      ),
    },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePrint(row.id)}
            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
            title="Print"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleEdit(row.id)}
            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-blue-600 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenDelete(row.id)}
            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={inventorySidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)]">
        <PageHeader title="Produced Stocks">
          <Link
            to="/inventory/landing"
            className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </PageHeader>

        <DataTable
          columns={columns}
          data={producedStocks}
          isLoading={isLoading}
          searchPlaceholder="Search produced stocks..."
          searchKey="id"
        />

        <ConfirmDeleteModal
          isOpen={isDeleteOpen}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      </main>
    </div>
  );
};
