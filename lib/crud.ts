import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';
import { coerce, getResource, rowToApi, type ResourceDef } from '@/lib/resources';

async function requireAuth(): Promise<NextResponse | null> {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

function resolve(resource: string): ResourceDef | NextResponse {
  const def = getResource(resource);
  if (!def) return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });
  return def;
}

export async function listResource(resource: string, q: string | null) {
  const auth = await requireAuth();
  if (auth) return auth;
  const def = resolve(resource);
  if (def instanceof NextResponse) return def;

  const db = getDb();
  let sql = `SELECT * FROM ${def.table}`;
  const params: unknown[] = [];
  if (q && def.searchColumns.length) {
    const clause = def.searchColumns.map((c) => `${c} LIKE ?`).join(' OR ');
    sql += ` WHERE ${clause}`;
    def.searchColumns.forEach(() => params.push(`%${q}%`));
  }
  sql += ' ORDER BY id ASC';

  const rows = db.prepare(sql).all(...params) as Record<string, unknown>[];
  return NextResponse.json({ data: rows.map((r) => rowToApi(def, r)) });
}

export async function createResource(resource: string, body: Record<string, unknown>) {
  const auth = await requireAuth();
  if (auth) return auth;
  const def = resolve(resource);
  if (def instanceof NextResponse) return def;

  for (const f of def.fields) {
    if (f.required && !String(body[f.key] ?? '').trim()) {
      return NextResponse.json({ error: `${f.key} is required.` }, { status: 400 });
    }
  }

  const db = getDb();
  const cols = def.fields.map((f) => f.column);
  const values = def.fields.map((f) => coerce(f, body[f.key]));
  const placeholders = cols.map(() => '?').join(', ');
  const info = db
    .prepare(`INSERT INTO ${def.table} (${cols.join(', ')}) VALUES (${placeholders})`)
    .run(...values);

  const row = db
    .prepare(`SELECT * FROM ${def.table} WHERE id = ?`)
    .get(info.lastInsertRowid) as Record<string, unknown>;
  return NextResponse.json({ data: rowToApi(def, row) }, { status: 201 });
}

export async function updateResource(
  resource: string,
  id: number,
  body: Record<string, unknown>,
) {
  const auth = await requireAuth();
  if (auth) return auth;
  const def = resolve(resource);
  if (def instanceof NextResponse) return def;

  const db = getDb();
  const existing = db.prepare(`SELECT * FROM ${def.table} WHERE id = ?`).get(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Only update fields present in the body.
  const updates = def.fields.filter((f) => f.key in body);
  if (updates.length === 0) {
    return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
  }
  for (const f of updates) {
    if (f.required && !String(body[f.key] ?? '').trim()) {
      return NextResponse.json({ error: `${f.key} is required.` }, { status: 400 });
    }
  }

  const setClause = updates.map((f) => `${f.column} = ?`).join(', ');
  const values = updates.map((f) => coerce(f, body[f.key]));
  db.prepare(`UPDATE ${def.table} SET ${setClause} WHERE id = ?`).run(...values, id);

  const row = db.prepare(`SELECT * FROM ${def.table} WHERE id = ?`).get(id) as Record<string, unknown>;
  return NextResponse.json({ data: rowToApi(def, row) });
}

export async function deleteResource(resource: string, id: number) {
  const auth = await requireAuth();
  if (auth) return auth;
  const def = resolve(resource);
  if (def instanceof NextResponse) return def;

  const db = getDb();
  const info = db.prepare(`DELETE FROM ${def.table} WHERE id = ?`).run(id);
  if (info.changes === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function cloneResource(resource: string, id: number) {
  const auth = await requireAuth();
  if (auth) return auth;
  const def = resolve(resource);
  if (def instanceof NextResponse) return def;

  const db = getDb();
  const row = db.prepare(`SELECT * FROM ${def.table} WHERE id = ?`).get(id) as
    | Record<string, unknown>
    | undefined;
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const cols = def.fields.map((f) => f.column);
  const values = def.fields.map((f) => {
    if (f.column === 'name') return `${row[f.column]} (Copy)`;
    return row[f.column];
  });
  const placeholders = cols.map(() => '?').join(', ');
  const info = db
    .prepare(`INSERT INTO ${def.table} (${cols.join(', ')}) VALUES (${placeholders})`)
    .run(...values);

  const created = db
    .prepare(`SELECT * FROM ${def.table} WHERE id = ?`)
    .get(info.lastInsertRowid) as Record<string, unknown>;
  return NextResponse.json({ data: rowToApi(def, created) }, { status: 201 });
}
