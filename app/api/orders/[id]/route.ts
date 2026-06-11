import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';
import { getOrderById, getOrderItems, getStatusLog } from '@/lib/repositories/orders';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const db = getDb();
  const order = getOrderById(db, Number(id));
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({
    data: {
      order,
      items: getOrderItems(db, order.id),
      timeline: getStatusLog(db, order.id),
    },
  });
}
