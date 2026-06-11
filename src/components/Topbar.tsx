import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStore } from '../store';
import { OutletSwitcher } from './OutletSwitcher';
import { Navigation, Headphones, Home, HelpCircle } from 'lucide-react';

export const Topbar: React.FC = () => {
  const location = useLocation();
  const { currentOutlet, addToast } = useStore();

  // Dynamically calculate page title from current route path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/business')) return 'Outlets';
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/catalogue/charges')) return 'Charges';
    if (path.startsWith('/catalogue/kitchens')) return 'Kitchens';
    if (path.startsWith('/catalogue/printers/update')) return 'Edit Kitchen';
    if (path.startsWith('/accounts')) return 'Accounting';
    if (path.startsWith('/inventory/landing')) return 'Inventory';
    if (path.startsWith('/inventory/store/productions')) return 'Produced Stocks';
    if (path.startsWith('/inventory/store/purchases/returns')) return 'Purchase Returns';
    if (path.startsWith('/inventory/setting/departments')) return 'Departments';
    if (path.startsWith('/offers/bookletlist')) return 'Booklets';
    if (path.startsWith('/loyalty/setting')) return 'Loyalty Setting';
    if (path.startsWith('/feedback/comments')) return 'Feedback Comments';
    if (path.startsWith('/reports')) return 'Reports';
    if (path.startsWith('/settings/message-setting')) return 'Message Setting';
    if (path.startsWith('/settings/pos-setting')) return 'POS Setting';
    if (path.startsWith('/settings/order-cancel')) return 'Cancel Orders';
    if (path.startsWith('/settings/timewatchturnstilekey')) return 'Timewatch Integration';
    return 'Sobos';
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-[990] flex items-center justify-between px-4 select-none">
      {/* Left side: Logo + dynamic Page Title */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Link to="/business" className="w-8 h-8 rounded-full bg-sobos-navy flex items-center justify-center shadow-md">
          <span className="text-white font-extrabold text-sm">C</span>
        </Link>
        
        {/* Separator line */}
        <div className="h-5 w-[1px] bg-gray-300 hidden sm:block" />

        {/* Dynamic Page Title */}
        <span className="font-bold text-lg text-gray-800 tracking-tight hidden sm:block">
          {getPageTitle()}
        </span>
      </div>

      {/* Right side widgets */}
      <div className="flex items-center gap-4">
        {/* Outlet Switcher */}
        {currentOutlet && <OutletSwitcher />}

        {/* Home Link */}
        {currentOutlet && (
          <Link
            to="/dashboard"
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors"
            title="Dashboard Home"
          >
            <Home className="w-4.5 h-4.5" />
          </Link>
        )}

        {/* Navigation pointer */}
        <button
          onClick={() => addToast('Navigation tools', 'info')}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition-colors"
          title="Navigation"
        >
          <Navigation className="w-4.5 h-4.5" />
        </button>

        {/* Support Link */}
        <button
          onClick={() => addToast('Connecting to support...', 'info')}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-xs font-semibold hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
        >
          <span>Support</span>
          <Headphones className="w-4 h-4 text-gray-400" />
        </button>

        {/* Avatar circle (blue with C) */}
        <div
          onClick={() => addToast('Logged in as Sobos Trial Admin', 'info')}
          className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 text-xs font-bold cursor-pointer hover:bg-blue-100 transition-colors"
          title="Profile"
        >
          C
        </div>
      </div>
    </header>
  );
};
