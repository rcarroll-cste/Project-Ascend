import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { RootState } from '../../../store';
import { assignEvidenceToSection } from '../../../features/pmisSlice';
import { FileText, Lock, CheckCircle, AlertCircle, Send, Award, BookOpen, ShieldCheck, ShieldAlert, Briefcase, Target, FileCheck } from 'lucide-react';
import { EvidenceItem, CompletedBusinessDocument } from '../../../types';
import {
  incrementCharterSubmission,
  addNotification,
  unlockProcess,
  completeObjective,
  completeLevel,
  unlockApp,
} from '../../../features/gameSlice';
import { unlockContact, setContactUnread } from '../../../features/dialogueSlice';
import { identifyStakeholder } from '../../../features/pmisSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '../../../utils/logger';
import { getLevelById } from '../../../data/levels';

// --- Draggable Completed Document Component ---
// These are the outputs from the Analysis phase (Doc Creator)
interface DraggableCompletedDocumentProps {
  document: CompletedBusinessDocument;
}

const DraggableCompletedDocument: React.FC<DraggableCompletedDocumentProps> = ({ document }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `completed-doc-${document.id}`,
    data: {
      type: 'completed-document',
      document: document,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const isBusinessCase = document.type === 'BusinessCase';
  const Icon = isBusinessCase ? Briefcase : Target;
  const colorClass = isBusinessCase ? 'text-emerald-600' : 'text-blue-600';
  const bgClass = isBusinessCase ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-3 ${bgClass} border rounded-lg shadow-sm cursor-grab active:cursor-grabbing mb-2
        hover:shadow-md transition-all
        ${isDragging ? 'opacity-50 ring-2 ring-purple-500' : ''}
      `}
    >
      <div className="flex items-start space-x-2">
        <div className={`p-1.5 rounded ${isBusinessCase ? 'bg-emerald-100' : 'bg-blue-100'}`}>
          <Icon className={colorClass} size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-semibold text-gray-800 leading-tight">{document.name}</h4>
            <FileCheck size={14} className="text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{document.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-1.5 py-0.5 bg-white/70 rounded text-gray-600">
              {document.assignedClueIds.length} clue{document.assignedClueIds.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-green-600 font-medium">
              Quality: {document.qualityScore}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Draggable Evidence Component ---
// For external documents like Agreements (TechCore_MSA.pdf)
interface DraggableEvidenceProps {
  item: EvidenceItem;
}

const DraggableEvidence: React.FC<DraggableEvidenceProps> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `evidence-${item.id}`,
    data: {
      type: 'evidence',
      item: item,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-3 bg-white border rounded shadow-sm cursor-grab active:cursor-grabbing mb-2
        hover:border-purple-500 transition-colors
        ${isDragging ? 'opacity-50 ring-2 ring-purple-500' : 'border-gray-200'}
      `}
    >
      <div className="flex items-start space-x-2">
        <FileText className="text-blue-500 shrink-0" size={18} />
        <div>
          <h4 className="text-sm font-medium text-gray-800 leading-tight">{item.name}</h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        </div>
      </div>
    </div>
  );
};

// --- Droppable Charter Section Component ---
interface CharterSectionProps {
  id: string;
  label: string;
  requiredType: string;
  assignedItemId: string | null;
  items: EvidenceItem[];
  completedDocuments: CompletedBusinessDocument[];
  isLocked: boolean;
  expectedDocType?: 'BusinessCase' | 'BenefitsManagementPlan' | 'Agreement';
}

const CharterSectionZone: React.FC<CharterSectionProps> = ({
  id,
  label,
  requiredType,
  assignedItemId,
  items,
  completedDocuments,
  isLocked,
  expectedDocType
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `charter-section-${id}`,
    data: {
      type: 'charter-section',
      sectionId: id,
      requiredType,
      expectedDocType,
    },
    disabled: isLocked,
  });

  const dispatch = useDispatch();

  // Check if assigned item is a completed document or an evidence item
  const assignedCompletedDoc = completedDocuments.find(d => d.id === assignedItemId);
  const assignedEvidence = items.find(i => i.id === assignedItemId);
  const hasAssignment = assignedCompletedDoc || assignedEvidence;

  const handleRemove = () => {
    dispatch(assignEvidenceToSection({ sectionId: id, evidenceId: null }));
  };

  // Determine placeholder text based on expected type
  const getPlaceholderText = () => {
    if (expectedDocType === 'BusinessCase') return 'Drag Business Case here';
    if (expectedDocType === 'BenefitsManagementPlan') return 'Drag Benefits Plan here';
    if (expectedDocType === 'Agreement') return 'Drag Agreement here';
    return `Drop ${requiredType} here`;
  };

  // Get icon based on expected type
  const getIcon = () => {
    if (assignedCompletedDoc) {
      return assignedCompletedDoc.type === 'BusinessCase' ? Briefcase : Target;
    }
    return FileText;
  };

  const Icon = getIcon();
  const iconColor = assignedCompletedDoc?.type === 'BusinessCase' ? 'text-emerald-600' :
                    assignedCompletedDoc?.type === 'BenefitsManagementPlan' ? 'text-blue-600' :
                    'text-green-600';

  return (
    <div
      ref={setNodeRef}
      className={`
        relative p-4 rounded-lg border-2 border-dashed transition-all min-h-[120px] flex flex-col justify-center
        ${isOver ? 'bg-purple-50 border-purple-500' : 'bg-gray-50 border-gray-300'}
        ${hasAssignment ? 'border-solid border-green-500 bg-green-50' : ''}
        ${isLocked ? 'opacity-75 cursor-not-allowed bg-gray-100' : ''}
      `}
    >
      <div className="absolute top-2 left-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </div>

      {isLocked && (
        <div className="flex flex-col items-center text-gray-400">
          <Lock size={24} />
          <span className="text-xs mt-1">Template Locked</span>
        </div>
      )}

      {!hasAssignment && !isLocked && (
        <div className="text-center text-gray-400 text-sm mt-4">
          {getPlaceholderText()}
        </div>
      )}

      {/* Display assigned completed document */}
      {assignedCompletedDoc && (
        <div className="mt-6 bg-white p-3 rounded border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 overflow-hidden">
              <Icon size={18} className={iconColor} />
              <div>
                <span className="text-sm font-medium">{assignedCompletedDoc.name}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">
                    {assignedCompletedDoc.assignedClueIds.length} clue{assignedCompletedDoc.assignedClueIds.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-green-600 font-medium">
                    {assignedCompletedDoc.qualityScore}%
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="text-gray-400 hover:text-red-500 ml-2"
              title="Remove document"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Display assigned evidence item (for Agreements) */}
      {assignedEvidence && !assignedCompletedDoc && (
        <div className="mt-6 bg-white p-2 rounded border border-green-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden">
            <CheckCircle size={16} className="text-green-600 shrink-0" />
            <span className="text-sm font-medium truncate">{assignedEvidence.name}</span>
          </div>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 ml-2"
            title="Remove item"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main Builder Component ---
export const CharterBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const { charterSections, completedDocuments } = useSelector((state: RootState) => state.pmis);
  const { items } = useSelector((state: RootState) => state.inventory);
  const { charterSubmissionCount, currentLevelId, levelProgress } = useSelector(
    (state: RootState) => state.game
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // GDD v6.6 Strategic Alignment Check
  const [strategicAlignmentVerified, setStrategicAlignmentVerified] = useState(false);

  const currentLevel = getLevelById(currentLevelId);
  const currentProgress = levelProgress[currentLevelId];

  // Get completed documents from the Analysis phase
  const completedBusinessCase = completedDocuments.find(d => d.id === 'completed_business_case' && d.isComplete);
  const completedBenefitsPlan = completedDocuments.find(d => d.id === 'completed_benefits_plan' && d.isComplete);

  // Track objective completion
  useEffect(() => {
    // Check if user has collected valid inputs (from files/documents)
    const hasBusinessCaseEvidence = items.some(
      (item) => item.type === 'BusinessCase' && !item.isDistractor
    );
    const hasAgreementEvidence = items.some(
      (item) => item.type === 'Agreement' && !item.isDistractor
    );

    if (
      hasBusinessCaseEvidence &&
      hasAgreementEvidence &&
      currentLevelId === 1 &&
      !currentProgress?.objectivesCompleted['filter_valid_inputs']
    ) {
      dispatch(
        completeObjective({ levelId: 1, objectiveId: 'filter_valid_inputs' })
      );
    }
  }, [items, currentLevelId, currentProgress, dispatch]);

  // Filter out items that are already assigned to a section
  const assignedIds = charterSections.map(s => s.assignedItemId).filter(Boolean);

  // Available completed documents (not yet assigned)
  const availableCompletedDocs = completedDocuments.filter(
    doc => doc.isComplete && !assignedIds.includes(doc.id)
  );

  // Available evidence items (Agreement type only, for external documents)
  const availableAgreements = items.filter(
    item => item.type === 'Agreement' && !item.isDistractor && !assignedIds.includes(item.id)
  );

  // Get expected document type for each section
  const getSectionExpectedType = (sectionId: string): 'BusinessCase' | 'BenefitsManagementPlan' | 'Agreement' | undefined => {
    switch (sectionId) {
      case 'sec_business_case': return 'BusinessCase';
      case 'sec_benefits_plan': return 'BenefitsManagementPlan';
      case 'sec_agreement': return 'Agreement';
      default: return undefined;
    }
  };

  // Validation rules for charter sections - Updated for GDD v7.1 flow
  const validateCharter = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    charterSections.forEach((section) => {
      if (section.isLocked) return; // Skip locked sections

      if (!section.assignedItemId) {
        errors.push(`${section.label}: No item assigned`);
        return;
      }

      // Check if it's a completed document
      const assignedCompletedDoc = completedDocuments.find(d => d.id === section.assignedItemId);
      if (assignedCompletedDoc) {
        // Validate completed document type matches section expectation
        if (section.id === 'sec_business_case' && assignedCompletedDoc.type !== 'BusinessCase') {
          errors.push(`${section.label}: This section requires the completed Business Case from the Analysis phase.`);
          return;
        }
        if (section.id === 'sec_benefits_plan' && assignedCompletedDoc.type !== 'BenefitsManagementPlan') {
          errors.push(`${section.label}: This section requires the completed Benefits Management Plan from the Analysis phase.`);
          return;
        }
        // Completed document is valid
        return;
      }

      // Check if it's an evidence item (for Agreement section)
      const assignedItem = items.find(i => i.id === section.assignedItemId);
      if (!assignedItem) {
        errors.push(`${section.label}: Invalid item`);
        return;
      }

      // Agreement section validation
      if (section.id === 'sec_agreement') {
        if (assignedItem.type !== 'Agreement') {
          errors.push(`${section.label}: This section requires an external Agreement document.`);
          return;
        }
        if (assignedItem.isDistractor) {
          errors.push(`${section.label}: This agreement is not valid for the Charter.`);
          return;
        }
        return;
      }

      // If we get here with an evidence item for Business Case or Benefits Plan sections,
      // inform the user to use completed documents from Doc Creator
      if (section.id === 'sec_business_case' || section.id === 'sec_benefits_plan') {
        errors.push(`${section.label}: Use the completed document from Doc Creator, not raw clues.`);
        return;
      }
    });

    // GDD v6.6 Strategic Alignment Check - Required for full points
    if (!strategicAlignmentVerified) {
      errors.push('Strategic Alignment: Not verified. Check the Benefits Management Plan to confirm project alignment.');
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = () => {
    logger.info('CharterBuilder', 'Submit clicked', {
      sections: charterSections.map(s => ({ id: s.id, assigned: s.assignedItemId })),
      inventoryCount: items.length
    });

    // Check if all sections are filled
    const emptySections = charterSections.filter(s => !s.assignedItemId && !s.isLocked);

    if (emptySections.length > 0) {
      logger.warn('CharterBuilder', 'Empty sections found', { emptySections: emptySections.map(s => s.label) });
      setValidationErrors([`Please fill all sections: ${emptySections.map(s => s.label).join(', ')}`]);
      return;
    }

    if (charterSubmissionCount >= 3) {
      logger.error('CharterBuilder', 'Submission limit reached');
      setValidationErrors(['Submission limit reached. Game Over.']);
      return;
    }

    // Validate the charter
    const { isValid, errors } = validateCharter();
    logger.info('CharterBuilder', 'Validation result', { isValid, errors });

    dispatch(incrementCharterSubmission());

    if (!isValid) {
      logger.warn('CharterBuilder', 'Charter rejected', { errors });
      setValidationErrors(errors);
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Charter Rejected',
        message: 'Some sections have incorrect evidence. Please review.',
        type: 'error',
        duration: 5000,
      }));
      return;
    }

    // Success! Charter is valid
    logger.info('CharterBuilder', 'Charter VALID - showing success modal');
    setValidationErrors([]);
    setShowSuccess(true);

    // Complete the draft_charter objective
    dispatch(completeObjective({ levelId: 1, objectiveId: 'draft_charter' }));

    // Trigger Level 2 progression after a delay
    setTimeout(() => {
      logger.info('CharterBuilder', 'Triggering Level 2 progression');

      // Unlock Team Channel contact
      dispatch(unlockContact('contact_team'));
      dispatch(setContactUnread({
        contactId: 'contact_team',
        hasUnread: true,
        lastMessage: 'You have been added to the Project Team channel.',
      }));

      // Unlock Marcus contact (appears in Team Channel)
      dispatch(unlockContact('contact_marcus'));
      dispatch(setContactUnread({
        contactId: 'contact_marcus',
        hasUnread: true,
        lastMessage: 'New message from Marcus',
      }));

      // Identify Marcus as a stakeholder
      dispatch(identifyStakeholder('sh_marcus'));

      // Unlock "Identify Stakeholders" process for Level 2
      dispatch(unlockProcess('proc_identify_stakeholders'));

      // Unlock Email app for Level 2
      dispatch(unlockApp('email'));

      // Complete Level 1 and transition to Level Complete screen
      dispatch(completeLevel(1));
      logger.info('CharterBuilder', 'Level 1 completed');

      // Add success notification
      dispatch(
        addNotification({
          id: `notif_${Date.now()}`,
          title: 'Charter Authorized!',
          message: 'Level 1 Complete! Proceeding to Level 2: The Politics',
          type: 'success',
          duration: 8000,
        })
      );
    }, 2500);
  };

  // Calculate objectives progress
  const objectivesStatus = currentLevel?.objectives.map((obj) => ({
    ...obj,
    isCompleted: currentProgress?.objectivesCompleted[obj.id] || false,
  })) || [];

  const completedObjectivesCount = objectivesStatus.filter((o) => o.isCompleted).length;

  return (
    <div className="flex h-full p-6 space-x-6 relative">
      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="bg-white rounded-xl p-8 max-w-md text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.4, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
              >
                <Award size={40} className="text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Charter Authorized!</h2>
              <p className="text-gray-600 mb-4">
                Director Vane has signed your Project Charter. You now have authority to proceed.
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-gray-500 border-t pt-4"
              >
                <p className="font-medium text-green-600">Level 1 Complete!</p>
                <p>Advancing to Level 2: "Who's Who?"</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Column: Charter Document */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Project Charter</h2>
            <p className="text-sm text-gray-500">Assemble the document using collected artifacts.</p>
          </div>
          <div className="text-right">
             <span className="text-xs font-semibold text-gray-500 uppercase">Submission Attempts</span>
             <div className="text-lg font-mono">{charterSubmissionCount}/3</div>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Charter Rejected</h4>
                <ul className="text-sm text-red-600 mt-1 space-y-0.5">
                  {validationErrors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {charterSections.map(section => (
              <CharterSectionZone
                key={section.id}
                id={section.id}
                label={section.label}
                requiredType={section.requiredType}
                assignedItemId={section.assignedItemId}
                items={items}
                completedDocuments={completedDocuments}
                isLocked={section.isLocked}
                expectedDocType={getSectionExpectedType(section.id)}
              />
            ))}
          </div>

          {/* GDD v6.6 Strategic Alignment Check */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {strategicAlignmentVerified ? (
                  <ShieldCheck size={24} className="text-green-600" />
                ) : (
                  <ShieldAlert size={24} className="text-amber-600" />
                )}
                <div>
                  <h4 className="font-medium text-gray-800">Strategic Alignment Check</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Verify project aligns with Benefits Management Plan before authorization
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStrategicAlignmentVerified(!strategicAlignmentVerified)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${strategicAlignmentVerified
                    ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                    : 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200'}
                `}
              >
                {strategicAlignmentVerified ? '✓ Verified' : 'Mark as Verified'}
              </button>
            </div>
            {!strategicAlignmentVerified && (
              <p className="mt-3 text-xs text-amber-700 bg-amber-100 p-2 rounded">
                <strong>Hint:</strong> Director Vane wants to add a "Customer Loyalty Module".
                Open <strong>Files → Benefits_Management_Plan.pdf</strong> to verify if this aligns with the project's strategic focus.
              </p>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
             <button
                onClick={handleSubmit}
                disabled={showSuccess}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <Send size={18} />
                <span>Submit Charter for Authorization</span>
             </button>
          </div>
        </div>
      </div>

      {/* Right Column: Inventory & Objectives */}
      <div className="w-80 flex flex-col gap-4">
        {/* Level Objectives Panel */}
        {currentLevel && (
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
            <h3 className="font-semibold text-purple-800 flex items-center gap-2 mb-3">
              <BookOpen size={16} />
              Level {currentLevelId} Objectives
            </h3>
            <div className="text-xs text-purple-600 mb-2">
              {completedObjectivesCount}/{objectivesStatus.length} completed
            </div>
            <ul className="space-y-2">
              {objectivesStatus.slice(0, 4).map((obj) => (
                <li
                  key={obj.id}
                  className={`flex items-start gap-2 text-sm ${
                    obj.isCompleted ? 'text-green-700' : 'text-gray-600'
                  }`}
                >
                  {obj.isCompleted ? (
                    <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 mt-0.5 shrink-0" />
                  )}
                  <span className={obj.isCompleted ? 'line-through opacity-60' : ''}>
                    {obj.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Charter Inputs Inventory */}
        <div className="flex-1 flex flex-col bg-gray-50 rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl">
            <h3 className="font-semibold text-gray-700 flex items-center">
              <FileText size={18} className="mr-2 text-purple-600" />
              Charter Inputs
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Drag documents to their corresponding slots
            </p>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {/* Completed Documents Section */}
            {availableCompletedDocs.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <FileCheck size={12} />
                  Completed Documents (from Analysis)
                </h4>
                {availableCompletedDocs.map((doc) => (
                  <DraggableCompletedDocument key={doc.id} document={doc} />
                ))}
              </div>
            )}

            {/* External Agreements Section */}
            {availableAgreements.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <FileText size={12} />
                  External Agreements
                </h4>
                {availableAgreements.map((item) => (
                  <DraggableEvidence key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {availableCompletedDocs.length === 0 && availableAgreements.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <FileText size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No inputs available</p>
                <p className="text-xs mt-2">
                  Complete the Analysis phase in Doc Creator to generate Business Documents.
                </p>
                <p className="text-xs mt-1">
                  Collect Agreement files from Chatter conversations.
                </p>
              </div>
            )}

            {/* Status Summary */}
            {(completedBusinessCase || completedBenefitsPlan) && (
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <h4 className="text-xs font-semibold text-green-700 mb-2">Analysis Phase Status</h4>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center gap-2">
                    {completedBusinessCase ? (
                      <CheckCircle size={12} className="text-green-500" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={completedBusinessCase ? 'text-green-700' : 'text-gray-500'}>
                      Business Case
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {completedBenefitsPlan ? (
                      <CheckCircle size={12} className="text-green-500" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={completedBenefitsPlan ? 'text-green-700' : 'text-gray-500'}>
                      Benefits Management Plan
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};