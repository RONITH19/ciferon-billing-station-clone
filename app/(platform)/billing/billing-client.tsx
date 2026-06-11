'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Search, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  apiCreateOrder,
  apiGetSettings,
  apiList,
  apiSaveHeldOrder,
  type MenuItem,
  type Category,
} from '@/lib/api-client';
import { useCartStore } from '@/lib/stores/cart-store';
import { useOutletStore } from '@/lib/stores/outlet-store';
import { formatInr } from '@/lib/utils';

export default function BillingPageClient() {
  const searchParams = useSearchParams();
  const { outletId } = useOutletStore();
  const cart = useCartStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const { data: items = [] } = useQuery({
    queryKey: ['items'],
    queryFn: () => apiList<MenuItem>('items'),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiList<Category>('categories'),
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: apiGetSettings,
  });

  const taxRate = Number(settings?.taxRate ?? 5);

  useEffect(() => {
    const tableId = searchParams.get('tableId');
    const sessionId = searchParams.get('sessionId');
    const label = searchParams.get('label');
    if (tableId) {
      cart.setTable(Number(tableId), sessionId ? Number(sessionId) : null, label);
    }
  }, [searchParams, cart]);

  const categoryNames = useMemo(() => ['All', ...categories.map((c) => c.name)], [categories]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchCat = category === 'All' || item.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.displayName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [items, category, search]);

  async function submitOrder(paymentMethod?: string) {
    if (!cart.lines.length) return;
    setSubmitting(true);
    setMessage('');
    try {
      await apiCreateOrder({
        outletId: outletId ?? 1,
        sessionId: cart.sessionId,
        tableId: cart.tableId,
        tableLabel: cart.tableLabel ?? '',
        subtotal: cart.subtotal(),
        tax: cart.taxAmount(taxRate),
        discount: cart.subtotal() * (cart.discountPercent / 100),
        total: cart.total(taxRate),
        itemCount: cart.lines.reduce((s, l) => s + l.qty, 0),
        paymentMethod,
        items: cart.lines.map((l) => ({
          itemId: l.itemId,
          name: l.name,
          qty: l.qty,
          unitPrice: l.unitPrice,
          notes: l.notes,
          modifiers: l.modifiers,
        })),
      });
      cart.clear();
      setMessage(paymentMethod ? 'Order paid and sent to kitchen.' : 'Order sent to kitchen.');
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function holdOrder() {
    if (!cart.lines.length) return;
    await apiSaveHeldOrder(
      outletId ?? 1,
      cart.tableLabel ? `Table ${cart.tableLabel}` : `Hold ${new Date().toLocaleTimeString()}`,
      JSON.stringify({
        lines: cart.lines,
        tableId: cart.tableId,
        sessionId: cart.sessionId,
        tableLabel: cart.tableLabel,
        discountPercent: cart.discountPercent,
      }),
    );
    cart.clear();
    setMessage('Order held.');
  }

  return (
    <AppShell title="Billing" breadcrumb={['Operations', 'POS']} fullWidth>
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        <aside className="hidden w-48 shrink-0 border-r bg-muted/30 p-3 md:block">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</p>
          <ScrollArea className="h-[calc(100%-2rem)]">
            <div className="space-y-1">
              {categoryNames.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                    category === c ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col border-r">
          <div className="flex items-center gap-2 border-b p-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {cart.tableLabel && <Badge variant="secondary">Table {cart.tableLabel}</Badge>}
          </div>
          <ScrollArea className="flex-1 p-3">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    cart.addLine({
                      itemId: item.id,
                      name: item.displayName || item.name,
                      unitPrice: item.basePrice,
                    })
                  }
                  className="rounded-xl border bg-card p-4 text-left shadow-sm transition hover:border-primary/30 hover:shadow-md"
                >
                  <p className="font-medium leading-tight">{item.displayName || item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.category}</p>
                  <p className="mt-2 text-sm font-semibold">{formatInr(item.basePrice)}</p>
                </motion.button>
              ))}
            </div>
          </ScrollArea>
        </section>

        <aside className="flex w-full max-w-md shrink-0 flex-col bg-card md:w-96">
          <div className="border-b p-4">
            <h2 className="font-semibold">Current order</h2>
            {message && <p className="mt-1 text-sm text-emerald-600">{message}</p>}
          </div>
          <ScrollArea className="flex-1 p-4">
            <AnimatePresence initial={false}>
              {cart.lines.length === 0 && (
                <p className="text-sm text-muted-foreground">Add items from the menu.</p>
              )}
              {cart.lines.map((line) => (
                <motion.div
                  key={line.id}
                  layout
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="mb-3 rounded-lg border p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{line.name}</p>
                      <p className="text-xs text-muted-foreground">{formatInr(line.unitPrice)} each</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => cart.removeLine(line.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => cart.updateQty(line.id, line.qty - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{line.qty}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => cart.updateQty(line.id, line.qty + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="text-sm font-medium">{formatInr(line.unitPrice * line.qty)}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
          <div className="space-y-2 border-t p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatInr(cart.subtotal())}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Discount ({cart.discountPercent}%)</span>
              <Input
                type="number"
                className="h-8 w-20"
                value={cart.discountPercent}
                onChange={(e) => cart.setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax ({taxRate}%)</span>
              <span>{formatInr(cart.taxAmount(taxRate))}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatInr(cart.total(taxRate))}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" disabled={submitting || !cart.lines.length} onClick={holdOrder}>
                Hold
              </Button>
              <Button disabled={submitting || !cart.lines.length} onClick={() => submitOrder()}>
                Send to kitchen
              </Button>
              <Button className="col-span-2" variant="secondary" disabled={submitting || !cart.lines.length} onClick={() => submitOrder('cash')}>
                Pay & complete
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
