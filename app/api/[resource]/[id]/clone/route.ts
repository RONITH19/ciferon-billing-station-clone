import { NextRequest, NextResponse } from 'next/server';
import { cloneResource } from '@/lib/crud';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const { resource, id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  return cloneResource(resource, numId);
}
