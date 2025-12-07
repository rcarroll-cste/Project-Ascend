import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  Shield,
  Star,
  AlertTriangle,
  RotateCcw,
  Crown,
  Target,
  BookOpen,
} from 'lucide-react';
import { RootState } from '../../store';
import { resetGame } from '../../features/gameSlice';
import { GameEnding } from '../../types';

interface EndingConfig {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  bgGradient: string;
  description: string;
  pmbokLesson: string;
}

const ENDING_CONFIGS: Record<GameEnding, EndingConfig> = {
  pmp_master: {
    title: 'PMP Master',
    subtitle: 'The Ideal Project Manager',
    icon: <Crown size={48} className="text-amber-400" />,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/50',
    bgGradient: 'from-amber-900/30 to-amber-600/10',
    description:
      'You demonstrated exceptional project management skills, balancing all constraints while maintaining ethical standards and stakeholder relationships. Your project was a resounding success.',
    pmbokLesson:
      'A successful Project Manager integrates all knowledge areas effectively, maintains professional responsibility, and delivers value to stakeholders through disciplined application of project management principles.',
  },
  gold_plater: {
    title: 'The Gold Plater',
    subtitle: 'Too Much of a Good Thing',
    icon: <Star size={48} className="text-yellow-400" />,
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/50',
    bgGradient: 'from-yellow-900/30 to-yellow-600/10',
    description:
      'You consistently added features beyond what was required, leading to scope creep and budget overruns. While your intentions were good, the project suffered from lack of scope discipline.',
    pmbokLesson:
      'Gold Plating adds features without going through formal change control. All changes must be evaluated for impact on the triple constraints and approved through the Integrated Change Control process.',
  },
  iron_fist: {
    title: 'The Iron Fist',
    subtitle: 'Results at Any Cost',
    icon: <Shield size={48} className="text-red-400" />,
    color: 'text-red-400',
    borderColor: 'border-red-500/50',
    bgGradient: 'from-red-900/30 to-red-600/10',
    description:
      'You prioritized project metrics over team welfare and stakeholder relationships. While the project delivered on time and budget, the human cost was significant.',
    pmbokLesson:
      'Effective project leadership requires balancing results with relationship management. Team morale directly impacts productivity, quality, and project success. The PM must be a servant leader.',
  },
  scope_creep_victim: {
    title: 'Scope Creep Victim',
    subtitle: 'Lost in Requirements',
    icon: <Target size={48} className="text-orange-400" />,
    color: 'text-orange-400',
    borderColor: 'border-orange-500/50',
    bgGradient: 'from-orange-900/30 to-orange-600/10',
    description:
      'The project scope expanded uncontrollably. Without proper change control, requirements grew beyond what resources could deliver, leading to delays and cost overruns.',
    pmbokLesson:
      'Scope management requires a clear WBS, change control processes, and the ability to say "no" to requests that bypass formal approval. Requirements must be validated before work begins.',
  },
  terminated: {
    title: 'Project Terminated',
    subtitle: 'Critical Failure',
    icon: <AlertTriangle size={48} className="text-red-500" />,
    color: 'text-red-500',
    borderColor: 'border-red-600/50',
    bgGradient: 'from-red-900/40 to-red-600/20',
    description:
      'Critical failures in project management led to project termination. Budget depletion, ethical violations, or complete loss of stakeholder confidence ended the project prematurely.',
    pmbokLesson:
      'Project failure often stems from ignoring warning signs, violating professional ethics, or failing to manage stakeholder expectations. Continuous monitoring and proactive risk management are essential.',
  },
};

export const EndingScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { gameEnding, cumulativeScores, levelProgress } = useSelector(
    (state: RootState) => state.game
  );

  const ending: GameEnding = gameEnding || 'terminated';
  const config = ENDING_CONFIGS[ending];

  // Count completed levels
  const completedLevels = Object.values(levelProgress).filter(
    (p) => p.isCompleted
  ).length;

  const handlePlayAgain = () => {
    dispatch(resetGame());
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Main Card */}
        <div
          className={`bg-slate-900/90 backdrop-blur-xl border ${config.borderColor} rounded-2xl overflow-hidden shadow-2xl`}
        >
          {/* Header */}
          <div
            className={`p-8 bg-gradient-to-r ${config.bgGradient} border-b border-slate-700/50`}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center border-2 border-slate-700"
            >
              {config.icon}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-3xl font-bold text-center ${config.color}`}
            >
              {config.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-slate-400 text-center mt-1"
            >
              {config.subtitle}
            </motion.p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-slate-300 text-center leading-relaxed"
            >
              {config.description}
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-4 gap-3"
            >
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
                <Trophy size={20} className="text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{completedLevels}</p>
                <p className="text-xs text-slate-400">Levels</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
                <Award size={20} className="text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {cumulativeScores.leadershipStyle}
                </p>
                <p className="text-xs text-slate-400">Leadership</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
                <Shield size={20} className="text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {cumulativeScores.ethicsScore}
                </p>
                <p className="text-xs text-slate-400">Ethics</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
                <Target size={20} className="text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {cumulativeScores.processAdherence}
                </p>
                <p className="text-xs text-slate-400">Process</p>
              </div>
            </motion.div>

            {/* PMBOK Lesson */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-purple-900/20 rounded-xl p-5 border border-purple-500/30"
            >
              <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                <BookOpen size={18} />
                PMBOK Learning Point
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {config.pmbokLesson}
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex gap-3">
            <button
              onClick={handlePlayAgain}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Play Again
            </button>
          </div>
        </div>

        {/* Credits */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-slate-600 text-sm mt-6"
        >
          Project Ascend - A PMP Educational Game
        </motion.p>
      </motion.div>
    </div>
  );
};

export default EndingScreen;
