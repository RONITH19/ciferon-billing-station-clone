import type Database from 'better-sqlite3';
import { COMPLETED_STATUSES } from '@/lib/db';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Served'
  | 'Completed'
  | 'Cancelled'
  | 'Paid';

export interface OrderRow {
  id: number;
  createdAt: string;
  customer: string;
  total: number;
  itemCount: number;
  status: OrderStatus;
  outletId: number | null;
  sessionId: number | null;
  tableId: number | null;
  tableLabel: string;
  orderType: string;
  subtotal: number;
  tax: number;
  discount: number;
  confirmedAt: string | null;
  preparingAt: string | null;
  readyAt: string | null;
  notes: string;
}

export interface OrderItemRow {
  id: number;
  orderId: number;
  itemId: number | null;
  itemName: string;
  qty: number;
  price: number;
  modifiersJson: string;
  notes: string;
  station: string;
}

const VALID_TRANSITIONS: Record<string, OrderStatus[]> = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Preparing', 'Cancelled'],
  Preparing: ['Ready', 'Cancelled'],
  Ready: ['Served', 'Cancelled'],
  Served: ['Completed'],
  Completed: [],
  Cancelled: [],
  Paid: [],
};

function mapOrder(row: Record<string, unknown>): OrderRow {
  return {
    id: row.id as number,
    createdAt: row.created_at as string,
    customer: row.customer as string,
    total: row.total as number,
    itemCount: row.item_count as number,
    status: row.status as OrderStatus,
    outletId: (row.outlet_id as number) ?? null,
    sessionId: (row.session_id as number) ?? null,
    tableId: (row.table_id as number) ?? null,
    tableLabel: (row.table_label as string) ?? '',
    orderType: (row.order_type as string) ?? 'dine_in',
    subtotal: (row.subtotal as number) ?? 0,
    tax: (row.tax as number) ?? 0,
    discount: (row.discount as number) ?? 0,
    confirmedAt: (row.confirmed_at as string) ?? null,
    preparingAt: (row.preparing_at as string) ?? null,
    readyAt: (row.ready_at as string) ?? null,
    notes: (row.notes as string) ?? '',
  };
}

export function listOrders(
  db: Database.Database,
  filters: { status?: string; q?: string; limit?: number } = {},
) {
  let sql = `SELECT * FROM orders WHERE 1=1`;
  const params: unknown[] = [];
  if (filters.status) {
    sql += ` AND status = ?`;
    params.push(filters.status);
  }
  if (filters.q) {
    sql += ` AND (customer LIKE ? OR table_label LIKE ? OR CAST(id AS TEXT) LIKE ?)`;
    const like = `%${filters.q}%`;
    params.push(like, like, like);
  }
  sql += ` ORDER BY created_at DESC LIMIT ?`;
  params.push(filters.limit ?? 100);
  return (db.prepare(sql).all(...params) as Record<string, unknown>[]).map(mapOrder);
}

export function getOrderById(db: Database.Database, id: number) {
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? mapOrder(row) : null;
}

export function getOrderItems(db: Database.Database, orderId: number): OrderItemRow[] {
  return (
    db
      .prepare(
        `SELECT id, order_id, item_id, item_name, qty, price, modifiers_json, notes, station
         FROM order_items WHERE order_id = ?`,
      )
      .all(orderId) as Record<string, unknown>[]
  ).map((r) => ({
    id: r.id as number,
    orderId: r.order_id as number,
    itemId: (r.item_id as number) ?? null,
    itemName: r.item_name as string,
    qty: r.qty as number,
    price: r.price as number,
    modifiersJson: (r.modifiers_json as string) ?? '[]',
    notes: (r.notes as string) ?? '',
    station: (r.station as string) ?? 'kitchen',
  }));
}

export function getStatusLog(db: Database.Database, orderId: number) {
  return db
    .prepare(
      `SELECT id, order_id, from_status, to_status, changed_at, changed_by
       FROM order_status_log WHERE order_id = ? ORDER BY changed_at ASC`,
    )
    .all(orderId);
}

export function createOrder(
  db: Database.Database,
  input: {
    outletId: number;
    sessionId?: number | null;
    tableId?: number | null;
    tableLabel?: string;
    customer?: string;
    orderType?: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    itemCount: number;
    notes?: string;
    items: {
      itemId?: number;
      name: string;
      qty: number;
      unitPrice: number;
      notes?: string;
      modifiers?: string[];
      station?: string;
    }[];
  },
) {
  const tx = db.transaction(() => {
    const now = new Date().toISOString();
    const info = db
      .prepare(
        `INSERT INTO orders (
          created_at, customer, total, item_count, status, outlet_id, session_id, table_id,
          table_label, order_type, subtotal, tax, discount, confirmed_at, notes
        ) VALUES (?, ?, ?, ?, 'Confirmed', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        now,
        input.customer ?? 'Walk-in',
        input.total,
        input.itemCount,
        input.outletId,
        input.sessionId ?? null,
        input.tableId ?? null,
        input.tableLabel ?? '',
        input.orderType ?? 'dine_in',
        input.subtotal,
        input.tax,
        input.discount,
        now,
        input.notes ?? '',
      );
    const orderId = Number(info.lastInsertRowid);
    const insItem = db.prepare(
      `INSERT INTO order_items (order_id, item_id, item_name, qty, price, modifiers_json, notes, station)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    input.items.forEach((item) => {
      insItem.run(
        orderId,
        item.itemId ?? null,
        item.name,
        item.qty,
        item.unitPrice,
        JSON.stringify(item.modifiers ?? []),
        item.notes ?? '',
        item.station ?? 'kitchen',
      );
    });
    db.prepare(
      `INSERT INTO order_status_log (order_id, from_status, to_status, changed_at)
       VALUES (?, 'Pending', 'Confirmed', ?)`,
    ).run(orderId, now);
    return orderId;
  });
  return tx();
}

export function transitionOrderStatus(
  db: Database.Database,
  orderId: number,
  toStatus: OrderStatus,
  changedBy = 'system',
) {
  const order = getOrderById(db, orderId);
  if (!order) throw new Error('Order not found');
  const allowed = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(toStatus) && order.status !== toStatus) {
    throw new Error(`Invalid transition from ${order.status} to ${toStatus}`);
  }
  const now = new Date().toISOString();
  const tsField =
    toStatus === 'Confirmed'
      ? 'confirmed_at'
      : toStatus === 'Preparing'
        ? 'preparing_at'
        : toStatus === 'Ready'
          ? 'ready_at'
          : toStatus === 'Served'
            ? 'served_at'
            : null;

  const tx = db.transaction(() => {
    if (tsField) {
      db.prepare(`UPDATE orders SET status = ?, ${tsField} = ? WHERE id = ?`).run(toStatus, now, orderId);
    } else {
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(toStatus, orderId);
    }
    db.prepare(
      `INSERT INTO order_status_log (order_id, from_status, to_status, changed_at, changed_by)
       VALUES (?, ?, ?, ?, ?)`,
    ).run(orderId, order.status, toStatus, now, changedBy);
  });
  tx();
  return getOrderById(db, orderId)!;
}

export function getLiveOrderCounts(db: Database.Database) {
  return db
    .prepare(
      `SELECT status, COUNT(*) AS count FROM orders
       WHERE status IN ('Pending','Confirmed','Preparing','Ready')
       GROUP BY status`,
    )
    .all() as { status: string; count: number }[];
}

export { COMPLETED_STATUSES };
