import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Calendar,
  DollarSign,
  Users,
  Target,
  ChevronDown,
  Activity,
} from 'lucide-react';
import { RootState } from '../../../store';
import { getLevelById } from '../../../data/levels';
import { ConstraintModule } from './ConstraintModule';

export const AscendTrack: React.FC = () => {
  const { constraints, currentLevelId, budget, totalBudget } = useSelector(
    (state: RootState) => state.game
  );
  const { currentTier } = useSelector((state: RootState) => state.pmisEvolution);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  const currentLevel = getLevelById(currentLevelId);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatBudget = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  // Get constraint status color
  const getStatusColor = (value: number): 'success' | 'warning' | 'danger' => {
    if (value >= 70) return 'success';
    if (value >= 40) return 'warning';
    return 'danger';
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-[100] select-none"
    >
      {/* Main Status Bar */}
      <div
        className="h-[44px] flex items-center justify-between px-4"
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        {/* Left Section - Level Info */}
        <div className="flex items-center gap-4">
          {/* AscendTrack Logo */}
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-ascend-600" />
            <span className="text-sm font-semibold text-gray-800">AscendTrack</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-ascend-100 text-ascend-700 font-medium">
              {currentTier.toUpperCase()}
            </span>
          </div>

          {/* Current Level */}
          {currentLevel && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/5">
              <span className="text-xs text-gray-500">Level {currentLevelId}</span>
              <span className="text-sm font-medium text-gray-800">
                {currentLevel.narrativeTitle}
              </span>
              {currentLevel.processCode && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                  {currentLevel.processCode}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center Section - Constraint Modules */}
        <div className="flex items-center gap-3">
          <ConstraintModule
            icon={<Calendar size={14} />}
            label="Schedule"
            value={constraints.schedule}
            status={getStatusColor(constraints.schedule)}
            tooltip="Project schedule health"
          />
          <ConstraintModule
            icon={<DollarSign size={14} />}
            label="Budget"
            value={constraints.budget}
            displayValue={formatBudget(budget)}
            status={getStatusColor(constraints.budget)}
            tooltip={`${formatBudget(budget)} of ${formatBudget(totalBudget)} remaining`}
          />
          <ConstraintModule
            icon={<Users size={14} />}
            label="Morale"
            value={constraints.morale}
            status={getStatusColor(constraints.morale)}
            tooltip="Team morale level"
          />
          <ConstraintModule
            icon={<Target size={14} />}
            label="Scope"
            value={constraints.scope}
            status={(constraints.scope < 40 ? 'danger' : constraints.scope > 60 ? 'warning' : 'success') as 'success' | 'warning' | 'danger'}
            tooltip={
              constraints.scope < 40
                ? 'Scope Creep detected!'
                : constraints.scope > 60
                ? 'Gold Plating detected!'
                : 'Scope is balanced'
            }
            isCentered
          />
        </div>

        {/* Right Section - Time & Controls */}
        <div className="flex items-center gap-4">
          {/* Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-black/5 transition-colors"
          >
            <span className="text-xs text-gray-500">Details</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} className="text-gray-400" />
            </motion.div>
          </button>

          {/* Date & Time */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">{formatDate(currentTime)}</span>
            <span className="font-medium text-gray-800">{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* Expanded Panel */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: isExpanded ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
        }}
      >
        <div className="px-4 py-3">
          <div className="grid grid-cols-4 gap-4">
            {/* Schedule Details */}
            <div className="p-3 rounded-lg bg-black/5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-blue-600" />
                <span className="font-medium text-gray-800">Schedule</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{constraints.schedule}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      constraints.schedule >= 70
                        ? 'bg-green-500'
                        : constraints.schedule >= 40
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${constraints.schedule}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Budget Details */}
            <div className="p-3 rounded-lg bg-black/5">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={16} className="text-green-600" />
                <span className="font-medium text-gray-800">Budget</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Remaining</span>
                  <span className="font-medium">{formatBudget(budget)}</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      constraints.budget >= 70
                        ? 'bg-green-500'
                        : constraints.budget >= 40
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${constraints.budget}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Morale Details */}
            <div className="p-3 rounded-lg bg-black/5">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-purple-600" />
                <span className="font-medium text-gray-800">Team Morale</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Level</span>
                  <span className="font-medium">
                    {constraints.morale >= 70
                      ? 'High'
                      : constraints.morale >= 40
                      ? 'Medium'
                      : 'Low'}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      constraints.morale >= 70
                        ? 'bg-green-500'
                        : constraints.morale >= 40
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${constraints.morale}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Scope Details */}
            <div className="p-3 rounded-lg bg-black/5">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-orange-600" />
                <span className="font-medium text-gray-800">Scope Balance</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium">
                    {constraints.scope < 40
                      ? 'Scope Creep!'
                      : constraints.scope > 60
                      ? 'Gold Plating!'
                      : 'Balanced'}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
                  {/* Center marker */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 -translate-x-1/2" />
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      constraints.scope >= 40 && constraints.scope <= 60
                        ? 'bg-green-500'
                        : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${constraints.scope}%`,
                      marginLeft: constraints.scope < 50 ? 0 : '50%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AscendTrack;
