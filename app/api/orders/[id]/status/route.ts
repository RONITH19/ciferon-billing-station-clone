import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';
import { transitionOrderStatus, type OrderStatus } from '@/lib/repositories/orders';
import { logAudit } from '@/lib/repositories/billing';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { status } = (await request.json()) as { status: OrderStatus };
  try {
    const order = transitionOrderStatus(getDb(), Number(id), status, email);
    logAudit(getDb(), 'status_change', 'order', id, email, { status });
    return NextResponse.json({ data: order });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
