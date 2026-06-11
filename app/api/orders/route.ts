import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requirePermission } from '@/lib/auth/rbac';
import { createOrder, listOrders, transitionOrderStatus } from '@/lib/repositories/orders';
import { logAudit, recordPayment } from '@/lib/repositories/billing';

export async function GET(request: NextRequest) {
  try {
    await requirePermission('orders.read');
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json({ error: msg }, { status: msg === 'Forbidden' ? 403 : 401 });
  }
  const { searchParams } = new URL(request.url);
  const orders = listOrders(getDb(), {
    status: searchParams.get('status') ?? undefined,
    q: searchParams.get('q') ?? undefined,
  });
  return NextResponse.json({ data: orders });
}

export async function POST(request: NextRequest) {
  let email: string;
  try {
    email = await requirePermission('orders.create');
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json({ error: msg }, { status: msg === 'Forbidden' ? 403 : 401 });
  }

  const body = await request.json();
  const db = getDb();
  const orderId = createOrder(db, body);
  if (body.paymentMethod) {
    recordPayment(db, orderId, body.paymentMethod, body.total);
    transitionOrderStatus(db, orderId, 'Completed', email);
  }
  logAudit(db, 'create', 'order', String(orderId), email, { total: body.total });
  const order = listOrders(db, { limit: 1 }).find((o) => o.id === orderId);
  return NextResponse.json({ data: order }, { status: 201 });
}
