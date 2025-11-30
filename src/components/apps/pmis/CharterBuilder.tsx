import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { RootState } from '../../../store';
import { assignEvidenceToSection } from '../../../features/pmisSlice';
import { FileText, Lock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { EvidenceItem } from '../../../types';
import { incrementCharterSubmission, setGameStage } from '../../../features/gameSlice';

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

  // Filter out items that are already assigned to a section
  const assignedIds = charterSections.map(s => s.assignedItemId).filter(Boolean);
  const availableItems = items.filter(item => !assignedIds.includes(item.id));

  const handleSubmit = () => {
    // Basic validation check before "submitting" to the game logic
    const emptySections = charterSections.filter(s => !s.assignedItemId && !s.isLocked);
    
    if (emptySections.length > 0) {
      alert(`Please fill all sections before submitting. Missing: ${emptySections.map(s => s.label).join(', ')}`);
      return;
    }

    if (charterSubmissionCount >= 3) {
      alert("Submission limit reached. Please consult with the Sponsor.");
      return;
    }

    // Trigger validation logic (conceptually)
    // In a real app, this would dispatch a thunk that runs the validation logic from Developer_Specifications
    // For now, we'll just simulate the state transition to the "Performance Report" if valid
    // The actual validation logic will be in PMISApp or a separate utility called here.
    // For this step, we just signal the intent.
    
    // We'll dispatch an action to simulate submission
    dispatch(incrementCharterSubmission());
    // We assume PMISApp will handle the actual "Scene Change" to PerformanceReport upon successful validation
  };

  return (
    <div className="flex h-full p-6 space-x-6">
      
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
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
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
                    <p className="text-xs mt-2">Check your emails or talk to stakeholders.</p>
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