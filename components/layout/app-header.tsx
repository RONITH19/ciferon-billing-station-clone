'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, Plus, Search, User } from 'lucide-react';
import { apiLogout, apiMe } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppHeaderProps {
  title: string;
  breadcrumb?: string[];
  onOpenSearch: () => void;
}

export function AppHeader({ title, breadcrumb = [], onOpenSearch }: AppHeaderProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    apiMe().then((m) => setEmail(m.email ?? ''));
  }, []);

  async function logout() {
    await apiLogout();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="min-w-0 flex-1">
        {breadcrumb.length > 0 && (
          <p className="text-xs text-muted-foreground">{breadcrumb.join(' / ')}</p>
        )}
        <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
      </div>

      <button
        type="button"
        onClick={onOpenSearch}
        className="hidden h-9 w-full max-w-md items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground transition hover:bg-muted md:flex"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="pointer-events-none hidden rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenSearch}>
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="hidden gap-1 sm:flex" onClick={() => router.push('/billing')}>
          <Plus className="h-4 w-4" />
          New Order
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel email={email} />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function DropdownMenuLabel({ email }: { email: string }) {
  return <div className="px-2 py-1.5 text-sm font-medium">{email || 'Staff'}</div>;
}
