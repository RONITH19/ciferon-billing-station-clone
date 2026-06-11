import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Send } from 'lucide-react';

export const OutletsPage: React.FC = () => {
  const { outlets, setCurrentOutlet, addToast } = useStore();
  const navigate = useNavigate();

  const handleManage = (outlet: string) => {
    setCurrentOutlet(outlet);
    addToast(`Managing outlet: "${outlet}"`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="w-full px-8 py-8 select-none animate-fade-in">
      {/* Business Header */}
      <h1 className="text-xl font-medium text-gray-800 mb-8 tracking-tight">
        Sobos Trial 2
      </h1>

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        {outlets.map((outlet) => (
          <div
            key={outlet}
            className="bg-white border border-gray-200 rounded-sm p-6 min-h-[140px] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-150"
          >
            {/* Outlet Name */}
            <h3 className="text-lg font-semibold text-gray-800">
              {outlet}
            </h3>

            {/* Bottom Manage Action */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleManage(outlet)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span>Manage</span>
                <Send className="w-4 h-4 text-blue-500 transform rotate-[0deg]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
