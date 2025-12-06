import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProcessMapState, ProcessExecution, GeneratedDocument } from '../types';

const initialState: ProcessMapState = {
  selectedProcessId: null,
  assignedInputs: {},
  executionHistory: [],
  generatedDocuments: [],
  activeTab: 'library',
};

const processMapSlice = createSlice({
  name: 'processMap',
  initialState,
  reducers: {
    // Process Selection
    selectProcess: (state, action: PayloadAction<string>) => {
      state.selectedProcessId = action.payload;
      state.assignedInputs = {}; // Reset inputs when selecting new process
    },
    clearSelectedProcess: (state) => {
      state.selectedProcessId = null;
      state.assignedInputs = {};
    },

    // Input Assignment
    assignInputToSlot: (
      state,
      action: PayloadAction<{ slotId: string; documentId: string }>
    ) => {
      state.assignedInputs[action.payload.slotId] = action.payload.documentId;
    },
    removeInputFromSlot: (state, action: PayloadAction<string>) => {
      delete state.assignedInputs[action.payload];
    },
    clearAllInputs: (state) => {
      state.assignedInputs = {};
    },

    // Process Execution
    recordExecution: (state, action: PayloadAction<ProcessExecution>) => {
      state.executionHistory.push(action.payload);
    },

    // Generated Documents
    addGeneratedDocument: (state, action: PayloadAction<GeneratedDocument>) => {
      state.generatedDocuments.push(action.payload);
    },
    updateDocumentQuality: (
      state,
      action: PayloadAction<{ id: string; quality: number }>
    ) => {
      const doc = state.generatedDocuments.find(
        (d) => d.id === action.payload.id
      );
      if (doc) {
        doc.quality = action.payload.quality;
      }
    },

    // Tab Navigation
    setActiveTab: (
      state,
      action: PayloadAction<'library' | 'active' | 'history'>
    ) => {
      state.activeTab = action.payload;
    },

    // Reset state
    resetProcessMap: () => initialState,
  },
});

export const {
  selectProcess,
  clearSelectedProcess,
  assignInputToSlot,
  removeInputFromSlot,
  clearAllInputs,
  recordExecution,
  addGeneratedDocument,
  updateDocumentQuality,
  setActiveTab,
  resetProcessMap,
} = processMapSlice.actions;

export default processMapSlice.reducer;
