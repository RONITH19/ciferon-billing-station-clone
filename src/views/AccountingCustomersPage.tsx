import React, { useState, useEffect } from 'react';
import { useStore, AccountingCustomer } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { accountingSidebarSections } from './AccountingLandingPage';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Edit2, Trash2, X, Check, ArrowLeft, Download, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountingCustomersPage: React.FC = () => {
  const {
    accountingCustomers,
    addAccountingCustomer,
    updateAccountingCustomer,
    deleteAccountingCustomer,
    addToast
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Form modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeCustId, setActiveCustId] = useState<string | null>(null);

  // Inputs
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState(0);
  const [spend, setSpend] = useState(0);
  const [orders, setOrders] = useState(1);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenAdd = () => {
    setEditMode(false);
    setName('');
    setMobile('');
    setEmail('--');
    setBalance(0);
    setSpend(0);
    setOrders(1);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cust: AccountingCustomer) => {
    setEditMode(true);
    setActiveCustId(cust.id);
    setName(cust.name);
    setMobile(cust.mobile);
    setEmail(cust.email);
    setBalance(cust.balance);
    setSpend(cust.totalSpend);
    setOrders(cust.totalOrders);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Customer Name is required', 'warning');
      return;
    }
    if (!mobile.trim()) {
      addToast('Mobile No. is required', 'warning');
      return;
    }

    if (editMode && activeCustId) {
      updateAccountingCustomer(activeCustId, {
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        balance,
        totalSpend: spend,
        totalOrders: orders,
      });
      addToast('Customer record updated successfully', 'success');
    } else {
      const newCust: AccountingCustomer = {
        id: Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        lastVisited: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        totalSpend: spend,
        totalOrders: orders,
        balance,
      };
      addAccountingCustomer(newCust);
      addToast('Customer record created successfully', 'success');
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setSelectedCustomerId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCustomerId) {
      deleteAccountingCustomer(selectedCustomerId);
      addToast('Customer record deleted successfully', 'success');
    }
    setIsDeleteOpen(false);
    setSelectedCustomerId(null);
  };

  const handleExport = () => {
    addToast('Exporting accounting customers list to CSV...', 'success');
  };

  const columns: Column<AccountingCustomer>[] = [
    {
      header: 'Name',
      render: (row) => <span className="font-bold text-gray-800">{row.name}</span>,
    },
    { header: 'Mobile No.', accessor: 'mobile' },
    { header: 'Email', accessor: 'email' },
    { header: 'Last Visited On', accessor: 'lastVisited' },
    {
      header: 'Total Spend',
      render: (row) => <span>{row.totalSpend}</span>,
    },
    { header: 'Total Orders', accessor: 'totalOrders' },
    {
      header: 'Balance',
      render: (row) => <span>{row.balance}</span>,
    },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-2">
          {/* Outlined Edit button matching screenshot 1 */}
          <button
            onClick={() => handleOpenEdit(row)}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-sm"
            title="Edit Customer"
          >
            <Edit2 className="w-3 h-3 text-gray-400" />
            Edit
          </button>
          
          {/* Outlined Delete button matching screenshot 1 */}
          <button
            onClick={() => handleOpenDelete(row.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-red-600 text-xs font-bold rounded-lg transition-colors shadow-sm"
            title="Delete Customer"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={accountingSidebarSections} />

      <main className="flex-grow p-4 md:p-6 overflow-y-auto h-[calc(100vh-56px)] scrollbar-thin">
        {/* Header container styled matching screenshot 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 mb-5 gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
              Customers
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1 px-4 py-2 border border-blue-600 hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              New
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-100 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Add/Edit Modal Form */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full overflow-hidden p-6 animate-scale-up"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-gray-900">
                  {editMode ? 'Edit Customer Info' : 'New Customer'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter customer name..."
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
                    Mobile No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter phone number..."
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address..."
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 truncate">
                      Spend Amount
                    </label>
                    <input
                      type="number"
                      value={spend || ''}
                      onChange={(e) => setSpend(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 truncate">
                      Orders Count
                    </label>
                    <input
                      type="number"
                      value={orders || ''}
                      onChange={(e) => setOrders(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1 truncate">
                      Balance Due
                    </label>
                    <input
                      type="number"
                      value={balance || ''}
                      onChange={(e) => setBalance(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 transition-all text-xs"
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
          data={accountingCustomers}
          isLoading={isLoading}
          searchPlaceholder="Search"
          searchKey="name"
          itemsPerPage={12} // Matches the screenshot size
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
