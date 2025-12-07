import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight, Award, BookOpen, Target } from 'lucide-react';
import { RootState } from '../../store';
import { advanceToNextLevel } from '../../features/gameSlice';
import { getLevelById, getNextLevel } from '../../data/levels';

export const LevelCompleteScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { currentLevelId, cumulativeScores } = useSelector(
    (state: RootState) => state.game
  );

  const currentLevel = getLevelById(currentLevelId);
  const nextLevel = getNextLevel(currentLevelId);

  const handleContinue = () => {
    dispatch(advanceToNextLevel());
  };

  if (!currentLevel) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full"
      >
        {/* Success Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-green-500/30 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-green-500/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center"
            >
              <CheckCircle size={40} className="text-green-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white text-center">
              Level {currentLevelId} Complete!
            </h1>
            <p className="text-green-400 text-center mt-1">
              {currentLevel.narrativeTitle}
            </p>
          </div>

          {/* Stats */}
          <div className="p-6 space-y-4">
            {/* Learning Objectives */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <BookOpen size={16} />
                Learning Objectives Covered
              </h3>
              <ul className="space-y-2">
                {currentLevel.learningObjectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Process Info */}
            {currentLevel.processCode && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <Target size={16} />
                  PMBOK Process
                </h3>
                <p className="text-slate-300">
                  <span className="text-blue-400 font-mono">
                    {currentLevel.processCode}
                  </span>{' '}
                  - {currentLevel.knowledgeArea} ({currentLevel.processGroup})
                </p>
              </div>
            )}

            {/* Cumulative Scores */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                <p className="text-xs text-slate-400">Leadership</p>
                <p className="text-lg font-bold text-amber-400">
                  {cumulativeScores.leadershipStyle}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                <p className="text-xs text-slate-400">Ethics</p>
                <p className="text-lg font-bold text-green-400">
                  {cumulativeScores.ethicsScore}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                <p className="text-xs text-slate-400">Process</p>
                <p className="text-lg font-bold text-blue-400">
                  {cumulativeScores.processAdherence}
                </p>
              </div>
            </div>

            {/* Next Level Preview */}
            {nextLevel && (
              <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/30">
                <h3 className="text-sm font-semibold text-purple-400 mb-2">
                  Coming Up Next
                </h3>
                <p className="text-white font-medium">
                  Level {nextLevel.id}: {nextLevel.narrativeTitle}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  {nextLevel.description}
                </p>
                {nextLevel.processCode && (
                  <p className="text-purple-400 text-xs mt-2 font-mono">
                    Process {nextLevel.processCode} - {nextLevel.knowledgeArea}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="p-4 bg-slate-800/50 border-t border-slate-700">
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {nextLevel ? (
                <>
                  Continue to Level {nextLevel.id}
                  <ChevronRight size={18} />
                </>
              ) : (
                <>
                  View Results
                  <Award size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelCompleteScreen;
