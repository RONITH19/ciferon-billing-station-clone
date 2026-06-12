import React, { useState } from 'react';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { inventorySidebarSections } from './InventoryLandingPage';
import { useStore, PurchaseInvoice } from '../store';
import { Printer, Edit2, Trash2, X, Plus, CheckCircle2 } from 'lucide-react';

export const InventoryPurchaseInvoicesPage: React.FC = () => {
  const { purchaseInvoices, addPurchaseInvoice, payPurchaseInvoice, deletePurchaseInvoice, addToast } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);

  // Form states
  const [billRefNo, setBillRefNo] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [number, setNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [createdOn, setCreatedOn] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);
  const [status, setStatus] = useState<'Received' | 'Pending' | 'Draft'>('Received');

  const openAddModal = () => {
    setSelectedInvoice(null);
    setBillRefNo('');
    setVendorName('');
    setNumber('');
    setInvoiceDate(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    setCreatedOn(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    setPaymentDueDate('--');
    setGrandTotal(0);
    setStatus('Received');
    setIsModalOpen(true);
  };

  const openDeleteModal = (inv: PurchaseInvoice) => {
    setSelectedInvoice(inv);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedInvoice) {
      deletePurchaseInvoice(selectedInvoice.id);
      addToast(`Purchase Invoice ${selectedInvoice.id} deleted successfully`, 'success');
    }
    setIsDeleteOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName) {
      addToast('Vendor Name is required', 'warning');
      return;
    }

    const newInvoice: PurchaseInvoice = {
      id: selectedInvoice ? selectedInvoice.id : `PI-${purchaseInvoices.length + 10}`,
      billRefNo: billRefNo || '--',
      vendorName,
      number: number || '--',
      invoiceDate,
      createdOn,
      paymentDueDate: paymentDueDate || '--',
      grandTotal: Number(grandTotal) || 0,
      status,
      balance: selectedInvoice ? selectedInvoice.balance : Number(grandTotal) || 0,
      settlement: selectedInvoice ? selectedInvoice.settlement : (Number(grandTotal) > 0 ? 'Pay' : 'Settled')
    };

    if (selectedInvoice) {
      deletePurchaseInvoice(selectedInvoice.id);
      addPurchaseInvoice(newInvoice);
      addToast(`Purchase Invoice ${newInvoice.id} updated successfully`, 'success');
    } else {
      addPurchaseInvoice(newInvoice);
      addToast(`Purchase Invoice ${newInvoice.id} created successfully`, 'success');
    }
    setIsModalOpen(false);
  };

  const handlePay = (inv: PurchaseInvoice) => {
    payPurchaseInvoice(inv.id);
    addToast(`Payment settled for ${inv.id} successfully`, 'success');
  };

  const handlePrint = (inv: PurchaseInvoice) => {
    addToast(`Invoice ${inv.id} sent to print successfully`, 'success');
  };

  const openEditModal = (inv: PurchaseInvoice) => {
    setSelectedInvoice(inv);
    setBillRefNo(inv.billRefNo);
    setVendorName(inv.vendorName);
    setNumber(inv.number);
    setInvoiceDate(inv.invoiceDate);
    setCreatedOn(inv.createdOn);
    setPaymentDueDate(inv.paymentDueDate);
    setGrandTotal(inv.grandTotal);
    setStatus(inv.status as 'Received' | 'Pending' | 'Draft');
    setIsModalOpen(true);
  };

  const columns: Column<PurchaseInvoice>[] = [
    { header: '#', accessor: 'id' },
    { header: 'Bill/Reference Number', accessor: 'billRefNo' },
    { header: 'Vendor Name', accessor: 'vendorName' },
    { header: 'Number', accessor: 'number' },
    { header: 'Invoice Date', accessor: 'invoiceDate' },
    { header: 'Created On', accessor: 'createdOn' },
    { header: 'Payment Due Date', accessor: 'paymentDueDate' },
    {
      header: 'Grand Total',
      render: (row) => (
        <span className="font-semibold text-gray-800">
          ₹{row.grandTotal.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
          {row.status}
        </span>
      )
    },
    {
      header: 'Balance',
      render: (row) => (
        <span className={`font-semibold ${row.balance > 0 ? 'text-red-600' : 'text-gray-500'}`}>
          ₹{row.balance.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Settlement',
      render: (row) => {
        if (row.balance === 0 || row.settlement === 'Settled') {
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-xl shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settled
            </span>
          );
        }
        return (
          <button
            onClick={() => handlePay(row)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-green-50 text-green-600 border border-green-500 hover:border-green-600 text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Pay
          </button>
        );
      }
    },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePrint(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-gray-250 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition-all animate-hover"
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
        <PageHeader title="Purchase Invoices" subtitle="Track product deliveries, bill receipts, and supplier settlements">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-100 transition-all"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </PageHeader>

        {/* Purchase Invoices list table */}
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={purchaseInvoices}
            searchable={true}
            searchPlaceholder="Search invoices by vendor name or reference..."
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
                  {selectedInvoice ? 'Edit Purchase Invoice' : 'Create Purchase Invoice'}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Bill Reference Number
                    </label>
                    <input
                      type="text"
                      value={billRefNo}
                      onChange={(e) => setBillRefNo(e.target.value)}
                      placeholder="e.g. 23102"
                      className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Vendor Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      placeholder="e.g. Caspian Caviar"
                      className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Vendor Contact Number
                    </label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="e.g. 9810344338"
                      className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Grand Total (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={grandTotal}
                      onChange={(e) => setGrandTotal(Number(e.target.value))}
                      className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Invoice Date
                    </label>
                    <input
                      type="text"
                      required
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
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
                      Payment Due Date
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentDueDate}
                      onChange={(e) => setPaymentDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Invoice Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-gray-250 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-700"
                  >
                    <option value="Received">Received</option>
                    <option value="Pending">Pending</option>
                    <option value="Draft">Draft</option>
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
          title={`Delete Purchase Invoice "${selectedInvoice?.id}"?`}
          subtext="Warning: Deleting this invoice will remove its ledger and balance logs permanently."
        />
      </main>
    </div>
  );
};
