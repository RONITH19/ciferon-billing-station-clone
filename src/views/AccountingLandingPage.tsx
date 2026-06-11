import React from 'react';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export const accountingSidebarSections = [
  {
    label: 'Accounting',
    items: [
      { label: 'Customers', href: '/accounts/customers' },
      { label: 'Credit Sales', href: '/accounts/credit-sales' },
      { label: 'Credit Purchases', href: '/accounts/credit-purchases' },
      { label: 'Expenses', href: '/accounts/expenses' },
      { label: 'Employees', href: '/accounts/employees' },
      { label: 'Bank', href: '/accounts/banks' },
    ],
  },
];

export const AccountingLandingPage: React.FC = () => {
  const cards = [
    { title: 'Customers', href: '/accounts/customers' },
    { title: 'Credit Sales', href: '/accounts/credit-sales' },
    { title: 'Credit Purchases', href: '/accounts/credit-purchases' },
    { title: 'Expenses', href: '/accounts/expenses' },
    { title: 'Employees', href: '/accounts/employees' },
    { title: 'Bank', href: '/accounts/banks' },
  ];

  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={accountingSidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-56px)] scrollbar-thin">
        <PageHeader title="Accounting">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </PageHeader>

        {/* Custom 4-Column Accounting Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.href}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-400 flex flex-col justify-between h-36 transition-all duration-150 hover-scale group"
            >
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {card.title}
              </h3>
              
              <div className="flex items-center justify-end gap-1.5 mt-auto">
                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-[-2px] transition-transform select-none">
                  Manage
                </span>
                <Send className="w-3.5 h-3.5 text-blue-500 transform -rotate-45 group-hover:translate-x-0.5 group-hover:translate-y-[-0.5px] transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};
