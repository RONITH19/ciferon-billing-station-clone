import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OutletState {
  outletId: number | null;
  outletName: string;
  setOutlet: (id: number, name: string) => void;
  clearOutlet: () => void;
}

export const useOutletStore = create<OutletState>()(
  persist(
    (set) => ({
      outletId: null,
      outletName: '',
      setOutlet: (outletId, outletName) => set({ outletId, outletName }),
      clearOutlet: () => set({ outletId: null, outletName: '' }),
    }),
    { name: 'sobos-outlet' },
  ),
);
