'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { COMMAND_WORKFLOW_PAGES } from '@/lib/workflow-nav';

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open: controlledOpen, onOpenChange }: CommandPaletteProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, modules…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Array.from(new Set(COMMAND_WORKFLOW_PAGES.map((p) => p.group))).map((group) => (
          <CommandGroup key={group} heading={group}>
            {COMMAND_WORKFLOW_PAGES.filter((p) => p.group === group).map((page) => (
              <CommandItem
                key={`${page.href}-${page.label}`}
                value={`${page.label} ${page.group}`}
                onSelect={() => {
                  setOpen(false);
                  router.push(page.href);
                }}
              >
                {page.label}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
