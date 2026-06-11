import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';
import { openSession } from '@/lib/repositories/tables';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const sessionId = openSession(getDb(), Number(id), body.outletId ?? 1, body.guestCount ?? 2);
  return NextResponse.json({ data: { sessionId } }, { status: 201 });
}
