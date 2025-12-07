import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { AlertTriangle, FileX, Users, RotateCcw, Home } from 'lucide-react';
import { RootState } from '../../../store';
import { resetGame, startLevel, setGameStage } from '../../../features/gameSlice';
import { resetPlayer } from '../../../features/playerSlice';

interface FalseStartEndingProps {
  onRetry?: () => void;
  onMainMenu?: () => void;
}

export const FalseStartEnding: React.FC<FalseStartEndingProps> = () => {
  const dispatch = useDispatch();
  const playerName = useSelector((state: RootState) => state.player.name);
  const assumptionLogEntries = useSelector((state: RootState) => state.player.assumptionLogEntries);
  const stakeholdersIdentified = useSelector((state: RootState) => state.player.stakeholdersIdentified);

  const missingItems = [];
  if (assumptionLogEntries === 0) {
    missingItems.push({ icon: FileX, label: 'Assumption Log is empty', description: 'No assumptions were documented' });
  }
  if (stakeholdersIdentified < 3) {
    missingItems.push({ icon: Users, label: 'Stakeholder Register incomplete', description: `Only ${stakeholdersIdentified} stakeholders identified` });
  }

  const handleRetry = () => {
    dispatch(resetGame());
    dispatch(resetPlayer());
    dispatch(setGameStage('Login'));
  };

  const handleContinue = () => {
    // Allow player to continue anyway but with consequences
    dispatch(startLevel(2));
    dispatch(setGameStage('Playing'));
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-red-950/20 to-slate-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Main card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 shadow-2xl">
          {/* Warning icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-bold text-red-400 mb-2">The False Start</h1>
            <p className="text-slate-400">Phase Gate Review: Failed</p>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/50 rounded-xl p-6 mb-6 border border-slate-700"
          >
            <p className="text-slate-300 leading-relaxed">
              <span className="text-white font-semibold">{playerName}</span>, you have authority,
              but your foundation is weak. The project moves forward into Planning, but unverified
              assumptions and missing stakeholder analysis will cause immediate delays.
            </p>
          </motion.div>

          {/* Missing Items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-3">
              What Went Wrong:
            </h3>
            <div className="space-y-3">
              {missingItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3"
                >
                  <item.icon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Lesson */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6"
          >
            <p className="text-amber-200 text-sm">
              <span className="font-semibold">Lesson:</span> The Initiating Process Group has two
              essential outputs: the Project Charter (with its Assumption Log) and the Stakeholder
              Register. Skipping either creates blind spots that compound during Planning.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex gap-3"
          >
            <button
              onClick={handleRetry}
              className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Continue Anyway
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
