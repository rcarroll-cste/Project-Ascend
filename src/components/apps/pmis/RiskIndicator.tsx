import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react';
import { RootState } from '../../../store';

interface RiskIndicatorProps {
  compact?: boolean;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ compact = false }) => {
  const riskLevel = useSelector((state: RootState) => state.player.riskLevel);
  const [isExpanded, setIsExpanded] = useState(false);

  const riskConfig = {
    green: {
      label: 'Low Risk',
      color: 'bg-green-500',
      textColor: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      icon: CheckCircle,
      description: 'All identified risks are within acceptable thresholds.',
      items: ['Business Case ROI validated', 'Stakeholders engaged', 'Assumptions documented'],
    },
    amber: {
      label: 'Medium Risk',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      icon: AlertCircle,
      description: 'Some risks require attention before proceeding.',
      items: ['Unverified assumptions present', 'Stakeholder concerns noted', 'Review recommended'],
    },
    red: {
      label: 'High Risk',
      color: 'bg-red-500',
      textColor: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      icon: AlertTriangle,
      description: 'Critical risks threaten project viability.',
      items: ['Business Case ROI at risk', 'Key stakeholders not identified', 'Sponsor alignment needed'],
    },
  };

  const config = riskConfig[riskLevel];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${config.color} animate-pulse`} />
        <span className={`text-xs font-medium ${config.textColor}`}>{config.label}</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <AlertTriangle className={`w-4 h-4 ${config.textColor}`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Risk Level</h4>
            <p className="text-xs text-slate-400">Project health indicator</p>
          </div>
        </div>

        {/* RAG Light */}
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${config.color} shadow-lg`} style={{
            boxShadow: riskLevel === 'red'
              ? '0 0 12px rgba(239, 68, 68, 0.6)'
              : riskLevel === 'amber'
                ? '0 0 12px rgba(234, 179, 8, 0.6)'
                : '0 0 12px rgba(34, 197, 94, 0.6)'
          }} />
        </div>
      </div>

      {/* Status display */}
      <div className={`p-3 rounded-lg ${config.bgColor} border ${config.borderColor} mb-3`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${config.textColor}`} />
          <span className={`font-semibold ${config.textColor}`}>{config.label}</span>
        </div>
        <p className="text-xs text-slate-300 mt-1">{config.description}</p>
      </div>

      {/* Expandable details */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-300 transition-colors"
      >
        <span>View Details</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="mt-3 space-y-2">
              {config.items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-xs text-slate-400"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RAG Legend */}
      <div className="mt-4 pt-3 border-t border-slate-700/50">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-slate-500">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-xs text-slate-500">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-slate-500">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};
