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
    searchColumns: ['name', 'unit'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'unit', key: 'unit', type: 'string', default: 'pcs' },
      { column: 'quantity', key: 'quantity', type: 'number', default: 0 },
      { column: 'reorder_level', key: 'reorderLevel', type: 'number', default: 0 },
    ],
  },
  customers: {
    table: 'customers',
    searchColumns: ['name', 'phone', 'email'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'phone', key: 'phone', type: 'string', default: '' },
      { column: 'email', key: 'email', type: 'string', default: '' },
      { column: 'visits', key: 'visits', type: 'int', default: 0 },
      { column: 'total_spend', key: 'totalSpend', type: 'number', default: 0 },
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
    searchColumns: ['name', 'email', 'role'],
    fields: [
      { column: 'name', key: 'name', type: 'string', required: true },
      { column: 'email', key: 'email', type: 'string', default: '' },
      { column: 'role', key: 'role', type: 'string', default: 'Cashier' },
    ],
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
