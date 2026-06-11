import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';
import { deleteHeldOrder, listHeldOrders, saveHeldOrder } from '@/lib/repositories/billing';

export async function GET(request: NextRequest) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const outletId = Number(new URL(request.url).searchParams.get('outletId') ?? '1');
  return NextResponse.json({ data: listHeldOrders(getDb(), outletId) });
}

export async function POST(request: NextRequest) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { outletId, label, cartJson } = await request.json();
  const id = saveHeldOrder(getDb(), outletId ?? 1, label ?? 'Held Order', cartJson);
  return NextResponse.json({ data: { id } }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = Number(new URL(request.url).searchParams.get('id'));
  deleteHeldOrder(getDb(), id);
  return NextResponse.json({ ok: true });
}
