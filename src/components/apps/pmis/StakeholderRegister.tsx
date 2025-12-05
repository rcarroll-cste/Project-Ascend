import React, { useState } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { RootState } from '../../../store';
import { Stakeholder } from '../../../types';
import { User, GripVertical, AlertCircle, CheckCircle2, LayoutGrid, List as ListIcon, CheckSquare } from 'lucide-react';
import { AnalysisGrid } from './AnalysisGrid';
import { DecomposeToolButton, DecomposeModal } from './DecomposeTool';
import { addNotification, triggerExam } from '../../../features/gameSlice';
import { startDialogue } from '../../../features/dialogueSlice';
import { DIALOGUE_LATE_ARRIVAL } from '../../../data/dialogueTrees';

interface DraggableStakeholderRowProps {
  stakeholder: Stakeholder;
  onDecomposeClick?: (stakeholder: Stakeholder) => void;
}

const DraggableStakeholderRow: React.FC<DraggableStakeholderRowProps> = ({ stakeholder, onDecomposeClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `stakeholder-${stakeholder.id}`,
    data: {
        type: 'stakeholder',
        stakeholder: stakeholder
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
  } : undefined;

  return (
    <div
        ref={setNodeRef}
        style={style}
        className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm mb-2 hover:shadow-md transition-shadow"
    >
      <div
        {...listeners}
        {...attributes}
        className="mr-3 text-gray-400 cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </div>

      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 overflow-hidden border border-gray-200">
        {stakeholder.avatarUrl ? (
            <img src={stakeholder.avatarUrl} alt={stakeholder.name} className="w-full h-full object-cover" />
        ) : (
            <User size={20} className="text-gray-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-gray-900 truncate">{stakeholder.name}</h4>
          {stakeholder.salienceClass && stakeholder.salienceClass !== 'None' && (
            <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">
              {stakeholder.salienceClass}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">{stakeholder.role}</p>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
         <div className="flex flex-col items-end min-w-[80px]">
            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Power</span>
            <span className={`font-medium ${stakeholder.power === 'High' ? 'text-red-600' : 'text-gray-600'}`}>{stakeholder.power}</span>
         </div>
         <div className="flex flex-col items-end min-w-[80px]">
            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Interest</span>
            <span className={`font-medium ${stakeholder.interest === 'High' ? 'text-blue-600' : 'text-gray-600'}`}>{stakeholder.interest}</span>
         </div>
      </div>

      {/* Decompose Button - only shown for decomposable stakeholders */}
      <div className="ml-3">
        {stakeholder.isDecomposable ? (
          <DecomposeToolButton
            stakeholder={stakeholder}
            onClick={() => onDecomposeClick?.(stakeholder)}
          />
        ) : (
          <div className="w-8" /> // Spacer for alignment
        )}
      </div>

      <div className="ml-2 w-6 flex justify-center">
        {stakeholder.isAnalyzed ? (
            <CheckCircle2 size={18} className="text-green-500" />
        ) : (
            <AlertCircle size={18} className="text-gray-300" />
        )}
      </div>
    </div>
  );
};

export const StakeholderRegister: React.FC = () => {
  const dispatch = useDispatch();
  const { stakeholders } = useSelector((state: RootState) => state.pmis);
  const { currentLevel } = useSelector((state: RootState) => state.game);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [decomposeTarget, setDecomposeTarget] = useState<Stakeholder | null>(null);
  const [isFinalized, setIsFinalized] = useState(false);

  // Drop zone for identifying new stakeholders (from emails)
  const { setNodeRef, isOver } = useDroppable({
    id: 'stakeholder-register-drop-zone',
    data: {
      type: 'stakeholder-register',
    },
  });

  const identifiedStakeholders = stakeholders.filter(s => s.isIdentified);
  const analyzedCount = identifiedStakeholders.filter(s => s.isAnalyzed).length;
  const canFinalize = identifiedStakeholders.length >= 2 && analyzedCount >= 2;

  const handleFinalizeRegister = () => {
    if (currentLevel >= 2 && !isFinalized) {
      // Check if compliance body is already identified
      const complianceIdentified = stakeholders.find(s => s.id === 'sh_compliance')?.isIdentified;

      if (!complianceIdentified) {
        // Trigger late arrival event via the team channel
        dispatch(startDialogue({
          contactId: DIALOGUE_LATE_ARRIVAL.contactId,
          startNodeId: DIALOGUE_LATE_ARRIVAL.startNodeId,
        }));
        dispatch(addNotification({
          id: `notif_${Date.now()}`,
          title: 'New Message',
          message: 'Check the Team Channel - urgent message from Regulatory Affairs.',
          type: 'info',
          duration: 5000,
        }));
      } else {
        // Register already complete
        dispatch(addNotification({
          id: `notif_${Date.now()}`,
          title: 'Register Finalized',
          message: 'Stakeholder Register is complete. Ready for Level 2 exam.',
          type: 'success',
          duration: 4000,
        }));
        setIsFinalized(true);
        dispatch(triggerExam(2));
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Stakeholder Register</h2>
                <p className="text-sm text-gray-500">Identify and analyze project stakeholders.</p>
            </div>
            
            <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <ListIcon size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                </div>

                {/* Finalize Button - Only shown in Level 2+ */}
                {currentLevel >= 2 && (
                    <button
                        onClick={handleFinalizeRegister}
                        disabled={!canFinalize || isFinalized}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                            ${isFinalized
                                ? 'bg-green-100 text-green-700 cursor-default'
                                : canFinalize
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        title={!canFinalize ? 'Identify and analyze at least 2 stakeholders' : ''}
                    >
                        <CheckSquare size={16} />
                        {isFinalized ? 'Finalized' : 'Finalize Register'}
                    </button>
                )}
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden relative">
            {viewMode === 'list' ? (
                <div className="absolute inset-0 overflow-y-auto p-6">
                    
                    {/* Identification Drop Zone */}
                    <div 
                        ref={setNodeRef}
                        className={`mb-8 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors
                            ${isOver ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
                        `}
                    >
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                            <User className="text-purple-600" size={24} />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">Identify New Stakeholder</h3>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs">
                            Drag emails here to add the sender to the stakeholder register.
                        </p>
                    </div>

                    {/* List of Stakeholders */}
                    <div className="space-y-1">
                        <div className="flex items-center px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="w-8 mr-3"></div> {/* Grip Spacer */}
                            <div className="w-14 mr-4">Avatar</div>
                            <div className="flex-1">Name / Role</div>
                            <div className="w-[200px] flex justify-end gap-4 mr-4">Analysis</div>
                            <div className="w-6 text-center">Status</div>
                        </div>

                        {identifiedStakeholders.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 text-sm">
                                No stakeholders identified yet. Check your emails.
                            </div>
                        ) : (
                            identifiedStakeholders.map(stakeholder => (
                                <DraggableStakeholderRow
                                  key={stakeholder.id}
                                  stakeholder={stakeholder}
                                  onDecomposeClick={setDecomposeTarget}
                                />
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <AnalysisGrid stakeholders={identifiedStakeholders} />
            )}
        </div>

        {/* Decompose Modal */}
        <AnimatePresence>
          {decomposeTarget && (
            <DecomposeModal
              stakeholder={decomposeTarget}
              onClose={() => setDecomposeTarget(null)}
            />
          )}
        </AnimatePresence>
    </div>
  );
};