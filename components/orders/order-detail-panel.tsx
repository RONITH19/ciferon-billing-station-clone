'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatInr } from '@/lib/utils';
import {
  columnAction,
  nextStatusFor,
  STATUS_VARIANT,
} from '@/lib/orders-ops';

interface OrderDetailPanelProps {
  orderId: number;
  order: { status: string; customer: string; tableLabel: string; total: number } | null;
  items: Array<{ itemName: string; qty: number; price: number; notes?: string }>;
  timeline: Array<{ from_status: string; to_status: string; changed_at: string; changed_by?: string }>;
  loading?: boolean;
  advancing?: boolean;
  onAdvance: (status: string) => void;
}

export function OrderDetailPanel({
  orderId,
  order,
  items,
  timeline,
  loading,
  advancing,
  onAdvance,
}: OrderDetailPanelProps) {
  if (loading || !order) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const next = nextStatusFor({
    id: orderId,
    status: order.status,
    createdAt: '',
    customer: order.customer,
    tableLabel: order.tableLabel,
    total: order.total,
    itemCount: items.length,
  });

  const action = columnAction({
    id: orderId,
    status: order.status,
    createdAt: '',
    customer: order.customer,
    tableLabel: order.tableLabel,
    total: order.total,
    itemCount: items.length,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'}>{order.status}</Badge>
        {order.tableLabel && (
          <span className="text-xs text-[#6b7280]">Table {order.tableLabel}</span>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Items</p>
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="min-w-0 pr-2">
              {item.qty}× {item.itemName}
              {item.notes && (
                <span className="block text-xs text-[#6b7280]">{item.notes}</span>
              )}
            </span>
            <span className="shrink-0 font-medium">{formatInr(item.qty * item.price)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-[#e5e7eb] pt-2 text-sm font-semibold">
          <span>Total</span>
          <span>{formatInr(order.total)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Timeline</p>
        {timeline.length === 0 && (
          <p className="text-sm text-[#6b7280]">No status changes yet.</p>
        )}
        {timeline.map((t, idx) => (
          <div key={idx} className="rounded-lg border border-[#e5e7eb] bg-[#f8fafc] px-3 py-2 text-xs">
            <p className="font-medium text-[#111827]">
              {t.from_status} → {t.to_status}
            </p>
            <p className="text-[#6b7280]">
              {new Date(t.changed_at).toLocaleString()}
              {t.changed_by ? ` · ${t.changed_by}` : ''}
            </p>
          </div>
        ))}
      </div>

      {(action || next) && (
        <Button
          className="w-full"
          disabled={advancing}
          onClick={() => onAdvance(action?.status ?? next!)}
        >
          {action?.label ?? `Mark ${next}`}
        </Button>
      )}
    </div>
  );
}
