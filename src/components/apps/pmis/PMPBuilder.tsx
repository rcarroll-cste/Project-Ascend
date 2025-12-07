import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import {
  FileText,
  BookOpen,
  Target,
  CheckCircle2,
  AlertTriangle,
  GripVertical,
  Layers,
  GitBranch,
  FileCheck,
  Book,
  X,
} from 'lucide-react';
import { RootState } from '../../../store';
import { completeObjective, completeLevel, addNotification } from '../../../features/gameSlice';
import { getLevelById } from '../../../data/levels';
import { LevelObjective } from '../../../types';

// =============================================================================
// TYPES
// =============================================================================

type PlanCategory = 'subsidiary_plan' | 'baseline' | 'project_document' | 'unassigned';
type LifecycleApproach = 'predictive' | 'agile' | 'hybrid' | null;

interface PMPItem {
  id: string;
  name: string;
  description: string;
  correctCategory: Exclude<PlanCategory, 'unassigned'>;
  hint: string;
}

// =============================================================================
// DATA - Items to be classified
// =============================================================================

const PMP_ITEMS: PMPItem[] = [
  // Subsidiary Plans (go INTO the PMP)
  {
    id: 'scope_mgmt_plan',
    name: 'Scope Management Plan',
    description: 'Defines how scope will be defined, validated, and controlled.',
    correctCategory: 'subsidiary_plan',
    hint: 'This defines HOW to manage an aspect of the project.',
  },
  {
    id: 'schedule_mgmt_plan',
    name: 'Schedule Management Plan',
    description: 'Establishes criteria for developing and controlling the schedule.',
    correctCategory: 'subsidiary_plan',
    hint: 'This defines HOW to manage an aspect of the project.',
  },
  {
    id: 'cost_mgmt_plan',
    name: 'Cost Management Plan',
    description: 'Describes how costs will be planned, structured, and controlled.',
    correctCategory: 'subsidiary_plan',
    hint: 'This defines HOW to manage an aspect of the project.',
  },
  {
    id: 'quality_mgmt_plan',
    name: 'Quality Management Plan',
    description: 'Describes how quality policies will be implemented.',
    correctCategory: 'subsidiary_plan',
    hint: 'This defines HOW to manage an aspect of the project.',
  },
  {
    id: 'change_mgmt_plan',
    name: 'Change Management Plan',
    description: 'Describes how change requests will be processed.',
    correctCategory: 'subsidiary_plan',
    hint: 'This is a critical subsidiary plan for controlling changes.',
  },
  // Baselines (go INTO the PMP)
  {
    id: 'scope_baseline',
    name: 'Scope Baseline',
    description: 'The approved version of scope statement, WBS, and WBS dictionary.',
    correctCategory: 'baseline',
    hint: 'This is an approved version used for comparison.',
  },
  {
    id: 'schedule_baseline',
    name: 'Schedule Baseline',
    description: 'The approved version of the schedule model.',
    correctCategory: 'baseline',
    hint: 'This is an approved version used for comparison.',
  },
  {
    id: 'cost_baseline',
    name: 'Cost Baseline',
    description: 'The approved version of the time-phased budget.',
    correctCategory: 'baseline',
    hint: 'This is an approved version used for comparison.',
  },
  // Project Documents (do NOT go into PMP)
  {
    id: 'stakeholder_register',
    name: 'Stakeholder Register',
    description: 'List of identified stakeholders and their information.',
    correctCategory: 'project_document',
    hint: 'This is a living document that is updated throughout the project.',
  },
  {
    id: 'risk_register',
    name: 'Risk Register',
    description: 'Record of identified risks and their details.',
    correctCategory: 'project_document',
    hint: 'This is a living document updated by risk processes.',
  },
  {
    id: 'assumption_log',
    name: 'Assumption Log',
    description: 'List of assumptions and constraints.',
    correctCategory: 'project_document',
    hint: 'This is a project document, not part of the PMP.',
  },
  {
    id: 'lessons_learned',
    name: 'Lessons Learned Register',
    description: 'Knowledge gained during the project.',
    correctCategory: 'project_document',
    hint: 'This is a project document maintained throughout the project.',
  },
];

// =============================================================================
// DRAGGABLE ITEM COMPONENT
// =============================================================================

interface DraggableItemProps {
  item: PMPItem;
  isPlaced: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, isPlaced }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `pmp-item-${item.id}`,
    data: {
      type: 'pmp-item',
      item,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
      }
    : undefined;

  if (isPlaced) return null;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging ? 'shadow-lg ring-2 ring-purple-400' : 'hover:shadow-md'
      }`}
      {...listeners}
      {...attributes}
    >
      <GripVertical size={16} className="text-slate-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
        <p className="text-xs text-slate-500 truncate">{item.description}</p>
      </div>
    </motion.div>
  );
};

// =============================================================================
// DROP ZONE COMPONENT
// =============================================================================

interface DropZoneProps {
  category: Exclude<PlanCategory, 'unassigned'>;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  items: PMPItem[];
  placedItems: Record<string, PlanCategory>;
  incorrectItems: Set<string>;
}

const DropZone: React.FC<DropZoneProps> = ({
  category,
  title,
  description,
  icon,
  color,
  items,
  placedItems,
  incorrectItems,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `pmp-zone-${category}`,
    data: {
      type: 'pmp-zone',
      category,
    },
  });

  const placedInZone = items.filter(item => placedItems[item.id] === category);

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 rounded-xl border-2 transition-all ${
        isOver
          ? 'border-purple-500 bg-purple-50'
          : `border-dashed ${color} bg-slate-50`
      }`}
    >
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
            {placedInZone.length}
          </span>
        </div>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <div className="p-3 space-y-2 min-h-[120px]">
        <AnimatePresence>
          {placedInZone.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                incorrectItems.has(item.id)
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : item.correctCategory === category
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-white border border-slate-200'
              }`}
            >
              {item.correctCategory === category ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : incorrectItems.has(item.id) ? (
                <X size={14} className="text-red-500" />
              ) : (
                <FileText size={14} className="text-slate-400" />
              )}
              <span className="truncate">{item.name}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {placedInZone.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">
            Drag items here
          </p>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// LIFECYCLE SELECTOR
// =============================================================================

interface LifecycleSelectorProps {
  selected: LifecycleApproach;
  onSelect: (approach: LifecycleApproach) => void;
  disabled: boolean;
}

const LifecycleSelector: React.FC<LifecycleSelectorProps> = ({ selected, onSelect, disabled }) => {
  const approaches = [
    {
      id: 'predictive' as const,
      name: 'Predictive (Waterfall)',
      description: 'Sequential phases, full planning upfront',
      best: 'Well-defined scope, low uncertainty',
    },
    {
      id: 'agile' as const,
      name: 'Agile (Iterative)',
      description: 'Incremental delivery, adaptive planning',
      best: 'Evolving requirements, high uncertainty',
    },
    {
      id: 'hybrid' as const,
      name: 'Hybrid',
      description: 'Combines predictive and agile elements',
      best: 'Mixed requirements, moderate uncertainty',
    },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-700">Development Approach</h4>
      <div className="grid grid-cols-3 gap-3">
        {approaches.map(approach => (
          <button
            key={approach.id}
            onClick={() => !disabled && onSelect(approach.id)}
            disabled={disabled}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              selected === approach.id
                ? 'border-purple-500 bg-purple-50'
                : disabled
                ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
            }`}
          >
            <p className="font-medium text-sm text-slate-800">{approach.name}</p>
            <p className="text-xs text-slate-500 mt-1">{approach.description}</p>
            <p className="text-xs text-purple-600 mt-2">Best for: {approach.best}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const PMPBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const { currentLevelId, levelProgress } = useSelector((state: RootState) => state.game);

  const [placedItems, setPlacedItems] = useState<Record<string, PlanCategory>>({});
  const [incorrectItems, setIncorrectItems] = useState<Set<string>>(new Set());
  const [selectedLifecycle, setSelectedLifecycle] = useState<LifecycleApproach>(null);
  const [conflictResolved, setConflictResolved] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);

  // Get current level data
  const currentLevel = getLevelById(currentLevelId);
  const currentProgress = levelProgress[currentLevelId];

  // Get level objectives
  const objectives: LevelObjective[] = useMemo(() => {
    if (!currentLevel || currentLevelId !== 3) return [];
    return currentLevel.objectives.map(obj => ({
      ...obj,
      isCompleted: currentProgress?.objectivesCompleted[obj.id] ?? false,
    }));
  }, [currentLevel, currentLevelId, currentProgress]);

  // Calculate progress
  const subsidiaryPlans = PMP_ITEMS.filter(i => i.correctCategory === 'subsidiary_plan');
  const baselines = PMP_ITEMS.filter(i => i.correctCategory === 'baseline');
  const projectDocs = PMP_ITEMS.filter(i => i.correctCategory === 'project_document');

  const correctSubsidiaryCount = subsidiaryPlans.filter(
    i => placedItems[i.id] === 'subsidiary_plan'
  ).length;
  const correctBaselineCount = baselines.filter(
    i => placedItems[i.id] === 'baseline'
  ).length;
  const correctDocumentCount = projectDocs.filter(
    i => placedItems[i.id] === 'project_document'
  ).length;

  // Track objective completion
  useEffect(() => {
    if (currentLevelId !== 3 || !currentProgress) return;

    // Objective: select_lifecycle
    if (selectedLifecycle && !currentProgress.objectivesCompleted['select_lifecycle']) {
      dispatch(completeObjective({ levelId: 3, objectiveId: 'select_lifecycle' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Lifecycle Selected',
        message: `${selectedLifecycle.charAt(0).toUpperCase() + selectedLifecycle.slice(1)} approach selected.`,
        type: 'success',
        duration: 3000,
      }));
    }

    // Objective: assemble_subsidiary_plans
    if (correctSubsidiaryCount >= 4 && !currentProgress.objectivesCompleted['assemble_subsidiary_plans']) {
      dispatch(completeObjective({ levelId: 3, objectiveId: 'assemble_subsidiary_plans' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Objective Complete',
        message: 'Subsidiary Plans correctly added to the PMP!',
        type: 'success',
        duration: 3000,
      }));
    }

    // Objective: add_baselines
    if (correctBaselineCount >= 3 && !currentProgress.objectivesCompleted['add_baselines']) {
      dispatch(completeObjective({ levelId: 3, objectiveId: 'add_baselines' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Objective Complete',
        message: 'Baselines correctly added to the PMP!',
        type: 'success',
        duration: 3000,
      }));
    }

    // Objective: reject_documents
    if (correctDocumentCount >= 3 && !currentProgress.objectivesCompleted['reject_documents']) {
      dispatch(completeObjective({ levelId: 3, objectiveId: 'reject_documents' }));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Objective Complete',
        message: 'Project Documents correctly excluded from the PMP!',
        type: 'success',
        duration: 3000,
      }));
    }

    // Objective: handle_marcus_conflict
    if (conflictResolved && !currentProgress.objectivesCompleted['handle_marcus_conflict']) {
      dispatch(completeObjective({ levelId: 3, objectiveId: 'handle_marcus_conflict' }));
    }
  }, [
    selectedLifecycle,
    correctSubsidiaryCount,
    correctBaselineCount,
    correctDocumentCount,
    conflictResolved,
    currentLevelId,
    currentProgress,
    dispatch,
  ]);

  // Trigger conflict when Change Management Plan is placed
  useEffect(() => {
    if (placedItems['change_mgmt_plan'] === 'subsidiary_plan' && !conflictResolved && !showConflictModal) {
      setTimeout(() => setShowConflictModal(true), 500);
    }
  }, [placedItems, conflictResolved, showConflictModal]);

  // Handle item drop
  const handleDrop = (itemId: string, category: PlanCategory) => {
    const item = PMP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    setPlacedItems(prev => ({ ...prev, [itemId]: category }));

    // Check if correct
    if (item.correctCategory !== category) {
      setIncorrectItems(prev => new Set(prev).add(itemId));
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Incorrect Placement',
        message: item.hint,
        type: 'warning',
        duration: 4000,
      }));
    } else {
      setIncorrectItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  // Listen for drop events from parent DndContext
  useEffect(() => {
    const handlePmpDrop = (e: CustomEvent<{ itemId: string; category: PlanCategory }>) => {
      handleDrop(e.detail.itemId, e.detail.category);
    };

    window.addEventListener('pmp-drop', handlePmpDrop as EventListener);
    return () => {
      window.removeEventListener('pmp-drop', handlePmpDrop as EventListener);
    };
  }, []);

  // Handle conflict resolution
  const handleConflictChoice = (choice: 'collaborate' | 'override') => {
    if (choice === 'collaborate') {
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Conflict Resolved',
        message: 'Marcus agrees to the Change Management Plan after discussing his concerns.',
        type: 'success',
        duration: 4000,
      }));
    } else {
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Conflict Escalated',
        message: 'Marcus is unhappy. This may cause issues later.',
        type: 'warning',
        duration: 4000,
      }));
    }
    setConflictResolved(true);
    setShowConflictModal(false);
  };

  // Check if level can be completed
  const canComplete =
    selectedLifecycle &&
    correctSubsidiaryCount >= 4 &&
    correctBaselineCount >= 3 &&
    correctDocumentCount >= 3 &&
    conflictResolved;

  const handleFinalize = () => {
    if (canComplete) {
      dispatch(completeLevel(3));
    }
  };

  const unplacedItems = PMP_ITEMS.filter(item => !placedItems[item.id]);

  return (
    <div className="flex h-full">
      {/* Sidebar - Objectives */}
      {currentLevelId === 3 && objectives.length > 0 && (
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

          {/* Objectives List */}
          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Target size={12} />
              Objectives
            </h4>
            {objectives.map(obj => (
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

          {/* Progress */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-500">Progress</span>
              <span className="font-semibold text-slate-700">
                {objectives.filter(o => o.isCompleted).length} / {objectives.length}
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${(objectives.filter(o => o.isCompleted).length / objectives.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* PMBOK Tip */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <h5 className="text-xs font-semibold text-purple-700 mb-1">PMBOK Tip</h5>
            <p className="text-xs text-purple-600">
              The PMP contains Subsidiary Plans and Baselines. Project Documents are separate and
              updated throughout the project lifecycle.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Project Management Plan Builder</h2>
              <p className="text-sm text-slate-500">
                Organize components into Subsidiary Plans, Baselines, or Project Documents
              </p>
            </div>
            <button
              onClick={handleFinalize}
              disabled={!canComplete}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                canComplete
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <FileCheck size={16} />
              Finalize PMP
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Lifecycle Selector */}
          <div className="mb-6 bg-white rounded-xl p-4 border border-slate-200">
            <LifecycleSelector
              selected={selectedLifecycle}
              onSelect={setSelectedLifecycle}
              disabled={!!currentProgress?.objectivesCompleted['select_lifecycle']}
            />
          </div>

          {/* Drop Zones */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <DropZone
              category="subsidiary_plan"
              title="Subsidiary Plans"
              description="Components that define HOW to manage project aspects"
              icon={<Layers size={18} className="text-blue-600" />}
              color="border-blue-300"
              items={PMP_ITEMS}
              placedItems={placedItems}
              incorrectItems={incorrectItems}
            />
            <DropZone
              category="baseline"
              title="Baselines"
              description="Approved versions used for comparison"
              icon={<GitBranch size={18} className="text-green-600" />}
              color="border-green-300"
              items={PMP_ITEMS}
              placedItems={placedItems}
              incorrectItems={incorrectItems}
            />
            <DropZone
              category="project_document"
              title="Project Documents"
              description="Living documents NOT part of the PMP"
              icon={<FileText size={18} className="text-orange-600" />}
              color="border-orange-300"
              items={PMP_ITEMS}
              placedItems={placedItems}
              incorrectItems={incorrectItems}
            />
          </div>

          {/* Unplaced Items */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <BookOpen size={16} />
              Items to Classify ({unplacedItems.length} remaining)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {unplacedItems.map(item => (
                <DraggableItem key={item.id} item={item} isPlaced={!!placedItems[item.id]} />
              ))}
            </div>
            {unplacedItems.length === 0 && (
              <p className="text-center text-slate-400 py-4">All items classified!</p>
            )}
          </div>
        </div>
      </div>

      {/* Conflict Modal */}
      <AnimatePresence>
        {showConflictModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-full">
                  <AlertTriangle size={24} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Conflict with Marcus</h3>
                  <p className="text-sm text-slate-500">Change Management Plan dispute</p>
                </div>
              </div>
              <p className="text-slate-700 mb-4">
                Marcus objects to the Change Management Plan: "This is too bureaucratic! We've
                always handled changes informally. This will slow everything down."
              </p>
              <p className="text-sm text-slate-500 mb-4">
                How do you resolve this conflict?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleConflictChoice('collaborate')}
                  className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Collaborate
                </button>
                <button
                  onClick={() => handleConflictChoice('override')}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Override
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-3 text-center">
                PMBOK: Conflict resolution techniques include Collaborate, Compromise, Smooth, Force, and Withdraw.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PMPBuilder;
