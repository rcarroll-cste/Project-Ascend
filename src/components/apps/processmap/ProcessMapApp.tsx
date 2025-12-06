import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { RootState } from '../../../store';
import { ProcessCard, GeneratedDocument, EvidenceItem } from '../../../types';
import { PROCESS_CARDS, getProcessById } from '../../../data/processCards';
import {
  selectProcess,
  clearSelectedProcess,
  assignInputToSlot,
  removeInputFromSlot,
  addGeneratedDocument,
  recordExecution,
} from '../../../features/processMapSlice';
import { addNotification } from '../../../features/gameSlice';

import ProcessCardDeck from './ProcessCardDeck';
import ExecutionSlot from './ExecutionSlot';
import InputPanel from './InputPanel';
import OutputPreview from './OutputPreview';
import MissingDataFeedback from './MissingDataFeedback';
import ProcessExecutionModal from './ProcessExecutionModal';

const ProcessMapApp: React.FC = () => {
  const dispatch = useDispatch();
  const { unlockedProcesses } = useSelector((state: RootState) => state.game);
  const { selectedProcessId, assignedInputs, generatedDocuments } = useSelector(
    (state: RootState) => state.processMap
  );
  const { items: inventoryItems } = useSelector((state: RootState) => state.inventory);

  const [isExecuting, setIsExecuting] = useState(false);
  const [showMissingData, setShowMissingData] = useState(false);
  const [showExecutionResult, setShowExecutionResult] = useState(false);
  const [lastGeneratedDoc, setLastGeneratedDoc] = useState<GeneratedDocument | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get processes with unlock status
  const processesWithStatus = useMemo(() => {
    return PROCESS_CARDS.map((p) => ({
      ...p,
      isUnlocked: unlockedProcesses.includes(p.id),
    }));
  }, [unlockedProcesses]);

  // Get selected process details
  const selectedProcess = useMemo(() => {
    if (!selectedProcessId) return null;
    const base = getProcessById(selectedProcessId);
    if (!base) return null;
    return {
      ...base,
      isUnlocked: unlockedProcesses.includes(base.id),
    };
  }, [selectedProcessId, unlockedProcesses]);

  // Combine generated documents with inventory items as available documents
  const availableDocuments: (GeneratedDocument | EvidenceItem)[] = useMemo(() => {
    return [...generatedDocuments, ...inventoryItems];
  }, [generatedDocuments, inventoryItems]);

  // Calculate output quality based on assigned inputs
  const calculatedQuality = useMemo(() => {
    if (!selectedProcess) return 0;

    const requiredInputs = selectedProcess.requiredInputs;
    let totalWeight = 0;
    let weightedSum = 0;

    requiredInputs.forEach((input) => {
      const docId = assignedInputs[input.id];
      if (docId) {
        const doc = availableDocuments.find((d) => d.id === docId);
        const quality = doc
          ? 'quality' in doc
            ? doc.quality
            : 'qualityScore' in doc
            ? doc.qualityScore
            : 100
          : 0;
        weightedSum += quality * input.qualityImpact;
        totalWeight += input.qualityImpact;
      } else if (input.isRequired) {
        // Missing required input = 0 quality contribution
        totalWeight += input.qualityImpact;
      }
    });

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }, [selectedProcess, assignedInputs, availableDocuments]);

  // Check if all required inputs are assigned
  const canExecute = useMemo(() => {
    if (!selectedProcess) return false;
    return selectedProcess.requiredInputs
      .filter((i) => i.isRequired)
      .every((i) => assignedInputs[i.id]);
  }, [selectedProcess, assignedInputs]);

  // Get missing required inputs
  const missingInputs = useMemo(() => {
    if (!selectedProcess) return [];
    return selectedProcess.requiredInputs.filter(
      (i) => i.isRequired && !assignedInputs[i.id]
    );
  }, [selectedProcess, assignedInputs]);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Process dropped on execution slot
    if (
      active.data.current?.type === 'process' &&
      over.id === 'execution-slot'
    ) {
      const card = active.data.current.card as ProcessCard;
      if (card.isUnlocked) {
        dispatch(selectProcess(card.id));
      }
      return;
    }

    // Document dropped on input slot
    if (
      active.data.current?.type === 'document' &&
      String(over.id).startsWith('input-')
    ) {
      const slotId = String(over.id).replace('input-', '');
      const doc = active.data.current.document as GeneratedDocument | EvidenceItem;
      dispatch(assignInputToSlot({ slotId, documentId: doc.id }));
      return;
    }
  };

  // Handle process execution
  const handleExecute = async () => {
    if (!selectedProcess || !canExecute) {
      if (!canExecute && selectedProcess) {
        setShowMissingData(true);
      }
      return;
    }

    setIsExecuting(true);

    // Simulate execution time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate output document
    const output = selectedProcess.outputs[0];
    const newDoc: GeneratedDocument = {
      id: `gen_${Date.now()}`,
      name: output.name,
      processId: selectedProcess.id,
      createdAt: Date.now(),
      quality: calculatedQuality,
      content: [
        { type: 'heading', text: output.name },
        { type: 'text', text: `Generated from: ${selectedProcess.name}` },
        { type: 'text', text: `Quality Score: ${calculatedQuality}%` },
      ],
      isUsableAsInput: true,
    };

    // Record execution
    dispatch(
      recordExecution({
        id: `exec_${Date.now()}`,
        processId: selectedProcess.id,
        timestamp: Date.now(),
        inputs: Object.entries(assignedInputs).map(([inputId, documentId]) => {
          const doc = availableDocuments.find((d) => d.id === documentId);
          const quality = doc
            ? 'quality' in doc
              ? doc.quality
              : 'qualityScore' in doc
              ? doc.qualityScore
              : 100
            : 0;
          return { inputId, documentId, quality };
        }),
        outputQuality: calculatedQuality,
        outputDocumentId: newDoc.id,
        wasSuccessful: true,
        missingInputs: [],
      })
    );

    // Add generated document
    dispatch(addGeneratedDocument(newDoc));
    setLastGeneratedDoc(newDoc);

    // Notify user
    dispatch(
      addNotification({
        id: `notif_${Date.now()}`,
        title: 'Process Complete',
        message: `${output.name} has been generated.`,
        type: calculatedQuality >= 50 ? 'success' : 'warning',
        duration: 5000,
      })
    );

    setIsExecuting(false);
    setShowExecutionResult(true);
  };

  // Handle clearing selected process
  const handleClear = () => {
    dispatch(clearSelectedProcess());
    setLastGeneratedDoc(null);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="h-full flex flex-col bg-gray-50 p-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">ProcessMap</h1>
          <p className="text-gray-500">
            Execute PMBOK processes by providing the correct inputs
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          {/* Left Panel: Process Library */}
          <div className="col-span-3 overflow-y-auto bg-white rounded-xl border border-gray-200 p-4">
            <ProcessCardDeck
              processes={processesWithStatus}
              selectedProcessId={selectedProcessId}
              onSelectProcess={(id) => dispatch(selectProcess(id))}
            />
          </div>

          {/* Center Panel: Execution Area */}
          <div className="col-span-5 bg-white rounded-xl border border-gray-200 p-4">
            <ExecutionSlot
              selectedProcess={selectedProcess}
              isExecuting={isExecuting}
              canExecute={canExecute}
              onExecute={handleExecute}
              onClear={handleClear}
            />
          </div>

          {/* Right Panel: Inputs & Outputs */}
          <div className="col-span-4 flex flex-col gap-4 overflow-hidden">
            {/* Input Panel */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 overflow-y-auto">
              {selectedProcess ? (
                <InputPanel
                  requiredInputs={selectedProcess.requiredInputs}
                  assignedInputs={assignedInputs}
                  availableDocuments={availableDocuments}
                  onRemoveInput={(slotId) => dispatch(removeInputFromSlot(slotId))}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Select a process to see required inputs
                </div>
              )}
            </div>

            {/* Output Preview */}
            <div className="h-64 bg-white rounded-xl border border-gray-200 p-4 overflow-y-auto">
              <OutputPreview
                selectedProcess={selectedProcess}
                calculatedQuality={calculatedQuality}
                assignedInputCount={Object.keys(assignedInputs).length}
                requiredInputCount={
                  selectedProcess?.requiredInputs.filter((i) => i.isRequired).length || 0
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MissingDataFeedback
        isOpen={showMissingData}
        onClose={() => setShowMissingData(false)}
        missingInputs={missingInputs}
        processName={selectedProcess?.name || ''}
      />

      <ProcessExecutionModal
        isOpen={showExecutionResult}
        onClose={() => {
          setShowExecutionResult(false);
          handleClear();
        }}
        process={selectedProcess}
        outputDocument={lastGeneratedDoc}
        quality={calculatedQuality}
      />
    </DndContext>
  );
};

export default ProcessMapApp;
