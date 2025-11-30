import React from 'react';
import { HelpCircle, Check, X } from 'lucide-react';

interface DecisionModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: (choice: 'Fact' | 'Assumption' | 'Risk') => void;
  onCancel: () => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({ isOpen, title, description, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 border border-gray-200">
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-blue-100 p-2 rounded-full shrink-0">
            <HelpCircle className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onConfirm('Fact')}
            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-500 transition-colors group"
          >
            <span className="font-medium text-gray-700 group-hover:text-green-700">It is a verified Fact</span>
            <Check size={18} className="text-gray-400 group-hover:text-green-600 opacity-0 group-hover:opacity-100" />
          </button>

          <button
            onClick={() => onConfirm('Assumption')}
            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-yellow-50 hover:border-yellow-500 transition-colors group"
          >
            <span className="font-medium text-gray-700 group-hover:text-yellow-700">It is an Assumption</span>
            <Check size={18} className="text-gray-400 group-hover:text-yellow-600 opacity-0 group-hover:opacity-100" />
          </button>

          <button
            onClick={() => onConfirm('Risk')}
            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-500 transition-colors group"
          >
            <span className="font-medium text-gray-700 group-hover:text-red-700">It is a Risk</span>
            <Check size={18} className="text-gray-400 group-hover:text-red-600 opacity-0 group-hover:opacity-100" />
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};