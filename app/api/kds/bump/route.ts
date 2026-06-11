import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';
import { bumpOrder } from '@/lib/repositories/kds';

export async function POST(request: NextRequest) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { orderId, target } = await request.json();
  try {
    const order = bumpOrder(getDb(), orderId, target ?? 'Ready');
    return NextResponse.json({ data: order });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
