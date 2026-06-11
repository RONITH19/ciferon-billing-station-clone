'use client';

import { AppShell } from '@/components/layout/app-shell';
import ManageLink from '@/components/ManageLink';

const masterCards = [
  {
    title: 'Super Categories',
    desc: 'First level grouping of items into categories to be done here.',
    href: '/menu/super-categories',
  },
  {
    title: 'Categories',
    desc: 'Second level grouping of items into categories to be done here.',
    href: '/menu/categories',
  },
  {
    title: 'Sub-Categories',
    desc: 'Third level grouping of items under a single category here.',
    href: '/menu/sub-categories',
  },
  {
    title: 'Items',
    desc: 'All items to be managed here. Assigning of modifiers variants to ite...',
    href: '/menu/items',
  },
  {
    title: 'Addons',
    desc: 'Create combos/options here. Eg choose extra toppings.',
    href: '/menu/addons',
  },
  {
    title: 'Variants',
    desc: 'Masters to manage small, medium, large etc variants here.',
    href: '/menu/variants',
  },
  {
    title: 'Submenu',
    desc: 'Lets you define a specific set of prices and make it exclusive for a particular...',
    href: '/menu/submenu',
  },
];

export default function MenuPage() {
  return (
    <AppShell title="Menu" breadcrumb={['Menu', 'Availability']}>
      <div className="min-w-0 flex-1">
        <h2 className="mb-4 text-lg font-semibold text-[#111827]">Menu Master</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {masterCards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-[#111827]">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm text-[#6b7280]">{card.desc}</p>
              <div className="mt-4">
                <ManageLink href={card.href} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
