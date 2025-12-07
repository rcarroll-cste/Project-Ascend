import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RootState } from '../../../store';

interface SentimentMeterProps {
  compact?: boolean;
}

export const SentimentMeter: React.FC<SentimentMeterProps> = ({ compact = false }) => {
  const sentiment = useSelector((state: RootState) => state.player.stakeholderSentiment);
  const stakeholdersIdentified = useSelector((state: RootState) => state.player.stakeholdersIdentified);

  const getSentimentLevel = () => {
    if (sentiment >= 70) return { label: 'Supportive', color: 'green', icon: TrendingUp };
    if (sentiment >= 40) return { label: 'Neutral', color: 'yellow', icon: Minus };
    return { label: 'Hostile', color: 'red', icon: TrendingDown };
  };

  const { label, color, icon: Icon } = getSentimentLevel();

  const colorClasses: Record<string, {
    bg: string;
    text: string;
    bar: string;
    border: string;
  }> = {
    green: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      bar: 'from-green-500 to-emerald-500',
      border: 'border-green-500/30',
    },
    yellow: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      bar: 'from-yellow-500 to-orange-500',
      border: 'border-yellow-500/30',
    },
    red: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      bar: 'from-red-500 to-rose-500',
      border: 'border-red-500/30',
    },
  };

  const classes = colorClasses[color];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Icon className={`w-3 h-3 ${classes.text}`} />
        <span className="text-xs font-medium text-slate-300">{sentiment}%</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${classes.bg}`}>
            <Users className={`w-4 h-4 ${classes.text}`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Stakeholder Sentiment</h4>
            <p className="text-xs text-slate-400">{stakeholdersIdentified} identified</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full ${classes.bg} ${classes.text} text-xs font-medium`}>
          {label}
        </div>
      </div>

      {/* Sentiment bar */}
      <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
        {/* Background zones */}
        <div className="absolute inset-0 flex">
          <div className="w-[40%] bg-red-900/30" />
          <div className="w-[30%] bg-yellow-900/30" />
          <div className="w-[30%] bg-green-900/30" />
        </div>

        {/* Actual value */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${sentiment}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${classes.bar} rounded-full`}
        />

        {/* Zone markers */}
        <div className="absolute left-[40%] top-0 bottom-0 w-px bg-white/20" />
        <div className="absolute left-[70%] top-0 bottom-0 w-px bg-white/20" />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-slate-500">
        <span>Hostile</span>
        <span>Neutral</span>
        <span>Supportive</span>
      </div>

      {/* Current value */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Icon className={`w-4 h-4 ${classes.text}`} />
          <span className={`text-sm font-medium ${classes.text}`}>{label}</span>
        </div>
        <span className="text-lg font-bold text-white">{sentiment}%</span>
      </div>

      {/* Tip */}
      {sentiment < 50 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`mt-3 p-2 ${classes.bg} border ${classes.border} rounded-lg`}
        >
          <p className="text-xs text-slate-300">
            <span className="font-semibold">Tip:</span> Use open-ended questions in interviews to build rapport.
          </p>
        </motion.div>
      )}
    </div>
  );
};
