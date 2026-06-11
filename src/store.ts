import { create } from 'zustand';
import {
  apiList,
  apiCreate,
  apiUpdate,
  apiDelete,
  apiGetSettings,
  apiSaveSettings,
} from '../lib/api-client';

export interface Charge {
  id: string;
  name: string;
}

export interface KitchenMenuItem {
  id: string;
  name: string;
}

export interface Kitchen {
  id: string;
  name: string;
  description: string;
  disablePrints: boolean;
  mainPrinterName: string;
  mainPrinterType: string;
  altPrinterName: string;
  altPrinterType: string;
  dineInTokenPrinter: string;
  pickupPrinterName: string;
  deliveryPrinterName: string;
  menuItems: KitchenMenuItem[];
}

export interface ProducedStock {
  id: string; // SRL-5
  date: string;
  status: string; // Open, Completed
}

export interface Department {
  id: string;
  name: string;
}

export interface Booklet {
  id: string;
  name: string;
}

export interface LoyaltySetting {
  programName: string;
  enabled: boolean;
  pointsPerRupee: number;
  pointsPerRupeeBirthday: number;
  pointsPerRupeeAnniversary: number;
  rupeesPerPoint: number;
  minPointsForReward: number;
  maxPointsRedeemPercent: number;
  expiryDays: number;
  askOtpOnRedemption: boolean;
  enablePointsOnOrderTotal: boolean;
  allowOfferLoyaltyTogether: boolean;
}

export interface FeedbackComment {
  id: string;
  customer: string;
  comments: string;
  date: string;
}

export interface MessageAlertRow {
  id: string;
  name: string;
  channel: 'off' | 'whatsapp' | 'sms' | 'ereceipt_feedback';
}

export interface POSSetting {
  printBrandOnline: boolean;
  printOutletBill: boolean;
  enableRegularToken: boolean;
  printBillKotTogether: boolean;
  enableKotToken: boolean;
  enableKotReprint: boolean;
  disableBillToken: boolean;
  maskCustomerNumber: boolean;
}

export interface TimewatchKey {
  apiKey: string;
  ipAddress: string;
  isActive: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface AccountingCustomer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  lastVisited: string;
  totalSpend: number;
  totalOrders: number;
  balance: number;
}

export interface CreditSale {
  id: string;
  invoiceNo: string;
  customer: string;
  totalAmount: number;
  balanceAmount: number;
  date: string;
}

export interface CreditPurchase {
  id: string;
  invoiceNo: string;
  vendorName: string;
  totalAmount: number;
  balanceAmount: number;
  date: string;
}

export interface ExpenseRecord {
  id: string;
  expenseNo: string; // E-11
  date: string;
  paidTo: string;
  grandTotal: number;
  itemsCount: number;
}

export interface Employee {
  id: string;
  name: string;
  mobile: string;
  designation: string;
}

export interface BankAccount {
  id: string;
  name: string;
  mobile: string;
}

export interface InventoryVendor {
  id: string;
  name: string;
  mobile: string;
  email: string;
  gstNo: string;
  balance: number;
  department: string;
}

export interface InventoryOverride {
  id: string;
  name: string;
  code: string;
  category: string;
  minStock: string;
}

export interface PurchaseOrder {
  id: string;
  ledger: string;
  number: string;
  date: string;
  createdOn: string;
  expectedDeliveryDate: string;
  totalAmount: number;
  status: string;
}

export interface PurchaseInvoice {
  id: string;
  billRefNo: string;
  vendorName: string;
  number: string;
  invoiceDate: string;
  createdOn: string;
  paymentDueDate: string;
  grandTotal: number;
  status: string;
  balance: number;
  settlement: string;
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  avgCostUnit: number;
  availableP: string;
  availableS: string;
  alert: string;
}

interface AppState {
  // Global States
  currentOutlet: string;
  outlets: string[];
  setCurrentOutlet: (outlet: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Toast notifications
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Hydration Action
  loadDatabaseData: () => Promise<void>;

  // Collections and settings state
  charges: Charge[];
  addCharge: (charge: Charge) => Promise<void>;
  updateCharge: (id: string, name: string) => Promise<void>;
  deleteCharge: (id: string) => Promise<void>;

  kitchens: Kitchen[];
  updateKitchen: (id: string, updated: Partial<Kitchen>) => Promise<void>;
  deleteKitchenMenuItem: (kitchenId: string, itemId: string) => Promise<void>;

  producedStocks: ProducedStock[];
  addProducedStock: (stock: ProducedStock) => Promise<void>;
  deleteProducedStock: (id: string) => Promise<void>;

  departments: Department[];
  addDepartment: (dept: Department) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;

  booklets: Booklet[];
  addBooklet: (booklet: Booklet) => Promise<void>;
  deleteBooklet: (id: string) => Promise<void>;

  // Accounting Customers
  accountingCustomers: AccountingCustomer[];
  addAccountingCustomer: (cust: AccountingCustomer) => Promise<void>;
  updateAccountingCustomer: (id: string, updated: Partial<AccountingCustomer>) => Promise<void>;
  deleteAccountingCustomer: (id: string) => Promise<void>;

  // Credit Sales
  creditSales: CreditSale[];
  settleCreditSale: (id: string) => Promise<void>;
  addCreditSale: (sale: CreditSale) => Promise<void>;

  // Credit Purchases
  creditPurchases: CreditPurchase[];
  payCreditPurchase: (id: string) => Promise<void>;
  addCreditPurchase: (purchase: CreditPurchase) => Promise<void>;

  // Expenses
  expensesList: ExpenseRecord[];
  addExpenseRecord: (exp: ExpenseRecord) => Promise<void>;
  updateExpenseRecord: (id: string, updated: Partial<ExpenseRecord>) => Promise<void>;
  deleteExpenseRecord: (id: string) => Promise<void>;

  // Employees
  employees: Employee[];
  addEmployee: (emp: Employee) => Promise<void>;
  updateEmployee: (id: string, updated: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;

  // Banks
  bankAccounts: BankAccount[];
  addBankAccount: (bank: BankAccount) => Promise<void>;
  updateBankAccount: (id: string, updated: Partial<BankAccount>) => Promise<void>;
  depositBank: (id: string, amount: number) => Promise<void>;

  loyaltySetting: LoyaltySetting;
  updateLoyaltySetting: (setting: Partial<LoyaltySetting>) => Promise<void>;

  feedbackComments: FeedbackComment[];
  messageAlerts: MessageAlertRow[];
  updateMessageAlert: (id: string, channel: MessageAlertRow['channel']) => Promise<void>;
  ereceptImage: string | null;
  setEreceptImage: (url: string | null) => Promise<void>;
  ereceptMessage: string;
  setEreceptMessage: (msg: string) => Promise<void>;

  posSetting: POSSetting;
  updatePOSSetting: (setting: Partial<POSSetting>) => Promise<void>;

  timewatchKey: TimewatchKey;
  updateTimewatchKey: (key: Partial<TimewatchKey>) => Promise<void>;

  // Inventory completion
  inventoryVendors: InventoryVendor[];
  addInventoryVendor: (vendor: InventoryVendor) => Promise<void>;
  updateInventoryVendor: (id: string, updated: Partial<InventoryVendor>) => Promise<void>;
  deleteInventoryVendor: (id: string) => Promise<void>;

  inventoryOverrides: InventoryOverride[];
  updateInventoryOverrideMinStock: (id: string, minStock: string) => Promise<void>;

  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (order: PurchaseOrder) => Promise<void>;
  deletePurchaseOrder: (id: string) => Promise<void>;

  purchaseInvoices: PurchaseInvoice[];
  addPurchaseInvoice: (invoice: PurchaseInvoice) => Promise<void>;
  payPurchaseInvoice: (id: string) => Promise<void>;
  deletePurchaseInvoice: (id: string) => Promise<void>;

  stockItems: StockItem[];
}

export const useStore = create<AppState>((set) => ({
  currentOutlet: '',
  outlets: ['Sobos Trial 2', 'Warehouse - Trial'],
  setCurrentOutlet: (outlet) => set({ currentOutlet: outlet }),
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // Hydration Action from SQLite Database
  loadDatabaseData: async () => {
    try {
      const [
        charges,
        kitchensData,
        producedStocks,
        departments,
        booklets,
        accountingCustomers,
        creditSales,
        creditPurchases,
        expensesList,
        employees,
        bankAccounts,
        inventoryVendors,
        stockItems,
        purchaseOrders,
        purchaseInvoices,
        settings,
      ] = await Promise.all([
        apiList<any>('charges'),
        apiList<any>('kitchens'),
        apiList<any>('produced-stocks'),
        apiList<any>('departments'),
        apiList<any>('booklets'),
        apiList<any>('customers'),
        apiList<any>('credit-sales'),
        apiList<any>('credit-purchases'),
        apiList<any>('expenses'),
        apiList<any>('staff'),
        apiList<any>('bank-accounts'),
        apiList<any>('vendors'),
        apiList<any>('inventory'),
        apiList<any>('purchase-orders'),
        apiList<any>('purchase-invoices'),
        apiGetSettings(),
      ]);

      // Parse kitchens menuItemsJson
      const kitchens = kitchensData.map((k: any) => ({
        id: String(k.id),
        name: k.name,
        description: k.description,
        disablePrints: !!k.disablePrints,
        mainPrinterName: k.mainPrinterName,
        mainPrinterType: k.mainPrinterType,
        altPrinterName: k.altPrinterName,
        altPrinterType: k.altPrinterType,
        dineInTokenPrinter: k.dineInTokenPrinter,
        pickupPrinterName: k.pickupPrinterName,
        deliveryPrinterName: k.deliveryPrinterName,
        menuItems: JSON.parse(k.menuItemsJson || '[]'),
      }));

      // Map inventory overrides from stockItems
      const inventoryOverrides = stockItems.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        code: item.shortCode || '--',
        category: item.category,
        minStock: item.reorderLevel === 0 ? '--' : String(item.reorderLevel),
      }));

      // Parse configs
      const loyaltySetting = settings.loyaltySetting
        ? JSON.parse(settings.loyaltySetting)
        : {
            programName: 'Birthday',
            enabled: false,
            pointsPerRupee: 2,
            pointsPerRupeeBirthday: 3,
            pointsPerRupeeAnniversary: 3,
            rupeesPerPoint: 100,
            minPointsForReward: 1,
            maxPointsRedeemPercent: 40,
            expiryDays: 365,
            askOtpOnRedemption: false,
            enablePointsOnOrderTotal: true,
            allowOfferLoyaltyTogether: false,
          };

      const posSetting = settings.posSetting
        ? JSON.parse(settings.posSetting)
        : {
            printBrandOnline: true,
            printOutletBill: true,
            enableRegularToken: true,
            printBillKotTogether: true,
            enableKotToken: true,
            enableKotReprint: true,
            disableBillToken: false,
            maskCustomerNumber: true,
          };

      const timewatchKey = settings.timewatchKey
        ? JSON.parse(settings.timewatchKey)
        : {
            apiKey: '',
            ipAddress: '',
            isActive: false,
          };

      const messageAlerts = settings.messageAlerts
        ? JSON.parse(settings.messageAlerts)
        : [
            { id: 'ereceipt', name: 'E-Receipt Message', channel: 'ereceipt_feedback' },
            { id: 'loyalty', name: 'Loyalty Message', channel: 'whatsapp' },
            { id: 'feedback', name: 'Feedback Message', channel: 'whatsapp' },
            { id: 'offer_otp', name: 'Offer OTP Message', channel: 'whatsapp' },
            { id: 'credit_reminder', name: 'Credit Sale Reminder Message', channel: 'whatsapp' },
            { id: 'order_confirmed', name: 'Order Confirmed (Applicable for Contactless)', channel: 'whatsapp' },
            { id: 'order_ready', name: 'Order Ready (Applicable for Contactless)', channel: 'whatsapp' },
            { id: 'order_pickup', name: 'Order Pick-Up (Applicable for Contactless)', channel: 'whatsapp' },
            { id: 'order_delivery', name: 'Order Delivery', channel: 'whatsapp' },
          ];

      const ereceptImage = settings.ereceptImage || null;
      const ereceptMessage = settings.ereceptMessage || 'Kuldeep Sobos';

      set({
        charges: charges.map((c: any) => ({ id: String(c.id), name: c.name })),
        kitchens,
        producedStocks: producedStocks.map((s: any) => ({ id: String(s.id), date: s.date, status: s.status })),
        departments: departments.map((d: any) => ({ id: String(d.id), name: d.name })),
        booklets: booklets.map((b: any) => ({ id: String(b.id), name: b.name })),
        accountingCustomers: accountingCustomers.map((c: any) => ({
          id: String(c.id),
          name: c.name,
          mobile: c.phone || '',
          email: c.email || '',
          lastVisited: c.lastVisited || '',
          totalSpend: Number(c.totalSpend || 0),
          totalOrders: Number(c.totalOrders || 0),
          balance: Number(c.balance || 0),
        })),
        creditSales: creditSales.map((s: any) => ({
          id: String(s.id),
          invoiceNo: s.invoiceNo,
          customer: s.customer,
          totalAmount: Number(s.totalAmount || 0),
          balanceAmount: Number(s.balanceAmount || 0),
          date: s.date,
        })),
        creditPurchases: creditPurchases.map((p: any) => ({
          id: String(p.id),
          invoiceNo: p.invoiceNo,
          vendorName: p.vendorName,
          totalAmount: Number(p.totalAmount || 0),
          balanceAmount: Number(p.balanceAmount || 0),
          date: p.date,
        })),
        expensesList: expensesList.map((e: any) => ({
          id: String(e.id),
          expenseNo: e.expenseNo,
          date: e.date,
          paidTo: e.paidTo,
          grandTotal: Number(e.grandTotal || 0),
          itemsCount: Number(e.itemsCount || 0),
        })),
        employees: employees.map((s: any) => ({
          id: String(s.id),
          name: s.name,
          mobile: s.mobile || '',
          designation: s.designation || '',
        })),
        bankAccounts: bankAccounts.map((b: any) => ({
          id: String(b.id),
          name: b.name,
          mobile: b.mobile || '',
        })),
        inventoryVendors: inventoryVendors.map((v: any) => ({
          id: String(v.id),
          name: v.name,
          mobile: v.mobile || '',
          email: v.email || '',
          gstNo: v.gstNo || '',
          balance: Number(v.balance || 0),
          department: v.department || '',
        })),
        purchaseOrders: purchaseOrders.map((o: any) => ({
          id: String(o.id),
          ledger: o.ledger,
          number: o.number,
          date: o.date,
          createdOn: o.createdOn,
          expectedDeliveryDate: o.expectedDeliveryDate,
          totalAmount: Number(o.totalAmount || 0),
          status: o.status,
        })),
        purchaseInvoices: purchaseInvoices.map((i: any) => ({
          id: String(i.id),
          billRefNo: i.billRefNo,
          vendorName: i.vendorName,
          number: i.number,
          invoiceDate: i.invoiceDate,
          createdOn: i.createdOn,
          paymentDueDate: i.paymentDueDate,
          grandTotal: Number(i.grandTotal || 0),
          status: i.status,
          balance: Number(i.balance || 0),
          settlement: i.settlement,
        })),
        stockItems: stockItems.map((item: any) => ({
          id: String(item.id),
          name: item.name,
          category: item.category,
          avgCostUnit: Number(item.avgCostUnit || 0),
          availableP: item.availableP || '',
          availableS: item.availableS || '',
          alert: item.alert || '',
        })),
        inventoryOverrides,
        loyaltySetting,
        posSetting,
        timewatchKey,
        messageAlerts,
        ereceptImage,
        ereceptMessage,
      });
    } catch (err) {
      console.error('Failed to load database data:', err);
    }
  },

  // Live CRUD integrations
  charges: [],
  addCharge: async (charge) => {
    try {
      const created = await apiCreate<any>('charges', { name: charge.name });
      set((state) => ({ charges: [...state.charges, { id: String(created.id), name: created.name }] }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to add charge', 'error');
    }
  },
  updateCharge: async (id, name) => {
    try {
      await apiUpdate<any>('charges', Number(id), { name });
      set((state) => ({
        charges: state.charges.map((c) => (c.id === id ? { ...c, name } : c)),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to update charge', 'error');
    }
  },
  deleteCharge: async (id) => {
    try {
      await apiDelete('charges', Number(id));
      set((state) => ({
        charges: state.charges.filter((c) => c.id !== id),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to delete charge', 'error');
    }
  },

  kitchens: [],
  updateKitchen: async (id, updated) => {
    try {
      const body: any = { ...updated };
      if (updated.menuItems) {
        body.menuItemsJson = JSON.stringify(updated.menuItems);
        delete body.menuItems;
      }
      await apiUpdate<any>('kitchens', Number(id), body);
      set((state) => ({
        kitchens: state.kitchens.map((k) => (k.id === id ? { ...k, ...updated } : k)),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to update kitchen', 'error');
    }
  },
  deleteKitchenMenuItem: async (kitchenId, itemId) => {
    try {
      const kitchen = useStore.getState().kitchens.find((k) => k.id === kitchenId);
      if (!kitchen) return;
      const newMenuItems = kitchen.menuItems.filter((i) => i.id !== itemId);
      await apiUpdate<any>('kitchens', Number(kitchenId), {
        menuItemsJson: JSON.stringify(newMenuItems),
      });
      set((state) => ({
        kitchens: state.kitchens.map((k) => {
          if (k.id === kitchenId) {
            return { ...k, menuItems: newMenuItems };
          }
          return k;
        }),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to delete menu item', 'error');
    }
  },

  producedStocks: [],
  addProducedStock: async (stock) => {
    try {
      const created = await apiCreate<any>('produced-stocks', {
        id: stock.id,
        date: stock.date,
        status: stock.status,
      });
      set((state) => ({ producedStocks: [...state.producedStocks, { id: String(created.id), date: created.date, status: created.status }] }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to add produced stock', 'error');
    }
  },
  deleteProducedStock: async (id) => {
    try {
      await apiDelete('produced-stocks', id as any);
      set((state) => ({ producedStocks: state.producedStocks.filter((s) => s.id !== id) }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to delete produced stock', 'error');
    }
  },

  departments: [],
  addDepartment: async (dept) => {
    try {
      const created = await apiCreate<any>('departments', { name: dept.name });
      set((state) => ({ departments: [...state.departments, { id: String(created.id), name: created.name }] }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to add department', 'error');
    }
  },
  deleteDepartment: async (id) => {
    try {
      await apiDelete('departments', Number(id));
      set((state) => ({ departments: state.departments.filter((d) => d.id !== id) }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to delete department', 'error');
    }
  },

  booklets: [],
  addBooklet: async (booklet) => {
    try {
      const created = await apiCreate<any>('booklets', { name: booklet.name });
      set((state) => ({ booklets: [...state.booklets, { id: String(created.id), name: created.name }] }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to add booklet', 'error');
    }
  },
  deleteBooklet: async (id) => {
    try {
      await apiDelete('booklets', Number(id));
      set((state) => ({ booklets: state.booklets.filter((b) => b.id !== id) }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to delete booklet', 'error');
    }
  },

  accountingCustomers: [],
  addAccountingCustomer: async (cust) => {
    try {
      const created = await apiCreate<any>('customers', {
        name: cust.name,
        phone: cust.mobile,
        email: cust.email,
        visits: cust.visits,
        total_spend: cust.totalSpend,
        last_visited: cust.lastVisited,
        total_orders: cust.totalOrders,
        balance: cust.balance,
      });
      set((state) => ({
        accountingCustomers: [
          ...state.accountingCustomers,
          {
            id: String(created.id),
            name: created.name,
            mobile: created.mobile || '',
            email: created.email || '',
            lastVisited: created.lastVisited || '',
            totalSpend: Number(created.totalSpend || 0),
            totalOrders: Number(created.totalOrders || 0),
            balance: Number(created.balance || 0),
          },
        ],
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to add customer', 'error');
    }
  },
  updateAccountingCustomer: async (id, updated) => {
    try {
      const body: any = {};
      if (updated.name !== undefined) body.name = updated.name;
      if (updated.mobile !== undefined) body.phone = updated.mobile;
      if (updated.email !== undefined) body.email = updated.email;
      if (updated.visits !== undefined) body.visits = updated.visits;
      if (updated.totalSpend !== undefined) body.total_spend = updated.totalSpend;
      if (updated.lastVisited !== undefined) body.last_visited = updated.lastVisited;
      if (updated.totalOrders !== undefined) body.total_orders = updated.totalOrders;
      if (updated.balance !== undefined) body.balance = updated.balance;

      await apiUpdate<any>('customers', Number(id), body);
      set((state) => ({
        accountingCustomers: state.accountingCustomers.map((c) => (c.id === id ? { ...c, ...updated } : c)),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to update customer', 'error');
    }
  },
  deleteAccountingCustomer: async (id) => {
    try {
      await apiDelete('customers', Number(id));
      set((state) => ({
        accountingCustomers: state.accountingCustomers.filter((c) => c.id !== id),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to delete customer', 'error');
    }
  },

  creditSales: [],
  settleCreditSale: async (id) => {
    try {
      await apiUpdate<any>('credit-sales', Number(id), { balance_amount: 0 });
      set((state) => ({
        creditSales: state.creditSales.map((s) => (s.id === id ? { ...s, balanceAmount: 0 } : s)),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to settle credit sale', 'error');
    }
  },
  addCreditSale: async (sale) => {
    try {
      const created = await apiCreate<any>('credit-sales', {
        invoice_no: sale.invoiceNo,
        customer: sale.customer,
        total_amount: sale.totalAmount,
        balance_amount: sale.balanceAmount,
        date: sale.date,
      });
      set((state) => ({
        creditSales: [
          ...state.creditSales,
          {
            id: String(created.id),
            invoiceNo: created.invoiceNo,
            customer: created.customer,
            totalAmount: Number(created.totalAmount || 0),
            balanceAmount: Number(created.balanceAmount || 0),
            date: created.date,
          },
        ],
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to add credit sale', 'error');
    }
  },

  creditPurchases: [],
  payCreditPurchase: async (id) => {
    try {
      await apiUpdate<any>('credit-purchases', Number(id), { balance_amount: 0 });
      set((state) => ({
        creditPurchases: state.creditPurchases.map((p) => (p.id === id ? { ...p, balanceAmount: 0 } : p)),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to pay credit purchase', 'error');
    }
  },
  addCreditPurchase: async (purchase) => {
    try {
      const created = await apiCreate<any>('credit-purchases', {
        invoice_no: purchase.invoiceNo,
        vendor_name: purchase.vendorName,
        total_amount: purchase.totalAmount,
        balance_amount: purchase.balanceAmount,
        date: purchase.date,
      });
      set((state) => ({
        creditPurchases: [
          ...state.creditPurchases,
          {
            id: String(created.id),
            invoiceNo: created.invoiceNo,
            vendorName: created.vendorName,
            totalAmount: Number(created.totalAmount || 0),
            balanceAmount: Number(created.balanceAmount || 0),
            date: created.date,
          },
        ],
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to add credit purchase', 'error');
    }
  },

  expensesList: [],
  addExpenseRecord: async (exp) => {
    try {
      const created = await apiCreate<any>('expenses', {
        expense_no: exp.expenseNo,
        date: exp.date,
        paid_to: exp.paidTo,
        grand_total: exp.grandTotal,
        items_count: exp.itemsCount,
      });
      set((state) => ({
        expensesList: [
          ...state.expensesList,
          {
            id: String(created.id),
            expenseNo: created.expenseNo,
            date: created.date,
            paidTo: created.paidTo,
            grandTotal: Number(created.grandTotal || 0),
            itemsCount: Number(created.itemsCount || 0),
          },
        ],
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to add expense', 'error');
    }
  },
  updateExpenseRecord: async (id, updated) => {
    try {
      const body: any = {};
      if (updated.expenseNo !== undefined) body.expense_no = updated.expenseNo;
      if (updated.date !== undefined) body.date = updated.date;
      if (updated.paidTo !== undefined) body.paid_to = updated.paidTo;
      if (updated.grandTotal !== undefined) body.grand_total = updated.grandTotal;
      if (updated.itemsCount !== undefined) body.items_count = updated.itemsCount;

      await apiUpdate<any>('expenses', Number(id), body);
      set((state) => ({
        expensesList: state.expensesList.map((e) => (e.id === id ? { ...e, ...updated } : e)),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to update expense', 'error');
    }
  },
  deleteExpenseRecord: async (id) => {
    try {
      await apiDelete('expenses', Number(id));
      set((state) => ({
        expensesList: state.expensesList.filter((e) => e.id !== id),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to delete expense', 'error');
    }
  },

  employees: [],
  addEmployee: async (emp) => {
    try {
      const created = await apiCreate<any>('staff', {
        name: emp.name,
        mobile: emp.mobile,
        designation: emp.designation,
      });
      set((state) => ({
        employees: [
          ...state.employees,
          {
            id: String(created.id),
            name: created.name,
            mobile: created.mobile || '',
            designation: created.designation || '',
          },
        ],
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to add employee', 'error');
    }
  },
  updateEmployee: async (id, updated) => {
    try {
      const body: any = {};
      if (updated.name !== undefined) body.name = updated.name;
      if (updated.mobile !== undefined) body.mobile = updated.mobile;
      if (updated.designation !== undefined) body.designation = updated.designation;

      await apiUpdate<any>('staff', Number(id), body);
      set((state) => ({
        employees: state.employees.map((e) => (e.id === id ? { ...e, ...updated } : e)),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to update employee', 'error');
    }
  },
  deleteEmployee: async (id) => {
    try {
      await apiDelete('staff', Number(id));
      set((state) => ({
        employees: state.employees.filter((e) => e.id !== id),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to delete employee', 'error');
    }
  },

  bankAccounts: [],
  addBankAccount: async (bank) => {
    try {
      const created = await apiCreate<any>('bank-accounts', {
        name: bank.name,
        mobile: bank.mobile,
      });
      set((state) => ({
        bankAccounts: [
          ...state.bankAccounts,
          {
            id: String(created.id),
            name: created.name,
            mobile: created.mobile || '',
          },
        ],
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to add bank account', 'error');
    }
  },
  updateBankAccount: async (id, updated) => {
    try {
      const body: any = {};
      if (updated.name !== undefined) body.name = updated.name;
      if (updated.mobile !== undefined) body.mobile = updated.mobile;

      await apiUpdate<any>('bank-accounts', Number(id), body);
      set((state) => ({
        bankAccounts: state.bankAccounts.map((b) => (b.id === id ? { ...b, ...updated } : b)),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to update bank account', 'error');
    }
  },
  depositBank: async (id, amount) => {
    try {
      useStore.getState().addToast(`Deposited ₹${amount} to bank account`, 'success');
    } catch (err) {
      console.error(err);
    }
  },

  loyaltySetting: {
    programName: 'Birthday',
    enabled: false,
    pointsPerRupee: 2,
    pointsPerRupeeBirthday: 3,
    pointsPerRupeeAnniversary: 3,
    rupeesPerPoint: 100,
    minPointsForReward: 1,
    maxPointsRedeemPercent: 40,
    expiryDays: 365,
    askOtpOnRedemption: false,
    enablePointsOnOrderTotal: true,
    allowOfferLoyaltyTogether: false,
  },
  updateLoyaltySetting: async (setting) => {
    try {
      const merged = { ...useStore.getState().loyaltySetting, ...setting };
      await apiSaveSettings({ loyaltySetting: JSON.stringify(merged) });
      set({ loyaltySetting: merged });
    } catch (err) {
      console.error(err);
    }
  },

  feedbackComments: [
    { id: '1', customer: 'Rahul N Kumbhare', comments: '-', date: '13 Dec 2025 08:45 PM' },
    { id: '2', customer: 'Parth', comments: '-', date: '12 Oct 2024 06:00 PM' },
    { id: '3', customer: 'Parth', comments: '-', date: '12 Oct 2024 05:37 PM' },
    { id: '4', customer: 'Parth', comments: '-', date: '10 Oct 2024 05:22 PM' },
  ],

  messageAlerts: [],
  updateMessageAlert: async (id, channel) => {
    try {
      const messageAlerts = useStore.getState().messageAlerts.map((a) => (a.id === id ? { ...a, channel } : a));
      await apiSaveSettings({ messageAlerts: JSON.stringify(messageAlerts) });
      set({ messageAlerts });
    } catch (err) {
      console.error(err);
    }
  },
  ereceptImage: null,
  setEreceptImage: async (url) => {
    try {
      await apiSaveSettings({ ereceptImage: url || '' });
      set({ ereceptImage: url });
    } catch (err) {
      console.error(err);
    }
  },
  ereceptMessage: 'Kuldeep Sobos',
  setEreceptMessage: async (msg) => {
    try {
      await apiSaveSettings({ ereceptMessage: msg });
      set({ ereceptMessage: msg });
    } catch (err) {
      console.error(err);
    }
  },

  posSetting: {
    printBrandOnline: true,
    printOutletBill: true,
    enableRegularToken: true,
    printBillKotTogether: true,
    enableKotToken: true,
    enableKotReprint: true,
    disableBillToken: false,
    maskCustomerNumber: true,
  },
  updatePOSSetting: async (setting) => {
    try {
      const merged = { ...useStore.getState().posSetting, ...setting };
      await apiSaveSettings({ posSetting: JSON.stringify(merged) });
      set({ posSetting: merged });
    } catch (err) {
      console.error(err);
    }
  },

  timewatchKey: {
    apiKey: '',
    ipAddress: '',
    isActive: false,
  },
  updateTimewatchKey: async (key) => {
    try {
      const merged = { ...useStore.getState().timewatchKey, ...key };
      await apiSaveSettings({ timewatchKey: JSON.stringify(merged) });
      set({ timewatchKey: merged });
    } catch (err) {
      console.error(err);
    }
  },

  inventoryVendors: [],
  addInventoryVendor: async (vendor) => {
    try {
      const created = await apiCreate<any>('vendors', {
        name: vendor.name,
        mobile: vendor.mobile,
        phone: vendor.mobile,
        email: vendor.email,
        gst_no: vendor.gstNo,
        balance: vendor.balance,
        department: vendor.department,
      });
      set((state) => ({
        inventoryVendors: [
          ...state.inventoryVendors,
          {
            id: String(created.id),
            name: created.name,
            mobile: created.mobile || '',
            email: created.email || '',
            gstNo: created.gstNo || '',
            balance: Number(created.balance || 0),
            department: created.department || '',
          },
        ],
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to add vendor', 'error');
    }
  },
  updateInventoryVendor: async (id, updated) => {
    try {
      const body: any = {};
      if (updated.name !== undefined) body.name = updated.name;
      if (updated.mobile !== undefined) {
        body.mobile = updated.mobile;
        body.phone = updated.mobile;
      }
      if (updated.email !== undefined) body.email = updated.email;
      if (updated.gstNo !== undefined) body.gst_no = updated.gstNo;
      if (updated.balance !== undefined) body.balance = updated.balance;
      if (updated.department !== undefined) body.department = updated.department;

      await apiUpdate<any>('vendors', Number(id), body);
      set((state) => ({
        inventoryVendors: state.inventoryVendors.map((v) => (v.id === id ? { ...v, ...updated } : v)),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to update vendor', 'error');
    }
  },
  deleteInventoryVendor: async (id) => {
    try {
      await apiDelete('vendors', Number(id));
      set((state) => ({
        inventoryVendors: state.inventoryVendors.filter((v) => v.id !== id),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to delete vendor', 'error');
    }
  },

  inventoryOverrides: [],
  updateInventoryOverrideMinStock: async (id, minStock) => {
    try {
      const numericVal = minStock === '--' ? 0 : Number(minStock);
      await apiUpdate<any>('inventory', Number(id), { reorder_level: numericVal });
      set((state) => ({
        inventoryOverrides: state.inventoryOverrides.map((o) => (o.id === id ? { ...o, minStock } : o)),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to update override limit', 'error');
    }
  },

  purchaseOrders: [],
  addPurchaseOrder: async (order) => {
    try {
      const created = await apiCreate<any>('purchase-orders', {
        id: order.id,
        ledger: order.ledger,
        number: order.number,
        date: order.date,
        created_on: order.createdOn,
        expected_delivery_date: order.expectedDeliveryDate,
        total_amount: order.totalAmount,
        status: order.status,
      });
      set((state) => ({
        purchaseOrders: [
          ...state.purchaseOrders,
          {
            id: String(created.id),
            ledger: created.ledger,
            number: created.number,
            date: created.date,
            createdOn: created.createdOn,
            expectedDeliveryDate: created.expectedDeliveryDate,
            totalAmount: Number(created.totalAmount || 0),
            status: created.status,
          },
        ],
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to create PO', 'error');
    }
  },
  deletePurchaseOrder: async (id) => {
    try {
      await apiDelete('purchase-orders', id as any);
      set((state) => ({
        purchaseOrders: state.purchaseOrders.filter((o) => o.id !== id),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to delete PO', 'error');
    }
  },

  purchaseInvoices: [],
  addPurchaseInvoice: async (invoice) => {
    try {
      const created = await apiCreate<any>('purchase-invoices', {
        id: invoice.id,
        bill_ref_no: invoice.billRefNo,
        vendor_name: invoice.vendorName,
        number: invoice.number,
        invoice_date: invoice.invoiceDate,
        created_on: invoice.createdOn,
        payment_due_date: invoice.paymentDueDate,
        grand_total: invoice.grandTotal,
        status: invoice.status,
        balance: invoice.balance,
        settlement: invoice.settlement,
      });
      set((state) => ({
        purchaseInvoices: [
          ...state.purchaseInvoices,
          {
            id: String(created.id),
            billRefNo: created.billRefNo,
            vendorName: created.vendorName,
            number: created.number,
            invoiceDate: created.invoiceDate,
            createdOn: created.createdOn,
            paymentDueDate: created.paymentDueDate,
            grandTotal: Number(created.grandTotal || 0),
            status: created.status,
            balance: Number(created.balance || 0),
            settlement: created.settlement,
          },
        ],
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to create invoice', 'error');
    }
  },
  payPurchaseInvoice: async (id) => {
    try {
      await apiUpdate<any>('purchase-invoices', id as any, { balance: 0, settlement: 'Settled' });
      set((state) => ({
        purchaseInvoices: state.purchaseInvoices.map((p) => (p.id === id ? { ...p, balance: 0, settlement: 'Settled' } : p)),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to pay invoice', 'error');
    }
  },
  deletePurchaseInvoice: async (id) => {
    try {
      await apiDelete('purchase-invoices', id as any);
      set((state) => ({
        purchaseInvoices: state.purchaseInvoices.filter((p) => p.id !== id),
      }));
    } catch (err) {
      useStore.getState().addToast(err instanceof Error ? err.message : 'Failed to delete invoice', 'error');
    }
  },

  stockItems: [],
}));
