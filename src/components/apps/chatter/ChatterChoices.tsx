import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { DialogueChoice } from '../../../types';

interface ChatterChoicesProps {
  choices: DialogueChoice[];
  onSelect: (choice: DialogueChoice) => void;
  disabled?: boolean;
}

export function ChatterChoices({ choices, onSelect, disabled = false }: ChatterChoicesProps) {
  const getChoiceStyles = (style: DialogueChoice['style']) => {
    switch (style) {
      case 'risky':
        return 'border-red-500/50 hover:border-red-400 hover:bg-red-500/10 text-red-400';
      case 'safe':
        return 'border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10 text-blue-400';
      case 'neutral':
      default:
        return 'border-slate-500/50 hover:border-slate-400 hover:bg-slate-500/10 text-slate-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-end gap-2 mt-4 px-4"
    >
      {/* Header prompt */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
        <MessageSquare size={12} />
        <span>Choose your reply:</span>
      </div>

      {/* Choice buttons - aligned right like player messages */}
      {choices.map((choice, index) => (
        <motion.button
          key={choice.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => !disabled && onSelect(choice)}
          disabled={disabled}
          className={`
            max-w-[80%] px-4 py-3 rounded-lg border-2 text-right
            transition-all duration-200
            ${getChoiceStyles(choice.style)}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${choice.style === 'risky' ? 'animate-pulse' : ''}
          `}
        >
          <span className="font-medium">{choice.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
