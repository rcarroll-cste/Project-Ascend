import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDraggable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../../store';
import { EvidenceItem } from '../../../types';
import {
  Lightbulb,
  FileText,
  ChevronLeft,
  ChevronRight,
  Package,
  Sparkles,
} from 'lucide-react';

// =============================================================================
// DRAGGABLE CLUE ITEM (for BusinessCase items - text snippets)
// =============================================================================

interface DraggableClueItemProps {
  item: EvidenceItem;
}

const DraggableClueItem: React.FC<DraggableClueItemProps> = ({ item }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-clue-${item.id}`,
    data: {
      type: 'doc-clue',
      item: item,
    },
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.3 : 1,
    transition: 'opacity 0.15s ease',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isDragging ? 0.3 : 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={isDragging ? {} : { scale: 1.02 }}
      className={`
        p-3 bg-white rounded-lg border-l-4 border-l-yellow-400 shadow-sm
        cursor-grab active:cursor-grabbing
        hover:shadow-md hover:border-l-yellow-500 transition-all
      `}
    >
      <div className="flex items-start gap-2">
        <div className="p-1 bg-yellow-100 rounded">
          <Lightbulb size={14} className="text-yellow-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-800 leading-tight truncate">
            {item.name}
          </h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// =============================================================================
// DRAGGABLE FILE ITEM (for Agreement items - PDFs)
// =============================================================================

interface DraggableFileItemProps {
  item: EvidenceItem;
}

const DraggableFileItem: React.FC<DraggableFileItemProps> = ({ item }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-file-${item.id}`,
    data: {
      type: 'evidence',
      item: item,
    },
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.3 : 1,
    transition: 'opacity 0.15s ease',
  };

  // Determine file type icon color based on content
  const isPDF = item.name.toLowerCase().includes('.pdf');

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isDragging ? 0.3 : 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={isDragging ? {} : { scale: 1.02 }}
      className={`
        p-3 bg-white rounded-lg border shadow-sm
        cursor-grab active:cursor-grabbing
        hover:shadow-md hover:border-blue-300 transition-all
        border-gray-200
      `}
    >
      <div className="flex items-start gap-2">
        <div className={`p-1.5 rounded ${isPDF ? 'bg-red-100' : 'bg-blue-100'}`}>
          <FileText size={16} className={isPDF ? 'text-red-600' : 'text-blue-600'} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-800 leading-tight truncate">
            {item.name}
          </h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {item.description}
          </p>
          {isPDF && (
            <span className="inline-block mt-1.5 text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded">
              PDF
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// =============================================================================
// MAIN CONTEXT SIDEBAR COMPONENT
// =============================================================================

type SidebarTab = 'clues' | 'files';

export const ContextSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<SidebarTab>('clues');

  // Get inventory items from Redux
  const { items: inventoryItems } = useSelector((state: RootState) => state.inventory);

  // Filter items into Clues (BusinessCase/text snippets) and Files (Agreements/PDFs)
  // Clues: Items that start with 'ev_clue_' or contain 'Clue:' in their name
  const clueItems = inventoryItems.filter(item =>
    item.type === 'BusinessCase' ||
    item.id.startsWith('ev_clue_') ||
    item.name.toLowerCase().includes('clue:') ||
    item.name.toLowerCase().includes('claim:')
  );

  // Files: Agreement type items (PDFs and external documents)
  const fileItems = inventoryItems.filter(item =>
    item.type === 'Agreement'
  );

  // Calculate badge counts
  const clueCount = clueItems.length;
  const fileCount = fileItems.length;
  const totalCount = clueCount + fileCount;

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 280 : 48 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full bg-slate-50 border-l border-slate-200 flex flex-col relative shrink-0"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -left-3 top-4 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
        title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isExpanded ? (
          <ChevronRight size={14} className="text-gray-500" />
        ) : (
          <ChevronLeft size={14} className="text-gray-500" />
        )}
      </button>

      {/* Collapsed State */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-4 space-y-4"
          >
            <div className="relative">
              <Package size={20} className="text-gray-400" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </div>
            <div className="w-6 h-px bg-gray-300" />
            <button
              onClick={() => { setActiveTab('clues'); setIsExpanded(true); }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors relative"
              title="Clues"
            >
              <Lightbulb size={18} className="text-yellow-500" />
              {clueCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-yellow-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {clueCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('files'); setIsExpanded(true); }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors relative"
              title="Files"
            >
              <FileText size={18} className="text-blue-500" />
              {fileCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {fileCount}
                </span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded State */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-purple-600" />
                <h3 className="font-semibold text-gray-800">Context</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Collected items ready to use
              </p>
            </div>

            {/* Tab Buttons */}
            <div className="flex border-b border-slate-200 bg-white">
              <button
                onClick={() => setActiveTab('clues')}
                className={`
                  flex-1 py-2.5 px-3 text-sm font-medium flex items-center justify-center gap-2
                  border-b-2 transition-colors
                  ${activeTab === 'clues'
                    ? 'border-yellow-500 text-yellow-700 bg-yellow-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                `}
              >
                <Lightbulb size={16} />
                <span>Clues</span>
                {clueCount > 0 && (
                  <span className={`
                    px-1.5 py-0.5 text-xs rounded-full
                    ${activeTab === 'clues' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {clueCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`
                  flex-1 py-2.5 px-3 text-sm font-medium flex items-center justify-center gap-2
                  border-b-2 transition-colors
                  ${activeTab === 'files'
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                `}
              >
                <FileText size={16} />
                <span>Files</span>
                {fileCount > 0 && (
                  <span className={`
                    px-1.5 py-0.5 text-xs rounded-full
                    ${activeTab === 'files' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {fileCount}
                  </span>
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <AnimatePresence mode="wait">
                {activeTab === 'clues' && (
                  <motion.div
                    key="clues"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    {clueItems.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Lightbulb size={24} className="text-yellow-400" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">No clues collected</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Interview stakeholders in Chatter to extract clues
                        </p>
                      </div>
                    ) : (
                      clueItems.map(item => (
                        <DraggableClueItem key={item.id} item={item} />
                      ))
                    )}
                  </motion.div>
                )}

                {activeTab === 'files' && (
                  <motion.div
                    key="files"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    {fileItems.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText size={24} className="text-blue-400" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">No files collected</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Stakeholders may share documents during conversations
                        </p>
                      </div>
                    ) : (
                      fileItems.map(item => (
                        <DraggableFileItem key={item.id} item={item} />
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Hint */}
            <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-t border-purple-100">
              <p className="text-xs text-purple-700">
                <strong>Tip:</strong> Drag items to Doc Creator or Charter Builder
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
