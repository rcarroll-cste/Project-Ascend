import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, CheckCircle, FileText, Users, MessageCircle, Mail, ArrowRight } from 'lucide-react';
import { RootState } from '../../../store';
import { resetGame, setGameStage } from '../../../features/gameSlice';
import { resetPlayer } from '../../../features/playerSlice';

export const InitiatorEnding: React.FC = () => {
  const dispatch = useDispatch();
  const playerName = useSelector((state: RootState) => state.player.name);
  const relationshipScore = useSelector((state: RootState) => state.player.relationshipScore);
  const stakeholdersIdentified = useSelector((state: RootState) => state.player.stakeholdersIdentified);
  const assumptionLogEntries = useSelector((state: RootState) => state.player.assumptionLogEntries);

  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    // Show email after initial animation
    const timer = setTimeout(() => setShowEmail(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayAgain = () => {
    dispatch(resetGame());
    dispatch(resetPlayer());
    dispatch(setGameStage('Login'));
  };

  const handleMainMenu = () => {
    dispatch(setGameStage('Login'));
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 flex items-center justify-center p-4 overflow-auto">
      {/* Celebration effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />

        {/* Floating stars */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100, x: Math.random() * window.innerWidth }}
            animate={{
              opacity: [0, 1, 0],
              y: [100, -100],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.5,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
            }}
            className="absolute text-yellow-400"
            style={{ left: `${10 + i * 15}%` }}
          >
            <Star className="w-6 h-6 fill-current" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl my-8"
      >
        {/* Main card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 shadow-2xl">
          {/* Trophy icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-yellow-500/30"
          >
            <Award className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-bold text-emerald-400 mb-2">The Initiator</h1>
            <p className="text-slate-400">Phase Gate Review: Success</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-4 gap-3 mb-6"
          >
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
              <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-400">100%</p>
              <p className="text-xs text-slate-400">Authority</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
              <FileText className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-400">{assumptionLogEntries}</p>
              <p className="text-xs text-slate-400">Assumptions</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
              <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-400">{stakeholdersIdentified}</p>
              <p className="text-xs text-slate-400">Stakeholders</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
              <MessageCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-400">{relationshipScore}%</p>
              <p className="text-xs text-slate-400">Rapport</p>
            </div>
          </motion.div>

          {/* Email from Vane */}
          <AnimatePresence>
            {showEmail && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="mb-6"
              >
                <div className="bg-slate-900/80 rounded-xl border border-slate-700 overflow-hidden">
                  {/* Email header */}
                  <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white">New Message from Director Vane</p>
                      <p className="text-xs text-slate-400">Just now</p>
                    </div>
                  </div>

                  {/* Email body */}
                  <div className="p-4">
                    <p className="text-slate-300 leading-relaxed mb-3">
                      {playerName},
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-3">
                      Excellent start. You've established a solid foundation - Charter approved,
                      assumptions documented, and stakeholders mapped with clear engagement strategies.
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-3">
                      Most importantly, you've built the relationships needed to make this project
                      succeed. That's what separates good project managers from great ones.
                    </p>
                    <p className="text-emerald-400 font-semibold">
                      You are cleared for the Planning Phase.
                    </p>
                    <p className="text-slate-400 mt-4 text-sm">
                      — Director Vane<br />
                      Project Sponsor
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Achievement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <p className="text-amber-300 font-semibold">Achievement Unlocked!</p>
                <p className="text-sm text-slate-400">
                  "The Initiator" - Completed the Initiating Phase with excellence
                </p>
              </div>
            </div>
          </motion.div>

          {/* Teaser */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6 text-center"
          >
            <p className="text-purple-300 text-sm">
              <span className="font-semibold">Planning Phase</span> - Coming Soon
            </p>
            <p className="text-xs text-slate-400 mt-1">
              10 new levels covering Scope, Schedule, and Cost Management
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
              onClick={handlePlayAgain}
              className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              Play Again
            </button>
            <button
              onClick={handleMainMenu}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Main Menu
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
