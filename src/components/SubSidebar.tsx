import React from 'react';
import { NavLink } from 'react-router-dom';
import { Lock } from 'lucide-react';

export interface SubSidebarItem {
  label: string;
  href: string;
  locked?: boolean;
}

export interface SubSidebarSection {
  label: string;
  items: SubSidebarItem[];
}

interface SubSidebarProps {
  sections: SubSidebarSection[];
}

export const SubSidebar: React.FC<SubSidebarProps> = ({ sections }) => {
  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 h-[calc(100vh-60px)] overflow-y-auto scrollbar-thin select-none hidden md:block">
      <div className="py-6 px-4 flex flex-col gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <h5 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase px-2 mb-1">
              {section.label}
            </h5>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item, itemIdx) => (
                <NavLink
                  key={itemIdx}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="truncate">{item.label}</span>
                  {item.locked && (
                    <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-1.5" />
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
