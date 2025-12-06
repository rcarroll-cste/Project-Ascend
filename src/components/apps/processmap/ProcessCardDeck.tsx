import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ProcessCard as ProcessCardType } from '../../../types';
import { PROCESS_GROUP_COLORS } from '../../../data/processCards';
import ProcessCardComponent from './ProcessCard';

interface ProcessCardDeckProps {
  processes: ProcessCardType[];
  selectedProcessId: string | null;
  onSelectProcess: (processId: string) => void;
}

type ProcessGroup = ProcessCardType['processGroup'];

const PROCESS_GROUPS: ProcessGroup[] = [
  'Initiating',
  'Planning',
  'Executing',
  'Monitoring',
  'Closing',
];

const ProcessCardDeck: React.FC<ProcessCardDeckProps> = ({
  processes,
  selectedProcessId,
  onSelectProcess,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<ProcessGroup>>(
    new Set(['Initiating', 'Planning'])
  );

  const toggleGroup = (group: ProcessGroup) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  const getProcessesByGroup = (group: ProcessGroup) =>
    processes.filter((p) => p.processGroup === group);

  const getUnlockedCount = (group: ProcessGroup) =>
    getProcessesByGroup(group).filter((p) => p.isUnlocked).length;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Process Library</h2>
      <p className="text-sm text-gray-500">
        Drag a process to the execution area to run it
      </p>

      <div className="space-y-2">
        {PROCESS_GROUPS.map((group) => {
          const groupProcesses = getProcessesByGroup(group);
          const unlockedCount = getUnlockedCount(group);
          const isExpanded = expandedGroups.has(group);
          const colors = PROCESS_GROUP_COLORS[group];

          if (groupProcesses.length === 0) return null;

          return (
            <div key={group} className="rounded-xl border border-gray-200 overflow-hidden">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group)}
                className={`w-full flex items-center justify-between p-3 ${colors.bg} hover:opacity-90 transition-opacity`}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown size={18} className={colors.text} />
                  ) : (
                    <ChevronRight size={18} className={colors.text} />
                  )}
                  <span className={`font-semibold ${colors.text}`}>{group}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {unlockedCount}/{groupProcesses.length} unlocked
                </span>
              </button>

              {/* Group Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 space-y-3 bg-white">
                      {groupProcesses.map((process) => (
                        <ProcessCardComponent
                          key={process.id}
                          card={process}
                          isSelected={selectedProcessId === process.id}
                          onClick={() => onSelectProcess(process.id)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessCardDeck;
