import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PMISState, AssumptionEntry, PowerLevel, InterestLevel, StakeholderAttitude, Stakeholder } from '../types';
import { INITIAL_STAKEHOLDERS, INITIAL_CHARTER_SECTIONS, DECOMPOSITION_MAPPINGS } from '../data/initialData';

const initialState: PMISState = {
  stakeholders: INITIAL_STAKEHOLDERS,
  charterSections: INITIAL_CHARTER_SECTIONS,
  assumptionLog: [],
};

const pmisSlice = createSlice({
  name: 'pmis',
  initialState,
  reducers: {
    // Stakeholder Management
    identifyStakeholder: (state, action: PayloadAction<string>) => {
      const stakeholder = state.stakeholders.find(s => s.id === action.payload);
      if (stakeholder) {
        stakeholder.isIdentified = true;
      }
    },
    updateStakeholderPosition: (state, action: PayloadAction<{ id: string; power: PowerLevel; interest: InterestLevel }>) => {
      const stakeholder = state.stakeholders.find(s => s.id === action.payload.id);
      if (stakeholder) {
        // Track what the player placed (for display)
        stakeholder.power = action.payload.power;
        stakeholder.interest = action.payload.interest;
        stakeholder.isAnalyzed = true;
        // Validation feedback is shown via notifications in the PMISApp handler
      }
    },
    // Action to check if a placement is correct (returns via selector)
    analyzeStakeholderCorrectly: (state, action: PayloadAction<{ id: string }>) => {
      const stakeholder = state.stakeholders.find(s => s.id === action.payload.id);
      if (stakeholder) {
        stakeholder.isAnalyzed = true;
      }
    },
    updateStakeholderAttitude: (state, action: PayloadAction<{ id: string; attitude: StakeholderAttitude }>) => {
      const stakeholder = state.stakeholders.find(s => s.id === action.payload.id);
      if (stakeholder) {
        stakeholder.attitude = action.payload.attitude;
      }
    },

    // Charter Management
    assignEvidenceToSection: (state, action: PayloadAction<{ sectionId: string; evidenceId: string | null }>) => {
      const section = state.charterSections.find(s => s.id === action.payload.sectionId);
      if (section && !section.isLocked) {
        section.assignedItemId = action.payload.evidenceId;
      }
    },

    // Assumption Log Management
    addAssumptionEntry: (state, action: PayloadAction<AssumptionEntry>) => {
        state.assumptionLog.push(action.payload);
    },
    classifyAssumption: (state, action: PayloadAction<{ id: string; category: 'Fact' | 'Assumption' | 'Risk' }>) => {
        const entry = state.assumptionLog.find(e => e.id === action.payload.id);
        if (entry) {
            entry.category = action.payload.category;
            // Logic to verify correctness would go here or be pre-calculated
        }
    },

    // GDD v3.3 Phase 3: Decompose Tool
    // Breaks a broad stakeholder group into specific categories
    decomposeStakeholder: (state, action: PayloadAction<string>) => {
      const parentId = action.payload;
      const parent = state.stakeholders.find(s => s.id === parentId);

      if (!parent || !parent.isDecomposable) return;

      // Get the child stakeholders from the mapping
      const mapping = DECOMPOSITION_MAPPINGS[parentId];
      if (!mapping) return;

      // Remove the parent stakeholder
      state.stakeholders = state.stakeholders.filter(s => s.id !== parentId);

      // Add the child stakeholders
      mapping.children.forEach((child: Stakeholder) => {
        // Only add if not already present
        if (!state.stakeholders.find(s => s.id === child.id)) {
          state.stakeholders.push({
            ...child,
            parentStakeholderId: parentId,
            isIdentified: true, // Children are automatically identified when decomposed
          });
        }
      });
    },

    // Add a new stakeholder (used for late-arriving stakeholders in Level 2)
    addStakeholder: (state, action: PayloadAction<Stakeholder>) => {
      if (!state.stakeholders.find(s => s.id === action.payload.id)) {
        state.stakeholders.push(action.payload);
      }
    },
  },
});

export const {
  identifyStakeholder,
  updateStakeholderPosition,
  analyzeStakeholderCorrectly,
  updateStakeholderAttitude,
  assignEvidenceToSection,
  addAssumptionEntry,
  classifyAssumption,
  decomposeStakeholder,
  addStakeholder,
} = pmisSlice.actions;

export default pmisSlice.reducer;