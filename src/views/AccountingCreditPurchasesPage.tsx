import React, { useState, useEffect } from 'react';
import { useStore, CreditPurchase } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { accountingSidebarSections } from './AccountingLandingPage';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountingCreditPurchasesPage: React.FC = () => {
  const { creditPurchases, payCreditPurchase, addToast } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePay = (id: string, invoice: string) => {
    payCreditPurchase(id);
    addToast(`Paid and settled purchase invoice ${invoice}`, 'success');
  };

  // Calculate pending counts & total due balance
  const pendingBillsCount = creditPurchases.filter((p) => p.balanceAmount > 0).length;
  const totalDueAmount = creditPurchases.reduce((acc, curr) => acc + curr.balanceAmount, 0);

  const columns: Column<CreditPurchase>[] = [
    {
      header: 'Invoice No.',
      accessor: 'invoiceNo',
      render: (row) => (
        <span className="text-blue-600 font-bold hover:underline cursor-pointer">
          {row.invoiceNo}
        </span>
      ),
    },
    { header: 'Vendor Name', accessor: 'vendorName' },
    {
      header: 'Total Amount',
      render: (row) => <span>{row.totalAmount}</span>,
    },
    {
      header: 'Balance Amount',
      render: (row) => (
        <span className={row.balanceAmount > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
          {row.balanceAmount}
        </span>
      ),
    },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Action',
      render: (row) => (
        <button
          onClick={() => handlePay(row.id, row.invoiceNo)}
          disabled={row.balanceAmount === 0}
          className="px-4 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:hover:bg-white"
        >
          Pay
        </button>
      ),
    },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={accountingSidebarSections} />

      <main className="flex-grow p-4 md:p-6 overflow-y-auto h-[calc(100vh-56px)] scrollbar-thin">
        <PageHeader title="Credit Purchases">
          <Link
            to="/accounts/landing"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Table (col-span 9) */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            <DataTable
              columns={columns}
              data={creditPurchases}
              isLoading={isLoading}
              searchPlaceholder="Search credit purchases..."
              searchKey="vendorName"
              itemsPerPage={10} // Matches the screenshot size
            />
          </div>

          {/* Right Panel: Summary Sidecards (col-span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-2">
              Credit Purchase Summary
            </h3>

            {/* Pending count card */}
            <div className="bg-gray-100/70 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between h-28">
              <span className="text-3xl font-black text-blue-600">51</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Pending Bills
              </span>
            </div>

            {/* Total due card */}
            <div className="bg-gray-100/70 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between h-28">
              <span className="text-3xl font-black text-blue-600">₹{totalDueAmount}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Total Due
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
