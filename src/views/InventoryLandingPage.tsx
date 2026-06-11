import React from 'react';
import { SubSidebar } from '../components/SubSidebar';
import { PageHeader } from '../components/PageHeader';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export const inventorySidebarSections = [
  {
    label: 'Master',
    items: [
      { label: 'Vendors', href: '/inventory/setting/vendors' },
      { label: 'Inventory Overrides', href: '/inventory/setting/overrides' },
    ],
  },
  {
    label: 'Store',
    items: [
      { label: 'Purchase Invoices', href: '/inventory/store/invoices' },
      { label: 'Purchase Orders', href: '/inventory/store/orders' },
      { label: 'Purchase Returns', href: '/inventory/store/purchases/returns' },
      { label: 'Produced Stocks', href: '/inventory/store/productions' },
      { label: 'Consumptions', href: '/inventory/store/consumptions', locked: true },
      { label: 'Wastages', href: '/inventory/store/wastages', locked: true },
      { label: 'Indents', href: '/inventory/store/indents', locked: true },
      { label: 'Material Transfers', href: '/inventory/store/transfers', locked: true },
      { label: 'Department Transfers', href: '/inventory/store/dept-transfers', locked: true },
      { label: 'Audits', href: '/inventory/store/audits', locked: true },
      { label: 'Opening Stocks', href: '/inventory/store/opening-stocks', locked: true },
    ],
  },
  {
    label: 'Stock View',
    items: [
      { label: 'Stock View', href: '/inventory/view' },
      { label: 'Department-Wise Stock View', href: '/inventory/view/department', locked: true },
    ],
  },
  {
    label: 'Production',
    items: [
      { label: 'Received Indents', href: '/inventory/production/received', locked: true },
      { label: 'Internal Indenting', href: '/inventory/production/internal', locked: true },
      { label: 'Consolidated Indent', href: '/inventory/production/consolidated', locked: true },
      { label: 'Sale Invoices', href: '/inventory/production/sales', locked: true },
      { label: 'GRN', href: '/inventory/production/grn', locked: true },
      { label: 'Stock Return', href: '/inventory/production/returns', locked: true },
      { label: 'Credit Notes', href: '/inventory/production/credit-notes', locked: true },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Inventory Settings', href: '/inventory/setting' },
      { label: 'Expiry Item Details', href: '/inventory/setting/expiry' },
      { label: 'Departments', href: '/inventory/setting/departments' },
    ],
  },
];

export const InventoryLandingPage: React.FC = () => {
  return (
    <div className="flex h-full animate-fade-in">
      <SubSidebar sections={inventorySidebarSections} />

      <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-60px)] scrollbar-thin">
        <PageHeader title="Inventory Operations" subtitle="Manage stocks, purchase records, and audits">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </PageHeader>

        {/* Feature Cards Grid by Section */}
        <div className="flex flex-col gap-8">
          {inventorySidebarSections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="text-[11px] font-bold text-gray-400 mb-4 uppercase tracking-wider border-b pb-2">
                {section.label}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-md hover:border-blue-400 hover-scale transition-all duration-200 group relative overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 pr-4">
                      <h4 className="font-bold text-gray-800 text-xs tracking-wide group-hover:text-blue-600 transition-colors">
                        {item.label}
                      </h4>
                      {item.locked && (
                        <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full w-max mt-0.5">
                          Locked
                        </span>
                      )}
                    </div>

                    {!item.locked && (
                      <Link
                        to={item.href}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50/50 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg flex-shrink-0"
                      >
                        Manage
                        <Send className="w-2.5 h-2.5 text-blue-500" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
