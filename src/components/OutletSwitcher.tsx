import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { ChevronDown, Store, Check } from 'lucide-react';

export const OutletSwitcher: React.FC = () => {
  const { currentOutlet, outlets, setCurrentOutlet, addToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (outlet: string) => {
    setCurrentOutlet(outlet);
    setIsOpen(false);
    addToast(`Switched active outlet to "${outlet}"`, 'info');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 border border-gray-250 hover:bg-gray-100 text-gray-800 text-sm font-semibold rounded-xl transition-all duration-150 select-none shadow-sm"
      >
        <Store className="w-4 h-4 text-gray-500" />
        <span className="truncate max-w-[130px] sm:max-w-none">{currentOutlet}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-56 bg-white border border-gray-150 rounded-2xl shadow-xl z-[999] py-1.5 overflow-hidden animate-fade-in">
          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Switch Outlet
          </div>
          {outlets.map((outlet) => {
            const isSelected = outlet === currentOutlet;
            return (
              <button
                key={outlet}
                onClick={() => handleSelect(outlet)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors duration-150 ${
                  isSelected ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{outlet}</span>
                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
