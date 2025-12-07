import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PMISTier, PMISFeature } from '../types';

// =============================================================================
// PMIS EVOLUTION STATE (AscendTrack)
// =============================================================================

export interface PMISEvolutionState {
  currentTier: PMISTier;
  features: PMISFeature[];
  upgradeHistory: {
    featureId: string;
    unlockedAt: number;
    levelId: number;
  }[];
}

// Define all PMIS features and their unlock requirements
const PMIS_FEATURES: PMISFeature[] = [
  // BASIC TIER (Prologue - Level 2)
  {
    id: 'raw_data_display',
    name: 'Raw Data Display',
    description: 'View basic project metrics as raw numbers',
    tier: 'basic',
    unlockedAtLevel: 0,
    isUnlocked: true,
  },
  {
    id: 'schedule_progress',
    name: 'Schedule Progress Bar',
    description: 'Visual progress bar showing schedule status',
    tier: 'basic',
    unlockedAtLevel: 0,
    isUnlocked: true,
  },
  {
    id: 'budget_display',
    name: 'Budget Display',
    description: 'Show remaining budget as percentage',
    tier: 'basic',
    unlockedAtLevel: 0,
    isUnlocked: true,
  },
  {
    id: 'morale_indicator',
    name: 'Team Morale Indicator',
    description: 'Display current team morale level',
    tier: 'basic',
    unlockedAtLevel: 0,
    isUnlocked: true,
  },
  {
    id: 'scope_gauge',
    name: 'Scope Gauge',
    description: 'Visualize scope creep vs gold plating balance',
    tier: 'basic',
    unlockedAtLevel: 0,
    isUnlocked: true,
  },
  {
    id: 'stakeholder_list',
    name: 'Stakeholder List',
    description: 'Basic list of identified stakeholders',
    tier: 'basic',
    unlockedAtLevel: 2,
    isUnlocked: false,
  },

  // INTERMEDIATE TIER (Level 3 - Level 12)
  {
    id: 'trend_charts',
    name: 'Trend Charts',
    description: 'Historical trends for all constraints',
    tier: 'intermediate',
    unlockedAtLevel: 3,
    isUnlocked: false,
  },
  {
    id: 'stakeholder_grid',
    name: 'Power/Interest Grid',
    description: 'Visual stakeholder classification grid',
    tier: 'intermediate',
    unlockedAtLevel: 2,
    isUnlocked: false,
  },
  {
    id: 'wbs_viewer',
    name: 'WBS Viewer',
    description: 'Work Breakdown Structure visualization',
    tier: 'intermediate',
    unlockedAtLevel: 7,
    isUnlocked: false,
  },
  {
    id: 'network_diagram',
    name: 'Network Diagram',
    description: 'Activity network visualization',
    tier: 'intermediate',
    unlockedAtLevel: 10,
    isUnlocked: false,
  },
  {
    id: 'gantt_chart',
    name: 'Gantt Chart',
    description: 'Schedule timeline visualization',
    tier: 'intermediate',
    unlockedAtLevel: 12,
    isUnlocked: false,
  },
  {
    id: 'critical_path_highlight',
    name: 'Critical Path Highlighting',
    description: 'Highlight critical path activities',
    tier: 'intermediate',
    unlockedAtLevel: 12,
    isUnlocked: false,
  },
  {
    id: 'resource_histogram',
    name: 'Resource Histogram',
    description: 'Resource allocation over time',
    tier: 'intermediate',
    unlockedAtLevel: 18,
    isUnlocked: false,
  },

  // ADVANCED TIER (Level 13+)
  {
    id: 'evm_dashboard',
    name: 'Earned Value Dashboard',
    description: 'EVM metrics (PV, EV, AC, SV, CV)',
    tier: 'advanced',
    unlockedAtLevel: 13,
    isUnlocked: false,
  },
  {
    id: 'evm_forecasting',
    name: 'EVM Forecasting',
    description: 'Predictive analytics (EAC, ETC, VAC, TCPI)',
    tier: 'advanced',
    unlockedAtLevel: 15,
    isUnlocked: false,
  },
  {
    id: 's_curve',
    name: 'S-Curve Visualization',
    description: 'Cumulative cost/schedule S-curve',
    tier: 'advanced',
    unlockedAtLevel: 15,
    isUnlocked: false,
  },
  {
    id: 'risk_matrix',
    name: 'Risk Probability/Impact Matrix',
    description: 'Visual risk assessment matrix',
    tier: 'advanced',
    unlockedAtLevel: 20,
    isUnlocked: false,
  },
  {
    id: 'tornado_diagram',
    name: 'Tornado Diagram',
    description: 'Sensitivity analysis visualization',
    tier: 'advanced',
    unlockedAtLevel: 23,
    isUnlocked: false,
  },
  {
    id: 'monte_carlo',
    name: 'Monte Carlo Simulation',
    description: 'Probabilistic schedule/cost analysis',
    tier: 'advanced',
    unlockedAtLevel: 23,
    isUnlocked: false,
  },
  {
    id: 'engagement_matrix',
    name: 'Stakeholder Engagement Matrix',
    description: 'Current vs desired engagement levels',
    tier: 'advanced',
    unlockedAtLevel: 26,
    isUnlocked: false,
  },
];

const initialState: PMISEvolutionState = {
  currentTier: 'basic',
  features: PMIS_FEATURES,
  upgradeHistory: [],
};

const pmisEvolutionSlice = createSlice({
  name: 'pmisEvolution',
  initialState,
  reducers: {
    // Unlock a specific feature
    unlockFeature: (
      state,
      action: PayloadAction<{ featureId: string; levelId: number }>
    ) => {
      const { featureId, levelId } = action.payload;
      const feature = state.features.find((f) => f.id === featureId);

      if (feature && !feature.isUnlocked) {
        feature.isUnlocked = true;
        state.upgradeHistory.push({
          featureId,
          unlockedAt: Date.now(),
          levelId,
        });

        // Update tier based on unlocked features
        updateTier(state);
      }
    },

    // Unlock all features for a given level
    unlockFeaturesForLevel: (state, action: PayloadAction<number>) => {
      const levelId = action.payload;

      state.features.forEach((feature) => {
        if (!feature.isUnlocked && feature.unlockedAtLevel <= levelId) {
          feature.isUnlocked = true;
          state.upgradeHistory.push({
            featureId: feature.id,
            unlockedAt: Date.now(),
            levelId,
          });
        }
      });

      updateTier(state);
    },

    // Upgrade to a specific tier (unlocks all features up to that tier)
    upgradeTier: (state, action: PayloadAction<PMISTier>) => {
      const targetTier = action.payload;
      const tierOrder: PMISTier[] = ['basic', 'intermediate', 'advanced'];
      const targetIndex = tierOrder.indexOf(targetTier);

      state.features.forEach((feature) => {
        const featureTierIndex = tierOrder.indexOf(feature.tier);
        if (featureTierIndex <= targetIndex && !feature.isUnlocked) {
          feature.isUnlocked = true;
          state.upgradeHistory.push({
            featureId: feature.id,
            unlockedAt: Date.now(),
            levelId: -1, // Manual upgrade
          });
        }
      });

      state.currentTier = targetTier;
    },

    // Reset PMIS evolution state
    resetPMISEvolution: () => initialState,
  },
});

// Helper to update current tier based on unlocked features
function updateTier(state: PMISEvolutionState): void {
  const hasAdvanced = state.features.some(
    (f) => f.tier === 'advanced' && f.isUnlocked
  );
  const hasIntermediate = state.features.some(
    (f) => f.tier === 'intermediate' && f.isUnlocked
  );

  if (hasAdvanced) {
    state.currentTier = 'advanced';
  } else if (hasIntermediate) {
    state.currentTier = 'intermediate';
  } else {
    state.currentTier = 'basic';
  }
}

export const {
  unlockFeature,
  unlockFeaturesForLevel,
  upgradeTier,
  resetPMISEvolution,
} = pmisEvolutionSlice.actions;

// Selectors
export const selectCurrentTier = (state: { pmisEvolution: PMISEvolutionState }) =>
  state.pmisEvolution.currentTier;

export const selectAllFeatures = (state: { pmisEvolution: PMISEvolutionState }) =>
  state.pmisEvolution.features;

export const selectUnlockedFeatures = (state: { pmisEvolution: PMISEvolutionState }) =>
  state.pmisEvolution.features.filter((f) => f.isUnlocked);

export const selectFeaturesByTier = (
  state: { pmisEvolution: PMISEvolutionState },
  tier: PMISTier
) => state.pmisEvolution.features.filter((f) => f.tier === tier);

export const selectIsFeatureUnlocked = (
  state: { pmisEvolution: PMISEvolutionState },
  featureId: string
) => state.pmisEvolution.features.find((f) => f.id === featureId)?.isUnlocked ?? false;

export default pmisEvolutionSlice.reducer;
