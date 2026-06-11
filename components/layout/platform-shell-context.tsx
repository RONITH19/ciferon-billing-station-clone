'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface PlatformShellMeta {
  title: string;
  breadcrumb: string[];
  fullWidth: boolean;
  hideHeader: boolean;
  hideSectionNav: boolean;
}

const DEFAULT_META: PlatformShellMeta = {
  title: 'RestaurantOS',
  breadcrumb: [],
  fullWidth: false,
  hideHeader: false,
  hideSectionNav: false,
};

interface PlatformShellContextValue {
  meta: PlatformShellMeta;
  setMeta: (patch: Partial<PlatformShellMeta>) => void;
  resetMeta: () => void;
}

const PlatformShellContext = createContext<PlatformShellContextValue | null>(null);

export function PlatformShellProvider({ children }: { children: React.ReactNode }) {
  const [meta, setMetaState] = useState<PlatformShellMeta>(DEFAULT_META);

  const setMeta = useCallback((patch: Partial<PlatformShellMeta>) => {
    setMetaState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetMeta = useCallback(() => {
    setMetaState(DEFAULT_META);
  }, []);

  const value = useMemo(
    () => ({ meta, setMeta, resetMeta }),
    [meta, setMeta, resetMeta],
  );

  return (
    <PlatformShellContext.Provider value={value}>{children}</PlatformShellContext.Provider>
  );
}

export function usePlatformShell() {
  const ctx = useContext(PlatformShellContext);
  if (!ctx) {
    throw new Error('usePlatformShell must be used within PlatformShellProvider');
  }
  return ctx;
}

export function useOptionalPlatformShell() {
  return useContext(PlatformShellContext);
}

export { DEFAULT_META };
