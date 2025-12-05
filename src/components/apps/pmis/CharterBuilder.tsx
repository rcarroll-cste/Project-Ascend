import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { RootState } from '../../../store';
import { assignEvidenceToSection } from '../../../features/pmisSlice';
import { FileText, Lock, CheckCircle, AlertCircle, Send, Award } from 'lucide-react';
import { EvidenceItem } from '../../../types';
import { incrementCharterSubmission, advanceLevel, addNotification, unlockProcess } from '../../../features/gameSlice';
import { unlockContact, setContactUnread } from '../../../features/dialogueSlice';
import { identifyStakeholder } from '../../../features/pmisSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '../../../utils/logger';

// --- Draggable Evidence Component ---
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
  isLocked: boolean;
}

const CharterSectionZone: React.FC<CharterSectionProps> = ({ id, label, requiredType, assignedItemId, items, isLocked }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `charter-section-${id}`,
    data: {
      type: 'charter-section',
      sectionId: id,
      requiredType,
    },
    disabled: isLocked,
  });

  const assignedItem = items.find(i => i.id === assignedItemId);
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(assignEvidenceToSection({ sectionId: id, evidenceId: null }));
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        relative p-4 rounded-lg border-2 border-dashed transition-all min-h-[120px] flex flex-col justify-center
        ${isOver ? 'bg-purple-50 border-purple-500' : 'bg-gray-50 border-gray-300'}
        ${assignedItem ? 'border-solid border-green-500 bg-green-50' : ''}
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

      {!assignedItem && !isLocked && (
        <div className="text-center text-gray-400 text-sm mt-4">
          Drop {requiredType} here
        </div>
      )}

      {assignedItem && (
        <div className="mt-6 bg-white p-2 rounded border border-green-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden">
            <CheckCircle size={16} className="text-green-600 shrink-0" />
            <span className="text-sm font-medium truncate">{assignedItem.name}</span>
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
  const { charterSections } = useSelector((state: RootState) => state.pmis);
  const { items } = useSelector((state: RootState) => state.inventory);
  const { charterSubmissionCount } = useSelector((state: RootState) => state.game);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Filter out items that are already assigned to a section
  const assignedIds = charterSections.map(s => s.assignedItemId).filter(Boolean);
  const availableItems = items.filter(item => !assignedIds.includes(item.id));

  // Validation rules for charter sections
  const validateCharter = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    charterSections.forEach((section) => {
      if (section.isLocked) return; // Skip locked sections

      if (!section.assignedItemId) {
        errors.push(`${section.label}: No item assigned`);
        return;
      }

      const assignedItem = items.find(i => i.id === section.assignedItemId);
      if (!assignedItem) {
        errors.push(`${section.label}: Invalid item`);
        return;
      }

      // GDD v3.3 Step 4: Granularity Trap - Special message for Detailed Gantt
      if (section.id === 'sec_timeline' && assignedItem.id === 'ev_detailed_gantt') {
        errors.push(`${section.label}: Too Detailed! Charters only contain high-level milestones.`);
        return;
      }

      // Check if item type matches required type
      if (assignedItem.type !== section.requiredType) {
        errors.push(`${section.label}: Wrong item type (needs ${section.requiredType})`);
        return;
      }

      // Check if it's a distractor
      if (assignedItem.isDistractor) {
        errors.push(`${section.label}: Item is not suitable for the Charter`);
      }
    });

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

      // Advance to Level 2
      dispatch(advanceLevel({ level: 2, title: "Who's Who?" }));
      logger.info('CharterBuilder', 'Level 2 dispatched');

      // Add success notification
      dispatch(addNotification({
        id: `notif_${Date.now()}`,
        title: 'Charter Authorized!',
        message: 'Level 2: "Who\'s Who?" - Identify and analyze your stakeholders.',
        type: 'success',
        duration: 8000,
      }));
    }, 2500);
  };

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
                isLocked={section.isLocked}
              />
            ))}
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

      {/* Right Column: Inventory */}
      <div className="w-80 flex flex-col bg-gray-50 rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl">
          <h3 className="font-semibold text-gray-700 flex items-center">
            <FileText size={18} className="mr-2 text-purple-600" />
            Evidence Inventory
          </h3>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
            {availableItems.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                    <p>No items available.</p>
                    <p className="text-xs mt-2">Check Files app or extract evidence from documents.</p>
                </div>
            ) : (
                availableItems.map(item => (
                    <DraggableEvidence key={item.id} item={item} />
                ))
            )}
        </div>
      </div>

    </div>
  );
};