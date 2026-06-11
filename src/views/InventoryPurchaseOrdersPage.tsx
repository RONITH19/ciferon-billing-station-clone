import React, { useState } from 'react';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { inventorySidebarSections } from './InventoryLandingPage';
import { useStore, PurchaseOrder } from '../store';
import { Mail, Printer, Edit2, Trash2, X, Plus } from 'lucide-react';

export const InventoryPurchaseOrdersPage: React.FC = () => {
  const { purchaseOrders, addPurchaseOrder, deletePurchaseOrder, addToast } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  // Form states
  const [ledger, setLedger] = useState('');
  const [number, setNumber] = useState('');
  const [date, setDate] = useState('');
  const [createdOn, setCreatedOn] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState<'PO Generated' | 'Send' | 'Pending'>('PO Generated');

  const openAddModal = () => {
    setSelectedPO(null);
    setLedger('');
    setNumber('');
    setDate(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    setCreatedOn(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    setExpectedDeliveryDate(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    setTotalAmount(0);
    setStatus('PO Generated');
    setIsModalOpen(true);
  };

  const openDeleteModal = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPO) {
      deletePurchaseOrder(selectedPO.id);
      addToast(`Purchase Order ${selectedPO.id} deleted successfully`, 'success');
    }
    setIsDeleteOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ledger) {
      addToast('Supplier Ledger is required', 'warning');
      return;
    }

    const newPO: PurchaseOrder = {
      id: selectedPO ? selectedPO.id : `PO1-${purchaseOrders.length + 1}`,
      ledger,
      number: number || '--',
      date,
      createdOn,
      expectedDeliveryDate,
      totalAmount: Number(totalAmount) || 0,
      status
    };

    if (selectedPO) {
      // For simplicity, we delete and re-insert the edited PO or just update it
      deletePurchaseOrder(selectedPO.id);
      addPurchaseOrder(newPO);
      addToast(`Purchase Order ${newPO.id} updated successfully`, 'success');
    } else {
      addPurchaseOrder(newPO);
      addToast(`Purchase Order ${newPO.id} created successfully`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleSendEmail = (po: PurchaseOrder) => {
    addToast(`Email sent to ${po.ledger} successfully`, 'success');
  };

  const handlePrint = (po: PurchaseOrder) => {
    addToast(`Print job sent for ${po.id} successfully`, 'success');
  };

  const openEditModal = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setLedger(po.ledger);
    setNumber(po.number);
    setDate(po.date);
    setCreatedOn(po.createdOn);
    setExpectedDeliveryDate(po.expectedDeliveryDate);
    setTotalAmount(po.totalAmount);
    setStatus(po.status);
    setIsModalOpen(true);
  };

  const columns: Column<PurchaseOrder>[] = [
    { header: '#', accessor: 'id' },
    { header: 'Ledger', accessor: 'ledger' },
    { header: 'Number', accessor: 'number' },
    { header: 'Date', accessor: 'date' },
    { header: 'Created On', accessor: 'createdOn' },
    { header: 'Expected Delivery Date', accessor: 'expectedDeliveryDate' },
    {
      header: 'Total Amount',
      render: (row) => (
        <span className="font-semibold text-gray-800">
          ₹{row.totalAmount.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Status',
      render: (row) => {
        const isSend = row.status === 'Send';
        return (
          <span
            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
              isSend
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {row.status}
          </span>
        );
      }
    },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleSendEmail(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-gray-250 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Mail className="w-3.5 h-3.5 text-gray-500" />
            Send Email
          </button>
          <button
            onClick={() => handlePrint(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-gray-250 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            Print
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-gray-250 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Edit2 className="w-3.5 h-3.5 text-gray-500" />
            Edit
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-red-100 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={inventorySidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <PageHeader title="Purchase Orders" subtitle="Create and monitor purchase orders sent to vendors">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </PageHeader>

        {/* DataTable list of POs */}
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={purchaseOrders}
            searchable={true}
            searchPlaceholder="Search purchase orders..."
            itemsPerPage={10}
          />
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-100 animate-scale-up">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-150 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-base">
                  {selectedPO ? 'Edit Purchase Order' : 'Create Purchase Order'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-gray-150/70 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Supplier Ledger *
                  </label>
                  <input
                    type="text"
                    required
                    value={ledger}
                    onChange={(e) => setLedger(e.target.value)}
                    placeholder="e.g. Caspian Caviar"
                    className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Supplier Contact Number
                    </label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="e.g. 9810344318"
                      className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Total Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      PO Date
                    </label>
                    <input
                      type="text"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Created On Date
                    </label>
                    <input
                      type="text"
                      required
                      value={createdOn}
                      onChange={(e) => setCreatedOn(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Expected Date
                    </label>
                    <input
                      type="text"
                      required
                      value={expectedDeliveryDate}
                      onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    PO Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                  >
                    <option value="PO Generated">PO Generated</option>
                    <option value="Send">Send</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-3 justify-end mt-2 pt-4 border-t border-gray-150">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={isDeleteOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteOpen(false)}
          title={`Delete Purchase Order "${selectedPO?.id}"?`}
          subtext="Warning: Deleting this purchase order cannot be undone. Are you sure?"
        />
      </main>
    </div>
  );
};
