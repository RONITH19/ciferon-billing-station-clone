import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../store';
import {
  CornerUpRight,
  Home,
  BookOpen,
  Package,
  FileText,
  BarChart3,
  Users,
  Settings,
  Lock,
  ScanBarcode
} from 'lucide-react';

interface SidebarItem {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  locked?: boolean;
}

export const Sidebar: React.FC = () => {
  const { currentOutlet, addToast } = useStore();
  const items: SidebarItem[] = [
    { label: 'Virtual Outlets', icon: CornerUpRight, href: '/business' },
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Menu Catalogue', icon: BookOpen, href: '/catalogue' },
    { label: 'Inventory', icon: Package, href: '/inventory' },
    { label: 'Accounting', icon: FileText, href: '/accounts/landing' },
    { label: 'Scan and Order', icon: ScanBarcode, href: '/scan-order' },
    { label: 'Reports', icon: BarChart3, href: '/reports' },
    { label: 'CRM / Offers', icon: Users, href: '/offers' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className="fixed top-14 left-0 bottom-0 w-[60px] bg-sobos-navy text-white transition-all duration-300 z-[980] flex flex-col justify-between items-center select-none py-4 border-r border-sobos-navyLight/20 shadow-lg">
      <nav className="flex flex-col gap-2 w-full px-1.5">
        {items.map((item, idx) => {
          const IconComponent = item.icon;
          const isLocked = !currentOutlet && item.href !== '/business';
          
          return (
            <NavLink
              key={idx}
              to={isLocked ? '/business' : item.href}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                  addToast('Please select an outlet to enable other sections.', 'warning');
                }
              }}
              className={({ isActive }) => {
                // Check if current path matches item prefix
                const isLinkActive = 
                  (item.href === '/catalogue' && window.location.hash.startsWith('#/catalogue')) ||
                  (item.href === '/inventory' && window.location.hash.startsWith('#/inventory')) ||
                  (item.href === '/offers' && (window.location.hash.startsWith('#/offers') || window.location.hash.startsWith('#/loyalty') || window.location.hash.startsWith('#/feedback'))) ||
                  (item.href === '/settings' && window.location.hash.startsWith('#/settings')) ||
                  (isActive);

                return `group flex flex-col items-center justify-center w-11 h-11 rounded-xl transition-all duration-150 relative ${
                  isLinkActive
                    ? 'bg-blue-600/90 text-white shadow-md shadow-blue-900/30'
                    : isLocked
                      ? 'text-gray-500 opacity-40 cursor-not-allowed'
                      : 'text-gray-400 hover:bg-sobos-navyLight/60 hover:text-white'
                }`;
              }}
            >
              <div className="relative">
                <IconComponent className="w-5 h-5" />
                {isLocked && (
                  <Lock className="w-2.5 h-2.5 text-gray-400 absolute -bottom-1 -right-1 bg-sobos-navy rounded-full p-[1px]" />
                )}
              </div>

              {/* Hover Tooltip */}
              <div className="absolute left-16 bg-gray-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-2xl z-[999] whitespace-nowrap border border-gray-800">
                {item.label} {isLocked && '🔒'}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Version badge */}
      <span className="text-[9px] text-gray-500 font-semibold select-none transform rotate-270 mt-auto pt-4 leading-none">
        v2.4
      </span>
    </aside>
  );
};
