import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameDecision, DecisionConsequence } from '../types';

// =============================================================================
// DECISION TRACKING STATE (GDD v4.0)
// =============================================================================

export interface DelayedEffect {
  id: string;
  sourceDecisionId: string;
  triggerLevelId: number;
  consequence: DecisionConsequence;
  isTriggered: boolean;
  triggeredAt: number | null;
}

export interface DecisionState {
  // All decisions made by the player
  decisions: GameDecision[];

  // Delayed effects waiting to trigger
  delayedEffects: DelayedEffect[];

  // Decision statistics
  stats: {
    totalDecisions: number;
    safeChoices: number;
    riskyChoices: number;
    neutralChoices: number;
    ethicalViolations: number;
  };

  // Key decision flags for narrative branches
  keyDecisions: {
    // Level 1
    resistedPressure: boolean;          // Didn't buy servers before charter
    assumptionLogCorrect: boolean;      // Correctly classified vendor promise

    // Level 2
    foundHiddenStakeholder: boolean;    // Found Legal in spam folder
    salienceModelCorrect: boolean;      // Correctly analyzed Union Rep

    // Level 3
    selectedCorrectLifecycle: boolean;  // Chose Predictive for fixed budget
    usedProblemSolving: boolean;        // Resolved Marcus conflict correctly

    // Level 4
    rejectedGoldPlating: boolean;       // Removed developer's dark mode

    // General tracking
    hasUnauthorizedSpend: boolean;
    hasScopeCreep: boolean;
    hasGoldPlating: boolean;
  };
}

const initialState: DecisionState = {
  decisions: [],
  delayedEffects: [],
  stats: {
    totalDecisions: 0,
    safeChoices: 0,
    riskyChoices: 0,
    neutralChoices: 0,
    ethicalViolations: 0,
  },
  keyDecisions: {
    resistedPressure: false,
    assumptionLogCorrect: false,
    foundHiddenStakeholder: false,
    salienceModelCorrect: false,
    selectedCorrectLifecycle: false,
    usedProblemSolving: false,
    rejectedGoldPlating: false,
    hasUnauthorizedSpend: false,
    hasScopeCreep: false,
    hasGoldPlating: false,
  },
};

const decisionSlice = createSlice({
  name: 'decisions',
  initialState,
  reducers: {
    // Record a new decision
    recordDecision: (state, action: PayloadAction<GameDecision>) => {
      const decision = action.payload;
      state.decisions.push(decision);
      state.stats.totalDecisions += 1;

      // Process consequences
      decision.consequences.forEach((consequence) => {
        // Check for delayed effects
        if (consequence.type === 'delayed_effect' && consequence.delayedUntilLevel) {
          state.delayedEffects.push({
            id: `${decision.id}_${consequence.target}`,
            sourceDecisionId: decision.id,
            triggerLevelId: consequence.delayedUntilLevel,
            consequence,
            isTriggered: false,
            triggeredAt: null,
          });
        }

        // Track penalties for ethics violations
        if (consequence.type === 'penalty') {
          state.stats.ethicalViolations += 1;
        }
      });
    },

    // Record a dialogue choice with style tracking
    recordDialogueChoice: (
      state,
      action: PayloadAction<{
        levelId: number;
        choiceId: string;
        choiceLabel: string;
        style: 'safe' | 'risky' | 'neutral';
        consequences: DecisionConsequence[];
      }>
    ) => {
      const { levelId, choiceId, choiceLabel, style, consequences } = action.payload;

      const decision: GameDecision = {
        id: `dialogue_${choiceId}_${Date.now()}`,
        levelId,
        timestamp: Date.now(),
        decisionType: 'dialogue_choice',
        choiceId,
        choiceLabel,
        consequences,
      };

      state.decisions.push(decision);
      state.stats.totalDecisions += 1;

      // Update style stats
      if (style === 'safe') state.stats.safeChoices += 1;
      else if (style === 'risky') state.stats.riskyChoices += 1;
      else state.stats.neutralChoices += 1;
    },

    // Set a key decision flag
    setKeyDecision: (
      state,
      action: PayloadAction<{ key: keyof DecisionState['keyDecisions']; value: boolean }>
    ) => {
      const { key, value } = action.payload;
      state.keyDecisions[key] = value;
    },

    // Check and trigger delayed effects for a level
    triggerDelayedEffectsForLevel: (state, action: PayloadAction<number>) => {
      const levelId = action.payload;

      state.delayedEffects.forEach((effect) => {
        if (effect.triggerLevelId === levelId && !effect.isTriggered) {
          effect.isTriggered = true;
          effect.triggeredAt = Date.now();
        }
      });
    },

    // Clear a specific delayed effect after handling
    clearDelayedEffect: (state, action: PayloadAction<string>) => {
      const effectId = action.payload;
      const effect = state.delayedEffects.find((e) => e.id === effectId);
      if (effect) {
        effect.isTriggered = true;
        effect.triggeredAt = Date.now();
      }
    },

    // Mark unauthorized spend
    markUnauthorizedSpend: (state) => {
      state.keyDecisions.hasUnauthorizedSpend = true;
      state.stats.ethicalViolations += 1;
    },

    // Mark scope creep
    markScopeCreep: (state) => {
      state.keyDecisions.hasScopeCreep = true;
    },

    // Mark gold plating
    markGoldPlating: (state) => {
      state.keyDecisions.hasGoldPlating = true;
    },

    // Reset decision state
    resetDecisions: () => initialState,
  },
});

export const {
  recordDecision,
  recordDialogueChoice,
  setKeyDecision,
  triggerDelayedEffectsForLevel,
  clearDelayedEffect,
  markUnauthorizedSpend,
  markScopeCreep,
  markGoldPlating,
  resetDecisions,
} = decisionSlice.actions;

// Selectors
export const selectAllDecisions = (state: { decisions: DecisionState }) =>
  state.decisions.decisions;

export const selectDecisionsByLevel = (
  state: { decisions: DecisionState },
  levelId: number
) => state.decisions.decisions.filter((d) => d.levelId === levelId);

export const selectDecisionStats = (state: { decisions: DecisionState }) =>
  state.decisions.stats;

export const selectKeyDecisions = (state: { decisions: DecisionState }) =>
  state.decisions.keyDecisions;

export const selectPendingDelayedEffects = (
  state: { decisions: DecisionState },
  levelId: number
) =>
  state.decisions.delayedEffects.filter(
    (e) => e.triggerLevelId === levelId && !e.isTriggered
  );

export const selectHasEthicalViolations = (state: { decisions: DecisionState }) =>
  state.decisions.stats.ethicalViolations > 0;

export const selectDecisionBalance = (state: { decisions: DecisionState }) => {
  const { safeChoices, riskyChoices, neutralChoices } = state.decisions.stats;
  const total = safeChoices + riskyChoices + neutralChoices;
  if (total === 0) return { safe: 0, risky: 0, neutral: 0 };

  return {
    safe: (safeChoices / total) * 100,
    risky: (riskyChoices / total) * 100,
    neutral: (neutralChoices / total) * 100,
  };
};

export default decisionSlice.reducer;
