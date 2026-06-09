import type Database from 'better-sqlite3';
import {
  ADDONS_DATA,
  CATEGORIES_DATA,
  ITEMS_DATA,
  SUB_CATEGORIES_DATA,
  VARIANTS_DATA,
} from './menu-data';

// Seeds the database once (only when a table is empty), using the original
// hardcoded UI data as the initial dataset.
export function seedDatabase(db: Database.Database) {
  const count = (table: string) =>
    (db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get() as { c: number }).c;

  const seed = db.transaction(() => {
    if (count('outlets') === 0) {
      const ins = db.prepare('INSERT INTO outlets (name) VALUES (?)');
      ['shobox Trial 2', 'Warehouse - Trial'].forEach((n) => ins.run(n));
    }

    if (count('super_categories') === 0) {
      const ins = db.prepare(
        'INSERT INTO super_categories (name, display_order) VALUES (?, ?)',
      );
      [
        { name: 'Food', display_order: 1 },
        { name: 'Beverages', display_order: 2 },
      ].forEach((s) => ins.run(s.name, s.display_order));
    }

    if (count('categories') === 0) {
      const ins = db.prepare(
        'INSERT INTO categories (name, online_display_name, item_count) VALUES (?, ?, ?)',
      );
      CATEGORIES_DATA.forEach((c) => ins.run(c.name, c.onlineDisplayName, c.itemCount));
    }

    if (count('sub_categories') === 0) {
      const ins = db.prepare('INSERT INTO sub_categories (name, category) VALUES (?, ?)');
      SUB_CATEGORIES_DATA.forEach((s) => ins.run(s.name, s.category));
    }

    if (count('items') === 0) {
      const ins = db.prepare(
        `INSERT INTO items (name, display_name, category, short_code, base_price, tax, mrp)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      );
      ITEMS_DATA.forEach((i) =>
        ins.run(i.name, i.displayName, i.category, i.shortCode, i.basePrice, i.tax, i.mrp),
      );
    }

    if (count('addons') === 0) {
      const ins = db.prepare(
        'INSERT INTO addons (name, display_name, items) VALUES (?, ?, ?)',
      );
      ADDONS_DATA.forEach((a) => ins.run(a.name, a.displayName, a.items));
    }

    if (count('variants') === 0) {
      const ins = db.prepare('INSERT INTO variants (name) VALUES (?)');
      VARIANTS_DATA.forEach((v) => ins.run(v));
    }

    if (count('submenu') === 0) {
      const ins = db.prepare('INSERT INTO submenu (name, is_active) VALUES (?, ?)');
      [
        { name: 'Lunch Menu', is_active: 1 },
        { name: 'Dinner Menu', is_active: 1 },
        { name: 'Happy Hours', is_active: 0 },
      ].forEach((s) => ins.run(s.name, s.is_active));
    }

    if (count('inventory') === 0) {
      const ins = db.prepare(
        'INSERT INTO inventory (name, unit, quantity, reorder_level) VALUES (?, ?, ?, ?)',
      );
      [
        ['Paneer', 'kg', 24, 10],
        ['Basmati Rice', 'kg', 80, 25],
        ['Refined Oil', 'ltr', 45, 20],
        ['Tomato', 'kg', 18, 15],
        ['Onion', 'kg', 60, 20],
        ['Wheat Flour', 'kg', 50, 20],
        ['Coca-Cola 750ml', 'btl', 8, 24],
        ['Cheese Slice', 'pkt', 12, 10],
        ['Butter', 'kg', 9, 8],
        ['Chicken', 'kg', 30, 12],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3]));
    }

    if (count('customers') === 0) {
      const ins = db.prepare(
        'INSERT INTO customers (name, phone, email, visits, total_spend) VALUES (?, ?, ?, ?, ?)',
      );
      [
        ['Rahul Sharma', '9876543210', 'rahul@example.com', 14, 8420],
        ['Priya Menon', '9823456710', 'priya@example.com', 9, 5310],
        ['Aman Gupta', '9911223344', 'aman@example.com', 22, 13180],
        ['Sneha Patil', '9090909090', 'sneha@example.com', 5, 2240],
        ['Vikram Rao', '9000011122', 'vikram@example.com', 31, 19870],
        ['Anjali Nair', '9765432109', 'anjali@example.com', 7, 3990],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3], r[4]));
    }

    if (count('locations') === 0) {
      const ins = db.prepare(
        'INSERT INTO locations (name, address, city, phone) VALUES (?, ?, ?, ?)',
      );
      [
        ['shobox Trial 2', 'Shop 4, MG Road', 'Pune', '9112239021'],
        ['Warehouse - Trial', 'Plot 12, MIDC', 'Pune', '9112239022'],
        ['shobox Downtown', '1st Floor, City Mall', 'Mumbai', '9112239023'],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3]));
    }

    if (count('staff') === 0) {
      const ins = db.prepare('INSERT INTO staff (name, email, role) VALUES (?, ?, ?)');
      [
        ['Admin User', 'admin@shobox.com', 'Owner'],
        ['Ravi Kumar', 'ravi@shobox.com', 'Manager'],
        ['Meera Joshi', 'meera@shobox.com', 'Cashier'],
        ['Sanjay Verma', 'sanjay@shobox.com', 'Cashier'],
        ['Kiran Desai', 'kiran@shobox.com', 'Steward'],
      ].forEach((r) => ins.run(r[0], r[1], r[2]));
    }

    if (count('settings') === 0) {
      const ins = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
      Object.entries({
        restaurantName: 'shobox Trial 2',
        currency: 'INR (₹)',
        taxRate: '5',
        address: 'Shop 4, MG Road, Pune',
        phone: '9112239021',
        gstNumber: '27ABCDE1234F1Z5',
      }).forEach(([k, v]) => ins.run(k, v));
    }

    if (count('orders') === 0) {
      seedOrders(db);
    }
  });

  seed();
}

// Generates ~60 sample orders over the last 14 days with line items drawn from
// the seeded menu, so the Reports page has real data to aggregate and chart.
function seedOrders(db: Database.Database) {
  const insOrder = db.prepare(
    'INSERT INTO orders (created_at, customer, total, item_count, status) VALUES (?, ?, ?, ?, ?)',
  );
  const insLine = db.prepare(
    'INSERT INTO order_items (order_id, item_name, qty, price) VALUES (?, ?, ?, ?)',
  );
  const customers = ['Walk-in', 'Rahul Sharma', 'Priya Menon', 'Aman Gupta', 'Sneha Patil', 'Vikram Rao'];
  const menu = ITEMS_DATA.length
    ? ITEMS_DATA.map((i) => ({ name: i.displayName || i.name, price: i.basePrice }))
    : [{ name: 'Item', price: 100 }];

  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  for (let day = 13; day >= 0; day--) {
    const ordersToday = 3 + Math.floor(Math.random() * 6); // 3-8 orders/day
    for (let o = 0; o < ordersToday; o++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(10 + Math.floor(Math.random() * 11), Math.floor(Math.random() * 60), 0, 0);

      const lineCount = 1 + Math.floor(Math.random() * 4);
      const lines: { name: string; qty: number; price: number }[] = [];
      let total = 0;
      let itemCount = 0;
      for (let l = 0; l < lineCount; l++) {
        const m = pick(menu);
        const qty = 1 + Math.floor(Math.random() * 3);
        lines.push({ name: m.name, qty, price: m.price });
        total += qty * m.price;
        itemCount += qty;
      }
      const status = Math.random() < 0.9 ? 'Paid' : 'Cancelled';
      const info = insOrder.run(date.toISOString(), pick(customers), total, itemCount, status);
      lines.forEach((ln) => insLine.run(info.lastInsertRowid, ln.name, ln.qty, ln.price));
    }
  }
}
