'use client';

// Thin fetch wrapper for the JSON API. All dashboard data flows through here.

export interface ApiError {
  error: string;
}

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error((json as ApiError).error || `Request failed (${res.status})`);
  }
  return json as T;
}

export async function apiList<T>(resource: string, q = ''): Promise<T[]> {
  const url = q ? `/api/${resource}?q=${encodeURIComponent(q)}` : `/api/${resource}`;
  const json = await handle<{ data: T[] }>(await fetch(url, { cache: 'no-store' }));
  return json.data;
}

export async function apiCreate<T>(resource: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`/api/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return (await handle<{ data: T }>(res)).data;
}

export async function apiUpdate<T>(
  resource: string,
  id: number,
  body: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`/api/${resource}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return (await handle<{ data: T }>(res)).data;
}

export async function apiDelete(resource: string, id: number): Promise<void> {
  await handle(await fetch(`/api/${resource}/${id}`, { method: 'DELETE' }));
}

export async function apiClone<T>(resource: string, id: number): Promise<T> {
  const res = await fetch(`/api/${resource}/${id}/clone`, { method: 'POST' });
  return (await handle<{ data: T }>(res)).data;
}

// --- Auth ---

export async function apiLogin(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handle<{ ok: true; email: string }>(res);
}

export async function apiSendOtp(email: string) {
  const res = await fetch('/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handle<{ ok: true; devCode: string }>(res);
}

export async function apiVerifyOtp(email: string, otp: string) {
  const res = await fetch('/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  return handle<{ ok: true; email: string }>(res);
}

export async function apiLogout() {
  await fetch('/api/auth/logout', { method: 'POST' });
}

export async function apiMe(): Promise<{ authenticated: boolean; email?: string }> {
  const res = await fetch('/api/auth/me', { cache: 'no-store' });
  if (!res.ok) return { authenticated: false };
  return res.json();
}

// --- Reports & settings ---

export interface ReportSummary {
  metrics: { totalSales: number; orderCount: number; avgOrderValue: number; itemsSold: number };
  counts: {
    categories: number;
    items: number;
    customers: number;
    inventory: number;
    lowStock: number;
    staff: number;
    locations: number;
  };
  salesByDay: { day: string; total: number; orders: number }[];
  topItems: { name: string; qty: number; revenue: number }[];
  recentOrders: {
    id: number;
    createdAt: string;
    customer: string;
    total: number;
    itemCount: number;
    status: string;
    tableLabel?: string;
  }[];
  kitchenStatus?: { status: string; count: number }[];
  activeTables?: number;
}

export async function apiReportSummary(): Promise<ReportSummary> {
  return handle<ReportSummary>(await fetch('/api/reports/summary', { cache: 'no-store' }));
}

export async function apiGetSettings(): Promise<Record<string, string>> {
  const json = await handle<{ data: Record<string, string> }>(
    await fetch('/api/settings', { cache: 'no-store' }),
  );
  return json.data;
}

export async function apiSaveSettings(
  values: Record<string, string>,
): Promise<Record<string, string>> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  return (await handle<{ data: Record<string, string> }>(res)).data;
}

// --- Operations ---

export interface MenuItem {
  id: number;
  name: string;
  displayName: string;
  category: string;
  basePrice: number;
}

export interface Category {
  id: number;
  name: string;
}

export async function apiCreateOrder(body: Record<string, unknown>) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return (await handle<{ data: unknown }>(res)).data;
}

export async function apiListOrders(params?: { status?: string; q?: string }) {
  const sp = new URLSearchParams();
  if (params?.status) sp.set('status', params.status);
  if (params?.q) sp.set('q', params.q);
  const q = sp.toString();
  return handle<{ data: unknown[] }>(await fetch(`/api/orders${q ? `?${q}` : ''}`, { cache: 'no-store' }));
}

export async function apiGetOrder(id: number) {
  return handle<{ data: { order: unknown; items: unknown[]; timeline: unknown[] } }>(
    await fetch(`/api/orders/${id}`, { cache: 'no-store' }),
  );
}

export async function apiUpdateOrderStatus(id: number, status: string) {
  const res = await fetch(`/api/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return (await handle<{ data: unknown }>(res)).data;
}

export async function apiListTables(outletId: number) {
  return handle<{ data: unknown[] }>(
    await fetch(`/api/tables?outletId=${outletId}`, { cache: 'no-store' }),
  );
}

export async function apiOpenTableSession(tableId: number, outletId: number, guestCount = 2) {
  const res = await fetch(`/api/tables/${tableId}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ outletId, guestCount }),
  });
  return (await handle<{ data: { sessionId: number } }>(res)).data;
}

export async function apiCloseSession(sessionId: number) {
  await handle(
    await fetch(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'close' }),
    }),
  );
}

export async function apiKdsFeed(station = 'Kitchen') {
  return handle<{ data: unknown[] }>(
    await fetch(`/api/kds/feed?station=${encodeURIComponent(station)}`, { cache: 'no-store' }),
  );
}

export async function apiKdsBump(orderId: number, target: 'Preparing' | 'Ready' = 'Ready') {
  const res = await fetch('/api/kds/bump', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, target }),
  });
  return (await handle<{ data: unknown }>(res)).data;
}

export async function apiListHeldOrders(outletId: number) {
  return handle<{ data: unknown[] }>(
    await fetch(`/api/held-orders?outletId=${outletId}`, { cache: 'no-store' }),
  );
}

export async function apiSaveHeldOrder(outletId: number, label: string, cartJson: string) {
  const res = await fetch('/api/held-orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ outletId, label, cartJson }),
  });
  return (await handle<{ data: { id: number } }>(res)).data;
}

export async function apiDeleteHeldOrder(id: number) {
  await fetch(`/api/held-orders?id=${id}`, { method: 'DELETE' });
}
