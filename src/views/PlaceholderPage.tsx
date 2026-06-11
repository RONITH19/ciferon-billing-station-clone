import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export const PlaceholderPage: React.FC = () => {
  const location = useLocation();

  return (
    <div className="max-w-md mx-auto p-8 text-center mt-12 bg-white border border-gray-200 rounded-2xl shadow-sm animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 mx-auto border border-blue-100">
        <ShieldCheck className="w-8 h-8 animate-pulse" />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1">
        Trial Feature Gated
      </h3>
      
      <p className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full inline-block mb-4">
        Path: {location.pathname}
      </p>

      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        This operation is simulated as part of the Sobos Operations Admin Panel clone. Review active screens like Outlets, Charges, Produced Stocks, and Settings items.
      </p>

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};
