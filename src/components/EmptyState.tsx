import React from 'react';

interface EmptyStateProps {
  title?: string;
  subtext?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No records found.",
  subtext = "Check your filters or try creating a new record."
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-150 rounded-2xl shadow-sm">
      {/* Cartoon SVG Illustration: Person pushing a folder with an X */}
      <svg
        className="w-48 h-48 text-gray-300 mb-4"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background elements */}
        <circle cx="100" cy="100" r="80" fill="#f8fafc" />
        
        {/* The Folder */}
        <path
          d="M60 70C60 64.4772 64.4772 60 70 60H100L115 75H140C145.523 75 150 79.4772 150 85V130C150 135.523 145.523 140 140 140H70C64.4772 140 60 135.523 60 130V70Z"
          fill="#eff6ff"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        
        {/* Document slipping out */}
        <path
          d="M80 85H130M80 100H120"
          stroke="#93c5fd"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Big X Badge on the folder */}
        <circle cx="140" cy="70" r="16" fill="#ef4444" />
        <path
          d="M134 64L146 76M146 64L134 76"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Pushing Character outline (simplified, friendly style) */}
        <path
          d="M45 130C45 116.193 56.1929 105 70 105H75C77.7614 105 80 107.239 80 110V140H45V130Z"
          fill="#e2e8f0"
          stroke="#94a3b8"
          strokeWidth="2"
        />
        <circle cx="72" cy="90" r="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
        
        {/* Hand pushing the folder */}
        <path
          d="M78 115H65"
          stroke="#64748b"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      
      <h4 className="text-lg font-bold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-500 max-w-sm">{subtext}</p>
    </div>
  );
};
