import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './features/gameSlice';
import inventoryReducer from './features/inventorySlice';
import pmisReducer from './features/pmisSlice';
import osReducer from './features/osSlice';
import dialogueReducer from './features/dialogueSlice';
import examReducer from './features/examSlice';
import processMapReducer from './features/processMapSlice';
import documentAnalysisReducer from './features/documentAnalysisSlice';
import pmisEvolutionReducer from './features/pmisEvolutionSlice';
import decisionReducer from './features/decisionSlice';
import playerReducer from './features/playerSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    inventory: inventoryReducer,
    pmis: pmisReducer,
    os: osReducer,
    dialogue: dialogueReducer,
    exam: examReducer,
    processMap: processMapReducer,
    documentAnalysis: documentAnalysisReducer,
    pmisEvolution: pmisEvolutionReducer,
    decisions: decisionReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
