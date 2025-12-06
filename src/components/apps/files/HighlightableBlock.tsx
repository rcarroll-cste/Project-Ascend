import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { DocumentContent } from '../../../types';

export type HighlightState =
  | 'idle'
  | 'hovering'
  | 'selected'
  | 'correct'
  | 'incorrect';

interface HighlightableBlockProps {
  content: DocumentContent;
  state: HighlightState;
  isTaskActive: boolean;
  onClick: () => void;
}

const HighlightableBlock: React.FC<HighlightableBlockProps> = ({
  content,
  state,
  isTaskActive,
  onClick,
}) => {
  // Only interactive during active task and if marked as selectable
  const isInteractive = isTaskActive && content.isSelectableForTask;

  const stateStyles: Record<HighlightState, string> = {
    idle: isTaskActive
      ? 'bg-slate-700/50 text-slate-300 border-dashed border-slate-500 cursor-pointer'
      : 'bg-slate-700/30 text-slate-400 border-transparent cursor-default',
    hovering: 'bg-amber-500/20 text-amber-200 border-amber-500/50 cursor-pointer',
    selected: 'bg-purple-500/30 text-purple-200 border-purple-500 ring-2 ring-purple-400 cursor-pointer',
    correct: 'bg-green-500/30 text-green-300 border-green-500 cursor-default',
    incorrect: 'bg-red-500/30 text-red-300 border-red-500 cursor-default',
  };

  // Shake animation for incorrect
  const shakeAnimation =
    state === 'incorrect'
      ? {
          x: [0, -5, 5, -5, 5, 0],
          transition: { duration: 0.4 },
        }
      : {};

  return (
    <motion.span
      onClick={isInteractive ? onClick : undefined}
      animate={shakeAnimation}
      whileHover={isInteractive && state === 'idle' ? { scale: 1.01 } : {}}
      className={`
        inline px-2 py-1 rounded border-2 transition-all duration-200
        ${stateStyles[state]}
        ${isInteractive ? '' : 'opacity-70'}
      `}
    >
      {content.text}
      {state === 'selected' && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center ml-2"
        >
          <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
        </motion.span>
      )}
      {state === 'correct' && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center ml-2"
        >
          <Check size={14} className="text-green-400" />
        </motion.span>
      )}

      {/* Label tooltip */}
      {content.analysisLabel && isTaskActive && (
        <span className="absolute -top-6 left-0 text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {content.analysisLabel}
        </span>
      )}
    </motion.span>
  );
};

export default HighlightableBlock;
