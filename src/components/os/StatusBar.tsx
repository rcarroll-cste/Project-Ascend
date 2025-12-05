import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Users, Target } from 'lucide-react';
import { RootState } from '../../store';

interface GaugeProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  tooltip: string;
  colorScheme: 'schedule' | 'budget' | 'morale' | 'scope';
}

const getBarColor = (value: number, colorScheme: string): string => {
  if (colorScheme === 'scope') {
    // Scope: 50 is ideal (green), deviation is warning/danger
    const deviation = Math.abs(value - 50);
    if (deviation <= 10) return 'bg-green-500';
    if (deviation <= 25) return 'bg-amber-500';
    return 'bg-red-500';
  }

  // Standard gauges: higher is better
  if (value >= 70) return 'bg-green-500';
  if (value >= 40) return 'bg-amber-500';
  return 'bg-red-500';
};

const getBackgroundGlow = (value: number, colorScheme: string): string => {
  if (colorScheme === 'scope') {
    const deviation = Math.abs(value - 50);
    if (deviation <= 10) return '';
    if (deviation <= 25) return 'shadow-amber-500/20';
    return 'shadow-red-500/30';
  }

  if (value >= 70) return '';
  if (value >= 40) return 'shadow-amber-500/20';
  return 'shadow-red-500/30';
};

const Gauge: React.FC<GaugeProps> = ({ icon, label, value, tooltip, colorScheme }) => {
  const barColor = getBarColor(value, colorScheme);
  const glow = getBackgroundGlow(value, colorScheme);

  // For scope, show balance indicator
  const isScopeGauge = colorScheme === 'scope';
  const scopeLabel = value < 40 ? 'Scope Creep' : value > 60 ? 'Gold Plating' : 'Balanced';

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 shadow-lg ${glow}`}
      title={tooltip}
    >
      <div className="text-slate-400">
        {icon}
      </div>
      <div className="flex flex-col min-w-[80px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-300">{label}</span>
          {isScopeGauge ? (
            <span className={`text-xs font-mono ${value < 40 || value > 60 ? 'text-amber-400' : 'text-green-400'}`}>
              {scopeLabel}
            </span>
          ) : (
            <span className="text-xs font-mono text-slate-400">{value}%</span>
          )}
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mt-0.5">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={false}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};

export const StatusBar: React.FC = () => {
  const { constraints, currentLevel, levelTitle } = useSelector((state: RootState) => state.game);

  return (
    <div className="h-12 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-4 shrink-0">
      {/* Left: Level Info */}
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg">
          <span className="text-xs font-semibold text-purple-300">Level {currentLevel}</span>
        </div>
        <span className="text-sm font-medium text-slate-300">{levelTitle}</span>
      </div>

      {/* Center: Triple Constraint Gauges */}
      <div className="flex items-center gap-3">
        <Gauge
          icon={<Clock size={14} />}
          label="Schedule"
          value={constraints.schedule}
          tooltip="Project schedule health. Slippage reduces this value."
          colorScheme="schedule"
        />
        <Gauge
          icon={<DollarSign size={14} />}
          label="Budget"
          value={constraints.budget}
          tooltip="Remaining project budget. Unauthorized spending depletes this."
          colorScheme="budget"
        />
        <Gauge
          icon={<Users size={14} />}
          label="Morale"
          value={constraints.morale}
          tooltip="Team morale. Poor decisions lower productivity and engagement."
          colorScheme="morale"
        />
        <Gauge
          icon={<Target size={14} />}
          label="Scope"
          value={constraints.scope}
          tooltip="Scope balance. Below 50 = Scope Creep, Above 50 = Gold Plating. Keep it balanced!"
          colorScheme="scope"
        />
      </div>

      {/* Right: Clock/Date (decorative) */}
      <div className="text-xs text-slate-500 font-mono">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};
