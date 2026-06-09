import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';

export async function GET() {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  const num = (sql: string) => (db.prepare(sql).get() as { v: number }).v ?? 0;

  // Headline metrics (paid orders only).
  const totalSales = num("SELECT COALESCE(SUM(total), 0) AS v FROM orders WHERE status = 'Paid'");
  const orderCount = num("SELECT COUNT(*) AS v FROM orders WHERE status = 'Paid'");
  const avgOrderValue = orderCount ? totalSales / orderCount : 0;
  const itemsSold = num("SELECT COALESCE(SUM(item_count), 0) AS v FROM orders WHERE status = 'Paid'");

  // Entity counts.
  const counts = {
    categories: num('SELECT COUNT(*) AS v FROM categories'),
    items: num('SELECT COUNT(*) AS v FROM items'),
    customers: num('SELECT COUNT(*) AS v FROM customers'),
    inventory: num('SELECT COUNT(*) AS v FROM inventory'),
    lowStock: num('SELECT COUNT(*) AS v FROM inventory WHERE quantity <= reorder_level'),
    staff: num('SELECT COUNT(*) AS v FROM staff'),
    locations: num('SELECT COUNT(*) AS v FROM locations'),
  };

  // Sales for the last 14 calendar days.
  const salesRows = db
    .prepare(
      `SELECT substr(created_at, 1, 10) AS day, COALESCE(SUM(total), 0) AS total, COUNT(*) AS orders
       FROM orders WHERE status = 'Paid'
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

  // Top selling items by quantity.
  const topItems = db
    .prepare(
      `SELECT oi.item_name AS name, SUM(oi.qty) AS qty, SUM(oi.qty * oi.price) AS revenue
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id AND o.status = 'Paid'
       GROUP BY oi.item_name ORDER BY qty DESC LIMIT 8`,
    )
    .all() as { name: string; qty: number; revenue: number }[];

  // Recent orders.
  const recentOrders = db
    .prepare(
      `SELECT id, created_at AS createdAt, customer, total, item_count AS itemCount, status
       FROM orders ORDER BY created_at DESC LIMIT 10`,
    )
    .all();

  return NextResponse.json({
    metrics: { totalSales, orderCount, avgOrderValue, itemsSold },
    counts,
    salesByDay,
    topItems,
    recentOrders,
  });
}
