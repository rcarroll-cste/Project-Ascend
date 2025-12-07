import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FileText, Users, MessageCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { RootState } from '../../../store';
import { resetGame, setGameStage } from '../../../features/gameSlice';
import { resetPlayer } from '../../../features/playerSlice';

export const PaperPusherEnding: React.FC = () => {
  const dispatch = useDispatch();
  const playerName = useSelector((state: RootState) => state.player.name);
  const relationshipScore = useSelector((state: RootState) => state.player.relationshipScore);
  const stakeholdersIdentified = useSelector((state: RootState) => state.player.stakeholdersIdentified);

  const handleRetry = () => {
    dispatch(resetGame());
    dispatch(resetPlayer());
    dispatch(setGameStage('Login'));
  };

  const handleContinue = () => {
    // Placeholder - would go to Planning in full game
    dispatch(setGameStage('LevelComplete'));
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* Main card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-amber-500/20 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <FileText className="w-10 h-10 text-amber-400" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-bold text-amber-400 mb-2">The Paper Pusher</h1>
            <p className="text-slate-400">Phase Gate Review: Partial Success</p>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/50 rounded-xl p-6 mb-6 border border-slate-700"
          >
            <p className="text-slate-300 leading-relaxed">
              <span className="text-white font-semibold">{playerName}</span>, you followed the
              process meticulously, but lacked Interpersonal Skills. Your documents are technically
              correct, but your stakeholders are disconnected and unsupportive.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <FileText className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">100%</p>
              <p className="text-xs text-slate-400">Documents</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
              <Users className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-400">{stakeholdersIdentified}</p>
              <p className="text-xs text-slate-400">Stakeholders</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <MessageCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-400">{relationshipScore}%</p>
              <p className="text-xs text-slate-400">Rapport</p>
            </div>
          </motion.div>

          {/* Feedback */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 mb-6"
          >
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">
              What Could Improve:
            </h3>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Soft Skills Matter</p>
                <p className="text-sm text-slate-400">
                  Use open-ended questions during interviews. Listen actively and build rapport.
                </p>
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-3">
              <Users className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Collaboration over Forcing</p>
                <p className="text-sm text-slate-400">
                  When conflicts arise, Problem Solving yields better long-term relationships.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Lesson */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-6"
          >
            <p className="text-slate-300 text-sm">
              <span className="font-semibold text-white">Lesson:</span> The PMP emphasizes that
              Project Management is both art and science. Technical process adherence must be
              balanced with interpersonal skills. The PMBOK dedicates entire sections to
              leadership, communication, and stakeholder engagement.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
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
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Continue
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
