import React from 'react';
import { Info, AlertTriangle } from 'lucide-react';

interface InfoBannerProps {
  type?: 'info' | 'warning';
  message: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ type = 'info', message }) => {
  const isWarning = type === 'warning';
  
  const bgColor = isWarning ? 'bg-amber-50 border-amber-400 text-amber-800' : 'bg-blue-50 border-blue-400 text-blue-800';
  const Icon = isWarning ? AlertTriangle : Info;
  const iconColor = isWarning ? 'text-amber-500' : 'text-blue-500';

  return (
    <div className={`flex items-start gap-3 p-4 border-l-4 rounded-r-xl ${bgColor} shadow-sm transition-all duration-200`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <p className="text-sm font-medium leading-relaxed">{message}</p>
    </div>
  );
};
