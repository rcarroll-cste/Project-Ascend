import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Notification,
  AppId,
  GameOverReason,
  ConstraintMetrics,
  LevelProgress,
  CumulativeScores,
  GameEnding,
  CampaignArc,
} from '../types';
import { ALL_LEVELS, getLevelById } from '../data/levels';

// =============================================================================
// ENHANCED GAME STATE (GDD v4.0)
// =============================================================================

export interface GameStateV2 {
  // Core Game State
  gameStage: 'Boot' | 'Login' | 'Playing' | 'ExamSim' | 'LevelComplete' | 'GameOver' | 'Ending';
  currentPhase: 'Initiation' | 'Planning' | 'Executing' | 'Closing';
  currentArc: CampaignArc;

  // Level Progression
  currentLevelId: number;
  levelProgress: Record<number, LevelProgress>;

  // Triple Constraint HUD (AscendTrack)
  constraints: ConstraintMetrics;

  // Cumulative Scores (for endings)
  cumulativeScores: CumulativeScores;

  // Resources
  budget: number;           // Actual $ remaining (for Cost Control Unit)
  totalBudget: number;      // Total project budget
  scheduleProgress: number; // 0-100, actual vs baseline
  scheduleBaseline: number; // Days in project

  // App & Process Unlocks
  unlockedApps: AppId[];
  unlockedProcesses: string[];

  // Notifications
  notifications: Notification[];

  // UI State
  isOnboardingCompleted: boolean;
  showTutorial: boolean;

  // ExamSim State
  examPending: boolean;
  pendingExamLevel: number | null;

  // Game Over / Ending State
  isGameOver: boolean;
  gameOverReason: GameOverReason | null;
  gameEnding: GameEnding | null;

  // Legacy flags (for backward compatibility)
  hasFoundMole: boolean;
  hasConsultedSME: boolean;
  charterSubmissionCount: number;
  isPMISUnlocked: boolean;
  socialCapital: number;
  corporateCulture: number;
  riskMeter: number;
}

// Initialize level progress for all levels
const initializeLevelProgress = (): Record<number, LevelProgress> => {
  const progress: Record<number, LevelProgress> = {};
  ALL_LEVELS.forEach((level) => {
    progress[level.id] = {
      levelId: level.id,
      isUnlocked: level.id === 1, // Level 1 unlocked initially
      isStarted: false,
      isCompleted: false,
      objectivesCompleted: {},
      examPassed: false,
      completedAt: null,
      attempts: 0,
    };
  });
  return progress;
};

const initialState: GameStateV2 = {
  // Core Game State
  gameStage: 'Login',
  currentPhase: 'Initiation',
  currentArc: 'Arc1_Initiation',

  // Level Progression
  currentLevelId: 1,
  levelProgress: initializeLevelProgress(),

  // Triple Constraint HUD
  constraints: {
    schedule: 100,  // 100% = on track
    budget: 100,    // 100% = full budget remaining
    morale: 75,     // Start with decent team morale
    scope: 50,      // 50 = balanced (no creep, no gold plating)
  },

  // Cumulative Scores
  cumulativeScores: {
    budgetAdherence: 100,
    scheduleAdherence: 100,
    teamMorale: 75,
    stakeholderSatisfaction: 50,
    qualityScore: 50,
    ethicsScore: 100,
    leadershipStyle: 50,
    processAdherence: 50,
  },

  // Resources
  budget: 500000,       // $500k starting budget
  totalBudget: 500000,
  scheduleProgress: 0,
  scheduleBaseline: 180, // 6 months

  // App & Process Unlocks
  unlockedApps: ['chatter'],
  unlockedProcesses: [],

  // Notifications
  notifications: [],

  // UI State
  isOnboardingCompleted: false,
  showTutorial: true,

  // ExamSim State
  examPending: false,
  pendingExamLevel: null,

  // Game Over / Ending State
  isGameOver: false,
  gameOverReason: null,
  gameEnding: null,

  // Legacy flags
  hasFoundMole: false,
  hasConsultedSME: false,
  charterSubmissionCount: 0,
  isPMISUnlocked: false,
  socialCapital: 50,
  corporateCulture: 75,
  riskMeter: 10,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // =========================================================================
    // GAME STAGE MANAGEMENT
    // =========================================================================
    setGameStage: (
      state,
      action: PayloadAction<GameStateV2['gameStage']>
    ) => {
      state.gameStage = action.payload;
    },

    startGame: (state) => {
      state.gameStage = 'Playing';
      state.levelProgress[0].isStarted = true;
    },

    // =========================================================================
    // LEVEL PROGRESSION (GDD v4.0)
    // =========================================================================
    startLevel: (state, action: PayloadAction<number>) => {
      const levelId = action.payload;
      const level = getLevelById(levelId);
      if (!level) return;

      state.currentLevelId = levelId;
      state.currentArc = level.arc;
      state.gameStage = 'Playing';

      // Update progress
      if (state.levelProgress[levelId]) {
        state.levelProgress[levelId].isStarted = true;
        state.levelProgress[levelId].attempts += 1;
      }

      // Determine phase
      if (level.processGroup === 'Initiating') {
        state.currentPhase = 'Initiation';
      } else if (level.processGroup === 'Planning') {
        state.currentPhase = 'Planning';
      }

      // Unlock apps specified by level
      level.unlocksApps.forEach((appId) => {
        if (!state.unlockedApps.includes(appId)) {
          state.unlockedApps.push(appId);
        }
      });

      // Unlock processes specified by level
      level.unlocksProcesses.forEach((processId) => {
        if (!state.unlockedProcesses.includes(processId)) {
          state.unlockedProcesses.push(processId);
        }
      });
    },

    completeObjective: (
      state,
      action: PayloadAction<{ levelId: number; objectiveId: string }>
    ) => {
      const { levelId, objectiveId } = action.payload;
      if (state.levelProgress[levelId]) {
        state.levelProgress[levelId].objectivesCompleted[objectiveId] = true;
      }
    },

    completeLevel: (state, action: PayloadAction<number>) => {
      const levelId = action.payload;
      const level = getLevelById(levelId);
      if (!level || !state.levelProgress[levelId]) return;

      // Mark level as completed
      state.levelProgress[levelId].isCompleted = true;
      state.levelProgress[levelId].completedAt = Date.now();

      // Unlock next level
      const nextLevelId = levelId + 1;
      if (state.levelProgress[nextLevelId]) {
        state.levelProgress[nextLevelId].isUnlocked = true;
      }

      // Trigger exam if level has exam questions
      if (level.examQuestionIds.length > 0) {
        state.examPending = true;
        state.pendingExamLevel = levelId;
        state.gameStage = 'ExamSim';
      } else {
        state.gameStage = 'LevelComplete';
      }
    },

    advanceToNextLevel: (state) => {
      const nextLevelId = state.currentLevelId + 1;
      const nextLevel = getLevelById(nextLevelId);

      if (nextLevel && state.levelProgress[nextLevelId]?.isUnlocked) {
        state.currentLevelId = nextLevelId;
        state.currentArc = nextLevel.arc;
        state.gameStage = 'Playing';
        state.levelProgress[nextLevelId].isStarted = true;
      } else if (nextLevelId > 2) {
        // Demo complete after Level 2 (Initiation Phase) - trigger ending
        state.gameStage = 'Ending';
        state.gameEnding = determineEnding(state.cumulativeScores);
      }
    },

    // Legacy advanceLevel for backward compatibility
    advanceLevel: (state, action: PayloadAction<{ level: number; title: string }>) => {
      const levelId = action.payload.level;
      state.currentLevelId = levelId;

      if (state.levelProgress[levelId]) {
        state.levelProgress[levelId].isStarted = true;
        state.levelProgress[levelId].isUnlocked = true;
      }
    },

    // =========================================================================
    // APP & PROCESS UNLOCKING
    // =========================================================================
    unlockApp: (state, action: PayloadAction<AppId>) => {
      if (!state.unlockedApps.includes(action.payload)) {
        state.unlockedApps.push(action.payload);
      }
      if (action.payload === 'pmis') {
        state.isPMISUnlocked = true;
      }
    },

    unlockProcess: (state, action: PayloadAction<string>) => {
      if (!state.unlockedProcesses.includes(action.payload)) {
        state.unlockedProcesses.push(action.payload);
      }
    },

    // =========================================================================
    // TRIPLE CONSTRAINT MANAGEMENT (AscendTrack)
    // =========================================================================
    updateConstraint: (
      state,
      action: PayloadAction<{ metric: keyof ConstraintMetrics; delta: number }>
    ) => {
      const { metric, delta } = action.payload;
      state.constraints[metric] = Math.max(0, Math.min(100, state.constraints[metric] + delta));

      // Update cumulative scores
      if (metric === 'budget') {
        state.cumulativeScores.budgetAdherence = state.constraints.budget;
      } else if (metric === 'schedule') {
        state.cumulativeScores.scheduleAdherence = state.constraints.schedule;
      } else if (metric === 'morale') {
        state.cumulativeScores.teamMorale = state.constraints.morale;
      }

      // Check for game over conditions
      if (metric === 'budget' && state.constraints.budget <= 0) {
        state.isGameOver = true;
        state.gameOverReason = 'BUDGET_DEPLETED';
        state.gameStage = 'GameOver';
      }
      if (metric === 'morale' && state.constraints.morale <= 0) {
        state.isGameOver = true;
        state.gameOverReason = 'MORALE_COLLAPSE';
        state.gameStage = 'GameOver';
      }
      if (metric === 'schedule' && state.constraints.schedule <= 0) {
        state.isGameOver = true;
        state.gameOverReason = 'SCHEDULE_CATASTROPHE';
        state.gameStage = 'GameOver';
      }
    },

    setConstraints: (state, action: PayloadAction<Partial<ConstraintMetrics>>) => {
      state.constraints = { ...state.constraints, ...action.payload };
    },

    spendBudget: (state, action: PayloadAction<number>) => {
      state.budget = Math.max(0, state.budget - action.payload);
      state.constraints.budget = (state.budget / state.totalBudget) * 100;

      if (state.budget <= 0) {
        state.isGameOver = true;
        state.gameOverReason = 'BUDGET_DEPLETED';
        state.gameStage = 'GameOver';
      }
    },

    // =========================================================================
    // CUMULATIVE SCORES
    // =========================================================================
    updateCumulativeScore: (
      state,
      action: PayloadAction<{ score: keyof CumulativeScores; delta: number }>
    ) => {
      const { score, delta } = action.payload;
      state.cumulativeScores[score] = Math.max(
        0,
        Math.min(100, state.cumulativeScores[score] + delta)
      );
    },

    // =========================================================================
    // GAME OVER & ENDINGS
    // =========================================================================
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
      state.gameStage = 'Playing';
    },

    resetToLevel: (state, action: PayloadAction<number>) => {
      const levelId = action.payload;
      state.currentLevelId = levelId;
      state.isGameOver = false;
      state.gameOverReason = null;
      state.gameStage = 'Playing';

      // Reset level progress for this level
      if (state.levelProgress[levelId]) {
        state.levelProgress[levelId].objectivesCompleted = {};
        state.levelProgress[levelId].isCompleted = false;
      }
    },

    // =========================================================================
    // EXAM MANAGEMENT
    // =========================================================================
    triggerExam: (state, action: PayloadAction<number>) => {
      state.examPending = true;
      state.pendingExamLevel = action.payload;
      state.gameStage = 'ExamSim';
    },

    passExam: (state, action: PayloadAction<number>) => {
      const levelId = action.payload;
      if (state.levelProgress[levelId]) {
        state.levelProgress[levelId].examPassed = true;
      }
      state.examPending = false;
      state.pendingExamLevel = null;
      state.gameStage = 'LevelComplete';
    },

    failExam: (state, _action: PayloadAction<number>) => {
      // Player can retry level or continue (depending on game design)
      state.examPending = false;
      state.pendingExamLevel = null;
      state.gameStage = 'LevelComplete';
    },

    clearExamPending: (state) => {
      state.examPending = false;
      state.pendingExamLevel = null;
    },

    // =========================================================================
    // NOTIFICATIONS
    // =========================================================================
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },

    // =========================================================================
    // UI STATE
    // =========================================================================
    completeOnboarding: (state) => {
      state.isOnboardingCompleted = true;
      state.showTutorial = false;
    },

    toggleTutorial: (state, action: PayloadAction<boolean>) => {
      state.showTutorial = action.payload;
    },

    // =========================================================================
    // LEGACY ACTIONS (Backward Compatibility)
    // =========================================================================
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
      if (!state.unlockedApps.includes('pmis')) {
        state.unlockedApps.push('pmis');
      }
    },

    // =========================================================================
    // GAME RESET
    // =========================================================================
    resetGame: () => initialState,
  },
});

// Helper function to determine ending based on cumulative scores
function determineEnding(scores: CumulativeScores): GameEnding {
  const {
    budgetAdherence,
    scheduleAdherence,
    teamMorale,
    stakeholderSatisfaction,
    qualityScore,
    ethicsScore,
  } = scores;

  // Calculate overall balance
  const overallScore =
    (budgetAdherence + scheduleAdherence + teamMorale + stakeholderSatisfaction + qualityScore + ethicsScore) / 6;

  // Gold Plater: High quality but poor budget/schedule
  if (qualityScore > 80 && (budgetAdherence < 50 || scheduleAdherence < 50)) {
    return 'gold_plater';
  }

  // Iron Fist: Good budget/schedule but poor morale
  if (budgetAdherence > 80 && scheduleAdherence > 80 && teamMorale < 40) {
    return 'iron_fist';
  }

  // PMP Master: Balanced approach
  if (overallScore >= 70 && ethicsScore >= 80) {
    return 'pmp_master';
  }

  // Default to iron_fist if not meeting PMP Master criteria
  return 'iron_fist';
}

export const {
  // Game Stage
  setGameStage,
  startGame,
  // Level Progression
  startLevel,
  completeObjective,
  completeLevel,
  advanceToNextLevel,
  advanceLevel,
  // App & Process Unlocking
  unlockApp,
  unlockProcess,
  // Triple Constraints
  updateConstraint,
  setConstraints,
  spendBudget,
  // Cumulative Scores
  updateCumulativeScore,
  // Game Over & Endings
  setGameOver,
  resetGameOver,
  resetToLevel,
  // Exam
  triggerExam,
  passExam,
  failExam,
  clearExamPending,
  // Notifications
  addNotification,
  removeNotification,
  // UI State
  completeOnboarding,
  toggleTutorial,
  // Legacy
  updateSocialCapital,
  updateCorporateCulture,
  updateRiskMeter,
  foundMole,
  consultedSME,
  incrementCharterSubmission,
  unlockPMIS,
  // Reset
  resetGame,
} = gameSlice.actions;

// Selectors
export const selectCurrentLevel = (state: { game: GameStateV2 }) =>
  getLevelById(state.game.currentLevelId);

export const selectLevelProgress = (state: { game: GameStateV2 }, levelId: number) =>
  state.game.levelProgress[levelId];

export const selectIsLevelCompleted = (state: { game: GameStateV2 }, levelId: number) =>
  state.game.levelProgress[levelId]?.isCompleted ?? false;

export const selectUnlockedLevels = (state: { game: GameStateV2 }) =>
  Object.values(state.game.levelProgress).filter((p) => p.isUnlocked);

export const selectConstraints = (state: { game: GameStateV2 }) => state.game.constraints;

export const selectCumulativeScores = (state: { game: GameStateV2 }) => state.game.cumulativeScores;

export default gameSlice.reducer;
