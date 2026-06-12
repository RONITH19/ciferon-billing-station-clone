import React, { useEffect } from 'react';
import { createHashRouter, RouterProvider, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from './store';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';

// Pages
import { OutletsPage } from './views/OutletsPage';
import { DashboardPage } from './views/DashboardPage';
import { ChargesPage } from './views/ChargesPage';
import { KitchensListPage } from './views/KitchensListPage';
import { EditKitchenPage } from './views/EditKitchenPage';
import { InventoryLandingPage } from './views/InventoryLandingPage';
import { ProducedStocksPage } from './views/ProducedStocksPage';
import { PurchaseReturnsPage } from './views/PurchaseReturnsPage';
import { DepartmentsPage } from './views/DepartmentsPage';
import { InventoryVendorsPage } from './views/InventoryVendorsPage';
import { InventoryOverridesPage } from './views/InventoryOverridesPage';
import { InventoryPurchaseOrdersPage } from './views/InventoryPurchaseOrdersPage';
import { InventoryPurchaseInvoicesPage } from './views/InventoryPurchaseInvoicesPage';
import { StockViewPage } from './views/StockViewPage';
import { ExpiryItemDetailsPage } from './views/ExpiryItemDetailsPage';
import { InventorySettingsPage } from './views/InventorySettingsPage';
import { BookletsPage } from './views/BookletsPage';
import { CreateBookletPage } from './views/CreateBookletPage';
import { OffersLandingPage } from './views/OffersLandingPage';
import { OffersListPage } from './views/OffersListPage';
import { OffersQRListPage } from './views/OffersQRListPage';
import { CreateEditOfferQRPage } from './views/CreateEditOfferQRPage';
import { LoyaltyPlansPage } from './views/LoyaltyPlansPage';
import { CreateLoyaltyPlanPage } from './views/CreateLoyaltyPlanPage';
import { LoyaltyRedemptionPage } from './views/LoyaltyRedemptionPage';
import { CreateLoyaltyRedemptionPage } from './views/CreateLoyaltyRedemptionPage';
import { ScanAndOrderPage } from './views/ScanAndOrderPage';
import { LoyaltySettingsPage } from './views/LoyaltySettingsPage';
import { FeedbackCommentsPage } from './views/FeedbackCommentsPage';
import { FeedbackInsightsPage } from './views/FeedbackInsightsPage';
import { ReportsPage } from './views/ReportsPage';
import { MessageSettingsPage } from './views/MessageSettingsPage';
import { POSSettingsPage } from './views/POSSettingsPage';
import { CancelOrdersPage } from './views/CancelOrdersPage';
import { TimewatchKeyPage } from './views/TimewatchKeyPage';
import { PlaceholderPage } from './views/PlaceholderPage';

// Accounting Pages
import { AccountingLandingPage } from './views/AccountingLandingPage';
import { AccountingCustomersPage } from './views/AccountingCustomersPage';
import { AccountingCreditSalesPage } from './views/AccountingCreditSalesPage';
import { AccountingCreditPurchasesPage } from './views/AccountingCreditPurchasesPage';
import { AccountingExpensesPage } from './views/AccountingExpensesPage';
import { AccountingEmployeesPage } from './views/AccountingEmployeesPage';
import { AccountingBanksPage } from './views/AccountingBanksPage';

// Responsive Layout wrapper
const AppLayout: React.FC = () => {
  const { currentOutlet, loadDatabaseData } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadDatabaseData();
  }, [loadDatabaseData]);

  useEffect(() => {
    if (!currentOutlet && location.pathname !== '/business') {
      navigate('/business', { replace: true });
    }
  }, [currentOutlet, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Topbar */}
      <Topbar />

      {/* Main Body */}
      <div className="flex flex-1 pt-14 relative overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Workspace Content Area */}
        <div className="flex-grow h-[calc(100vh-56px)] overflow-hidden pl-[60px]">
          <div className="h-full w-full overflow-y-auto bg-gray-50">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Global Toasts */}
      <ToastContainer />
    </div>
  );
};

// Route Configuration
const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/business" replace /> },
      { path: 'business', element: <OutletsPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      
      // Menu Catalogue
      { path: 'catalogue', element: <Navigate to="/catalogue/charges" replace /> },
      { path: 'catalogue/charges', element: <ChargesPage /> },
      { path: 'catalogue/kitchens', element: <KitchensListPage /> },
      { path: 'catalogue/kitchens/new', element: <EditKitchenPage /> },
      { path: 'catalogue/printers/update/:id', element: <EditKitchenPage /> },

      // Inventory
      { path: 'inventory', element: <Navigate to="/inventory/landing" replace /> },
      { path: 'inventory/landing', element: <InventoryLandingPage /> },
      { path: 'inventory/setting/vendors', element: <InventoryVendorsPage /> },
      { path: 'inventory/setting/overrides', element: <InventoryOverridesPage /> },
      { path: 'inventory/store/invoices', element: <InventoryPurchaseInvoicesPage /> },
      { path: 'inventory/store/orders', element: <InventoryPurchaseOrdersPage /> },
      { path: 'inventory/store/productions', element: <ProducedStocksPage /> },
      { path: 'inventory/store/purchases/returns', element: <PurchaseReturnsPage /> },
      { path: 'inventory/setting/departments', element: <DepartmentsPage /> },
      { path: 'inventory/view', element: <StockViewPage /> },
      { path: 'inventory/setting/expiry', element: <ExpiryItemDetailsPage /> },
      { path: 'inventory/setting', element: <InventorySettingsPage /> },

      // CRM / Offers / Feedback
      { path: 'offers', element: <OffersLandingPage /> },
      { path: 'offers/list', element: <OffersListPage /> },
      { path: 'offers/bookletlist', element: <BookletsPage /> },
      { path: 'offers/bookletlist/new', element: <CreateBookletPage /> },
      { path: 'offers/qr', element: <OffersQRListPage /> },
      { path: 'offers/qr/new', element: <CreateEditOfferQRPage /> },
      { path: 'offers/qr/edit/:id', element: <CreateEditOfferQRPage /> },
      { path: 'loyalty/plans', element: <LoyaltyPlansPage /> },
      { path: 'loyalty/plans/new', element: <CreateLoyaltyPlanPage /> },
      { path: 'loyalty/redemption', element: <LoyaltyRedemptionPage /> },
      { path: 'loyalty/redemption/new', element: <CreateLoyaltyRedemptionPage /> },
      { path: 'loyalty/setting', element: <LoyaltySettingsPage /> },
      { path: 'feedback/insights', element: <FeedbackInsightsPage /> },
      { path: 'feedback/comments', element: <FeedbackCommentsPage /> },

      // Scan and Order
      { path: 'scan-order', element: <ScanAndOrderPage /> },

      // Accounting
      { path: 'accounts', element: <Navigate to="/accounts/landing" replace /> },
      { path: 'accounts/landing', element: <AccountingLandingPage /> },
      { path: 'accounts/customers', element: <AccountingCustomersPage /> },
      { path: 'accounts/credit-sales', element: <AccountingCreditSalesPage /> },
      { path: 'accounts/credit-purchases', element: <AccountingCreditPurchasesPage /> },
      { path: 'accounts/expenses', element: <AccountingExpensesPage /> },
      { path: 'accounts/employees', element: <AccountingEmployeesPage /> },
      { path: 'accounts/banks', element: <AccountingBanksPage /> },

      // Reports
      { path: 'reports', element: <ReportsPage /> },

      // Settings
      { path: 'settings', element: <Navigate to="/settings/message-setting" replace /> },
      { path: 'settings/message-setting', element: <MessageSettingsPage /> },
      { path: 'settings/pos-setting', element: <POSSettingsPage /> },
      { path: 'settings/order-cancel', element: <CancelOrdersPage /> },
      { path: 'settings/timewatchturnstilekey', element: <TimewatchKeyPage /> },

      // Fallback for stubs
      { path: '*', element: <PlaceholderPage /> }
    ],
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};
