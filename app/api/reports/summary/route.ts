import { NextResponse } from 'next/server';
import { getDb, COMPLETED_STATUSES } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';
import { getLiveOrderCounts } from '@/lib/repositories/orders';

export async function GET() {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const num = (sql: string) => (db.prepare(sql).get() as { v: number }).v ?? 0;

  const totalSales = num(`SELECT COALESCE(SUM(total), 0) AS v FROM orders WHERE status IN ${COMPLETED_STATUSES}`);
  const orderCount = num(`SELECT COUNT(*) AS v FROM orders WHERE status IN ${COMPLETED_STATUSES}`);
  const avgOrderValue = orderCount ? totalSales / orderCount : 0;
  const itemsSold = num(`SELECT COALESCE(SUM(item_count), 0) AS v FROM orders WHERE status IN ${COMPLETED_STATUSES}`);

  const counts = {
    categories: num('SELECT COUNT(*) AS v FROM categories'),
    items: num('SELECT COUNT(*) AS v FROM items'),
    customers: num('SELECT COUNT(*) AS v FROM customers'),
    inventory: num('SELECT COUNT(*) AS v FROM inventory'),
    lowStock: num('SELECT COUNT(*) AS v FROM inventory WHERE quantity <= reorder_level'),
    staff: num('SELECT COUNT(*) AS v FROM staff'),
    locations: num('SELECT COUNT(*) AS v FROM locations'),
  };

  const salesRows = db
    .prepare(
      `SELECT substr(created_at, 1, 10) AS day, COALESCE(SUM(total), 0) AS total, COUNT(*) AS orders
       FROM orders WHERE status IN ${COMPLETED_STATUSES}
       GROUP BY day ORDER BY day ASC`,
    )
    .all() as { day: string; total: number; orders: number }[];

  const salesByDay: { day: string; total: number; orders: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const found = salesRows.find((r) => r.day === key);
    salesByDay.push({ day: key, total: found?.total ?? 0, orders: found?.orders ?? 0 });
  }

  const topItems = db
    .prepare(
      `SELECT oi.item_name AS name, SUM(oi.qty) AS qty, SUM(oi.qty * oi.price) AS revenue
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id AND o.status IN ${COMPLETED_STATUSES}
       GROUP BY oi.item_name ORDER BY qty DESC LIMIT 8`,
    )
    .all() as { name: string; qty: number; revenue: number }[];

  const recentOrders = db
    .prepare(
      `SELECT id, created_at AS createdAt, customer, total, item_count AS itemCount, status, table_label AS tableLabel
       FROM orders ORDER BY created_at DESC LIMIT 10`,
    )
    .all();

  const kitchenStatus = getLiveOrderCounts(db);
  const activeTables = num(`SELECT COUNT(*) AS v FROM restaurant_tables WHERE status = 'occupied'`);

  return NextResponse.json({
    metrics: { totalSales, orderCount, avgOrderValue, itemsSold },
    counts,
    salesByDay,
    topItems,
    recentOrders,
    kitchenStatus,
    activeTables,
  });
}
