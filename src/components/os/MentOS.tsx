import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { getLevelById } from '../../data/levels';
import {
  getHintForObjective,
  getHintForPhase,
  getRandomTip,
  MentosHint,
} from '../../data/mentosHints';
import { Sparkles, X, HelpCircle, Lightbulb } from 'lucide-react';

export const MentOS: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentHint, setCurrentHint] = useState<MentosHint | null>(null);
  const [hasNewHint, setHasNewHint] = useState(false);

  // Get game state
  const { currentLevelId, levelProgress, currentPhase } = useSelector(
    (state: RootState) => state.game
  );

  // Get current level data
  const currentLevel = useMemo(() => getLevelById(currentLevelId), [currentLevelId]);
  const currentLevelProgress = levelProgress[currentLevelId];

  // Determine the most relevant hint based on context
  useEffect(() => {
    if (!currentLevel || !currentLevelProgress) {
      // Fallback to a general tip
      setCurrentHint(getRandomTip());
      return;
    }

    // Find the first incomplete objective and get its hint
    const incompleteObjective = currentLevel.objectives.find(
      (obj) => !currentLevelProgress.objectivesCompleted[obj.id]
    );

    if (incompleteObjective) {
      const objectiveHint = getHintForObjective(incompleteObjective.id);
      if (objectiveHint) {
        setCurrentHint(objectiveHint);
        setHasNewHint(true);
        return;
      }
    }

    // Fallback to phase hint
    const phaseHint = getHintForPhase(currentPhase);
    if (phaseHint) {
      setCurrentHint(phaseHint);
      setHasNewHint(true);
      return;
    }

    // Final fallback to random tip
    setCurrentHint(getRandomTip());
  }, [currentLevel, currentLevelProgress, currentPhase]);

  // Reset new hint indicator when expanded
  useEffect(() => {
    if (isExpanded) {
      setHasNewHint(false);
    }
  }, [isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getPriorityColor = (priority: MentosHint['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-amber-400';
      case 'medium':
        return 'text-blue-400';
      case 'low':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPriorityGlow = (priority: MentosHint['priority']) => {
    switch (priority) {
      case 'high':
        return 'shadow-[0_0_20px_rgba(251,191,36,0.4)]';
      case 'medium':
        return 'shadow-[0_0_15px_rgba(59,130,246,0.3)]';
      case 'low':
        return 'shadow-[0_0_10px_rgba(156,163,175,0.2)]';
      default:
        return '';
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-[90] flex flex-col items-end gap-2">
      {/* Hint Panel */}
      <AnimatePresence>
        {isExpanded && currentHint && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Lightbulb size={14} className={getPriorityColor(currentHint.priority)} />
                <span className="text-xs font-medium text-slate-300">MentOS Hint</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded hover:bg-slate-700 transition-colors"
              >
                <X size={12} className="text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-3">
              <p className="text-sm text-slate-200 leading-relaxed">{currentHint.text}</p>
            </div>

            {/* Footer with context */}
            {currentLevel && (
              <div className="px-3 py-2 bg-slate-800/30 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <HelpCircle size={10} />
                    {currentLevel.narrativeTitle}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Orb Button */}
      <motion.button
        onClick={toggleExpanded}
        className={`relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400
          flex items-center justify-center cursor-pointer
          ${currentHint ? getPriorityGlow(currentHint.priority) : ''}
          hover:scale-110 active:scale-95 transition-transform`}
        whileHover={{ rotate: 15 }}
        animate={{
          boxShadow: hasNewHint
            ? [
                '0 0 20px rgba(139, 92, 246, 0.4)',
                '0 0 30px rgba(139, 92, 246, 0.6)',
                '0 0 20px rgba(139, 92, 246, 0.4)',
              ]
            : '0 0 15px rgba(139, 92, 246, 0.3)',
        }}
        transition={{
          boxShadow: {
            duration: 1.5,
            repeat: hasNewHint ? Infinity : 0,
            ease: 'easeInOut',
          },
        }}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/30 to-transparent" />

        {/* Icon */}
        <Sparkles size={20} className="text-white relative z-10" />

        {/* Notification dot */}
        <AnimatePresence>
          {hasNewHint && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-900 flex items-center justify-center"
            >
              <span className="text-[8px] font-bold text-slate-900">!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring animation */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-400/50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.button>
    </div>
  );
};
