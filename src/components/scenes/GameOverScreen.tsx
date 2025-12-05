import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { RootState } from '../../store';
import { resetGameOver } from '../../features/gameSlice';
import { resetDialogue } from '../../features/dialogueSlice';

const GAME_OVER_MESSAGES: Record<string, { title: string; lesson: string }> = {
  UNAUTHORIZED_SPEND: {
    title: 'UNAUTHORIZED SPEND',
    lesson:
      'A Project Manager has no authority to spend company resources or utilize staff without a signed Project Charter. The Charter formally authorizes the project and gives the PM the power to apply organizational resources to project activities.',
  },
  BUDGET_DEPLETED: {
    title: 'BUDGET DEPLETED',
    lesson:
      'You exhausted the project budget before completing critical milestones. Effective cost management requires monitoring actual costs against the baseline and taking corrective action when variances occur.',
  },
  SPONSOR_LOST_CONFIDENCE: {
    title: 'SPONSOR LOST CONFIDENCE',
    lesson:
      'Your project sponsor has withdrawn support. Maintaining stakeholder engagement and managing expectations is critical to project success. Regular communication and transparency build trust.',
  },
};

export function GameOverScreen() {
  const dispatch = useDispatch();
  const { gameOverReason } = useSelector((state: RootState) => state.game);

  const message = gameOverReason
    ? GAME_OVER_MESSAGES[gameOverReason]
    : { title: 'GAME OVER', lesson: 'Something went wrong.' };

  const handleRetry = () => {
    dispatch(resetGameOver());
    dispatch(resetDialogue());
    // Note: A full retry would reset more state - for now just go back to Investigation
  };

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full mx-4"
      >
        {/* Error Screen Container */}
        <div className="bg-slate-900 border-2 border-red-500/50 rounded-lg overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-red-900/50 px-6 py-4 flex items-center gap-3 border-b border-red-500/30">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <AlertTriangle size={32} className="text-red-400" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-red-400 tracking-wider">
                {message.title}
              </h1>
              <p className="text-sm text-red-300/70">Project Failed</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Educational Message */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h2 className="text-sm font-semibold text-amber-400 mb-2">
                PMP Learning Point
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {message.lesson}
              </p>
            </div>

            {/* PMBOK Reference */}
            <div className="text-xs text-slate-500 text-center">
              Reference: PMBOK Guide, 7th Edition - Project Integration Management
            </div>

            {/* Retry Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRetry}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw size={18} />
              Try Again
            </motion.button>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-slate-800/50 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-500">
              Press any key or click "Try Again" to restart
            </p>
          </div>
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent"
            style={{
              backgroundSize: '100% 4px',
              animation: 'scanline 8s linear infinite',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
