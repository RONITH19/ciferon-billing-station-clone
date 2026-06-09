import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { updateResource, deleteResource } from '@/lib/crud';

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const { resource, id } = await params;
  const numId = parseId(id);
  if (numId === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  return updateResource(resource, numId, body);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const { resource, id } = await params;
  const numId = parseId(id);
  if (numId === null) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  return deleteResource(resource, numId);
}
