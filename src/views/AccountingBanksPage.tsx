import React, { useState, useEffect } from 'react';
import { useStore, BankAccount } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { accountingSidebarSections } from './AccountingLandingPage';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ArrowLeft, Plus, X, Check, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountingBanksPage: React.FC = () => {
  const { bankAccounts, addBankAccount, updateBankAccount, depositBank, addToast } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  // Form modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeBankId, setActiveBankId] = useState<string | null>(null);

  // Deposit modal states
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);

  // Input states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenAdd = () => {
    setEditMode(false);
    setName('');
    setMobile('No contact');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (bank: BankAccount) => {
    setEditMode(true);
    setActiveBankId(bank.id);
    setName(bank.name);
    setMobile(bank.mobile);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Account Name is required', 'warning');
      return;
    }

    if (editMode && activeBankId) {
      updateBankAccount(activeBankId, {
        name: name.trim(),
        mobile: mobile.trim(),
      });
      addToast('Bank account details saved', 'success');
    } else {
      const newBank: BankAccount = {
        id: Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        mobile: mobile.trim(),
      };
      addBankAccount(newBank);
      addToast(`Bank account "${newBank.name}" added`, 'success');
    }
    setIsFormOpen(false);
  };

  const handleOpenDeposit = (id: string, bankName: string) => {
    setActiveBankId(id);
    setName(bankName);
    setDepositAmount(0);
    setIsDepositOpen(true);
  };

  const handleConfirmDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) {
      addToast('Please enter an amount greater than 0', 'warning');
      return;
    }
    if (activeBankId) {
      depositBank(activeBankId, depositAmount);
    }
    setIsDepositOpen(false);
  };

  const columns: Column<BankAccount>[] = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => <span className="font-bold text-gray-800">{row.name}</span>,
    },
    { header: 'Mobile', accessor: 'mobile' },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex items-center gap-2">
          {/* Deposit action button matching screenshot 5 */}
          <button
            onClick={() => handleOpenDeposit(row.id, row.name)}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <Landmark className="w-3.5 h-3.5 text-gray-400" />
            Deposit
          </button>
          
          <button
            onClick={() => handleOpenEdit(row)}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={accountingSidebarSections} />

      <main className="flex-grow p-4 md:p-6 overflow-y-auto h-[calc(100vh-56px)] scrollbar-thin">
        {/* Header container styled matching screenshot 5 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 mb-5 gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
              Bank
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
                  {editMode ? 'Edit Account Info' : 'New Bank/Gateway Account'}
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
                    Account/Gateway Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. HDFC Current Account, Swiggy Gateway"
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
                    Mobile / Contact Info
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
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

        {/* Deposit Modal */}
        {isDepositOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <form
              onSubmit={handleConfirmDeposit}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-sm w-full overflow-hidden p-6 animate-scale-up"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-base font-bold text-gray-900">
                  Bank Deposit: {name}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDepositOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">
                  Deposit Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={depositAmount || ''}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  placeholder="Enter deposit amount..."
                  className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsDepositOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 transition-all text-xs"
                >
                  <Check className="w-4 h-4" />
                  Deposit
                </button>
              </div>
            </form>
          </div>
        )}

        <DataTable
          columns={columns}
          data={bankAccounts}
          isLoading={isLoading}
          searchPlaceholder="Search bank accounts..."
          searchKey="name"
          itemsPerPage={10}
        />
      </main>
    </div>
  );
};
