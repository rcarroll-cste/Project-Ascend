import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PMISState, AssumptionEntry, PowerLevel, InterestLevel } from '../types';
import { INITIAL_STAKEHOLDERS, INITIAL_CHARTER_SECTIONS } from '../data/initialData';

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
        // Logic to check if placement is correct could happen here or in middleware/component
        // For now, we just update the "player's understanding" or the game state
        // If we want to track "analyzed" state separately:
        stakeholder.power = action.payload.power;
        stakeholder.interest = action.payload.interest;
        stakeholder.isAnalyzed = true; // Mark as analyzed once placed
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
    }
  },
});

export const {
  identifyStakeholder,
  updateStakeholderPosition,
  assignEvidenceToSection,
  addAssumptionEntry,
  classifyAssumption
} = pmisSlice.actions;

export default pmisSlice.reducer;