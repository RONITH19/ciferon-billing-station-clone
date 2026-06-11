import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartLine {
  id: string;
  itemId: number;
  name: string;
  unitPrice: number;
  qty: number;
  notes?: string;
  modifiers?: string[];
}

interface CartState {
  tableId: number | null;
  sessionId: number | null;
  tableLabel: string | null;
  lines: CartLine[];
  discountPercent: number;
  setTable: (tableId: number | null, sessionId: number | null, label: string | null) => void;
  addLine: (line: Omit<CartLine, 'id' | 'qty'> & { qty?: number }) => void;
  updateQty: (id: string, qty: number) => void;
  removeLine: (id: string) => void;
  setDiscount: (percent: number) => void;
  clear: () => void;
  subtotal: () => number;
  taxAmount: (taxRate: number) => number;
  total: (taxRate: number) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      tableId: null,
      sessionId: null,
      tableLabel: null,
      lines: [],
      discountPercent: 0,
      setTable: (tableId, sessionId, tableLabel) => set({ tableId, sessionId, tableLabel }),
      addLine: (line) => {
        const id = `${line.itemId}-${Date.now()}`;
        set((s) => ({
          lines: [...s.lines, { ...line, id, qty: line.qty ?? 1 }],
        }));
      },
      updateQty: (id, qty) => {
        if (qty <= 0) {
          set((s) => ({ lines: s.lines.filter((l) => l.id !== id) }));
          return;
        }
        set((s) => ({
          lines: s.lines.map((l) => (l.id === id ? { ...l, qty } : l)),
        }));
      },
      removeLine: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
      setDiscount: (discountPercent) => set({ discountPercent }),
      clear: () => set({ lines: [], discountPercent: 0 }),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0),
      taxAmount: (taxRate) => {
        const sub = get().subtotal();
        const afterDiscount = sub * (1 - get().discountPercent / 100);
        return afterDiscount * (taxRate / 100);
      },
      total: (taxRate) => {
        const sub = get().subtotal();
        const afterDiscount = sub * (1 - get().discountPercent / 100);
        return afterDiscount + get().taxAmount(taxRate);
      },
    }),
    { name: 'sobos-cart', partialize: (s) => ({ lines: s.lines, tableId: s.tableId, sessionId: s.sessionId, tableLabel: s.tableLabel, discountPercent: s.discountPercent }) },
  ),
);
