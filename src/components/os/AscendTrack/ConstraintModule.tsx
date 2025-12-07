import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConstraintModuleProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  displayValue?: string;
  status: 'success' | 'warning' | 'danger';
  tooltip: string;
  isCentered?: boolean;
}

export const ConstraintModule: React.FC<ConstraintModuleProps> = ({
  icon,
  label,
  value,
  displayValue,
  status,
  tooltip,
  isCentered = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-700';
      case 'warning':
        return 'text-amber-700';
      case 'danger':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-md whitespace-nowrap pointer-events-none z-50"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="text-white text-xs font-medium">{tooltip}</span>
            {/* Tooltip arrow */}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
              style={{ borderTopColor: 'rgba(0, 0, 0, 0.8)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Module Container */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-default transition-colors ${
          isHovered ? 'bg-black/8' : 'bg-black/4'
        }`}
      >
        {/* Icon */}
        <div className={`${getStatusTextColor()}`}>{icon}</div>

        {/* Label & Value */}
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 leading-none">{label}</span>
          <span className={`text-xs font-semibold ${getStatusTextColor()} leading-tight`}>
            {displayValue || `${value}%`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-12 h-1.5 rounded-full overflow-hidden bg-gray-200 relative">
          {isCentered ? (
            // Centered bar for Scope (shows deviation from center)
            <>
              {/* Center marker */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400" />
              {/* Fill from center */}
              <motion.div
                initial={false}
                animate={{
                  width: `${Math.abs(value - 50)}%`,
                  left: value < 50 ? `${value}%` : '50%',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`absolute top-0 bottom-0 ${getStatusColor()} rounded-full`}
              />
            </>
          ) : (
            // Standard progress bar
            <motion.div
              initial={false}
              animate={{ width: `${value}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`h-full ${getStatusColor()} rounded-full`}
            />
          )}
        </div>

        {/* Status indicator dot */}
        <motion.div
          initial={false}
          animate={{
            scale: status === 'danger' ? [1, 1.2, 1] : 1,
          }}
          transition={{
            repeat: status === 'danger' ? Infinity : 0,
            repeatType: 'loop',
            duration: 1,
          }}
          className={`w-2 h-2 rounded-full ${getStatusColor()}`}
          style={{
            boxShadow:
              status === 'danger'
                ? '0 0 6px rgba(239, 68, 68, 0.6)'
                : status === 'warning'
                ? '0 0 4px rgba(245, 158, 11, 0.4)'
                : '0 0 4px rgba(34, 197, 94, 0.4)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default ConstraintModule;
