import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Notification, AppId, GameOverReason, ConstraintMetrics } from '../types';

const initialState: GameState = {
  currentPhase: 'Initiation',
  gameStage: 'Login',

  // Level Progression
  currentLevel: 1,
  levelTitle: 'The Handover',
  levelObjectives: {},

  // Triple Constraint HUD (GDD v3.3)
  constraints: {
    schedule: 100,  // 100% = on track
    budget: 100,    // 100% = full budget remaining
    morale: 75,     // Start with decent team morale
    scope: 50,      // 50 = balanced (no creep, no gold plating)
  },

  // Resources (legacy)
  socialCapital: 50,
  corporateCulture: 75,
  riskMeter: 10,

  // Progression Flags
  hasFoundMole: false,
  hasConsultedSME: false,
  charterSubmissionCount: 0,
  isPMISUnlocked: false, // Now starts locked, unlocked via Chatter choice
  notifications: [],
  isOnboardingCompleted: false,

  // ExamSim (Post-Level Assessment)
  examPending: false,
  pendingExamLevel: null,

  // App Unlock Tracking - Chatter and WikiBOK available at start
  unlockedApps: ['chatter', 'wikibok'],
  unlockedProcesses: [],

  // Game Over State
  isGameOver: false,
  gameOverReason: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Notifications
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },

    // Game Stage
    setGameStage: (
      state,
      action: PayloadAction<'Login' | 'Investigation' | 'Authorization' | 'GameOver'>
    ) => {
      state.gameStage = action.payload;
    },

    // Level Progression
    advanceLevel: (state, action: PayloadAction<{ level: number; title: string }>) => {
      state.currentLevel = action.payload.level;
      state.levelTitle = action.payload.title;
      state.levelObjectives = {}; // Reset objectives for new level
    },
    completeObjective: (state, action: PayloadAction<string>) => {
      state.levelObjectives[action.payload] = true;
    },

    // App Unlocking
    unlockApp: (state, action: PayloadAction<AppId>) => {
      if (!state.unlockedApps.includes(action.payload)) {
        state.unlockedApps.push(action.payload);
      }
      // Also set isPMISUnlocked for backwards compatibility
      if (action.payload === 'pmis') {
        state.isPMISUnlocked = true;
      }
    },
    unlockProcess: (state, action: PayloadAction<string>) => {
      if (!state.unlockedProcesses.includes(action.payload)) {
        state.unlockedProcesses.push(action.payload);
      }
    },

    // Game Over
    setGameOver: (
      state,
      action: PayloadAction<{ reason: GameOverReason; message?: string }>
    ) => {
      state.isGameOver = true;
      state.gameOverReason = action.payload.reason;
      state.gameStage = 'GameOver';
    },
    resetGameOver: (state) => {
      state.isGameOver = false;
      state.gameOverReason = null;
      state.gameStage = 'Investigation';
    },

    // Triple Constraint Updates (GDD v3.3 Status HUD)
    updateConstraint: (
      state,
      action: PayloadAction<{ metric: keyof ConstraintMetrics; delta: number }>
    ) => {
      const { metric, delta } = action.payload;
      state.constraints[metric] = Math.max(0, Math.min(100, state.constraints[metric] + delta));

      // Check for budget depletion game over
      if (metric === 'budget' && state.constraints.budget <= 0) {
        state.isGameOver = true;
        state.gameOverReason = 'BUDGET_DEPLETED';
        state.gameStage = 'GameOver';
      }
    },
    setConstraints: (state, action: PayloadAction<Partial<ConstraintMetrics>>) => {
      state.constraints = { ...state.constraints, ...action.payload };
    },

    // ExamSim triggers
    triggerExam: (state, action: PayloadAction<number>) => {
      state.examPending = true;
      state.pendingExamLevel = action.payload;
    },
    clearExamPending: (state) => {
      state.examPending = false;
      state.pendingExamLevel = null;
    },

    // Resource Updates (legacy)
    updateSocialCapital: (state, action: PayloadAction<number>) => {
      state.socialCapital = Math.max(0, state.socialCapital + action.payload);
    },
    updateCorporateCulture: (state, action: PayloadAction<number>) => {
      state.corporateCulture = Math.max(0, Math.min(100, state.corporateCulture + action.payload));
    },
    updateRiskMeter: (state, action: PayloadAction<number>) => {
      state.riskMeter = Math.max(0, Math.min(100, state.riskMeter + action.payload));
    },

    // Legacy Progression Flags
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
      if (!state.unlockedApps.includes('pmis')) {
        state.unlockedApps.push('pmis');
      }
    },
    completeOnboarding: (state) => {
      state.isOnboardingCompleted = true;
    },
  },
});

export const {
  // Notifications
  addNotification,
  removeNotification,
  // Game Stage
  setGameStage,
  // Level Progression
  advanceLevel,
  completeObjective,
  // App Unlocking
  unlockApp,
  unlockProcess,
  // Game Over
  setGameOver,
  resetGameOver,
  // Triple Constraints (GDD v3.3)
  updateConstraint,
  setConstraints,
  // ExamSim
  triggerExam,
  clearExamPending,
  // Resources (legacy)
  updateSocialCapital,
  updateCorporateCulture,
  updateRiskMeter,
  // Legacy Flags
  foundMole,
  consultedSME,
  incrementCharterSubmission,
  unlockPMIS,
  completeOnboarding,
} = gameSlice.actions;

export default gameSlice.reducer;