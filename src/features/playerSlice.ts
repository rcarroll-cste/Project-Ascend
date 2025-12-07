import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// =============================================================================
// PLAYER IDENTITY STATE (GDD v4.3 - Onboarding)
// =============================================================================

export type AvatarArchetype = 'coordinator' | 'strategist' | 'innovator' | 'mentor' | 'achiever' | 'diplomat';

export interface PlayerState {
  // Identity
  name: string;
  avatarId: AvatarArchetype | null;
  title: string;

  // Onboarding Progress
  onboardingStage: 'hr_portal' | 'avatar_select' | 'badge_gen' | 'complete';
  badgeGenerated: boolean;

  // Demo Metrics (for Gate Review endings)
  authorityLevel: number;           // 0-100, fills when Charter is signed
  stakeholderSentiment: number;     // 0-100, aggregate stakeholder mood
  riskLevel: 'green' | 'amber' | 'red';

  // Tracking for Demo Endings
  charterCompleted: boolean;
  assumptionLogEntries: number;
  stakeholdersIdentified: number;
  stakeholdersCorrectlyClassified: number;
  relationshipScore: number;        // 0-100, how well player handled Chatter
  conflictResolutions: { type: 'collaborate' | 'force' | 'withdraw'; count: number }[];
}

// Avatar definitions - Cartoon-friendly professional headshots
export interface AvatarDefinition {
  id: AvatarArchetype;
  name: string;
  role: string;
  description: string;
  // Cartoon avatar styling
  skinTone: string;
  hairColor: string;
  hairStyle: 'short' | 'medium' | 'long' | 'bald' | 'curly' | 'ponytail';
  accessory: 'glasses' | 'headset' | 'none' | 'earrings';
  outfit: string;
  outfitColor: string;
  expression: 'friendly' | 'confident' | 'thoughtful' | 'warm';
}

export const AVATARS: Record<AvatarArchetype, AvatarDefinition> = {
  coordinator: {
    id: 'coordinator',
    name: 'Alex Chen',
    role: 'Project Coordinator',
    description: 'Organized and detail-oriented, keeps everything on track.',
    skinTone: '#F5D0C5',
    hairColor: '#2C1810',
    hairStyle: 'short',
    accessory: 'headset',
    outfit: 'polo',
    outfitColor: '#3B82F6',
    expression: 'friendly',
  },
  strategist: {
    id: 'strategist',
    name: 'Jordan Williams',
    role: 'Business Analyst',
    description: 'Big-picture thinker who connects the dots.',
    skinTone: '#8D5524',
    hairColor: '#1a1a1a',
    hairStyle: 'curly',
    accessory: 'glasses',
    outfit: 'blazer',
    outfitColor: '#1E3A5F',
    expression: 'confident',
  },
  innovator: {
    id: 'innovator',
    name: 'Sam Rivera',
    role: 'Tech Lead',
    description: 'Creative problem-solver with fresh ideas.',
    skinTone: '#C68642',
    hairColor: '#4A3728',
    hairStyle: 'medium',
    accessory: 'none',
    outfit: 'hoodie',
    outfitColor: '#7C3AED',
    expression: 'thoughtful',
  },
  mentor: {
    id: 'mentor',
    name: 'Dr. Pat Morrison',
    role: 'Senior Consultant',
    description: 'Experienced guide who\'s seen it all.',
    skinTone: '#FFDBAC',
    hairColor: '#9CA3AF',
    hairStyle: 'short',
    accessory: 'glasses',
    outfit: 'cardigan',
    outfitColor: '#059669',
    expression: 'warm',
  },
  achiever: {
    id: 'achiever',
    name: 'Morgan Taylor',
    role: 'Scrum Master',
    description: 'Results-driven and always hitting targets.',
    skinTone: '#F1C27D',
    hairColor: '#B45309',
    hairStyle: 'ponytail',
    accessory: 'earrings',
    outfit: 'blazer',
    outfitColor: '#DC2626',
    expression: 'confident',
  },
  diplomat: {
    id: 'diplomat',
    name: 'Casey Okonkwo',
    role: 'Stakeholder Manager',
    description: 'Builds bridges and navigates politics with ease.',
    skinTone: '#6F4E37',
    hairColor: '#1a1a1a',
    hairStyle: 'bald',
    accessory: 'none',
    outfit: 'suit',
    outfitColor: '#374151',
    expression: 'friendly',
  },
};

const initialState: PlayerState = {
  // Identity
  name: '',
  avatarId: null,
  title: 'Junior Project Manager',

  // Onboarding Progress
  onboardingStage: 'hr_portal',
  badgeGenerated: false,

  // Demo Metrics
  authorityLevel: 0,
  stakeholderSentiment: 50,
  riskLevel: 'green',

  // Tracking for Demo Endings
  charterCompleted: false,
  assumptionLogEntries: 0,
  stakeholdersIdentified: 0,
  stakeholdersCorrectlyClassified: 0,
  relationshipScore: 50,
  conflictResolutions: [],
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // =========================================================================
    // ONBOARDING ACTIONS
    // =========================================================================
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },

    setAvatar: (state, action: PayloadAction<AvatarArchetype>) => {
      state.avatarId = action.payload;
    },

    advanceOnboarding: (state) => {
      switch (state.onboardingStage) {
        case 'hr_portal':
          state.onboardingStage = 'avatar_select';
          break;
        case 'avatar_select':
          state.onboardingStage = 'badge_gen';
          break;
        case 'badge_gen':
          state.onboardingStage = 'complete';
          state.badgeGenerated = true;
          break;
      }
    },

    completeOnboarding: (state) => {
      state.onboardingStage = 'complete';
      state.badgeGenerated = true;
    },

    // =========================================================================
    // DEMO METRIC ACTIONS
    // =========================================================================
    setAuthorityLevel: (state, action: PayloadAction<number>) => {
      state.authorityLevel = Math.max(0, Math.min(100, action.payload));
    },

    grantFullAuthority: (state) => {
      state.authorityLevel = 100;
      state.charterCompleted = true;
    },

    updateStakeholderSentiment: (state, action: PayloadAction<number>) => {
      state.stakeholderSentiment = Math.max(0, Math.min(100, state.stakeholderSentiment + action.payload));
    },

    setRiskLevel: (state, action: PayloadAction<'green' | 'amber' | 'red'>) => {
      state.riskLevel = action.payload;
    },

    // =========================================================================
    // TRACKING ACTIONS (For Demo Endings)
    // =========================================================================
    incrementAssumptionLog: (state) => {
      state.assumptionLogEntries += 1;
    },

    identifyStakeholder: (state) => {
      state.stakeholdersIdentified += 1;
    },

    correctlyClassifyStakeholder: (state) => {
      state.stakeholdersCorrectlyClassified += 1;
    },

    updateRelationshipScore: (state, action: PayloadAction<number>) => {
      state.relationshipScore = Math.max(0, Math.min(100, state.relationshipScore + action.payload));
    },

    recordConflictResolution: (state, action: PayloadAction<'collaborate' | 'force' | 'withdraw'>) => {
      const existing = state.conflictResolutions.find(c => c.type === action.payload);
      if (existing) {
        existing.count += 1;
      } else {
        state.conflictResolutions.push({ type: action.payload, count: 1 });
      }

      // Update relationship score based on resolution type
      if (action.payload === 'collaborate') {
        state.relationshipScore = Math.min(100, state.relationshipScore + 10);
      } else if (action.payload === 'force') {
        state.relationshipScore = Math.max(0, state.relationshipScore - 15);
      } else if (action.payload === 'withdraw') {
        state.relationshipScore = Math.max(0, state.relationshipScore - 5);
      }
    },

    // =========================================================================
    // RESET
    // =========================================================================
    resetPlayer: () => initialState,
  },
});

export const {
  // Onboarding
  setPlayerName,
  setAvatar,
  advanceOnboarding,
  completeOnboarding,
  // Demo Metrics
  setAuthorityLevel,
  grantFullAuthority,
  updateStakeholderSentiment,
  setRiskLevel,
  // Tracking
  incrementAssumptionLog,
  identifyStakeholder,
  correctlyClassifyStakeholder,
  updateRelationshipScore,
  recordConflictResolution,
  // Reset
  resetPlayer,
} = playerSlice.actions;

// Selectors
export const selectPlayerName = (state: { player: PlayerState }) => state.player.name;
export const selectPlayerAvatar = (state: { player: PlayerState }) =>
  state.player.avatarId ? AVATARS[state.player.avatarId] : null;
export const selectOnboardingStage = (state: { player: PlayerState }) => state.player.onboardingStage;
export const selectIsOnboardingComplete = (state: { player: PlayerState }) =>
  state.player.onboardingStage === 'complete';
export const selectAuthorityLevel = (state: { player: PlayerState }) => state.player.authorityLevel;
export const selectHasAuthority = (state: { player: PlayerState }) => state.player.authorityLevel >= 100;

// Demo Ending Calculation
export type DemoEnding = 'false_start' | 'paper_pusher' | 'initiator';

export const selectDemoEnding = (state: { player: PlayerState }): DemoEnding => {
  const p = state.player;

  // False Start: Charter done but missing assumptions or stakeholders
  if (p.charterCompleted && (p.assumptionLogEntries === 0 || p.stakeholdersIdentified < 3)) {
    return 'false_start';
  }

  // Paper Pusher: Documents correct but poor relationships
  if (p.charterCompleted && p.assumptionLogEntries > 0 && p.stakeholdersIdentified >= 3 && p.relationshipScore < 50) {
    return 'paper_pusher';
  }

  // Initiator: Everything done well
  return 'initiator';
};

export default playerSlice.reducer;
