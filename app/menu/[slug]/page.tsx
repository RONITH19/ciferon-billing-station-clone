import { notFound } from 'next/navigation';
import DashboardShell from '@/components/DashboardShell';
import MenuSidebar from '@/components/MenuSidebar';
import MenuMasterContent from '@/components/menu/MenuMasterContent';
import { MENU_MASTERS } from '@/lib/menu-data';

const VALID_SLUGS = MENU_MASTERS.map((item) => item.id);

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export default async function MenuMasterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  return (
    <DashboardShell title="Menu">
      <div className="page-body">
        <MenuSidebar activeId={slug} />
        <main className="menu-content" id="menu-page-root">
          <MenuMasterContent slug={slug} />
        </main>
      </div>
    </DashboardShell>
  );
}
