import React, { useState, useEffect } from 'react';
import { useStore, ExpenseRecord } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { accountingSidebarSections } from './AccountingLandingPage';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { Edit2, Trash2, X, Check, ArrowLeft, Plus, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountingExpensesPage: React.FC = () => {
  const { expensesList, addExpenseRecord, updateExpenseRecord, deleteExpenseRecord, addToast } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  // Form modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeExpId, setActiveExpId] = useState<string | null>(null);

  // Input states
  const [paidTo, setPaidTo] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);
  const [itemsCount, setItemsCount] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenAdd = () => {
    setEditMode(false);
    setPaidTo('');
    setGrandTotal(0);
    setItemsCount(1);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (exp: ExpenseRecord) => {
    setEditMode(true);
    setActiveExpId(exp.id);
    setPaidTo(exp.paidTo);
    setGrandTotal(exp.grandTotal);
    setItemsCount(exp.itemsCount);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paidTo.trim()) {
      addToast('Recipient/Paid To name is required', 'warning');
      return;
    }

    if (editMode && activeExpId) {
      updateExpenseRecord(activeExpId, {
        paidTo: paidTo.trim(),
        grandTotal,
        itemsCount,
      });
      addToast('Expense updated successfully', 'success');
    } else {
      const newIndex = expensesList.length + 11;
      const newExp: ExpenseRecord = {
        id: Math.random().toString(36).substring(2, 9),
        expenseNo: `E-${newIndex}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        paidTo: paidTo.trim(),
        grandTotal,
        itemsCount,
      };
      addExpenseRecord(newExp);
      addToast(`Expense ${newExp.expenseNo} created successfully`, 'success');
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setSelectedExpenseId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpenseId) {
      deleteExpenseRecord(selectedExpenseId);
      addToast('Expense record deleted', 'success');
    }
    setIsDeleteOpen(false);
    setSelectedExpenseId(null);
  };

  const columns: Column<ExpenseRecord>[] = [
    {
      header: '#',
      accessor: 'expenseNo',
      render: (row) => <span className="font-bold text-gray-500">{row.expenseNo}</span>,
    },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Paid To',
      accessor: 'paidTo',
      render: (row) => <span className="font-bold text-gray-800">{row.paidTo}</span>,
    },
    {
      header: 'Grand Total',
      render: (row) => <span>{row.grandTotal}</span>,
    },
    { header: 'Expense Items', accessor: 'itemsCount' },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <Edit2 className="w-3 h-3 text-gray-400" />
            Edit
          </button>
          <button
            onClick={() => handleOpenDelete(row.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-red-600 text-xs font-bold rounded-lg transition-colors shadow-sm"
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
        {/* Header container styled matching screenshot 3 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 mb-5 gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
              Expenses
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              to="/accounts/landing"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1 px-4 py-2 border border-blue-600 hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              New
            </button>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full overflow-hidden p-6 animate-scale-up"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-gray-900">
                  {editMode ? 'Edit Expense Record' : 'New Expense'}
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
                    Paid To / Recipient <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paidTo}
                    onChange={(e) => setPaidTo(e.target.value)}
                    placeholder="e.g. Divya"
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
                    Grand Total (₹)
                  </label>
                  <input
                    type="number"
                    value={grandTotal || ''}
                    onChange={(e) => setGrandTotal(Number(e.target.value))}
                    placeholder="Enter total amount..."
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
                    Expense Items Count
                  </label>
                  <input
                    type="number"
                    value={itemsCount || ''}
                    onChange={(e) => setItemsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Table (col-span 9) */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            <DataTable
              columns={columns}
              data={expensesList}
              isLoading={isLoading}
              searchPlaceholder="Search expenses..."
              searchKey="paidTo"
              itemsPerPage={10}
            />
          </div>

          {/* Right Panel: Expense Dashboard (col-span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-2">
              Expense Dashboard
            </h3>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-100/70 border border-gray-200 rounded-xl p-3 flex flex-col justify-between h-20">
                <span className="text-xl font-black text-blue-600">0</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase">Today</span>
              </div>
              <div className="bg-gray-100/70 border border-gray-200 rounded-xl p-3 flex flex-col justify-between h-20">
                <span className="text-xl font-black text-blue-600">0</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase">Yesterday</span>
              </div>
              <div className="bg-gray-100/70 border border-gray-200 rounded-xl p-3 flex flex-col justify-between h-20">
                <span className="text-xl font-black text-blue-600">0</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase">This Week</span>
              </div>
              <div className="bg-gray-100/70 border border-gray-200 rounded-xl p-3 flex flex-col justify-between h-20">
                <span className="text-xl font-black text-blue-600">0</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase">This Month</span>
              </div>
            </div>

            {/* Detail Report Button */}
            <button
              onClick={() => addToast('Detail expense report ledger generated.', 'success')}
              className="w-full py-2.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl shadow-sm transition-colors text-center"
            >
              Detail Report
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};
