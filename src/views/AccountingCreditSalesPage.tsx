import React, { useState, useEffect } from 'react';
import { useStore, CreditSale } from '../store';
import { SubSidebar } from '../components/SubSidebar';
import { accountingSidebarSections } from './AccountingLandingPage';
import { PageHeader } from '../components/PageHeader';
import { DataTable, Column } from '../components/DataTable';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountingCreditSalesPage: React.FC = () => {
  const { creditSales, settleCreditSale, addToast } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomerWise, setShowCustomerWise] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSettle = (id: string, invoice: string) => {
    settleCreditSale(id);
    addToast(`Invoice ${invoice} settled successfully`, 'success');
  };

  const handleSendReminder = (customer: string) => {
    addToast(`WhatsApp/SMS payment reminder sent to "${customer}"`, 'success');
  };

  // Calculate pending counts & total due balance
  const pendingBillsCount = creditSales.filter((s) => s.balanceAmount > 0).length;
  const totalDueAmount = creditSales.reduce((acc, curr) => acc + curr.balanceAmount, 0);

  const columns: Column<CreditSale>[] = [
    {
      header: 'Invoice No.',
      accessor: 'invoiceNo',
      render: (row) => (
        <span className="text-blue-600 font-bold hover:underline cursor-pointer">
          {row.invoiceNo}
        </span>
      ),
    },
    { header: 'Customer', accessor: 'customer' },
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSettle(row.id, row.invoiceNo)}
            disabled={row.balanceAmount === 0}
            className="px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:hover:bg-white"
          >
            Settle
          </button>
          <button
            onClick={() => handleSendReminder(row.customer)}
            className="px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            Send Reminder
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={accountingSidebarSections} />

      <main className="flex-grow p-4 md:p-6 overflow-y-auto h-[calc(100vh-56px)] scrollbar-thin">
        <PageHeader title="Credit Sales">
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
            
            {/* Custom Search Filter Panel with Customer Wise Toggle */}
            <div className="flex justify-end mb-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm select-none">
                <span className="text-xs font-bold text-gray-600">Show Customer Wise</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomerWise(!showCustomerWise);
                    addToast(`Filter showCustomerWise set to ${!showCustomerWise}`, 'info');
                  }}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-250 ${
                    showCustomerWise ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-250 ${
                      showCustomerWise ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={creditSales}
              isLoading={isLoading}
              searchPlaceholder="Search credit sales..."
              searchKey="customer"
              itemsPerPage={6}
            />
          </div>

          {/* Right Panel: Summary Sidecards (col-span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-2">
              Credit Sales Summary
            </h3>

            {/* Pending count card */}
            <div className="bg-gray-100/70 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between h-28">
              <span className="text-3xl font-black text-blue-600">{pendingBillsCount}</span>
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
