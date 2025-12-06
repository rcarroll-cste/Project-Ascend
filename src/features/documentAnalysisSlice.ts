import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DocumentAnalysisState,
  DocumentAnalysisTask,
  HighlightAttempt,
  HighlightFeedback,
} from '../types';

const initialState: DocumentAnalysisState = {
  activeTask: null,
  completedTasks: [],
  attemptHistory: [],
  selectedHighlightId: null,
  lastFeedback: null,
};

const documentAnalysisSlice = createSlice({
  name: 'documentAnalysis',
  initialState,
  reducers: {
    // Set the active analysis task
    setActiveTask: (
      state,
      action: PayloadAction<DocumentAnalysisTask | null>
    ) => {
      state.activeTask = action.payload;
      state.selectedHighlightId = null;
      state.lastFeedback = null;
    },

    // Select a highlight (before validation)
    selectHighlight: (state, action: PayloadAction<string | null>) => {
      state.selectedHighlightId = action.payload;
      state.lastFeedback = null;
    },

    // Record an attempt (correct or incorrect)
    recordAttempt: (state, action: PayloadAction<HighlightAttempt>) => {
      state.attemptHistory.push(action.payload);
    },

    // Set feedback to display
    setFeedback: (state, action: PayloadAction<HighlightFeedback | null>) => {
      state.lastFeedback = action.payload;
    },

    // Mark task as completed
    completeTask: (state, action: PayloadAction<string>) => {
      if (!state.completedTasks.includes(action.payload)) {
        state.completedTasks.push(action.payload);
      }
      if (state.activeTask?.id === action.payload) {
        state.activeTask = null;
      }
      state.selectedHighlightId = null;
    },

    // Clear feedback (after modal dismissed)
    clearFeedback: (state) => {
      state.lastFeedback = null;
    },

    // Clear selection without clearing feedback
    clearSelection: (state) => {
      state.selectedHighlightId = null;
    },

    // Reset for new game
    resetDocumentAnalysis: () => initialState,
  },
});

export const {
  setActiveTask,
  selectHighlight,
  recordAttempt,
  setFeedback,
  completeTask,
  clearFeedback,
  clearSelection,
  resetDocumentAnalysis,
} = documentAnalysisSlice.actions;

// Selectors
export const selectActiveTask = (state: { documentAnalysis: DocumentAnalysisState }) =>
  state.documentAnalysis.activeTask;

export const selectSelectedHighlight = (state: { documentAnalysis: DocumentAnalysisState }) =>
  state.documentAnalysis.selectedHighlightId;

export const selectLastFeedback = (state: { documentAnalysis: DocumentAnalysisState }) =>
  state.documentAnalysis.lastFeedback;

export const selectCompletedTasks = (state: { documentAnalysis: DocumentAnalysisState }) =>
  state.documentAnalysis.completedTasks;

export const selectAttemptCountForTask =
  (taskId: string) =>
  (state: { documentAnalysis: DocumentAnalysisState }) =>
    state.documentAnalysis.attemptHistory.filter((a) => a.taskId === taskId)
      .length;

export default documentAnalysisSlice.reducer;
