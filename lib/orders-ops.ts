/** Live operations board — column logic and timers */

export const DELAY_THRESHOLD_MINUTES = 15;

export interface OpsOrder {
  id: number;
  createdAt: string;
  customer: string;
  tableLabel: string;
  status: string;
  total: number;
  itemCount: number;
  confirmedAt?: string | null;
  preparingAt?: string | null;
}

export type OpsColumnId = 'new' | 'preparing' | 'ready' | 'served' | 'delayed';

export interface OpsColumn {
  id: OpsColumnId;
  title: string;
  action?: string;
  actionLabel?: string;
}

export const OPS_COLUMNS: OpsColumn[] = [
  { id: 'new', title: 'New Orders', action: 'Preparing', actionLabel: 'Start prep' },
  { id: 'preparing', title: 'Preparing', action: 'Ready', actionLabel: 'Mark ready' },
  { id: 'ready', title: 'Ready', action: 'Served', actionLabel: 'Mark served' },
  { id: 'served', title: 'Served', action: 'Completed', actionLabel: 'Complete' },
  { id: 'delayed', title: 'Delayed', actionLabel: 'Escalate' },
];

export function elapsedMinutes(iso: string | null | undefined): number {
  if (!iso) return 0;
  return (Date.now() - new Date(iso).getTime()) / 60000;
}

export function formatElapsed(iso: string | null | undefined): string {
  const min = Math.floor(elapsedMinutes(iso));
  if (min < 1) return '<1m';
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  return `${h}h ${min % 60}m`;
}

export function isDelayed(order: OpsOrder): boolean {
  if (order.status !== 'Confirmed' && order.status !== 'Preparing' && order.status !== 'Pending') {
    return false;
  }
  const anchor = order.confirmedAt ?? order.preparingAt ?? order.createdAt;
  return elapsedMinutes(anchor) >= DELAY_THRESHOLD_MINUTES;
}

export function timerBorderClass(iso: string | null | undefined): string {
  const min = elapsedMinutes(iso);
  if (min >= 20) return 'border-red-400 bg-red-50/80';
  if (min >= DELAY_THRESHOLD_MINUTES) return 'border-amber-400 bg-amber-50/80';
  return 'border-[#e5e7eb] bg-white';
}

export function assignColumn(order: OpsOrder): OpsColumnId {
  if (isDelayed(order)) return 'delayed';

  switch (order.status) {
    case 'Pending':
    case 'Confirmed':
      return 'new';
    case 'Preparing':
      return 'preparing';
    case 'Ready':
      return 'ready';
    case 'Served':
      return 'served';
    default:
      return 'new';
  }
}

export function nextStatusFor(order: OpsOrder): string | null {
  const map: Record<string, string> = {
    Pending: 'Confirmed',
    Confirmed: 'Preparing',
    Preparing: 'Ready',
    Ready: 'Served',
    Served: 'Completed',
  };
  return map[order.status] ?? null;
}

export function columnAction(order: OpsOrder): { status: string; label: string } | null {
  const next = nextStatusFor(order);
  if (!next) return null;

  const labels: Record<string, string> = {
    Confirmed: 'Confirm order',
    Preparing: 'Start prep',
    Ready: 'Mark ready',
    Served: 'Mark served',
    Completed: 'Complete',
  };

  return { status: next, label: labels[next] ?? `Mark ${next}` };
}

export function groupOrdersByColumn(orders: OpsOrder[]): Record<OpsColumnId, OpsOrder[]> {
  const groups: Record<OpsColumnId, OpsOrder[]> = {
    new: [],
    preparing: [],
    ready: [],
    served: [],
    delayed: [],
  };
  for (const order of orders) {
    const activeStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Served'];
    if (!activeStatuses.includes(order.status)) continue;
    groups[assignColumn(order)].push(order);
  }
  return groups;
}

/** Active kitchen/floor orders only (exclude completed/cancelled/paid) */
export function filterLiveOrders(orders: OpsOrder[]): OpsOrder[] {
  return orders.filter((o) =>
    ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Served'].includes(o.status),
  );
}

export const STATUS_VARIANT: Record<
  string,
  'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'
> = {
  Pending: 'warning',
  Confirmed: 'secondary',
  Preparing: 'warning',
  Ready: 'success',
  Served: 'success',
  Completed: 'default',
  Cancelled: 'destructive',
  Paid: 'default',
};
