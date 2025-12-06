import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { FileText, GripVertical, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProcessInput, GeneratedDocument, EvidenceItem } from '../../../types';

interface InputPanelProps {
  requiredInputs: ProcessInput[];
  assignedInputs: Record<string, string>;
  availableDocuments: (GeneratedDocument | EvidenceItem)[];
  onRemoveInput: (slotId: string) => void;
}

// Draggable document item
const DraggableDocument: React.FC<{
  document: GeneratedDocument | EvidenceItem;
  isAssigned: boolean;
}> = ({ document, isAssigned }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `document-${document.id}`,
      data: { type: 'document', document },
      disabled: isAssigned,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 999 : undefined,
      }
    : undefined;

  const quality = 'quality' in document ? document.quality :
    ('qualityScore' in document ? document.qualityScore : 100);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 p-3 rounded-lg border transition-all
        ${isAssigned ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed' : 'bg-white border-gray-200 cursor-grab active:cursor-grabbing hover:border-purple-300'}
        ${isDragging ? 'opacity-50 ring-2 ring-purple-500' : ''}
      `}
    >
      <GripVertical size={16} className="text-gray-400" />
      <FileText size={18} className="text-gray-500" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 truncate">
          {document.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Quality: {quality}%
          </span>
          {isAssigned && (
            <span className="text-xs text-purple-600">(Assigned)</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Input slot component
const InputSlot: React.FC<{
  input: ProcessInput;
  assignedDocument: (GeneratedDocument | EvidenceItem) | null;
  onRemove: () => void;
}> = ({ input, assignedDocument, onRemove }) => {
  return (
    <div
      className={`
        p-4 rounded-lg border-2 transition-all
        ${assignedDocument
          ? 'border-green-300 bg-green-50'
          : input.isRequired
          ? 'border-amber-300 bg-amber-50 border-dashed'
          : 'border-gray-200 bg-gray-50 border-dashed'
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {assignedDocument ? (
            <CheckCircle2 size={18} className="text-green-500" />
          ) : (
            <AlertCircle
              size={18}
              className={input.isRequired ? 'text-amber-500' : 'text-gray-400'}
            />
          )}
          <span className="font-medium text-gray-700">{input.name}</span>
        </div>
        {input.isRequired && !assignedDocument && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
            Required
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-2">{input.description}</p>

      {assignedDocument ? (
        <div className="flex items-center justify-between bg-white p-2 rounded border border-green-200">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-green-600" />
            <span className="text-sm text-gray-700">{assignedDocument.name}</span>
          </div>
          <button
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="text-center py-2 text-xs text-gray-400">
          Drag document here
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        Quality Impact: {input.qualityImpact}%
      </div>
    </div>
  );
};

const InputPanel: React.FC<InputPanelProps> = ({
  requiredInputs,
  assignedInputs,
  availableDocuments,
  onRemoveInput,
}) => {
  const getAssignedDocument = (slotId: string) => {
    const docId = assignedInputs[slotId];
    if (!docId) return null;
    return availableDocuments.find((d) => d.id === docId) || null;
  };

  const isDocumentAssigned = (docId: string) =>
    Object.values(assignedInputs).includes(docId);

  const assignedCount = Object.keys(assignedInputs).length;
  const requiredCount = requiredInputs.filter((i) => i.isRequired).length;
  const allRequiredAssigned = requiredInputs
    .filter((i) => i.isRequired)
    .every((i) => assignedInputs[i.id]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Input Documents</h3>
        <p className="text-sm text-gray-500">
          Assign documents to input slots ({assignedCount}/{requiredCount} required)
        </p>
        {allRequiredAssigned && (
          <p className="text-sm text-green-600 mt-1">
            ✓ All required inputs assigned
          </p>
        )}
      </div>

      {/* Input Slots */}
      <div className="space-y-3 mb-6">
        {requiredInputs.map((input) => (
          <InputSlot
            key={input.id}
            input={input}
            assignedDocument={getAssignedDocument(input.id)}
            onRemove={() => onRemoveInput(input.id)}
          />
        ))}
      </div>

      {/* Available Documents */}
      <div className="flex-1 min-h-0">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Available Documents
        </h4>
        <div className="space-y-2 overflow-y-auto max-h-[200px]">
          {availableDocuments.length > 0 ? (
            availableDocuments.map((doc) => (
              <DraggableDocument
                key={doc.id}
                document={doc}
                isAssigned={isDocumentAssigned(doc.id)}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              No documents available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
