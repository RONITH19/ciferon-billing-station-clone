'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const SIDEBAR_KEY = 'sobos_sidebar_collapsed';

const navItems = [
  { id: 'outlet', href: '/outlets', label: 'Go to Outlet', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12c4-6 10-6 14 0" />
      <polyline points="14 12 19 12 19 17" />
    </svg>
  )},
  { id: 'menu', href: '/menu', label: 'Menu', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10l8-6 8 6v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )},
  { id: 'inventory', href: '/inventory', label: 'Inventory', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="8" width="14" height="14" rx="1" />
      <rect x="7" y="4" width="14" height="14" rx="1" />
    </svg>
  )},
  { id: 'crm', href: '/crm', label: 'CRM', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <circle cx="17" cy="7" r="2.5" />
      <line x1="8" y1="10" x2="14" y2="10" />
      <line x1="8" y1="14" x2="12" y2="14" />
    </svg>
  )},
  { id: 'reports', href: '/reports', label: 'Reports', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )},
  { id: 'locations', href: '/locations', label: 'Locations', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )},
  { id: 'users', href: '/users', label: 'Users', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )},
  { id: 'settings', href: '/settings', label: 'Settings', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )},
];

export default function Sidebar() {
  const pathname = usePathname();
  const isMenuSection = pathname.startsWith('/menu');
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (isMenuSection) {
      setCollapsed(true);
      return;
    }
    setCollapsed(localStorage.getItem(SIDEBAR_KEY) !== 'false');
  }, [isMenuSection]);

  const collapseSidebar = () => {
    setCollapsed(true);
    localStorage.setItem(SIDEBAR_KEY, 'true');
  };

  const activeNav = isMenuSection
    ? 'menu'
    : pathname.startsWith('/inventory')
      ? 'inventory'
      : pathname.startsWith('/crm')
        ? 'crm'
        : pathname.startsWith('/reports')
          ? 'reports'
          : pathname.startsWith('/locations')
            ? 'locations'
            : pathname.startsWith('/users')
              ? 'users'
              : pathname.startsWith('/settings')
                ? 'settings'
                : 'outlet';

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`} id="sidebar">
      <div className="sidebar-header">
        <Link href="/outlets" className="sidebar-brand">
          <Image className="sidebar-brand-icon" src="/assets/favicon.svg" alt="" width={28} height={28} />
          <span className="sidebar-brand-text">sobos</span>
        </Link>
        <button type="button" className="sidebar-toggle" onClick={collapseSidebar} aria-label="Collapse sidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <p className="sidebar-section">MAINS</p>
        {navItems.map((item) => {
          const isActive = item.id === activeNav;
          const className = `sidebar-item${isActive ? ' active' : ''}`;
          const content = (
            <>
              {item.icon}
              <span>{item.label}</span>
            </>
          );

          if (item.href === '#') {
            return (
              <a key={item.id} href="#" className={className}>
                {content}
              </a>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={className}
              aria-current={isActive ? 'page' : undefined}
              data-nav={item.id}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer-divider" />
    </aside>
  );
}
