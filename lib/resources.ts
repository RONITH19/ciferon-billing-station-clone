// Declarative config for every CRUD resource. The generic API route handlers
// in app/api/[resource] read this to validate input and build SQL.

export type FieldType = 'string' | 'number' | 'int' | 'bool';

export interface FieldDef {
  /** Column name in SQLite. */
  column: string;
  /** Key used in JSON request/response bodies. */
  key: string;
  type: FieldType;
  required?: boolean;
  default?: string | number;
}

export interface ResourceDef {
  table: string;
  fields: FieldDef[];
  /** Columns searched by the ?q= query param. */
  searchColumns: string[];
}

export const RESOURCES: Record<string, ResourceDef> = {
  outlets: {
    table: 'outlets',
    searchColumns: ['name'],
    fields: [{ column: 'name', key: 'name', type: 'string', required: true }],
  },
  'super-categories': {
    table: 'super_categories',
    searchColumns: ['name'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'display_order', key: 'displayOrder', type: 'int', default: 0 },
    ],
  },
  categories: {
    table: 'categories',
    searchColumns: ['name', 'online_display_name'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'online_display_name', key: 'onlineDisplayName', type: 'string', default: '--' },
      { column: 'item_count', key: 'itemCount', type: 'int', default: 0 },
    ],
  },
  'sub-categories': {
    table: 'sub_categories',
    searchColumns: ['name', 'category'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'category', key: 'category', type: 'string', default: '' },
    ],
  },
  items: {
    table: 'items',
    searchColumns: ['name', 'display_name', 'category', 'short_code'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'display_name', key: 'displayName', type: 'string', default: '' },
      { column: 'category', key: 'category', type: 'string', default: '' },
      { column: 'short_code', key: 'shortCode', type: 'string', default: '--' },
      { column: 'base_price', key: 'basePrice', type: 'number', default: 0 },
      { column: 'tax', key: 'tax', type: 'string', default: 'GST 0%' },
      { column: 'mrp', key: 'mrp', type: 'number', default: 0 },
    ],
  },
  addons: {
    table: 'addons',
    searchColumns: ['name', 'display_name', 'items'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'display_name', key: 'displayName', type: 'string', default: '' },
      { column: 'items', key: 'items', type: 'string', default: '' },
    ],
  },
  variants: {
    table: 'variants',
    searchColumns: ['name'],
    fields: [{ column: 'name', key: 'name', type: 'string', required: true }],
  },
  submenu: {
    table: 'submenu',
    searchColumns: ['name'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'is_active', key: 'isActive', type: 'int', default: 1 },
    ],
  },
  inventory: {
    table: 'inventory',
    searchColumns: ['name', 'unit', 'category'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'unit', key: 'unit', type: 'string', default: 'pcs' },
      { column: 'quantity', key: 'quantity', type: 'number', default: 0 },
      { column: 'reorder_level', key: 'reorderLevel', type: 'number', default: 0 },
      { column: 'category', key: 'category', type: 'string', default: '' },
      { column: 'avg_cost_unit', key: 'avgCostUnit', type: 'number', default: 0 },
      { column: 'available_p', key: 'availableP', type: 'string', default: '' },
      { column: 'available_s', key: 'availableS', type: 'string', default: '' },
      { column: 'alert', key: 'alert', type: 'string', default: '' },
    ],
  },
  customers: {
    table: 'customers',
    searchColumns: ['name', 'phone', 'email'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'phone', key: 'mobile', type: 'string', default: '' },
      { column: 'email', key: 'email', type: 'string', default: '' },
      { column: 'visits', key: 'visits', type: 'int', default: 0 },
      { column: 'total_spend', key: 'totalSpend', type: 'number', default: 0 },
      { column: 'last_visited', key: 'lastVisited', type: 'string', default: '' },
      { column: 'total_orders', key: 'totalOrders', type: 'int', default: 0 },
      { column: 'balance', key: 'balance', type: 'number', default: 0 },
    ],
  },
  locations: {
    table: 'locations',
    searchColumns: ['name', 'address', 'city', 'phone'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'address', key: 'address', type: 'string', default: '' },
      { column: 'city', key: 'city', type: 'string', default: '' },
      { column: 'phone', key: 'phone', type: 'string', default: '' },
    ],
  },
  staff: {
    table: 'staff',
    searchColumns: ['name', 'email', 'role', 'mobile'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'email', key: 'email', type: 'string', default: '' },
      { column: 'role', key: 'role', type: 'string', default: 'Cashier' },
      { column: 'mobile', key: 'mobile', type: 'string', default: '' },
      { column: 'designation', key: 'designation', type: 'string', default: '' },
    ],
  },
  vendors: {
    table: 'vendors',
    searchColumns: ['name', 'phone', 'email', 'department'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'phone', key: 'phone', type: 'string', default: '' },
      { column: 'email', key: 'email', type: 'string', default: '' },
      { column: 'address', key: 'address', type: 'string', default: '' },
      { column: 'mobile', key: 'mobile', type: 'string', default: '' },
      { column: 'gst_no', key: 'gstNo', type: 'string', default: '' },
      { column: 'balance', key: 'balance', type: 'number', default: 0 },
      { column: 'department', key: 'department', type: 'string', default: '' },
    ],
  },
  charges: {
    table: 'charges',
    searchColumns: ['name'],
    fields: [{ column: 'name', key: 'name', type: 'string', required: true }],
  },
  booklets: {
    table: 'booklets',
    searchColumns: ['name'],
    fields: [{ column: 'name', key: 'name', type: 'string', required: true }],
  },
  'bank-accounts': {
    table: 'bank_accounts',
    searchColumns: ['name', 'mobile'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'mobile', key: 'mobile', type: 'string', default: '' },
    ],
  },
  'credit-sales': {
    table: 'credit_sales',
    searchColumns: ['invoice_no', 'customer'],
    fields: [
      { column: 'invoice_no', key: 'invoiceNo', type: 'string', required: true },
      { column: 'customer', key: 'customer', type: 'string', required: true },
      { column: 'total_amount', key: 'totalAmount', type: 'number', default: 0 },
      { column: 'balance_amount', key: 'balanceAmount', type: 'number', default: 0 },
      { column: 'date', key: 'date', type: 'string', required: true },
    ],
  },
  'credit-purchases': {
    table: 'credit_purchases',
    searchColumns: ['invoice_no', 'vendor_name'],
    fields: [
      { column: 'invoice_no', key: 'invoiceNo', type: 'string', required: true },
      { column: 'vendor_name', key: 'vendorName', type: 'string', required: true },
      { column: 'total_amount', key: 'totalAmount', type: 'number', default: 0 },
      { column: 'balance_amount', key: 'balanceAmount', type: 'number', default: 0 },
      { column: 'date', key: 'date', type: 'string', required: true },
    ],
  },
  expenses: {
    table: 'expenses',
    searchColumns: ['expense_no', 'paid_to'],
    fields: [
      { column: 'expense_no', key: 'expenseNo', type: 'string', required: true },
      { column: 'date', key: 'date', type: 'string', required: true },
      { column: 'paid_to', key: 'paidTo', type: 'string', required: true },
      { column: 'grand_total', key: 'grandTotal', type: 'number', default: 0 },
      { column: 'items_count', key: 'itemsCount', type: 'int', default: 0 },
    ],
  },
  kitchens: {
    table: 'kitchens',
    searchColumns: ['name', 'description'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'description', key: 'description', type: 'string', default: '' },
      { column: 'disable_prints', key: 'disablePrints', type: 'bool', default: 0 },
      { column: 'main_printer_name', key: 'mainPrinterName', type: 'string', default: '' },
      { column: 'main_printer_type', key: 'mainPrinterType', type: 'string', default: '' },
      { column: 'alt_printer_name', key: 'altPrinterName', type: 'string', default: '' },
      { column: 'alt_printer_type', key: 'altPrinterType', type: 'string', default: '' },
      { column: 'dine_in_token_printer', key: 'dineInTokenPrinter', type: 'string', default: '' },
      { column: 'pickup_printer_name', key: 'pickupPrinterName', type: 'string', default: '' },
      { column: 'delivery_printer_name', key: 'deliveryPrinterName', type: 'string', default: '' },
      { column: 'menu_items_json', key: 'menuItemsJson', type: 'string', default: '[]' },
    ],
  },
  'produced-stocks': {
    table: 'produced_stocks',
    searchColumns: ['id', 'status'],
    fields: [
      { column: 'id', key: 'id', type: 'string', required: true },
      { column: 'date', key: 'date', type: 'string', required: true },
      { column: 'status', key: 'status', type: 'string', required: true },
    ],
  },
  'purchase-orders': {
    table: 'sobos_purchase_orders',
    searchColumns: ['id', 'ledger', 'status'],
    fields: [
      { column: 'id', key: 'id', type: 'string', required: true },
      { column: 'ledger', key: 'ledger', type: 'string', required: true },
      { column: 'number', key: 'number', type: 'string', default: '' },
      { column: 'date', key: 'date', type: 'string', required: true },
      { column: 'created_on', key: 'createdOn', type: 'string', required: true },
      { column: 'expected_delivery_date', key: 'expectedDeliveryDate', type: 'string', required: true },
      { column: 'total_amount', key: 'totalAmount', type: 'number', default: 0 },
      { column: 'status', key: 'status', type: 'string', default: 'PO Generated' },
    ],
  },
  'purchase-invoices': {
    table: 'purchase_invoices',
    searchColumns: ['id', 'vendor_name', 'status'],
    fields: [
      { column: 'id', key: 'id', type: 'string', required: true },
      { column: 'bill_ref_no', key: 'billRefNo', type: 'string', default: '' },
      { column: 'vendor_name', key: 'vendorName', type: 'string', required: true },
      { column: 'number', key: 'number', type: 'string', default: '' },
      { column: 'invoice_date', key: 'invoiceDate', type: 'string', required: true },
      { column: 'created_on', key: 'createdOn', type: 'string', required: true },
      { column: 'payment_due_date', key: 'paymentDueDate', type: 'string', default: '' },
      { column: 'grand_total', key: 'grandTotal', type: 'number', default: 0 },
      { column: 'status', key: 'status', type: 'string', default: 'Received' },
      { column: 'balance', key: 'balance', type: 'number', default: 0 },
      { column: 'settlement', key: 'settlement', type: 'string', default: 'Pay' },
    ],
  },
  departments: {
    table: 'departments',
    searchColumns: ['name'],
    fields: [{ column: 'name', key: 'name', type: 'string', required: true }],
  },
};

export function getResource(name: string): ResourceDef | undefined {
  return RESOURCES[name];
}

/** Convert a DB row (snake_case columns) into an API object (camelCase keys + id). */
export function rowToApi(def: ResourceDef, row: Record<string, unknown>) {
  const out: Record<string, unknown> = { id: row.id };
  for (const f of def.fields) {
    let v = row[f.column];
    if (f.type === 'bool') v = v ? true : false;
    out[f.key] = v;
  }
  return out;
}

/** Coerce + validate an incoming value for a field. Returns the column value. */
export function coerce(field: FieldDef, raw: unknown): number | string {
  if (field.type === 'bool') {
    return raw ? 1 : 0;
  }
  if (field.type === 'number' || field.type === 'int') {
    const n = typeof raw === 'string' ? Number(raw) : (raw as number);
    if (raw === undefined || raw === null || raw === '' || Number.isNaN(n)) {
      if (field.default !== undefined) return field.default as number;
      return 0;
    }
    return field.type === 'int' ? Math.trunc(n) : n;
  }
  // string
  if (raw === undefined || raw === null) {
    return (field.default as string) ?? '';
  }
  return String(raw);
}
