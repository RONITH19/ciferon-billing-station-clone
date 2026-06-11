import React from 'react';
import { useStore } from '../store';
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => {
        let bgColor = 'bg-white border-green-200 shadow-green-100';
        let textColor = 'text-gray-800';
        let Icon = CheckCircle;
        let iconColor = 'text-green-500';

        if (toast.type === 'warning') {
          bgColor = 'bg-white border-amber-200 shadow-amber-100';
          Icon = AlertTriangle;
          iconColor = 'text-amber-500';
        } else if (toast.type === 'info') {
          bgColor = 'bg-white border-blue-200 shadow-blue-100';
          Icon = Info;
          iconColor = 'text-blue-500';
        } else if (toast.type === 'error') {
          bgColor = 'bg-white border-red-200 shadow-red-100';
          Icon = AlertCircle;
          iconColor = 'text-red-500';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start p-4 border rounded-xl shadow-lg transition-all duration-300 transform translate-x-0 ${bgColor} animate-fade-in`}
          >
            <div className="flex-shrink-0 mr-3 mt-0.5">
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="flex-grow mr-2">
              <p className={`text-sm font-medium ${textColor}`}>{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
