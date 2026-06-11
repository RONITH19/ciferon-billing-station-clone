import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';
import { listTables, updateTablePosition } from '@/lib/repositories/tables';

export async function GET(request: NextRequest) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const outletId = Number(new URL(request.url).searchParams.get('outletId') ?? '1');
  return NextResponse.json({ data: listTables(getDb(), outletId) });
}

export async function PATCH(request: NextRequest) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, posX, posY } = await request.json();
  updateTablePosition(getDb(), id, posX, posY);
  return NextResponse.json({ ok: true });
}
