import DashboardShell from '@/components/DashboardShell';
import ManageLink from '@/components/ManageLink';
import MenuSidebar from '@/components/MenuSidebar';

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
    <DashboardShell title="Menu">
      <div className="page-body">
        <MenuSidebar />
        <main className="menu-content">
          <h2 className="menu-content-heading">Menu Master</h2>

          <div className="master-grid">
            {masterCards.map((card) => (
              <article key={card.title} className="master-card">
                <h3 className="master-card-title">{card.title}</h3>
                <p className="master-card-desc">{card.desc}</p>
                <div className="master-card-footer">
                  <ManageLink href={card.href} />
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </DashboardShell>
  );
}
