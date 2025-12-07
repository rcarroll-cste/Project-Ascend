import React, { useState, useEffect, useMemo } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { RootState } from '../../../store';
import { Stakeholder, LevelObjective, SalienceClass } from '../../../types';
import { User, GripVertical, AlertCircle, CheckCircle2, LayoutGrid, List as ListIcon, CheckSquare, Target, Book, Zap, Scale, Crown } from 'lucide-react';
import { AnalysisGrid } from './AnalysisGrid';
import { DecomposeToolButton, DecomposeModal } from './DecomposeTool';
import { addNotification, completeObjective, completeLevel } from '../../../features/gameSlice';
import { startDialogue } from '../../../features/dialogueSlice';
import { DIALOGUE_LATE_ARRIVAL } from '../../../data/dialogueTrees';
import { getLevelById } from '../../../data/levels';

// Salience class color mapping (Power/Urgency/Legitimacy visual indicators)
const SALIENCE_BADGE_STYLES: Record<SalienceClass, { bg: string; text: string; description: string }> = {
  Definitive: { bg: 'bg-red-100', text: 'text-red-700', description: 'Power + Urgency + Legitimacy' },
  Dominant: { bg: 'bg-orange-100', text: 'text-orange-700', description: 'Power + Legitimacy' },
  Dangerous: { bg: 'bg-purple-100', text: 'text-purple-700', description: 'Power + Urgency' },
  Dependent: { bg: 'bg-blue-100', text: 'text-blue-700', description: 'Urgency + Legitimacy' },
  Dormant: { bg: 'bg-gray-100', text: 'text-gray-600', description: 'Power only' },
  Discretionary: { bg: 'bg-green-100', text: 'text-green-700', description: 'Legitimacy only' },
  Demanding: { bg: 'bg-yellow-100', text: 'text-yellow-700', description: 'Urgency only' },
  None: { bg: 'bg-slate-100', text: 'text-slate-500', description: 'No salience' },
};

// Compact Salience Indicator (shows P/U/L as small colored dots)
const SalienceIndicator: React.FC<{ stakeholder: Stakeholder }> = ({ stakeholder }) => {
  const hasPower = stakeholder.power === 'High';
  const hasUrgency = stakeholder.urgency === 'High';
  const hasLegitimacy = stakeholder.legitimacy === 'High';

  return (
    <div className="flex items-center gap-1" title={`P:${stakeholder.power} U:${stakeholder.urgency} L:${stakeholder.legitimacy}`}>
      {/* Power indicator */}
      <div
        className={`w-5 h-5 rounded flex items-center justify-center ${hasPower ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-300'}`}
        title={`Power: ${stakeholder.power}`}
      >
        <Crown size={12} />
      </div>
      {/* Urgency indicator */}
      <div
        className={`w-5 h-5 rounded flex items-center justify-center ${hasUrgency ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-300'}`}
        title={`Urgency: ${stakeholder.urgency}`}
      >
        <Zap size={12} />
      </div>
      {/* Legitimacy indicator */}
      <div
        className={`w-5 h-5 rounded flex items-center justify-center ${hasLegitimacy ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-300'}`}
        title={`Legitimacy: ${stakeholder.legitimacy}`}
      >
        <Scale size={12} />
      </div>
    </div>
  );
};

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

  // Get salience badge styles
  const salienceStyle = stakeholder.salienceClass
    ? SALIENCE_BADGE_STYLES[stakeholder.salienceClass]
    : SALIENCE_BADGE_STYLES.None;

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
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${salienceStyle.bg} ${salienceStyle.text}`}
              title={salienceStyle.description}
            >
              {stakeholder.salienceClass}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">{stakeholder.role}</p>
      </div>

      {/* Salience (P/U/L) Visual Indicators */}
      <div className="mr-4">
        <SalienceIndicator stakeholder={stakeholder} />
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
         <div className="flex flex-col items-end min-w-[70px]">
            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Power</span>
            <span className={`font-medium ${stakeholder.power === 'High' ? 'text-red-600' : 'text-gray-600'}`}>{stakeholder.power}</span>
         </div>
         <div className="flex flex-col items-end min-w-[70px]">
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
  const { currentLevelId, levelProgress } = useSelector((state: RootState) => state.game);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [decomposeTarget, setDecomposeTarget] = useState<Stakeholder | null>(null);
  const [isFinalized, setIsFinalized] = useState(false);
  const [hasScannedDirectory, setHasScannedDirectory] = useState(false);

  // Get current level data
  const currentLevel = getLevelById(currentLevelId);
  const currentProgress = levelProgress[currentLevelId];

  // Get level objectives for display
  const objectives: LevelObjective[] = useMemo(() => {
    if (!currentLevel || currentLevelId !== 2) return [];
    return currentLevel.objectives.map(obj => ({
      ...obj,
      isCompleted: currentProgress?.objectivesCompleted[obj.id] ?? false,
    }));
  }, [currentLevel, currentLevelId, currentProgress]);

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

  // Track Level 2 objectives based on stakeholder actions
  useEffect(() => {
    if (currentLevelId !== 2 || !currentProgress) return;

    // Objective: tag_stakeholders - Tag all visible stakeholders (at least 3)
    if (identifiedStakeholders.length >= 3 && !currentProgress.objectivesCompleted['tag_stakeholders']) {
      dispatch(completeObjective({ levelId: 2, objectiveId: 'tag_stakeholders' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Objective Complete',
        message: 'All visible stakeholders have been tagged!',
        type: 'success',
        duration: 3000,
      }));
    }

    // Objective: find_hidden_stakeholder - Discover the compliance body
    const complianceIdentified = stakeholders.find(s => s.id === 'sh_compliance')?.isIdentified;
    if (complianceIdentified && !currentProgress.objectivesCompleted['find_hidden_stakeholder']) {
      dispatch(completeObjective({ levelId: 2, objectiveId: 'find_hidden_stakeholder' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Hidden Stakeholder Found!',
        message: 'You discovered the Compliance Body - they were lurking in the spam folder!',
        type: 'success',
        duration: 4000,
      }));
    }

    // Objective: place_power_interest - At least 2 stakeholders correctly placed on grid
    const correctlyPlaced = stakeholders.filter(s =>
      s.isAnalyzed && s.power && s.interest
    ).length;
    if (correctlyPlaced >= 2 && !currentProgress.objectivesCompleted['place_power_interest']) {
      dispatch(completeObjective({ levelId: 2, objectiveId: 'place_power_interest' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Objective Complete',
        message: 'Power/Interest Grid analysis complete for key stakeholders.',
        type: 'success',
        duration: 3000,
      }));
    }

    // Objective: analyze_salience - Apply Salience Model to union rep
    const unionRep = stakeholders.find(s => s.id === 'sh_union');
    if (unionRep?.salienceClass && unionRep.salienceClass !== 'None' &&
        !currentProgress.objectivesCompleted['analyze_salience']) {
      dispatch(completeObjective({ levelId: 2, objectiveId: 'analyze_salience' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Salience Analysis Complete',
        message: `Union Representative classified as ${unionRep.salienceClass}`,
        type: 'success',
        duration: 3000,
      }));
    }
  }, [stakeholders, identifiedStakeholders.length, currentLevelId, currentProgress, dispatch]);

  // Handle directory scan (simulated action)
  const handleScanDirectory = () => {
    if (!hasScannedDirectory && currentLevelId === 2) {
      setHasScannedDirectory(true);
      dispatch(completeObjective({ levelId: 2, objectiveId: 'scan_directory' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Directory Scanned',
        message: 'Company directory reviewed. Potential stakeholders identified.',
        type: 'info',
        duration: 3000,
      }));
    }
  };

  const handleFinalizeRegister = () => {
    if (currentLevelId >= 2 && !isFinalized) {
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
        // Complete the update_register objective
        if (!currentProgress?.objectivesCompleted['update_register']) {
          dispatch(completeObjective({ levelId: 2, objectiveId: 'update_register' }));
        }

        // Register already complete
        dispatch(addNotification({
          id: `notif_${Date.now()}`,
          title: 'Register Finalized',
          message: 'Stakeholder Register is complete. Excellent stakeholder analysis!',
          type: 'success',
          duration: 4000,
        }));
        setIsFinalized(true);

        // Complete Level 2
        dispatch(completeLevel(2));
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
                {currentLevelId >= 2 && (
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

        {/* Main Content with Sidebar */}
        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar - Level 2 Objectives */}
            {currentLevelId === 2 && objectives.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-72 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto shrink-0"
                >
                    {/* Level Header */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                            <Book size={16} />
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Level {currentLevelId}
                            </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">
                            {currentLevel?.narrativeTitle}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            {currentLevel?.processCode} - {currentLevel?.knowledgeArea}
                        </p>
                    </div>

                    {/* Scan Directory Button */}
                    {!hasScannedDirectory && (
                        <button
                            onClick={handleScanDirectory}
                            className="w-full mb-4 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Target size={14} />
                            Scan Company Directory
                        </button>
                    )}

                    {/* Objectives List */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Target size={12} />
                            Objectives
                        </h4>
                        {objectives.map((obj) => (
                            <motion.div
                                key={obj.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`flex items-start gap-2 p-2 rounded-lg text-xs transition-colors ${
                                    obj.isCompleted
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-white text-slate-600 border border-slate-200'
                                }`}
                            >
                                {obj.isCompleted ? (
                                    <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
                                ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
                                )}
                                <span className={obj.isCompleted ? 'line-through opacity-75' : ''}>
                                    {obj.description}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress Summary */}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Progress</span>
                            <span className="font-semibold text-slate-700">
                                {objectives.filter(o => o.isCompleted).length} / {objectives.length}
                            </span>
                        </div>
                        <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-purple-500"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${(objectives.filter(o => o.isCompleted).length / objectives.length) * 100}%`
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* PMBOK Tip */}
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <h5 className="text-xs font-semibold text-purple-700 mb-1">PMBOK Tip</h5>
                        <p className="text-xs text-purple-600">
                            Stakeholder identification is iterative - new stakeholders can appear at any phase. Always keep the register updated!
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Main Content Area */}
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
                                <div className="w-[60px] mr-4 text-center" title="Power / Urgency / Legitimacy">P/U/L</div>
                                <div className="w-[180px] flex justify-end gap-4 mr-4">Analysis</div>
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