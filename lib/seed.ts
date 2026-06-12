import type Database from 'better-sqlite3';
import { DEMO_LOGIN_USERS } from './demo-users.constants';
import {
  ADDONS_DATA,
  CATEGORIES_DATA,
  ITEMS_DATA,
  SUB_CATEGORIES_DATA,
  VARIANTS_DATA,
} from './menu-data';

// Helper: row count in a table
const count = (db: Database.Database, table: string) =>
  (db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get() as { c: number }).c;

// Seeds the database once (only when a table is empty).
export function seedDatabase(db: Database.Database) {
  const seed = db.transaction(() => {
    // ── Outlets ────────────────────────────────────────────────
    if (count(db, 'outlets') === 0) {
      const ins = db.prepare('INSERT INTO outlets (name) VALUES (?)');
      ['sobos Trial 2', 'Warehouse - Trial'].forEach((n) => ins.run(n));
    }

    // ── Super Categories ───────────────────────────────────────
    if (count(db, 'super_categories') === 0) {
      const ins = db.prepare('INSERT INTO super_categories (name, display_order) VALUES (?, ?)');
      [
        ['Food', 1],
        ['Beverages', 2],
        ['Desserts', 3],
      ].forEach(([n, o]) => ins.run(n, o));
    }

    // ── Categories ─────────────────────────────────────────────
    if (count(db, 'categories') === 0) {
      const ins = db.prepare('INSERT INTO categories (name, online_display_name, item_count) VALUES (?, ?, ?)');
      CATEGORIES_DATA.forEach((c) => ins.run(c.name, c.onlineDisplayName, c.itemCount));
    }

    // ── Sub Categories ─────────────────────────────────────────
    if (count(db, 'sub_categories') === 0) {
      const ins = db.prepare('INSERT INTO sub_categories (name, category) VALUES (?, ?)');
      SUB_CATEGORIES_DATA.forEach((s) => ins.run(s.name, s.category));
    }

    // ── Items (Menu) ───────────────────────────────────────────
    if (count(db, 'items') === 0) {
      const ins = db.prepare(
        `INSERT INTO items (name, display_name, category, short_code, base_price, tax, mrp)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      );
      ITEMS_DATA.forEach((i) =>
        ins.run(i.name, i.displayName, i.category, i.shortCode, i.basePrice, i.tax, i.mrp),
      );
    }

    // ── Add-ons ────────────────────────────────────────────────
    if (count(db, 'addons') === 0) {
      const ins = db.prepare('INSERT INTO addons (name, display_name, items) VALUES (?, ?, ?)');
      ADDONS_DATA.forEach((a) => ins.run(a.name, a.displayName, a.items));
    }

    // ── Variants ───────────────────────────────────────────────
    if (count(db, 'variants') === 0) {
      const ins = db.prepare('INSERT INTO variants (name) VALUES (?)');
      VARIANTS_DATA.forEach((v) => ins.run(v));
    }

    // ── Submenus ───────────────────────────────────────────────
    if (count(db, 'submenu') === 0) {
      const ins = db.prepare('INSERT INTO submenu (name, is_active) VALUES (?, ?)');
      [
        ['Lunch Menu', 1],
        ['Dinner Menu', 1],
        ['Happy Hours', 0],
        ['Weekend Specials', 1],
      ].forEach(([n, a]) => ins.run(n, a));
    }

    // ── Inventory ──────────────────────────────────────────────
    if (count(db, 'inventory') === 0) {
      const ins = db.prepare(
        `INSERT INTO inventory (name, unit, quantity, reorder_level, category, avg_cost_unit, available_p, available_s, alert)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      [
        ['Paneer', 'kg', 24, 10, 'Dairy', 320, '24 kg', '24000.00 gm', '--'],
        ['Basmati Rice', 'kg', 80, 25, 'Grains', 75, '80 kg', '80000.00 gm', '--'],
        ['Refined Oil', 'ltr', 45, 20, 'Oils', 140, '45 ltr', '45.00 ltr', '--'],
        ['Tomato', 'kg', 18, 15, 'Vegetables', 28, '18 kg', '18000.00 gm', '--'],
        ['Onion', 'kg', 60, 20, 'Vegetables', 22, '60 kg', '60000.00 gm', '--'],
        ['Wheat Flour', 'kg', 50, 20, 'Grains', 42, '50 kg', '50000.00 gm', '--'],
        ['Coca-Cola 750ml', 'btl', 8, 24, 'Beverages', 45, '8 btl', '8.00 btl', '⚠️ Low'],
        ['Cheese Slice', 'pkt', 12, 10, 'Dairy', 95, '12 pkt', '12.00 pkt', '--'],
        ['Butter', 'kg', 9, 8, 'Dairy', 480, '9 kg', '9000.00 gm', '--'],
        ['Chicken', 'kg', 30, 12, 'Meat', 220, '30 kg', '30000.00 gm', '--'],
        ['AMUL PROCESSED CHEESE', 'pkt', 1, 0, 'Tea And Snacks', 1.11, '1 0.5Kg', '500.00 gm', '--'],
        ['Atta', 'kg', 119.17, 0, 'Tea And Snacks', 0, '119.17 1 kg', '119165.00 gm', '--'],
        ['Capsicum', 'kg', 8.75, 0, 'Tea And Snacks', 0.05, '8.75 1 kg', '8750.00 gm', '--'],
        ['Chicken 65', 'pcs', 31, 0, 'Tea And Snacks', 1.00, '31 piece', '31.00 piece', '--'],
        ['KIM JUMBO BREAD', 'pkt', 0, 0, 'Tea And Snacks', 0.28, '0 0.5Kg', '0 gm', '--'],
        ['Noodles', 'pkt', 6.25, 0, 'Tea And Snacks', 0.06, '6.25 1 packet (1 kg)', '6250.00 gm', '--'],
        ['Pepsi Bottle', 'btl', -0.10, 0, 'Tea And Snacks', 0.10, '-0.10 1 packet (10 piece)', '-1.00 piece', '--'],
        ['Potato', 'kg', 11, 0, 'Tea And Snacks', 0.03, '11 kg', '1000.00 gm', '--'],
        ['Garlic', 'kg', 5, 3, 'Vegetables', 80, '5 kg', '5000.00 gm', '--'],
        ['Ginger', 'kg', 4, 2, 'Vegetables', 120, '4 kg', '4000.00 gm', '--'],
        ['Green Chilli', 'kg', 3, 1, 'Vegetables', 60, '3 kg', '3000.00 gm', '--'],
        ['Coriander', 'kg', 2, 1, 'Vegetables', 40, '2 kg', '2000.00 gm', '--'],
        ['Eggs', 'tray', 10, 5, 'Dairy', 120, '10 trays', '300.00 pcs', '--'],
        ['Mutton', 'kg', 15, 5, 'Meat', 680, '15 kg', '15000.00 gm', '--'],
        ['Fish', 'kg', 8, 3, 'Meat', 320, '8 kg', '8000.00 gm', '--'],
      ].forEach((r) =>
        ins.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8]),
      );
    }

    // ── Customers ──────────────────────────────────────────────
    if (count(db, 'customers') === 0) {
      const ins = db.prepare(
        `INSERT INTO customers (name, phone, email, visits, total_spend, last_visited, total_orders, balance)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      [
        ['Rahul Sharma', '9876543210', 'rahul@example.com', 14, 8420, '06/06/2026', 14, 0],
        ['Priya Menon', '9823456710', 'priya@example.com', 9, 5310, '05/06/2026', 9, 0],
        ['Aman Gupta', '9911223344', 'aman@example.com', 22, 13180, '04/06/2026', 22, 0],
        ['Sneha Patil', '9090909090', 'sneha@example.com', 5, 2240, '01/06/2026', 5, 0],
        ['Vikram Rao', '9000011122', 'vikram@example.com', 31, 19870, '07/06/2026', 31, 0],
        ['Anjali Nair', '9765432109', 'anjali@example.com', 7, 3990, '03/06/2026', 7, 0],
        ['Raj', '9632587412', 'raj@example.com', 1, 940, '06/06/2026', 1, 0],
        ['Rajababu', '9324778139', 'rajababu@example.com', 1, 165, '06/06/2026', 1, 0],
        ['Om', '9324778194', 'om@example.com', 1, 1790, '06/06/2026', 1, 0],
        ['Abc', '2525252525', '--', 1, 835, '29/05/2026', 1, 0],
        ['Gopal', '8790930575', 'gopal@example.com', 1, 500, '01/06/2026', 1, 500],
        ['Rakesh', '8530075659', 'rakesh@example.com', 3, 1655, '01/06/2026', 3, 0],
        ['Sunil Reddy Garu', '9341745559', '--', 1, 838, '16/04/2026', 1, 0],
        ['Bharath', '990664533', '--', 1, 483, '15/04/2026', 1, 0],
        ['Raghu', '9845048558', '--', 1, 542, '15/04/2026', 1, 0],
        ['Abhijeet', '9421120778', '--', 1, 189, '27/02/2026', 1, 189],
        ['MOHIT', '9802382207', '--', 1, 330, '24/02/2026', 1, 330],
        ['Twinkle', '7778489841', '--', 1, 1390, '20/02/2026', 1, 0],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7]));
    }

    // ── Locations ──────────────────────────────────────────────
    if (count(db, 'locations') === 0) {
      const ins = db.prepare('INSERT INTO locations (name, address, city, phone) VALUES (?, ?, ?, ?)');
      [
        ['sobos Trial 2', 'Shop 4, MG Road', 'Pune', '9112239021'],
        ['Warehouse - Trial', 'Plot 12, MIDC', 'Pune', '9112239022'],
        ['sobos Downtown', '1st Floor, City Mall', 'Mumbai', '9112239023'],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3]));
    }

    // ── Staff (login-capable demo users seeded in migrateV6; integration accounts here) ──
    if (count(db, 'staff') === 0) {
      const ins = db.prepare(
        'INSERT INTO staff (name, email, role, mobile, designation) VALUES (?, ?, ?, ?, ?)',
      );
      DEMO_LOGIN_USERS.forEach((u) =>
        ins.run(u.name, u.email, u.role, u.mobile, u.designation),
      );
      [
        ['Sanjay Verma', 'cashier2@sobos.com', 'Cashier', '9112230004', 'Cashier'],
        ['Amit', '', 'boy', '9877788888', 'Delivery Boy'],
        ['Dot Pe', '', 'Cashier', 'No contact', '--'],
        ['Direct Client', '', 'Cashier', 'No contact', '--'],
        ['Zomato', '', 'Cashier', 'No contact', '--'],
        ['Saaransh', '', 'Cashier', '9899345890', '--'],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3], r[4]));
    }

    // ── Settings ───────────────────────────────────────────────
    if (count(db, 'settings') === 0) {
      const ins = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
      Object.entries({
        restaurantName: 'sobos Trial 2',
        currency: 'INR (₹)',
        taxRate: '5',
        address: 'Shop 4, MG Road, Pune',
        phone: '9112239021',
        gstNumber: '27ABCDE1234F1Z5',
      }).forEach(([k, v]) => ins.run(k, v));
    }

    // ── Stations ───────────────────────────────────────────────
    if (count(db, 'stations') === 0) {
      const ins = db.prepare(
        'INSERT INTO stations (outlet_id, name, display_order, color) VALUES (?, ?, ?, ?)',
      );
      [
        [1, 'Kitchen', 1, '#3b82f6'],
        [1, 'Bar', 2, '#8b5cf6'],
        [1, 'Billing', 3, '#10b981'],
        [1, 'Delivery', 4, '#f59e0b'],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3]));
    }

    // ── Restaurant Tables ──────────────────────────────────────
    if (count(db, 'restaurant_tables') === 0) {
      const ins = db.prepare(
        `INSERT INTO restaurant_tables (outlet_id, number, capacity, section, status, pos_x, pos_y, shape)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      [
        ['T1', 2, 'Main Hall', 'available', 0, 0, 'square'],
        ['T2', 2, 'Main Hall', 'available', 1, 0, 'square'],
        ['T3', 4, 'Main Hall', 'occupied', 2, 0, 'round'],
        ['T4', 4, 'Main Hall', 'available', 0, 1, 'square'],
        ['T5', 6, 'Main Hall', 'occupied', 1, 1, 'round'],
        ['T6', 6, 'Patio', 'available', 2, 1, 'square'],
        ['T7', 4, 'Patio', 'available', 0, 2, 'square'],
        ['T8', 8, 'Private Room', 'reserved', 1, 2, 'round'],
        ['T9', 2, 'Patio', 'available', 2, 2, 'square'],
        ['T10', 4, 'Main Hall', 'occupied', 3, 0, 'square'],
      ].forEach((t) => ins.run(1, t[0], t[1], t[2], t[3], t[4], t[5], t[6]));
    }

    // ── Charges ────────────────────────────────────────────────
    if (count(db, 'charges') === 0) {
      const ins = db.prepare('INSERT INTO charges (name) VALUES (?)');
      [
        'Packaging Charges Platter',
        'Packaging Charges 12pc',
        'Packaging charge 24 platter',
        'Packaging Charges By Percent',
        'Packaging Charges',
        'Delivery Charge',
        'Service Charge',
        'GST 5%',
        'GST 12%',
        'Container Deposit',
      ].forEach((n) => ins.run(n));
    }

    // ── Departments ────────────────────────────────────────────
    if (count(db, 'departments') === 0) {
      const ins = db.prepare('INSERT INTO departments (name) VALUES (?)');
      ['Kitchen', 'Service', 'Bar', 'Delivery', 'Housekeeping', 'Accounts'].forEach((n) =>
        ins.run(n),
      );
    }

    // ── Booklets ───────────────────────────────────────────────
    if (count(db, 'booklets') === 0) {
      const ins = db.prepare('INSERT INTO booklets (name) VALUES (?)');
      ['Gopal', 'Ravi', 'Main Register', 'Online Orders'].forEach((n) => ins.run(n));
    }

    // ── Bank Accounts ──────────────────────────────────────────
    if (count(db, 'bank_accounts') === 0) {
      const ins = db.prepare('INSERT INTO bank_accounts (name, mobile) VALUES (?, ?)');
      [
        ['Bank', 'No contact'],
        ['Dunzo Cod', 'No contact'],
        ['Dot Pe', 'No contact'],
        ['Swiggy', 'No contact'],
        ['Zomato', 'No contact'],
        ['Google Pay', '9000000001'],
        ['PhonePe', '9000000002'],
        ['Paytm', '9000000003'],
        ['Cash Drawer', 'No contact'],
        ['UPI Collection', 'No contact'],
      ].forEach(([n, m]) => ins.run(n, m));
    }

    // ── Credit Sales ───────────────────────────────────────────
    if (count(db, 'credit_sales') === 0) {
      const ins = db.prepare(
        'INSERT INTO credit_sales (invoice_no, customer, total_amount, balance_amount, date) VALUES (?, ?, ?, ?, ?)',
      );
      [
        ['CZ-12', 'Bonny', 665, 665, '17/06/2025 01:38 PM'],
        ['CZ-10', 'Bonny', 1680, 1680, '17/06/2025 01:28 PM'],
        ['CZ-11', 'Rahul Sharma', 920, 920, '10/06/2025 12:15 PM'],
        ['CZ-9', 'Vikram Rao', 2400, 0, '05/06/2025 07:30 PM'],
        ['AB-1', 'Bonny', 82, 82, '30/04/2025 10:31 AM'],
        ['TC-3894', 'Parth', 170, 170, '10/10/2024 05:11 PM'],
        ['t-436', 'Sale Account', 2415, 2415, '03/08/2023 12:25 PM'],
        ['CZ-8', 'Anjali Nair', 545, 545, '01/06/2026 03:45 PM'],
        ['CZ-7', 'Gopal', 500, 0, '01/06/2026 11:00 AM'],
        ['CZ-6', 'Aman Gupta', 1350, 1350, '28/05/2026 08:15 PM'],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3], r[4]));
    }

    // ── Credit Purchases ───────────────────────────────────────
    if (count(db, 'credit_purchases') === 0) {
      const ins = db.prepare(
        'INSERT INTO credit_purchases (invoice_no, vendor_name, total_amount, balance_amount, date) VALUES (?, ?, ?, ?, ?)',
      );
      [
        ['PI-7', 'Caspian Caviar', 585, 585, '01/03/2026 02:15 PM'],
        ['PI-6', 'Laxmi Stores', 5000, 5000, '03/12/2025 07:14 PM'],
        ['PI-5', 'Balaji Traders', 1100, 1100, '04/07/2025 01:17 PM'],
        ['PI-4', 'Hook Catch', 5000, 5000, '26/06/2025 04:56 PM'],
        ['PI-3', 'Zomato Hyperpure', 0, 0, '13/05/2025 10:00 AM'],
        ['PI-2', 'Balaji Traders', 2, 0, '02/05/2025 11:36 AM'],
        ['PI-1', 'Hook Catch', 20, 20, '02/05/2025 12:11 PM'],
        ['PI-1', 'Caspian Caviar', 50, 50, '02/05/2025 11:36 AM'],
        ['PI-48', 'Balaji Traders', 10, 10, '31/01/2025 11:32 AM'],
        ['PI-47', 'Balaji Traders', 1, 1, '20/12/2024 05:38 PM'],
        ['PI-46', 'Balaji Traders', 140, 140, '20/12/2024 05:37 PM'],
        ['PI-45', 'Balaji Traders', 1500, 1500, '20/12/2024 04:19 PM'],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3], r[4]));
    }

    // ── Expenses ───────────────────────────────────────────────
    if (count(db, 'expenses') === 0) {
      const ins = db.prepare(
        'INSERT INTO expenses (expense_no, date, paid_to, grand_total, items_count) VALUES (?, ?, ?, ?, ?)',
      );
      [
        ['E-11', '04 Dec 2025', 'Divya', 650, 1],
        ['E-10', '04 Dec 2025', 'Divya', 300, 1],
        ['E-9', '04 Dec 2025', 'Divya', 500, 1],
        ['E-8', '21 Nov 2024', 'Balaji Traders', 1440, 2],
        ['E-7', '19 Nov 2024', 'Direct Client', 140, 1],
        ['E-6', '19 Nov 2024', 'Direct Client', 40567, 3],
        ['E-5', '15 Nov 2024', 'Rana Enterprises', 10000, 0],
        ['E-4', '12 Oct 2024', 'Caspian Caviar', 29, 1],
        ['E-3', '23 Sep 2024', 'Saaransh', 200, 1],
        ['E-2', '16 Aug 2024', 'Divya', 150, 0],
        ['E-1', '01 Jul 2024', 'Ravi Kumar', 800, 2],
        ['E-12', '10 Jan 2026', 'Electricity Board', 3200, 1],
        ['E-13', '15 Feb 2026', 'Gas Agency', 1800, 1],
        ['E-14', '01 Mar 2026', 'Staff Salary', 45000, 10],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3], r[4]));
    }

    // ── Kitchens ───────────────────────────────────────────────
    if (count(db, 'kitchens') === 0) {
      const ins = db.prepare(
        `INSERT INTO kitchens (
          name, description, disable_prints, main_printer_name, main_printer_type,
          alt_printer_name, alt_printer_type, dine_in_token_printer, pickup_printer_name,
          delivery_printer_name, menu_items_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );

      const kitchenItems = JSON.stringify([
        { id: '1', name: '7Up - D' },
        { id: '2', name: '8Pcs Fried Momos - DM' },
        { id: '3', name: '8Pcs Pan Tossed Momos - DM' },
        { id: '4', name: '8Pcs Steamed Momos - DM' },
        { id: '5', name: '8Pcs Tandoori Momos - DM' },
        { id: '6', name: 'Aachari Paneer Tikka Roll' },
        { id: '7', name: 'Aachari Soya Chaap' },
        { id: '8', name: 'Aaloo Kobi - D' },
        { id: '9', name: 'Aaloo Pakoda - D' },
        { id: '10', name: 'Aamchi Chatpata Chowmin' },
        { id: '11', name: 'Absolut Vodka 30Ml - D' },
        { id: '12', name: 'Absolut Vodka 60Ml - D' },
        { id: '13', name: 'Absolut Vodka 90Ml - D' },
      ]);

      const barItems = JSON.stringify([
        { id: '1', name: 'Kingfisher Beer' },
        { id: '2', name: 'Absolut Vodka 30Ml - D' },
        { id: '3', name: 'Absolut Vodka 60Ml - D' },
        { id: '4', name: 'Whisky 30ml' },
        { id: '5', name: 'Rum 30ml' },
        { id: '6', name: 'Cold Coffee' },
        { id: '7', name: '7Up - D' },
        { id: '8', name: 'Fresh Lime Soda' },
      ]);

      [
        ['KOT', 'Main kitchen order ticket printer group', 0, 'KITCHEN', 'Network', 'KITCHEN_ALT', 'USB', 'DINEIN_PRT', 'PICKUP_PRT', 'DELIVERY_PRT', kitchenItems],
        ['Bar', 'Bar and beverages station', 0, 'BAR_PRT', 'Network', '', 'USB', '', 'PICKUP_PRT', '', barItems],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10]));
    }

    // ── Produced Stocks ────────────────────────────────────────
    if (count(db, 'produced_stocks') === 0) {
      const ins = db.prepare('INSERT INTO produced_stocks (id, date, status) VALUES (?, ?, ?)');
      [
        ['SRL-5', '03 Jan 2021', 'Open'],
        ['SRL-4', '15 Nov 2020', 'Completed'],
        ['SRL-3', '02 Oct 2020', 'Completed'],
        ['SRL-2', '20 Aug 2020', 'Completed'],
        ['SRL-1', '10 Jul 2020', 'Completed'],
      ].forEach((r) => ins.run(r[0], r[1], r[2]));
    }

    // ── Sobos Purchase Orders ────────────────────────────────
    if (count(db, 'sobos_purchase_orders') === 0) {
      const ins = db.prepare(
        `INSERT INTO sobos_purchase_orders
          (id, ledger, number, date, created_on, expected_delivery_date, total_amount, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      [
        ['PO1-1', 'Caspian Caviar', '9810344318', '02 May 2025', '02 May 2025', '09 May 2025', 50, 'PO Generated'],
        ['PO1-2', 'Hook Catch', '8800611156', '30 Apr 2024', '30 Apr 2024', '30 Apr 2024', 30, 'Send'],
        ['PO1-3', 'Balaji Traders', '1234567890', '10 Mar 2025', '10 Mar 2025', '17 Mar 2025', 1500, 'PO Generated'],
        ['PO1-4', 'Laxmi Stores', '9999999999', '05 Feb 2025', '05 Feb 2025', '12 Feb 2025', 3200, 'Send'],
        ['PO1-5', 'Vegetable Vendor', '7777777777', '01 Jun 2026', '01 Jun 2026', '03 Jun 2026', 800, 'PO Generated'],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7]));
    }

    // ── Purchase Invoices ──────────────────────────────────────
    if (count(db, 'purchase_invoices') === 0) {
      const ins = db.prepare(
        `INSERT INTO purchase_invoices
          (id, bill_ref_no, vendor_name, number, invoice_date, created_on, payment_due_date, grand_total, status, balance, settlement)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      );
      [
        ['PI-1', '--', 'Caspian Caviar', '9810344338', '02 May 2025', '02 Jun 2026', '--', 50, 'Received', 50, 'Pay'],
        ['PI-7', '23102', 'Caspian Caviar', '9810344318', '01 Mar 2026', '01 Mar 2026', '04 Mar 2028', 585, 'Received', 585, 'Pay'],
        ['PI-6', '123', 'Laxmi Stores', '9999999999', '03 Dec 2025', '03 Dec 2025', '15 Dec 2025', 5000, 'Received', 5000, 'Pay'],
        ['PI-5', '--', 'Balaji Traders', '1234567890', '04 Jul 2025', '04 Jul 2025', '--', 1100, 'Received', 1100, 'Pay'],
        ['PI-4', '--', 'Hook Catch', '8800611156', '26 Jun 2025', '26 Jun 2025', '--', 5000, 'Received', 5000, 'Pay'],
        ['PI-3', '22485664', 'Zomato Hyperpure', '--', '13 May 2025', '16 May 2025', '--', 0, 'Received', 0, 'Settled'],
        ['PI-2', '--', 'Balaji Traders', '1234567890', '02 May 2025', '02 May 2025', '--', 2, 'Received', 0, 'Settled'],
        ['PI-8', '--', 'Hook Catch', '8800611156', '02 May 2025', '02 May 2025', '--', 20, 'Received', 20, 'Pay'],
        ['PI-48', '--', 'Balaji Traders', '1234567890', '31 Jan 2025', '31 Jan 2025', '--', 10, 'Received', 10, 'Pay'],
        ['PI-47', '--', 'Balaji Traders', '1234567890', '20 Dec 2024', '20 Dec 2024', '--', 1, 'Received', 1, 'Pay'],
        ['PI-46', '--', 'Balaji Traders', '1234567890', '20 Dec 2024', '20 Dec 2024', '--', 140, 'Received', 140, 'Pay'],
        ['PI-45', '--', 'Balaji Traders', '1234567890', '20 Dec 2024', '20 Dec 2024', '--', 1500, 'Received', 1500, 'Pay'],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10]));
    }

    // ── Vendors ────────────────────────────────────────────────
    if (count(db, 'vendors') === 0) {
      const ins = db.prepare(
        'INSERT INTO vendors (name, phone, email, address, mobile, gst_no, balance, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      );
      [
        ['Vegetable Vendor', '777777777', '--', 'Local Market', '777777777', '--', 0, 'Vegetables'],
        ['Laxmi Stores', '999999999', '--', 'Main Bazar', '999999999', '--', 5000, 'Grocery'],
        ['Tirupati', '2323232323', '--', 'Near Temple', '2323232323', '--', 0, 'Vegetables'],
        ['Balaji Traders', '1234567890', 'balaji@trade.com', 'Industrial Area', '1234567890', 'GST123456', 187116, 'Grocery'],
        ['Hook Catch', '8800611156', '--', 'Fish Market', '8800611156', '--', 5000, 'Seafood'],
        ['Caspian Caviar', '9810344318', 'caspian@caviar.com', 'Delhi', '9810344318', 'GST789012', 585, 'Premium'],
        ['Zomato Hyperpure', '9999000001', 'supply@zomato.com', 'Online', '9999000001', 'GST345678', 0, 'Online'],
        ['Amul Distributor', '9880001122', 'amul@dist.com', 'Dairy Hub', '9880001122', 'GST901234', 0, 'Dairy'],
      ].forEach((r) => ins.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7]));
    }

    // ── Orders (seed 60+ days of realistic orders) ─────────────
    if (count(db, 'orders') === 0) {
      seedOrders(db);
    }

    // ── Campaigns (Offers/Loyalty Plans/Redemptions) ───────────
    if (count(db, 'campaigns') === 0) {
      const ins = db.prepare(`
        INSERT INTO campaigns (campaign_category, name, description, promocode, type, start_date, end_date, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      ins.run('offer', 'Summer general discount', 'Summer promotional offer', 'SUMMER20', 'GENERAL DISCOUNT', '10-Jun-2026', '30-Jun-2026', 1);
      ins.run('offer', 'BOGO Buy 1 Get 1 Pizzas', 'Buy 1 get 1 free on all pizzas', 'BOGOPZ', 'BOGO', '01-Jun-2026', '15-Jun-2026', 1);
      ins.run('offer', 'DEWALI', 'Festive season discount scheme', 'DEWALI', 'GENERAL DISCOUNT', '12-Jun-2026', '30-Jun-2026', 1);
    }

    // ── Offer QRs ──────────────────────────────────────────────
    if (count(db, 'offer_qrs') === 0) {
      const ins = db.prepare(`
        INSERT INTO offer_qrs (name, type, offer, thank_you_message, home_screen_message, is_active, print_pos, print_online)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      ins.run('DEWALI', 'With Offer', 'DEWALI', 'JNJM', 'RFGGJBH', 1, 1, 1);
      ins.run('Gopal', 'Without Offer', '', 'Thank you for visiting!', 'Welcome to our store!', 1, 0, 0);
    }

    // ── OTPs ───────────────────────────────────────────────────
    if (count(db, 'otps') === 0) {
      const ins = db.prepare('INSERT OR REPLACE INTO otps (email, code, expires_at) VALUES (?, ?, ?)');
      ins.run('admin@sobos.com', '555222', '2030-01-01 00:00:00');
      ins.run('cashier@sobos.com', '123456', '2030-01-01 00:00:00');
    }

    // ── Table Sessions ─────────────────────────────────────────
    if (count(db, 'table_sessions') === 0) {
      const ins = db.prepare(`
        INSERT INTO table_sessions (table_id, outlet_id, status, opened_at, closed_at, guest_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      ins.run(3, 1, 'active', new Date().toISOString(), null, 4);
      ins.run(5, 1, 'active', new Date().toISOString(), null, 6);
      ins.run(10, 1, 'active', new Date().toISOString(), null, 2);
      ins.run(1, 1, 'closed', '2026-06-11T12:00:00.000Z', '2026-06-11T13:30:00.000Z', 2);
      ins.run(2, 1, 'closed', '2026-06-11T18:00:00.000Z', '2026-06-11T19:15:00.000Z', 3);
    }

    // ── Held Orders ────────────────────────────────────────────
    if (count(db, 'held_orders') === 0) {
      const ins = db.prepare('INSERT INTO held_orders (outlet_id, label, cart_json, created_at) VALUES (?, ?, ?, ?)');
      const cart1 = JSON.stringify([
        { id: 1, name: 'Paneer Tikka Roll', qty: 2, price: 180 },
        { id: 7, name: '7Up - D', qty: 3, price: 40 }
      ]);
      const cart2 = JSON.stringify([
        { id: 3, name: 'Chicken Biryani', qty: 1, price: 320 },
        { id: 10, name: 'Cold Coffee', qty: 1, price: 90 }
      ]);
      ins.run(1, 'Table 4 Draft', cart1, new Date().toISOString());
      ins.run(1, 'Quick Delivery Bill', cart2, new Date().toISOString());
    }

    // ── Stock Movements ────────────────────────────────────────
    if (count(db, 'stock_movements') === 0) {
      const ins = db.prepare('INSERT INTO stock_movements (inventory_id, type, quantity, reason, created_at) VALUES (?, ?, ?, ?, ?)');
      ins.run(1, 'IN', 50, 'Purchase Invoice PI-7', '2026-06-01T10:00:00.000Z');
      ins.run(1, 'OUT', 5, 'Spillage / Wastage', '2026-06-05T15:30:00.000Z');
      ins.run(2, 'IN', 100, 'Initial Stock Seeding', '2026-05-15T09:00:00.000Z');
      ins.run(4, 'OUT', 2, 'Damaged during prep', '2026-06-10T11:20:00.000Z');
    }

    // ── Recipes & Recipe Ingredients ───────────────────────────
    if (count(db, 'recipes') === 0) {
      const insRecipe = db.prepare('INSERT INTO recipes (item_id, name) VALUES (?, ?)');
      const insIngredient = db.prepare('INSERT INTO recipe_ingredients (recipe_id, inventory_id, quantity) VALUES (?, ?, ?)');
      
      const rId1 = Number(insRecipe.run(1, 'Paneer Tikka').lastInsertRowid);
      insIngredient.run(rId1, 1, 0.2);
      insIngredient.run(rId1, 9, 0.05);
      
      const rId2 = Number(insRecipe.run(3, 'Chicken Biryani').lastInsertRowid);
      insIngredient.run(rId2, 2, 0.15);
      insIngredient.run(rId2, 10, 0.2);
    }

    // ── Loyalty Points ─────────────────────────────────────────
    if (count(db, 'loyalty_points') === 0) {
      const ins = db.prepare('INSERT INTO loyalty_points (customer_id, points, reason, created_at) VALUES (?, ?, ?, ?)');
      ins.run(1, 150, 'Order #1 Billing reward points', '2026-06-01T12:00:00.000Z');
      ins.run(2, 80, 'Sign up bonus loyalty points', '2026-06-02T15:00:00.000Z');
      ins.run(1, -50, 'Redeemed on order #12', '2026-06-08T19:30:00.000Z');
      ins.run(3, 300, 'Birthday promotional points bonus', '2026-06-12T09:00:00.000Z');
    }

    // ── Audit Logs ─────────────────────────────────────────────
    if (count(db, 'audit_log') === 0) {
      const ins = db.prepare('INSERT INTO audit_log (actor, action, resource, resource_id, detail_json, created_at) VALUES (?, ?, ?, ?, ?, ?)');
      ins.run('admin@sobos.com', 'create', 'menu_item', '201', JSON.stringify({ name: 'Special Burger' }), '2026-06-11T10:00:00.000Z');
      ins.run('cashier2@sobos.com', 'login', 'session', '30291', '{}', '2026-06-12T08:00:00.000Z');
      ins.run('admin@sobos.com', 'update', 'settings', 'loyaltySetting', '{"enabled":true}', '2026-06-12T09:15:00.000Z');
    }

    // ── Legacy Purchase Orders ─────────────────────────────────
    if (count(db, 'purchase_orders') === 0) {
      const ins = db.prepare('INSERT INTO purchase_orders (vendor_id, status, total, created_at, received_at) VALUES (?, ?, ?, ?, ?)');
      ins.run(1, 'completed', 450, '2026-05-10T10:00:00.000Z', '2026-05-12T11:00:00.000Z');
      ins.run(2, 'draft', 1200, '2026-06-08T15:30:00.000Z', null);
    }

    // ── Order Status Log ───────────────────────────────────────
    if (count(db, 'order_status_log') === 0) {
      const ins = db.prepare(`
        INSERT INTO order_status_log (order_id, from_status, to_status, changed_at, changed_by)
        VALUES (?, ?, ?, ?, ?)
      `);
      const ordersList = db.prepare('SELECT id, created_at, status FROM orders LIMIT 20').all() as { id: number; created_at: string; status: string }[];
      ordersList.forEach((o) => {
        ins.run(o.id, 'Pending', 'Preparing', o.created_at, 'system');
        if (o.status === 'Paid' || o.status === 'Served' || o.status === 'Completed') {
          ins.run(o.id, 'Preparing', 'Ready', o.created_at, 'system');
          ins.run(o.id, 'Ready', o.status, o.created_at, 'cashier@sobos.com');
        } else if (o.status === 'Cancelled') {
          ins.run(o.id, 'Preparing', 'Cancelled', o.created_at, 'admin@sobos.com');
        }
      });
    }
  });

  seed();
}

// Generates ~70 realistic orders over the last 30 days with proper data.
function seedOrders(db: Database.Database) {
  const insOrder = db.prepare(
    `INSERT INTO orders
       (created_at, customer, total, item_count, status, subtotal, tax, discount, order_type, table_label, outlet_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insLine = db.prepare(
    'INSERT INTO order_items (order_id, item_name, qty, price) VALUES (?, ?, ?, ?)',
  );

  const customers = [
    'Walk-in', 'Rahul Sharma', 'Priya Menon', 'Aman Gupta',
    'Sneha Patil', 'Vikram Rao', 'Anjali Nair', 'Gopal', 'Rakesh',
  ];
  const orderTypes = ['dine_in', 'dine_in', 'dine_in', 'delivery', 'pickup'];
  const tableLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', ''];

  const menu = ITEMS_DATA.length
    ? ITEMS_DATA.filter((i) => i.basePrice > 0).map((i) => ({
        name: i.displayName || i.name,
        price: i.basePrice,
      }))
    : [
        { name: 'Paneer Tikka', price: 280 },
        { name: 'Veg Fried Rice', price: 160 },
        { name: 'Chicken Biryani', price: 320 },
        { name: 'Dal Makhani', price: 180 },
        { name: 'Naan', price: 40 },
        { name: 'Butter Chicken', price: 340 },
        { name: 'Veg Chowmein', price: 140 },
        { name: 'Mango Lassi', price: 80 },
        { name: 'Cold Coffee', price: 90 },
        { name: 'Gulab Jamun', price: 60 },
      ];

  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const statuses = (r: number) => (r < 0.75 ? 'Paid' : r < 0.85 ? 'Served' : r < 0.92 ? 'Preparing' : 'Cancelled');

  // Seed orders for last 30 days
  for (let day = 29; day >= 0; day--) {
    const ordersToday = 3 + Math.floor(Math.random() * 7); // 3-9 orders per day
    for (let o = 0; o < ordersToday; o++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(10 + Math.floor(Math.random() * 11), Math.floor(Math.random() * 60), 0, 0);

      const lineCount = 1 + Math.floor(Math.random() * 5);
      const lines: { name: string; qty: number; price: number }[] = [];
      let subtotal = 0;
      let itemCount = 0;

      for (let l = 0; l < lineCount; l++) {
        const m = pick(menu);
        const qty = 1 + Math.floor(Math.random() * 3);
        lines.push({ name: m.name, qty, price: m.price });
        subtotal += qty * m.price;
        itemCount += qty;
      }

      const taxAmt = Math.round(subtotal * 0.05);
      const discount = Math.random() < 0.1 ? Math.round(subtotal * 0.1) : 0;
      const total = subtotal + taxAmt - discount;
      const status = statuses(Math.random());
      const orderType = pick(orderTypes);
      const tableLabel = orderType === 'dine_in' ? pick(tableLabels.slice(0, 10)) : '';

      const info = insOrder.run(
        date.toISOString(),
        pick(customers),
        total,
        itemCount,
        status,
        subtotal,
        taxAmt,
        discount,
        orderType,
        tableLabel,
        1,
      );
      lines.forEach((ln) => insLine.run(info.lastInsertRowid, ln.name, ln.qty, ln.price));

      if (status !== 'Cancelled') {
        const paymentMethod = pick(['cash', 'card', 'UPI', 'Google Pay', 'PhonePe', 'Swiggy', 'Zomato']);
        db.prepare(`
          INSERT INTO payments (order_id, method, amount, status, reference, created_at)
          VALUES (?, ?, ?, 'captured', ?, ?)
        `).run(
          info.lastInsertRowid,
          paymentMethod,
          total,
          'REF-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          date.toISOString()
        );
      }
    }
  }
}
