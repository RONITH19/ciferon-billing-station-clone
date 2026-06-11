import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';
import { closeSession } from '@/lib/repositories/tables';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const { action } = await request.json();
  if (action === 'close') {
    closeSession(getDb(), Number(id));
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
