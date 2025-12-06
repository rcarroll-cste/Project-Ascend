import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Play, Loader2, Target } from 'lucide-react';
import { ProcessCard } from '../../../types';
import { PROCESS_GROUP_COLORS } from '../../../data/processCards';

interface ExecutionSlotProps {
  selectedProcess: ProcessCard | null;
  isExecuting: boolean;
  canExecute: boolean;
  onExecute: () => void;
  onClear: () => void;
}

const ExecutionSlot: React.FC<ExecutionSlotProps> = ({
  selectedProcess,
  isExecuting,
  canExecute,
  onExecute,
  onClear,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'execution-slot',
    data: { type: 'execution-slot' },
  });

  const colors = selectedProcess
    ? PROCESS_GROUP_COLORS[selectedProcess.processGroup]
    : null;

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Execution Area</h3>
      <p className="text-sm text-gray-500 mb-4">
        Drop a process here to prepare for execution
      </p>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 min-h-[200px] rounded-xl border-2 border-dashed p-6 transition-all duration-200
          flex flex-col items-center justify-center
          ${isOver ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'}
          ${selectedProcess ? 'border-solid' : ''}
        `}
      >
        {selectedProcess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            {/* Selected Process Display */}
            <div
              className={`p-6 rounded-xl border-2 ${colors?.bg} ${colors?.border} mb-6`}
            >
              <div
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${colors?.text}`}
              >
                {selectedProcess.processGroup}
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                {selectedProcess.name}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                {selectedProcess.description}
              </p>

              {/* Tools & Techniques */}
              <div className="mb-4">
                <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Tools & Techniques
                </h5>
                <div className="flex flex-wrap gap-1">
                  {selectedProcess.toolsTechniques.map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-0.5 text-xs bg-white rounded border border-gray-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Input Summary */}
              <div className="text-sm text-gray-600">
                <span className="font-medium">Required Inputs: </span>
                {selectedProcess.requiredInputs
                  .filter((i) => i.isRequired)
                  .map((i) => i.name)
                  .join(', ')}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onExecute}
                disabled={!canExecute || isExecuting}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors
                  ${
                    canExecute && !isExecuting
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isExecuting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Run Process
                  </>
                )}
              </button>
              <button
                onClick={onClear}
                disabled={isExecuting}
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center">
            <Target size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400 font-medium">
              {isOver ? 'Release to select process' : 'Drag a process here'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Select a process from the library to begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionSlot;
