'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/layout/filter-bar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatInr } from '@/lib/utils';
import { STATUS_VARIANT, type OpsOrder } from '@/lib/orders-ops';

const ALL_STATUSES = ['', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Served', 'Completed', 'Cancelled', 'Paid'];

interface AllOrdersTableProps {
  orders: OpsOrder[];
  loading?: boolean;
  search: string;
  onSearchChange: (q: string) => void;
  onSelect: (id: number) => void;
}

export function AllOrdersTable({
  orders,
  loading,
  search,
  onSearchChange,
  onSelect,
}: AllOrdersTableProps) {
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(() => {
    return orders.filter((o) => !statusFilter || o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div>
      <FilterBar>
        <Input
          placeholder="Search orders…"
          className="max-w-xs border-[#e5e7eb] bg-white"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="flex flex-wrap gap-1">
          {ALL_STATUSES.map((s) => (
            <Button
              key={s || 'all'}
              size="sm"
              variant={statusFilter === s ? 'default' : 'outline'}
              className="h-8"
              onClick={() => setStatusFilter(s)}
            >
              {s || 'All'}
            </Button>
          ))}
        </div>
      </FilterBar>

      <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
        <div className="sticky top-0 z-10 grid grid-cols-[72px_1fr_100px_72px_88px_96px] gap-2 border-b border-[#e5e7eb] bg-[#f8fafc] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b7280]">
          <span>#</span>
          <span>Customer / Table</span>
          <span>Time</span>
          <span>Items</span>
          <span>Total</span>
          <span>Status</span>
        </div>

        {loading && (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-[#6b7280]">No orders match your filters.</p>
        )}

        <div className="max-h-[520px] overflow-y-auto">
          {filtered.map((order, i) => (
            <motion.button
              key={order.id}
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.015, duration: 0.15 }}
              onClick={() => onSelect(order.id)}
              className="grid w-full grid-cols-[72px_1fr_100px_72px_88px_96px] gap-2 border-b border-[#e5e7eb] px-4 py-2.5 text-left text-sm last:border-0 hover:bg-[#f8fafc]"
            >
              <span className="font-medium text-[#111827]">{order.id}</span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-[#111827]">{order.customer}</span>
                {order.tableLabel && (
                  <span className="text-xs text-[#6b7280]">Table {order.tableLabel}</span>
                )}
              </span>
              <span className="text-xs text-[#6b7280]">
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-[#6b7280]">{order.itemCount}</span>
              <span className="font-medium text-[#111827]">{formatInr(order.total)}</span>
              <span>
                <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'} className="text-[10px]">
                  {order.status}
                </Badge>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
