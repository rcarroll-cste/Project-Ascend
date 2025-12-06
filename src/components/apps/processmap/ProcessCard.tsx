import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Lock, GripVertical } from 'lucide-react';
import { ProcessCard as ProcessCardType } from '../../../types';
import { PROCESS_GROUP_COLORS } from '../../../data/processCards';

interface ProcessCardProps {
  card: ProcessCardType;
  isSelected?: boolean;
  onClick?: () => void;
}

const ProcessCardComponent: React.FC<ProcessCardProps> = ({
  card,
  isSelected = false,
  onClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `process-${card.id}`,
      data: { type: 'process', card },
      disabled: !card.isUnlocked,
    });

  const colors = PROCESS_GROUP_COLORS[card.processGroup];

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 999 : undefined,
      }
    : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      onClick={card.isUnlocked ? onClick : undefined}
      whileHover={card.isUnlocked ? { scale: 1.02 } : {}}
      whileTap={card.isUnlocked ? { scale: 0.98 } : {}}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200
        ${colors.bg} ${colors.border}
        ${card.isUnlocked ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-60'}
        ${isDragging ? 'opacity-50 ring-2 ring-purple-500 shadow-lg' : ''}
        ${isSelected ? 'ring-2 ring-purple-500 shadow-md' : 'shadow-sm'}
      `}
      {...(card.isUnlocked ? { ...listeners, ...attributes } : {})}
    >
      {/* Lock overlay for locked cards */}
      {!card.isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 rounded-xl">
          <Lock size={24} className="text-gray-500" />
        </div>
      )}

      {/* Drag handle */}
      {card.isUnlocked && (
        <div className="absolute top-2 right-2 text-gray-400">
          <GripVertical size={16} />
        </div>
      )}

      {/* Process Group Badge */}
      <div
        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${colors.text} ${colors.bg} border ${colors.border}`}
      >
        {card.processGroup}
      </div>

      {/* Process Name */}
      <h3 className="font-semibold text-gray-800 text-sm mb-1">{card.name}</h3>

      {/* Knowledge Area */}
      <p className="text-xs text-gray-500 mb-2">{card.knowledgeArea}</p>

      {/* Description (truncated) */}
      <p className="text-xs text-gray-600 line-clamp-2">{card.description}</p>

      {/* Input/Output indicators */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          {card.requiredInputs.filter((i) => i.isRequired).length} inputs
        </span>
        <span className="text-gray-300">•</span>
        <span className="text-xs text-gray-500">
          {card.outputs.length} output{card.outputs.length !== 1 ? 's' : ''}
        </span>
      </div>
    </motion.div>
  );
};

export default ProcessCardComponent;
