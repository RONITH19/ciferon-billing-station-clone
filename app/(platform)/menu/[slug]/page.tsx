import { notFound } from 'next/navigation';
import { MENU_MASTERS } from '@/lib/menu-data';
import { MenuSlugClient } from './menu-slug-client';

const VALID_SLUGS = MENU_MASTERS.map((item) => item.id);

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export default async function MenuMasterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  return <MenuSlugClient slug={slug} />;
}
