import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-gray-200 mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      
      {children && (
        <div className="flex flex-wrap items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};
