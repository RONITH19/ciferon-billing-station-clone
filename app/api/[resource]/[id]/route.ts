import { NextRequest, NextResponse } from 'next/server';
import { updateResource, deleteResource } from '@/lib/crud';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const { resource, id } = await params;
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  
  const parsedId = /^\d+$/.test(id) ? Number(id) : id;
  return updateResource(resource, parsedId, body);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> },
) {
  const { resource, id } = await params;
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const parsedId = /^\d+$/.test(id) ? Number(id) : id;
  return deleteResource(resource, parsedId);
}
