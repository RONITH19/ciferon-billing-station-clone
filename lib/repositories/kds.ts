import type Database from 'better-sqlite3';
import { getOrderById, getOrderItems, transitionOrderStatus } from '@/lib/repositories/orders';

export function getKdsFeed(db: Database.Database, station = 'Kitchen') {
  const orders = db
    .prepare(
      `SELECT * FROM orders
       WHERE status IN ('Confirmed', 'Preparing', 'Ready')
       ORDER BY confirmed_at ASC`,
    )
    .all() as Record<string, unknown>[];

  return orders
    .map((o) => {
      const items = getOrderItems(db, o.id as number).filter(
        (i) => i.station.toLowerCase() === station.toLowerCase() || station === 'all',
      );
      if (items.length === 0 && station !== 'all') return null;
      return {
        id: o.id as number,
        tableLabel: (o.table_label as string) || 'Counter',
        status: o.status as string,
        confirmedAt: (o.confirmed_at as string) ?? (o.created_at as string),
        items: items.length ? items : getOrderItems(db, o.id as number),
      };
    })
    .filter(Boolean);
}

export function bumpOrder(db: Database.Database, orderId: number, target: 'Preparing' | 'Ready') {
  const order = getOrderById(db, orderId);
  if (!order) throw new Error('Order not found');
  if (target === 'Preparing' && order.status === 'Confirmed') {
    return transitionOrderStatus(db, orderId, 'Preparing', 'kds');
  }
  if (target === 'Ready' && (order.status === 'Preparing' || order.status === 'Confirmed')) {
    return transitionOrderStatus(db, orderId, 'Ready', 'kds');
  }
  throw new Error(`Cannot bump order ${orderId} from ${order.status} to ${target}`);
}
