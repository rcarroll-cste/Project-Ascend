import React from 'react';
import { motion } from 'framer-motion';
import { Search, Lightbulb } from 'lucide-react';
import { DocumentAnalysisTask } from '../../../types';

interface TaskPromptBannerProps {
  task: DocumentAnalysisTask;
  attemptCount: number;
  showHint: boolean;
}

const TaskPromptBanner: React.FC<TaskPromptBannerProps> = ({
  task,
  attemptCount,
  showHint,
}) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4 rounded-lg mb-4 border border-purple-500/50"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-purple-800/50 rounded-lg">
          <Search className="text-purple-300" size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-purple-200 font-semibold text-sm uppercase tracking-wide">
            Analysis Required
          </h4>
          <p className="text-white mt-1">{task.promptText}</p>

          {/* Hint section - shows after failed attempts */}
          {showHint && task.hintText && attemptCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 pt-3 border-t border-purple-700/50"
            >
              <div className="flex items-start gap-2">
                <Lightbulb size={16} className="text-amber-400 mt-0.5" />
                <p className="text-amber-300 text-sm italic">{task.hintText}</p>
              </div>
            </motion.div>
          )}

          {attemptCount > 0 && (
            <p className="text-purple-400 text-xs mt-2">
              Attempts: {attemptCount}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-purple-400">
        Click on highlighted sections to select your answer
      </div>
    </motion.div>
  );
};

export default TaskPromptBanner;
