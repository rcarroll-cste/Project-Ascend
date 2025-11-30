import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Notification } from '../types';

const initialState: GameState = {
  currentPhase: 'Initiation',
  gameStage: 'Login',
  socialCapital: 50,
  corporateCulture: 75,
  riskMeter: 10,
  hasFoundMole: false,
  hasConsultedSME: false,
  charterSubmissionCount: 0,
  isPMISUnlocked: false,
  notifications: [],
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    setGameStage: (state, action: PayloadAction<'Login' | 'Investigation' | 'Authorization'>) => {
      state.gameStage = action.payload;
    },
    updateSocialCapital: (state, action: PayloadAction<number>) => {
      state.socialCapital = Math.max(0, state.socialCapital + action.payload);
    },
    updateCorporateCulture: (state, action: PayloadAction<number>) => {
      state.corporateCulture = Math.max(0, Math.min(100, state.corporateCulture + action.payload));
    },
    updateRiskMeter: (state, action: PayloadAction<number>) => {
      state.riskMeter = Math.max(0, Math.min(100, state.riskMeter + action.payload));
    },
    foundMole: (state) => {
      state.hasFoundMole = true;
    },
    consultedSME: (state) => {
      state.hasConsultedSME = true;
    },
    incrementCharterSubmission: (state) => {
      state.charterSubmissionCount += 1;
    },
    unlockPMIS: (state) => {
      state.isPMISUnlocked = true;
    },
  },
});

export const {
  setGameStage,
  updateSocialCapital,
  updateCorporateCulture,
  updateRiskMeter,
  foundMole,
  consultedSME,
  incrementCharterSubmission,
  unlockPMIS,
  addNotification,
  removeNotification,
} = gameSlice.actions;

export default gameSlice.reducer;