import { NextRequest } from 'next/server';
import { listResource, createResource } from '@/lib/crud';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  const q = request.nextUrl.searchParams.get('q');
  return listResource(resource, q);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  return createResource(resource, body);
}
