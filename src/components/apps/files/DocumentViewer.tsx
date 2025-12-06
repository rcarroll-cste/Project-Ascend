import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { GameDocument, DocumentContent, HighlightFeedback } from '../../../types';
import { RootState } from '../../../store';
import { addItem } from '../../../features/inventorySlice';
import { identifyStakeholder } from '../../../features/pmisSlice';
import { addNotification, completeObjective } from '../../../features/gameSlice';
import { unlockContact, setContactUnread } from '../../../features/dialogueSlice';
import {
  setActiveTask,
  selectHighlight,
  recordAttempt,
  setFeedback,
  completeTask,
  clearFeedback,
} from '../../../features/documentAnalysisSlice';
import { INITIAL_EVIDENCE } from '../../../data/initialData';
import { getActiveTaskForDocument } from '../../../data/documentTasks';
import TaskPromptBanner from './TaskPromptBanner';
import HighlightableBlock, { HighlightState } from './HighlightableBlock';
import HighlightFeedbackModal from './HighlightFeedbackModal';

interface DocumentViewerProps {
  document: GameDocument;
  onClose: () => void;
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const dispatch = useDispatch();
  const { currentLevel, levelObjectives } = useSelector((state: RootState) => state.game);
  const { activeTask, completedTasks, selectedHighlightId, lastFeedback, attemptHistory } =
    useSelector((state: RootState) => state.documentAnalysis);

  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const [highlightStates, setHighlightStates] = useState<Record<string, HighlightState>>({});

  // Get active task for this document
  const documentTask = useMemo(() => {
    return getActiveTaskForDocument(
      document.id,
      currentLevel,
      completedTasks,
      levelObjectives
    );
  }, [document.id, currentLevel, completedTasks, levelObjectives]);

  // Set active task when document opens
  useEffect(() => {
    if (documentTask && (!activeTask || activeTask.id !== documentTask.id)) {
      dispatch(setActiveTask(documentTask));
    }
  }, [documentTask, activeTask, dispatch]);

  // Count attempts for current task
  const attemptCount = useMemo(() => {
    if (!activeTask) return 0;
    return attemptHistory.filter((a) => a.taskId === activeTask.id).length;
  }, [activeTask, attemptHistory]);

  // Should show hint after failed attempts
  const showHint = attemptCount >= 2;

  // Handle highlight click for task-based analysis
  const handleTaskHighlightClick = (content: DocumentContent) => {
    if (!content.highlightId || !activeTask) return;

    // Select this highlight
    dispatch(selectHighlight(content.highlightId));
    setHighlightStates((prev) => ({
      ...prev,
      [content.highlightId!]: 'selected',
    }));
  };

  // Handle confirm selection
  const handleConfirmSelection = () => {
    if (!selectedHighlightId || !activeTask) return;

    const isCorrect = activeTask.correctHighlightIds.includes(selectedHighlightId);

    // Record attempt
    dispatch(
      recordAttempt({
        taskId: activeTask.id,
        documentId: document.id,
        highlightId: selectedHighlightId,
        wasCorrect: isCorrect,
        timestamp: Date.now(),
      })
    );

    if (isCorrect) {
      // Success!
      setHighlightStates((prev) => ({
        ...prev,
        [selectedHighlightId]: 'correct',
      }));

      const feedback: HighlightFeedback = {
        type: 'correct',
        title: 'Correct!',
        message: activeTask.successFeedback,
      };
      dispatch(setFeedback(feedback));

      // Execute consequence
      if (activeTask.consequence) {
        executeConsequence(activeTask.consequence, selectedHighlightId);
      }

      // Mark task complete
      dispatch(completeTask(activeTask.id));
      setHighlightedIds((prev) => new Set(prev).add(selectedHighlightId));
    } else {
      // Incorrect
      setHighlightStates((prev) => ({
        ...prev,
        [selectedHighlightId]: 'incorrect',
      }));

      // Get specific feedback or default
      const message =
        activeTask.incorrectFeedback[selectedHighlightId] ||
        activeTask.defaultIncorrectMessage;

      const feedback: HighlightFeedback = {
        type: 'incorrect',
        title: 'Not Quite',
        message,
      };
      dispatch(setFeedback(feedback));

      // Reset to idle after animation
      setTimeout(() => {
        setHighlightStates((prev) => ({
          ...prev,
          [selectedHighlightId]: 'idle',
        }));
        dispatch(selectHighlight(null));
      }, 500);
    }
  };

  // Execute task consequence
  const executeConsequence = (
    consequence: { type: string; payload: Record<string, unknown> },
    highlightId: string
  ) => {
    switch (consequence.type) {
      case 'extract_evidence': {
        const evidenceId = consequence.payload.evidenceId as string;
        const evidenceItem = INITIAL_EVIDENCE.find((e) => e.id === evidenceId);
        if (evidenceItem) {
          dispatch(addItem(evidenceItem));
          dispatch(
            addNotification({
              id: `notif_${Date.now()}`,
              title: 'Evidence Extracted',
              message: `${evidenceItem.name} added to inventory.`,
              type: 'success',
              duration: 3000,
            })
          );
        } else if (highlightId === 'hl_roi_20_percent') {
          // Create ROI evidence
          dispatch(
            addItem({
              id: 'ev_roi_justification',
              name: 'ROI Justification (20%)',
              description: 'Economic feasibility from Business Case',
              type: 'BusinessCase',
              isDistractor: false,
              qualityScore: 100,
            })
          );
        } else if (highlightId === 'hl_deliverables_section') {
          // Create deliverables evidence
          dispatch(
            addItem({
              id: 'ev_mou_deliverables',
              name: 'Client Deliverables',
              description: 'Binding conditions from MOU Agreement',
              type: 'Agreement',
              isDistractor: false,
              qualityScore: 95,
            })
          );
        }
        break;
      }
      case 'identify_stakeholder': {
        const stakeholderId = consequence.payload.stakeholderId as string;
        const contactId = consequence.payload.contactId as string;
        dispatch(identifyStakeholder(stakeholderId));
        if (contactId) {
          dispatch(unlockContact(contactId));
          dispatch(
            setContactUnread({
              contactId,
              hasUnread: true,
              lastMessage: 'Newly discovered stakeholder',
            })
          );
        }
        dispatch(
          addNotification({
            id: `notif_${Date.now()}`,
            title: 'New Stakeholder Found!',
            message: 'A new stakeholder has been added to your register.',
            type: 'success',
            duration: 5000,
          })
        );
        break;
      }
      case 'complete_objective': {
        const objectiveId = consequence.payload.objectiveId as string;
        dispatch(completeObjective(objectiveId));
        break;
      }
      default:
        break;
    }
  };

  // Legacy click handler for when no task is active
  const handleLegacyHighlightClick = (content: DocumentContent) => {
    if (!content.highlightId) return;
    if (highlightedIds.has(content.highlightId)) return;

    setHighlightedIds((prev) => new Set(prev).add(content.highlightId!));

    // Handle special highlight types
    if (content.highlightId === 'sh_sarah_discovery') {
      dispatch(identifyStakeholder('sh_sarah'));
      dispatch(unlockContact('contact_sarah'));
      dispatch(
        setContactUnread({
          contactId: 'contact_sarah',
          hasUnread: true,
          lastMessage: 'Newly discovered stakeholder',
        })
      );
      dispatch(
        addNotification({
          id: `notif_${Date.now()}`,
          title: 'New Stakeholder Found!',
          message: 'Sarah (Data Privacy Officer) has been added to your stakeholder list.',
          type: 'success',
          duration: 5000,
        })
      );
    } else if (content.highlightId === 'ev_budget_500k') {
      const budgetEvidence = {
        id: 'ev_budget_500k',
        name: 'Budget: $500,000',
        description: 'Approved project budget extracted from Business Case',
        type: 'Agreement' as const,
        isDistractor: false,
        qualityScore: 100,
      };
      dispatch(addItem(budgetEvidence));
      dispatch(
        addNotification({
          id: `notif_${Date.now()}`,
          title: 'Key Input Found!',
          message: 'Budget figure added to your inventory.',
          type: 'success',
          duration: 3000,
        })
      );
    } else {
      const evidenceItem = INITIAL_EVIDENCE.find((e) => e.id === content.highlightId);
      if (evidenceItem) {
        dispatch(addItem(evidenceItem));
        dispatch(
          addNotification({
            id: `notif_${Date.now()}`,
            title: 'Evidence Collected',
            message: `${evidenceItem.name} added to inventory.`,
            type: 'info',
            duration: 3000,
          })
        );
      }
    }
  };

  // Close feedback modal
  const handleCloseFeedback = () => {
    dispatch(clearFeedback());
    if (lastFeedback?.type === 'correct') {
      dispatch(selectHighlight(null));
    }
  };

  const renderContent = (content: DocumentContent, index: number) => {
    const isHighlighted = content.highlightId && highlightedIds.has(content.highlightId);
    const highlightState = content.highlightId
      ? highlightStates[content.highlightId] || 'idle'
      : 'idle';
    const isSelected = content.highlightId === selectedHighlightId;

    switch (content.type) {
      case 'heading':
        return (
          <h2 key={index} className="text-lg font-bold text-slate-200 mt-4 mb-2">
            {content.text}
          </h2>
        );
      case 'text':
        return (
          <p key={index} className="text-sm text-slate-300 my-1 font-mono">
            {content.text}
          </p>
        );
      case 'redacted':
        return (
          <p key={index} className="text-sm text-slate-500 my-1 font-mono bg-slate-800 px-2 py-1 rounded">
            [REDACTED]
          </p>
        );
      case 'highlight':
        // Use task-based highlighting when task is active
        if (activeTask && content.isSelectableForTask) {
          return (
            <div key={index} className="my-1 relative group">
              <HighlightableBlock
                content={content}
                state={isSelected ? 'selected' : highlightState}
                isTaskActive={true}
                onClick={() => handleTaskHighlightClick(content)}
              />
            </div>
          );
        }

        // Legacy highlight behavior
        return (
          <motion.p
            key={index}
            onClick={() => handleLegacyHighlightClick(content)}
            whileHover={!isHighlighted ? { scale: 1.02 } : {}}
            className={`
              text-sm my-1 font-mono px-2 py-1 rounded cursor-pointer
              transition-all duration-300
              ${
                isHighlighted
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-amber-500/20 hover:text-amber-200 border border-transparent hover:border-amber-500/30'
              }
            `}
          >
            {content.text}
            {!isHighlighted && (
              <span className="ml-2 text-xs text-slate-500">(click to extract)</span>
            )}
            {isHighlighted && <span className="ml-2 text-xs text-amber-400">(collected)</span>}
          </motion.p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800">
        <h3 className="text-sm font-medium text-slate-200">{document.name}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
        >
          <X size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Task Prompt Banner */}
      {activeTask && (
        <div className="p-4 pb-0">
          <TaskPromptBanner
            task={activeTask}
            attemptCount={attemptCount}
            showHint={showHint}
          />
        </div>
      )}

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-850">
        <div className="max-w-2xl mx-auto bg-white/5 rounded-lg p-6 shadow-lg">
          {document.content.map((content, index) => renderContent(content, index))}
        </div>
      </div>

      {/* Selection Confirmation Footer */}
      {activeTask && selectedHighlightId && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 border-t border-slate-700 bg-slate-800"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Selection made. Confirm your answer?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setHighlightStates((prev) => ({
                    ...prev,
                    [selectedHighlightId]: 'idle',
                  }));
                  dispatch(selectHighlight(null));
                }}
                className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Confirm Selection
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer Hint (when no task) */}
      {!activeTask && (
        <div className="p-2 border-t border-slate-700 bg-slate-800">
          <p className="text-xs text-slate-500 text-center">
            Click highlighted text to extract key inputs for your Charter
          </p>
        </div>
      )}

      {/* Feedback Modal */}
      <HighlightFeedbackModal
        feedback={lastFeedback}
        taskType={activeTask?.taskType}
        onClose={handleCloseFeedback}
      />
    </div>
  );
}
