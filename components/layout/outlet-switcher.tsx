'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Store } from 'lucide-react';
import { apiList } from '@/lib/api-client';
import { useOutletStore } from '@/lib/stores/outlet-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface Outlet {
  id: number;
  name: string;
}

export function OutletSwitcher() {
  const { outletId, outletName, setOutlet } = useOutletStore();
  const [outlets, setOutlets] = useState<Outlet[]>([]);

  useEffect(() => {
    apiList<Outlet>('outlets')
      .then((data) => {
        setOutlets(data);
        if (!outletId && data[0]) {
          setOutlet(data[0].id, data[0].name);
        }
      })
      .catch(() => {});
  }, [outletId, setOutlet]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 w-full justify-between border-[#e5e7eb] bg-[#f8fafc] px-2 text-[#111827] hover:bg-[#f8fafc]"
        >
          <span className="flex min-w-0 items-center gap-2">
            <Store className="h-4 w-4 shrink-0" />
            <span className="truncate text-sm">{outletName || 'Select outlet'}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {outlets.map((o) => (
          <DropdownMenuItem key={o.id} onClick={() => setOutlet(o.id, o.name)}>
            {o.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
