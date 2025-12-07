import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Shield, Lock, Unlock } from 'lucide-react';
import { RootState } from '../../../store';

interface AuthorityMeterProps {
  compact?: boolean;
}

export const AuthorityMeter: React.FC<AuthorityMeterProps> = ({ compact = false }) => {
  const authorityLevel = useSelector((state: RootState) => state.player.authorityLevel);
  const hasAuthority = authorityLevel >= 100;

  const getStatusColor = () => {
    if (hasAuthority) return 'from-green-500 to-emerald-500';
    if (authorityLevel >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getStatusText = () => {
    if (hasAuthority) return 'Full Authority';
    if (authorityLevel >= 50) return 'Partial Authority';
    return 'No Authority';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${hasAuthority ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-xs text-slate-400">
          {hasAuthority ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
        </span>
        <span className="text-xs font-medium text-slate-300">{authorityLevel}%</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${hasAuthority ? 'bg-green-500/20' : 'bg-slate-700'}`}>
            <Shield className={`w-4 h-4 ${hasAuthority ? 'text-green-400' : 'text-slate-400'}`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Authority</h4>
            <p className="text-xs text-slate-400">Project decision power</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {hasAuthority ? (
            <Unlock className="w-4 h-4 text-green-400" />
          ) : (
            <Lock className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${authorityLevel}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getStatusColor()} rounded-full`}
        />
        {/* Threshold marker at 100% */}
        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-white/50" />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{getStatusText()}</span>
        <span className={`text-sm font-bold ${hasAuthority ? 'text-green-400' : 'text-slate-300'}`}>
          {authorityLevel}%
        </span>
      </div>

      {/* Warning message if no authority */}
      {!hasAuthority && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <p className="text-xs text-red-300">
            <span className="font-semibold">No Charter = No Spending.</span> Sign the Project Charter to gain authority.
          </p>
        </motion.div>
      )}
    </div>
  );
};
