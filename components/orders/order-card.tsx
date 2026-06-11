'use client';

import { motion } from 'framer-motion';
import { Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatInr } from '@/lib/utils';
import {
  columnAction,
  formatElapsed,
  timerBorderClass,
  type OpsOrder,
} from '@/lib/orders-ops';

interface OrderCardProps {
  order: OpsOrder;
  index: number;
  selected?: boolean;
  onSelect: (id: number) => void;
  onAdvance: (id: number, status: string) => void;
  advancing?: boolean;
}

export function OrderCard({
  order,
  index,
  selected,
  onSelect,
  onAdvance,
  advancing,
}: OrderCardProps) {
  const anchor = order.confirmedAt ?? order.createdAt;
  const action = columnAction(order);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      className={cn(
        'rounded-xl border-2 p-3 shadow-sm transition-shadow hover:shadow-md',
        timerBorderClass(anchor),
        selected && 'ring-2 ring-[#12263a] ring-offset-1',
      )}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={() => onSelect(order.id)}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#111827]">
              {order.tableLabel ? `Table ${order.tableLabel}` : `Order #${order.id}`}
            </p>
            <p className="truncate text-xs text-[#6b7280]">{order.customer}</p>
          </div>
          <Badge variant="outline" className="shrink-0 text-[10px]">
            #{order.id}
          </Badge>
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[#6b7280]">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatElapsed(anchor)}
          </span>
          <span>{order.itemCount} items</span>
          <span className="font-medium text-[#111827]">{formatInr(order.total)}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-[#6b7280]">
          <User className="h-3 w-3" />
          <span className="truncate">{order.customer}</span>
        </div>
      </button>

      {action && (
        <Button
          size="sm"
          className="mt-3 h-9 w-full"
          disabled={advancing}
          onClick={(e) => {
            e.stopPropagation();
            onAdvance(order.id, action.status);
          }}
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
