import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionEmail } from '@/lib/session';
import { getKdsFeed } from '@/lib/repositories/kds';

export async function GET(request: NextRequest) {
  if (!(await getSessionEmail())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const station = new URL(request.url).searchParams.get('station') ?? 'Kitchen';
  return NextResponse.json({ data: getKdsFeed(getDb(), station) });
}
