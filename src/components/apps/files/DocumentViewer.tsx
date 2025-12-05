import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { GameDocument, DocumentContent } from '../../../types';
import { addItem } from '../../../features/inventorySlice';
import { identifyStakeholder } from '../../../features/pmisSlice';
import { addNotification } from '../../../features/gameSlice';
import { unlockContact, setContactUnread } from '../../../features/dialogueSlice';
import { INITIAL_EVIDENCE } from '../../../data/initialData';

interface DocumentViewerProps {
  document: GameDocument;
  onClose: () => void;
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const dispatch = useDispatch();
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());

  const handleHighlightClick = (content: DocumentContent) => {
    if (!content.highlightId) return;

    // Check if already highlighted
    if (highlightedIds.has(content.highlightId)) return;

    // Mark as highlighted
    setHighlightedIds((prev) => new Set(prev).add(content.highlightId!));

    // Handle special highlight types
    if (content.highlightId === 'sh_sarah_discovery') {
      // This is the hidden stakeholder discovery in Org Chart
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
      // This is the budget highlight that becomes evidence
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
      // Check if this links to an existing evidence item
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

  const renderContent = (content: DocumentContent, index: number) => {
    const isHighlighted = content.highlightId && highlightedIds.has(content.highlightId);

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
      case 'highlight':
        return (
          <motion.p
            key={index}
            onClick={() => handleHighlightClick(content)}
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

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-850">
        <div className="max-w-2xl mx-auto bg-white/5 rounded-lg p-6 shadow-lg">
          {document.content.map((content, index) => renderContent(content, index))}
        </div>
      </div>

      {/* Footer Hint */}
      <div className="p-2 border-t border-slate-700 bg-slate-800">
        <p className="text-xs text-slate-500 text-center">
          Click highlighted text to extract key inputs for your Charter
        </p>
      </div>
    </div>
  );
}
