import type Database from 'better-sqlite3';

export function listHeldOrders(db: Database.Database, outletId: number) {
  return db
    .prepare(
      `SELECT id, outlet_id, label, cart_json, created_at
       FROM held_orders WHERE outlet_id = ? ORDER BY created_at DESC`,
    )
    .all(outletId);
}

export function saveHeldOrder(
  db: Database.Database,
  outletId: number,
  label: string,
  cartJson: string,
) {
  const info = db
    .prepare(`INSERT INTO held_orders (outlet_id, label, cart_json) VALUES (?, ?, ?)`)
    .run(outletId, label, cartJson);
  return Number(info.lastInsertRowid);
}

export function deleteHeldOrder(db: Database.Database, id: number) {
  db.prepare('DELETE FROM held_orders WHERE id = ?').run(id);
}

export function getHeldOrder(db: Database.Database, id: number) {
  return db.prepare('SELECT * FROM held_orders WHERE id = ?').get(id);
}

export function recordPayment(
  db: Database.Database,
  orderId: number,
  method: string,
  amount: number,
) {
  db.prepare(
    `INSERT INTO payments (order_id, method, amount, status) VALUES (?, ?, ?, 'captured')`,
  ).run(orderId, method, amount);
}

export function logAudit(
  db: Database.Database,
  action: string,
  resource: string,
  resourceId: string,
  actor = 'system',
  detail: Record<string, unknown> = {},
) {
  db.prepare(
    `INSERT INTO audit_log (actor, action, resource, resource_id, detail_json) VALUES (?, ?, ?, ?, ?)`,
  ).run(actor, action, resource, resourceId, JSON.stringify(detail));
}
