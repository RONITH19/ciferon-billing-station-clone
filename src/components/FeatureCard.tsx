import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, href }) => {
  return (
    <Link
      to={href}
      className="group flex flex-col justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 hover-scale transition-all-300"
    >
      <div>
        <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
          {title}
        </h4>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="mt-4 flex items-center justify-end">
        <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
          Manage
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
};
