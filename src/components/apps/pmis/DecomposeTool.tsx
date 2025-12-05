import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Scissors, Users, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { decomposeStakeholder } from '../../../features/pmisSlice';
import { addNotification } from '../../../features/gameSlice';
import { DECOMPOSITION_MAPPINGS } from '../../../data/initialData';
import { Stakeholder } from '../../../types';

interface DecomposeToolProps {
  stakeholder: Stakeholder;
  onClose?: () => void;
}

export const DecomposeToolButton: React.FC<{ stakeholder: Stakeholder; onClick: () => void }> = ({
  stakeholder,
  onClick,
}) => {
  if (!stakeholder.isDecomposable) return null;

  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
      title="Decompose into categories"
    >
      <Scissors size={14} />
    </button>
  );
};

export const DecomposeModal: React.FC<DecomposeToolProps> = ({ stakeholder, onClose }) => {
  const dispatch = useDispatch();
  const [isDecomposing, setIsDecomposing] = useState(false);

  const mapping = DECOMPOSITION_MAPPINGS[stakeholder.id];
  const childCount = mapping?.children.length || 0;

  const handleDecompose = () => {
    setIsDecomposing(true);

    // Animate then decompose
    setTimeout(() => {
      dispatch(decomposeStakeholder(stakeholder.id));
      dispatch(
        addNotification({
          id: `notif_${Date.now()}`,
          title: 'Stakeholder Decomposed',
          message: `"${stakeholder.name}" has been broken down into ${childCount} specific categories.`,
          type: 'success',
          duration: 4000,
        })
      );
      onClose?.();
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Scissors size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Decompose Stakeholder</h2>
              <p className="text-sm text-gray-500">Break down into specific categories</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning */}
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
            <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
            <div className="text-sm text-amber-800">
              <strong>"{stakeholder.name}"</strong> is too broad to manage effectively.
              You cannot manage "Everyone" as a single stakeholder.
            </div>
          </div>

          {/* Current State */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Entry:</h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Users size={24} className="text-gray-400" />
              <div>
                <div className="font-medium text-gray-800">{stakeholder.name}</div>
                <div className="text-xs text-gray-500">{stakeholder.role}</div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-4">
            <motion.div
              animate={isDecomposing ? { y: [0, 5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <ChevronRight size={24} className="text-amber-500 rotate-90" />
            </motion.div>
          </div>

          {/* Result Preview */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Will become {childCount} categories:
            </h3>
            <div className="space-y-2">
              {mapping?.children.map((child) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Users size={14} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{child.name}</div>
                    <div className="text-xs text-gray-500">{child.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDecompose}
            disabled={isDecomposing}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Scissors size={16} />
            {isDecomposing ? 'Decomposing...' : 'Decompose'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
