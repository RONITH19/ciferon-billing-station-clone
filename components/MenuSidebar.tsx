'use client';

import Link from 'next/link';
import { MENU_MASTERS } from '@/lib/menu-data';

export default function MenuSidebar({ activeId }: { activeId?: string }) {
  return (
    <aside className="menu-sidebar" aria-label="Menu masters navigation">
      <p className="menu-sidebar-section">MENU MASTERS</p>
      <nav className="menu-sidebar-nav" id="menu-masters-nav">
        {MENU_MASTERS.map((item) => {
          const isActive = activeId === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`menu-sidebar-link${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
