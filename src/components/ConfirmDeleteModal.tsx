import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  subtext?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Are you sure you want to delete this?",
  subtext = "This is to inform you once you delete this item or details it cannot be undone or recover."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full overflow-hidden p-6 animate-scale-up">
        <div className="flex flex-col items-center text-center">
          {/* Red Attention Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 mb-4 font-semibold text-xs uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            Attention!
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {subtext}
          </p>

          <div className="flex items-center justify-center gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 transition-all duration-200"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
