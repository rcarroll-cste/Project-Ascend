import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../../store';
import { addAssumptionEntry, assignClueToDocument, removeClueFromDocument, completeBusinessDocument } from '../../../features/pmisSlice';
import { completeObjective } from '../../../features/gameSlice';
import { useNotification } from '../../../hooks/useNotification';
import { EvidenceItem } from '../../../types';
import {
  FileText,
  Briefcase,
  Target,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Lightbulb,
  X
} from 'lucide-react';
import { nanoid } from '@reduxjs/toolkit';
import { getLevelById } from '../../../data/levels';

// =============================================================================
// CLUE CATEGORY DEFINITIONS
// Per GDD v7.1: Clues must be sorted into correct document types
// =============================================================================

type ClueCategory = 'Financial' | 'Strategic' | 'Assumption' | 'Unknown';

// Map evidence to their correct document destinations
const getClueCategory = (item: EvidenceItem): ClueCategory => {
  // Financial/ROI clues go to Business Case
  if (item.id === 'ev_clue_roi_target' ||
      item.name.toLowerCase().includes('roi') ||
      item.name.toLowerCase().includes('budget') ||
      item.name.toLowerCase().includes('$') ||
      item.description.toLowerCase().includes('return on investment') ||
      item.description.toLowerCase().includes('financial')) {
    return 'Financial';
  }

  // Strategic/Value clues go to Benefits Management Plan
  if (item.id === 'ev_clue_strategic_align' ||
      item.name.toLowerCase().includes('strategic') ||
      item.name.toLowerCase().includes('alignment') ||
      item.description.toLowerCase().includes('efficiency') ||
      item.description.toLowerCase().includes('strategic') ||
      item.description.toLowerCase().includes('corporate goal')) {
    return 'Strategic';
  }

  // Assumption clues (unverified claims) go to Assumption Log
  if (item.id === 'ev_clue_power_assumption' ||
      item.isDistractor ||
      item.name.toLowerCase().includes('claim') ||
      item.name.toLowerCase().includes('assumption') ||
      item.description.toLowerCase().includes('probably') ||
      item.description.toLowerCase().includes('might') ||
      item.description.toLowerCase().includes('maybe')) {
    return 'Assumption';
  }

  return 'Unknown';
};

// Document zone definitions
interface DocumentZone {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  acceptsCategory: ClueCategory;
  color: string;
  bgColor: string;
  borderColor: string;
}

const DOCUMENT_ZONES: DocumentZone[] = [
  {
    id: 'business-case',
    name: 'Business Case',
    description: 'Financial justification & ROI metrics',
    icon: <Briefcase size={24} />,
    acceptsCategory: 'Financial',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
  },
  {
    id: 'benefits-plan',
    name: 'Benefits Management Plan',
    description: 'Strategic alignment & value delivery',
    icon: <Target size={24} />,
    acceptsCategory: 'Strategic',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
  },
  {
    id: 'assumption-log',
    name: 'Assumption Log',
    description: 'Unverified claims & uncertainties',
    icon: <AlertTriangle size={24} />,
    acceptsCategory: 'Assumption',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
  },
];

// =============================================================================
// MENTOS FEEDBACK MESSAGES
// Per GDD: MentOS provides contextual pedagogical nudges
// =============================================================================

interface MentosFeedback {
  title: string;
  message: string;
  hint?: string;
}

const getMentosFeedback = (
  item: EvidenceItem,
  targetZone: string,
  correctCategory: ClueCategory
): MentosFeedback => {
  const targetZoneObj = DOCUMENT_ZONES.find(z => z.id === targetZone);

  // Wrong zone for Financial clue
  if (correctCategory === 'Financial' && targetZone !== 'business-case') {
    return {
      title: 'Wrong Document!',
      message: `This is financial data. "${item.name}" contains ROI or budget information.`,
      hint: 'Financial metrics belong in the Business Case, not the ' + targetZoneObj?.name,
    };
  }

  // Wrong zone for Strategic clue
  if (correctCategory === 'Strategic' && targetZone !== 'benefits-plan') {
    return {
      title: 'Wrong Document!',
      message: `This is about strategic alignment. "${item.name}" relates to corporate goals and value.`,
      hint: 'Strategic alignment belongs in the Benefits Management Plan, not the ' + targetZoneObj?.name,
    };
  }

  // Trying to put assumption in a business document (GDD Phase 2 key mechanic)
  if (correctCategory === 'Assumption' && targetZone !== 'assumption-log') {
    return {
      title: 'Wait!',
      message: 'Is this a proven fact? Or is this just a hope?',
      hint: 'Business Cases require verified data, not assumptions. Unverified claims belong in the Assumption Log.',
    };
  }

  return {
    title: 'Hmm...',
    message: 'This clue doesn\'t seem to fit here.',
    hint: 'Review the document types and what information each one needs.',
  };
};

// =============================================================================
// DRAGGABLE CLUE COMPONENT
// =============================================================================

interface DraggableClueProps {
  item: EvidenceItem;
  isAssigned: boolean;
}

const DraggableClue: React.FC<DraggableClueProps> = ({ item, isAssigned }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `doc-clue-${item.id}`,
    data: {
      type: 'doc-clue',
      item: item,
    },
    disabled: isAssigned,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const category = getClueCategory(item);
  const categoryColors: Record<ClueCategory, string> = {
    Financial: 'border-l-emerald-500',
    Strategic: 'border-l-blue-500',
    Assumption: 'border-l-amber-500',
    Unknown: 'border-l-gray-400',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-3 bg-white border-l-4 ${categoryColors[category]} rounded-r shadow-sm
        cursor-grab active:cursor-grabbing mb-2
        hover:shadow-md transition-all
        ${isDragging ? 'opacity-50 ring-2 ring-purple-500 z-50' : ''}
        ${isAssigned ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex items-start space-x-2">
        <Lightbulb className="text-yellow-500 shrink-0" size={16} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-800 leading-tight truncate">
            {item.name}
          </h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// DROPPABLE DOCUMENT ZONE COMPONENT
// =============================================================================

interface DocumentDropZoneProps {
  zone: DocumentZone;
  assignedItems: EvidenceItem[];
  onRemoveItem: (itemId: string) => void;
}

const DocumentDropZone: React.FC<DocumentDropZoneProps> = ({
  zone,
  assignedItems,
  onRemoveItem
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `doc-zone-${zone.id}`,
    data: {
      type: 'doc-zone',
      zoneId: zone.id,
      acceptsCategory: zone.acceptsCategory,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative p-4 rounded-xl border-2 border-dashed transition-all min-h-[160px]
        ${isOver ? `${zone.bgColor} ${zone.borderColor} border-solid` : 'bg-gray-50 border-gray-300'}
      `}
    >
      {/* Zone Header */}
      <div className={`flex items-center gap-2 mb-3 ${zone.color}`}>
        {zone.icon}
        <div>
          <h3 className="font-semibold">{zone.name}</h3>
          <p className="text-xs opacity-75">{zone.description}</p>
        </div>
      </div>

      {/* Drop Indicator */}
      {assignedItems.length === 0 && (
        <div className={`
          text-center py-6 rounded-lg border border-dashed transition-colors
          ${isOver ? zone.borderColor : 'border-gray-200'}
        `}>
          <p className={`text-sm ${isOver ? zone.color : 'text-gray-400'}`}>
            {isOver ? 'Drop here!' : 'Drag clues here'}
          </p>
        </div>
      )}

      {/* Assigned Items */}
      <div className="space-y-2">
        {assignedItems.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`
              flex items-center justify-between p-2 rounded-lg
              ${zone.bgColor} border ${zone.borderColor}
            `}
          >
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle size={16} className={zone.color} />
              <span className="text-sm font-medium truncate">{item.name}</span>
            </div>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="p-1 hover:bg-white/50 rounded transition-colors"
              title="Remove item"
            >
              <X size={14} className="text-gray-500" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// MENTOS FEEDBACK MODAL
// =============================================================================

interface MentosModalProps {
  isOpen: boolean;
  feedback: MentosFeedback | null;
  onClose: () => void;
}

const MentosModal: React.FC<MentosModalProps> = ({ isOpen, feedback, onClose }) => {
  if (!isOpen || !feedback) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-md mx-4 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <HelpCircle className="text-white" size={24} />
            </div>
            <div>
              <p className="text-purple-200 text-xs font-medium">MentOS</p>
              <h3 className="text-white font-bold">{feedback.title}</h3>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-700 mb-4">{feedback.message}</p>
            {feedback.hint && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  <strong>Hint:</strong> {feedback.hint}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Got it!
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// =============================================================================
// MAIN DOC CREATOR COMPONENT
// =============================================================================

export const DocCreator: React.FC = () => {
  const dispatch = useDispatch();
  const { showNotification } = useNotification();

  // Redux state
  const { items: inventoryItems } = useSelector((state: RootState) => state.inventory);
  const { currentLevelId, levelProgress } = useSelector((state: RootState) => state.game);
  const { documentAssignments } = useSelector((state: RootState) => state.pmis);

  // MentOS feedback modal state
  const [mentosModalOpen, setMentosModalOpen] = useState(false);
  const [mentosFeedback, setMentosFeedback] = useState<MentosFeedback | null>(null);

  // Get current level data
  const currentLevel = getLevelById(currentLevelId);
  const currentProgress = levelProgress[currentLevelId];

  // Filter clues from inventory (items that can be sorted into documents)
  // Per GDD: Clues are text snippets extracted from Chatter conversations
  const clueItems = inventoryItems.filter(item =>
    item.id.startsWith('ev_clue_') ||
    item.name.toLowerCase().includes('clue:') ||
    item.name.toLowerCase().includes('claim:')
  );

  // Get all assigned item IDs
  const allAssignedIds = Object.values(documentAssignments).flat();

  // Check if an item is assigned to any document
  const isItemAssigned = (itemId: string) => allAssignedIds.includes(itemId);

  // Get assigned items for a zone
  const getZoneItems = (zoneId: string): EvidenceItem[] => {
    const assignedIds = documentAssignments[zoneId] || [];
    return inventoryItems.filter(item => assignedIds.includes(item.id));
  };

  // Handle removing an item from a zone
  const handleRemoveItem = (zoneId: string, itemId: string) => {
    dispatch(removeClueFromDocument({ zoneId, itemId }));
  };

  // Track objective completion and generate completed documents
  useEffect(() => {
    // Check if player has correctly sorted clues
    const businessCaseItems = documentAssignments['business-case'];
    const benefitsPlanItems = documentAssignments['benefits-plan'];
    const assumptionLogItems = documentAssignments['assumption-log'];

    const hasCorrectBusinessCase = businessCaseItems.includes('ev_clue_roi_target');
    const hasCorrectBenefitsPlan = benefitsPlanItems.includes('ev_clue_strategic_align');
    const hasCorrectAssumption = assumptionLogItems.includes('ev_clue_power_assumption');

    // Generate completed Business Case document when ROI clue is placed
    if (hasCorrectBusinessCase && businessCaseItems.length > 0) {
      dispatch(completeBusinessDocument({
        id: 'completed_business_case',
        type: 'BusinessCase',
        name: 'Business Case',
        description: 'Economic justification for the project, including ROI targets and financial constraints.',
        assignedClueIds: businessCaseItems,
        isComplete: true,
        completedAt: Date.now(),
        qualityScore: 100,
      }));
    }

    // Generate completed Benefits Management Plan when strategic alignment clue is placed
    if (hasCorrectBenefitsPlan && benefitsPlanItems.length > 0) {
      dispatch(completeBusinessDocument({
        id: 'completed_benefits_plan',
        type: 'BenefitsManagementPlan',
        name: 'Benefits Management Plan',
        description: 'Strategic alignment and value delivery goals for the project.',
        assignedClueIds: benefitsPlanItems,
        isComplete: true,
        completedAt: Date.now(),
        qualityScore: 95,
      }));
    }

    // Complete objective when all clues are correctly sorted
    if (hasCorrectBusinessCase && hasCorrectBenefitsPlan && hasCorrectAssumption) {
      if (currentLevelId === 1 && !currentProgress?.objectivesCompleted['sort_clues_to_docs']) {
        dispatch(completeObjective({ levelId: 1, objectiveId: 'sort_clues_to_docs' }));
        showNotification(
          'Documents Complete!',
          'All clues have been correctly sorted. The Business Case and Benefits Plan are ready for the Charter.',
          'success',
          5000
        );
      }
    }
  }, [documentAssignments, currentLevelId, currentProgress, dispatch, showNotification]);

  // This function will be called from PMISApp's handleDragEnd
  // We expose it via a custom event listener
  useEffect(() => {
    const handleDocDrop = (event: CustomEvent<{ itemId: string; zoneId: string }>) => {
      const { itemId, zoneId } = event.detail;
      const item = inventoryItems.find(i => i.id === itemId);

      if (!item) return;

      const correctCategory = getClueCategory(item);
      const targetZone = DOCUMENT_ZONES.find(z => z.id === zoneId);

      if (!targetZone) return;

      // Validate the drop
      const isCorrect = correctCategory === targetZone.acceptsCategory;

      if (isCorrect) {
        // Correct drop - add to zone via Redux
        dispatch(assignClueToDocument({ zoneId, itemId }));

        // Handle special case: Assumption going to Assumption Log (GDD Phase 2)
        if (zoneId === 'assumption-log') {
          dispatch(addAssumptionEntry({
            id: nanoid(),
            content: item.description,
            category: 'Assumption',
            isCorrectlyClassified: true,
          }));

          showNotification(
            'Assumption Logged!',
            `"${item.name}" has been moved to the Assumption Log for tracking.`,
            'success',
            3000
          );
        } else {
          showNotification(
            'Correct!',
            `"${item.name}" added to ${targetZone.name}.`,
            'success',
            2000
          );
        }
      } else {
        // Incorrect drop - show MentOS feedback
        const feedback = getMentosFeedback(item, zoneId, correctCategory);
        setMentosFeedback(feedback);
        setMentosModalOpen(true);
      }
    };

    window.addEventListener('doc-creator-drop', handleDocDrop as EventListener);
    return () => {
      window.removeEventListener('doc-creator-drop', handleDocDrop as EventListener);
    };
  }, [inventoryItems, dispatch, showNotification]);

  // Calculate objectives for sidebar
  const objectives = currentLevel?.objectives.filter(obj =>
    obj.id === 'sort_clues_to_docs' || obj.id === 'create_business_case'
  ).map(obj => ({
    ...obj,
    isCompleted: currentProgress?.objectivesCompleted[obj.id] ?? false,
  })) || [];

  return (
    <div className="flex h-full">
      {/* Left Sidebar: Clue Inventory */}
      <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <Lightbulb size={18} className="text-yellow-500" />
            Collected Clues
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Drag clues to the correct document
          </p>
        </div>

        {/* Clue List */}
        <div className="flex-1 p-4 overflow-y-auto">
          {clueItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Lightbulb size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No clues collected yet.</p>
              <p className="text-xs mt-1">
                Use Chatter to interview stakeholders and mine clues.
              </p>
            </div>
          ) : (
            clueItems.map(item => (
              <DraggableClue
                key={item.id}
                item={item}
                isAssigned={isItemAssigned(item.id)}
              />
            ))
          )}
        </div>

        {/* Level Objectives */}
        {objectives.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-purple-50">
            <h4 className="text-xs font-semibold text-purple-700 uppercase tracking-wider flex items-center gap-1 mb-2">
              <BookOpen size={12} />
              Objectives
            </h4>
            <ul className="space-y-1">
              {objectives.map(obj => (
                <li
                  key={obj.id}
                  className={`flex items-center gap-2 text-xs ${
                    obj.isCompleted ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  {obj.isCompleted ? (
                    <CheckCircle size={12} className="text-green-500" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={obj.isCompleted ? 'line-through opacity-60' : ''}>
                    {obj.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Content: Document Zones */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Doc Creator</h2>
            <p className="text-gray-500">
              Sort collected clues into the appropriate business documents.
            </p>
          </div>

          {/* Instructions Panel */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border border-indigo-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-indigo-800">How to Sort Clues</h3>
                <ul className="text-sm text-indigo-700 mt-1 space-y-1">
                  <li>
                    <strong>Financial data</strong> (ROI, budgets) goes in the <strong>Business Case</strong>
                  </li>
                  <li>
                    <strong>Strategic alignment</strong> (goals, value) goes in the <strong>Benefits Management Plan</strong>
                  </li>
                  <li>
                    <strong>Unverified claims</strong> (hopes, maybes) go in the <strong>Assumption Log</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Document Drop Zones */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {DOCUMENT_ZONES.map(zone => (
              <DocumentDropZone
                key={zone.id}
                zone={zone}
                assignedItems={getZoneItems(zone.id)}
                onRemoveItem={(itemId) => handleRemoveItem(zone.id, itemId)}
              />
            ))}
          </div>

          {/* Progress Summary */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Document Status</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {DOCUMENT_ZONES.map(zone => {
                const items = getZoneItems(zone.id);
                const hasItems = items.length > 0;
                return (
                  <div
                    key={zone.id}
                    className={`p-3 rounded-lg ${hasItems ? zone.bgColor : 'bg-gray-50'}`}
                  >
                    <div className={`font-medium ${hasItems ? zone.color : 'text-gray-400'}`}>
                      {zone.name}
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {items.length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {items.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MentOS Feedback Modal */}
      <MentosModal
        isOpen={mentosModalOpen}
        feedback={mentosFeedback}
        onClose={() => setMentosModalOpen(false)}
      />
    </div>
  );
};
