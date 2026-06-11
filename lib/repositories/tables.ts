import type Database from 'better-sqlite3';

export interface TableRow {
  id: number;
  outletId: number;
  number: string;
  capacity: number;
  section: string;
  status: string;
  posX: number;
  posY: number;
  shape: string;
  sessionId?: number | null;
}

function mapTable(row: Record<string, unknown>): TableRow {
  return {
    id: row.id as number,
    outletId: row.outlet_id as number,
    number: row.number as string,
    capacity: row.capacity as number,
    section: row.section as string,
    status: row.status as string,
    posX: row.pos_x as number,
    posY: row.pos_y as number,
    shape: row.shape as string,
    sessionId: (row.session_id as number) ?? null,
  };
}

export function listTables(db: Database.Database, outletId?: number) {
  let sql = `
    SELECT t.*, s.id AS session_id
    FROM restaurant_tables t
    LEFT JOIN table_sessions s ON s.table_id = t.id AND s.status = 'active'
  `;
  const params: unknown[] = [];
  if (outletId) {
    sql += ' WHERE t.outlet_id = ?';
    params.push(outletId);
  }
  sql += ' ORDER BY t.section, t.number';
  return (db.prepare(sql).all(...params) as Record<string, unknown>[]).map(mapTable);
}

export function updateTablePosition(db: Database.Database, id: number, posX: number, posY: number) {
  db.prepare('UPDATE restaurant_tables SET pos_x = ?, pos_y = ? WHERE id = ?').run(posX, posY, id);
}

export function updateTableStatus(db: Database.Database, id: number, status: string) {
  db.prepare('UPDATE restaurant_tables SET status = ? WHERE id = ?').run(status, id);
}

export function openSession(
  db: Database.Database,
  tableId: number,
  outletId: number,
  guestCount = 2,
) {
  const existing = db
    .prepare(`SELECT id FROM table_sessions WHERE table_id = ? AND status = 'active'`)
    .get(tableId) as { id: number } | undefined;
  if (existing) return existing.id;

  const tx = db.transaction(() => {
    const info = db
      .prepare(
        `INSERT INTO table_sessions (table_id, outlet_id, status, guest_count)
         VALUES (?, ?, 'active', ?)`,
      )
      .run(tableId, outletId, guestCount);
    db.prepare(`UPDATE restaurant_tables SET status = 'occupied' WHERE id = ?`).run(tableId);
    return Number(info.lastInsertRowid);
  });
  return tx();
}

export function closeSession(db: Database.Database, sessionId: number) {
  const session = db
    .prepare('SELECT table_id FROM table_sessions WHERE id = ?')
    .get(sessionId) as { table_id: number } | undefined;
  if (!session) throw new Error('Session not found');

  const tx = db.transaction(() => {
    db.prepare(
      `UPDATE table_sessions SET status = 'closed', closed_at = datetime('now') WHERE id = ?`,
    ).run(sessionId);
    db.prepare(`UPDATE restaurant_tables SET status = 'available' WHERE id = ?`).run(session.table_id);
  });
  tx();
}
