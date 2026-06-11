'use client';

import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ChefHat } from 'lucide-react';
import { apiKdsBump, apiKdsFeed } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface KdsOrder {
  id: number;
  tableLabel: string;
  status: string;
  confirmedAt: string;
  items: Array<{ itemName: string; qty: number; notes: string }>;
}

function elapsed(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  return `${min}m`;
}

function timerColor(iso: string) {
  const min = (Date.now() - new Date(iso).getTime()) / 60000;
  if (min >= 20) return 'border-red-500 bg-red-50';
  if (min >= 15) return 'border-amber-500 bg-amber-50';
  return 'border-blue-500 bg-blue-50';
}

export default function KdsPage() {
  const qc = useQueryClient();
  const prevCount = useRef(0);

  const { data } = useQuery({
    queryKey: ['kds'],
    queryFn: async () => (await apiKdsFeed('Kitchen')).data as KdsOrder[],
    refetchInterval: 3000,
  });

  useEffect(() => {
    const orders = data ?? [];
    const newCount = orders.filter((o) => o.status === 'Confirmed').length;
    if (newCount > prevCount.current) {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch {
        /* ignore */
      }
    }
    prevCount.current = newCount;
  }, [data]);

  const columns = [
    { key: 'Confirmed', title: 'New', action: 'Preparing' as const },
    { key: 'Preparing', title: 'Cooking', action: 'Ready' as const },
    { key: 'Ready', title: 'Ready', action: null },
  ];

  async function bump(orderId: number, target: 'Preparing' | 'Ready') {
    await apiKdsBump(orderId, target);
    qc.invalidateQueries({ queryKey: ['kds'] });
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      <header className="flex h-14 items-center justify-between border-b border-zinc-800 px-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-800">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <ChefHat className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Kitchen Display</h1>
        </div>
        <Badge variant="secondary" className="bg-zinc-800 text-white">
          Kitchen · Live
        </Badge>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-3">
        {columns.map((col) => {
          const orders = (data ?? []).filter((o) => o.status === col.key);
          return (
            <section key={col.key} className="flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
              <div className="border-b border-zinc-800 px-4 py-3">
                <h2 className="font-semibold">{col.title}</h2>
                <p className="text-xs text-zinc-400">{orders.length} orders</p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-3">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    className={`rounded-xl border-2 p-4 ${timerColor(order.confirmedAt)} text-zinc-900`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-lg font-bold">{order.tableLabel}</span>
                      <span className="rounded-full bg-black/10 px-2 py-0.5 text-sm font-semibold">
                        {elapsed(order.confirmedAt)}
                      </span>
                    </div>
                    <ul className="mb-3 space-y-1 text-sm">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.qty}× {item.itemName}
                          {item.notes && <span className="text-xs opacity-70"> — {item.notes}</span>}
                        </li>
                      ))}
                    </ul>
                    {col.action && (
                      <Button
                        className="h-12 w-full text-base"
                        onClick={() => bump(order.id, col.action!)}
                      >
                        {col.action === 'Preparing' ? 'Start cooking' : 'Mark ready'}
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
