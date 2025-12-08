import { GameLevel, LevelObjective } from '../types';

// =============================================================================
// LEVEL DEFINITIONS - GDD v4.0 (Demo Scope)
// =============================================================================

// Helper to create objectives
const objective = (id: string, description: string): LevelObjective => ({
  id,
  description,
  isCompleted: false,
});

// =============================================================================
// LEVEL 1: The Authorization (4.1 Develop Project Charter)
// =============================================================================
export const LEVEL_01_CHARTER: GameLevel = {
  id: 1,
  arc: 'Arc1_Initiation',
  processCode: '4.1',
  processGroup: 'Initiating',
  knowledgeArea: 'Integration',
  narrativeTitle: 'The Authorization',
  description: 'Formally authorize the project by developing the Project Charter.',

  learningObjectives: [
    'Distinguish between Business Case and Project Charter',
    'Understand valid inputs for charter development',
    'Learn the purpose and contents of the Assumption Log',
    'Recognize that the Charter grants authority to apply resources',
  ],
  examQuestionIds: ['exam_1_1', 'exam_1_2', 'exam_1_3', 'exam_1_4', 'exam_1_5'],

  requiredInputDocuments: ['business_case', 'sow_draft'],
  outputDocuments: ['project_charter', 'assumption_log'],

  prerequisiteLevelId: null,
  unlocksApps: ['pmis'],
  unlocksProcesses: ['4.1_develop_charter'],

  objectives: [
    objective('filter_valid_inputs', 'Identify valid inputs for the Charter'),
    objective('highlight_justification', 'Find the ROI justification in the Business Case'),
    objective('create_assumption_log', 'Correctly classify the vendor promise'),
    objective('draft_charter', 'Complete the Project Charter with appropriate detail'),
    objective('resist_pressure', 'Avoid unauthorized spending before Charter approval'),
  ],

  introDialogueId: 'dialogue_vane_charter_intro',
  outroDialogueId: 'dialogue_vane_charter_complete',
};

// =============================================================================
// LEVEL 2: The Politics (13.1 Identify Stakeholders)
// =============================================================================
export const LEVEL_02_STAKEHOLDERS: GameLevel = {
  id: 2,
  arc: 'Arc1_Initiation',
  processCode: '13.1',
  processGroup: 'Initiating',
  knowledgeArea: 'Stakeholder',
  narrativeTitle: 'The Politics',
  description: 'Identify all stakeholders who impact or are impacted by the project.',

  learningObjectives: [
    'Apply the Power/Interest Grid for stakeholder classification',
    'Understand the Salience Model (Power, Urgency, Legitimacy)',
    'Recognize that stakeholder identification is iterative',
    'Learn to discover hidden stakeholders',
  ],
  examQuestionIds: ['exam_2_1', 'exam_2_2', 'exam_2_3', 'exam_2_4', 'exam_2_5'],

  requiredInputDocuments: ['project_charter', 'company_directory'],
  outputDocuments: ['stakeholder_register'],

  prerequisiteLevelId: 1,
  unlocksApps: ['email'],
  unlocksProcesses: ['13.1_identify_stakeholders'],

  objectives: [
    objective('scan_directory', 'Review the Company Directory for stakeholders'),
    objective('tag_stakeholders', 'Tag all visible stakeholders'),
    objective('find_hidden_stakeholder', 'Discover the hidden stakeholder in the spam folder'),
    objective('place_power_interest', 'Correctly place stakeholders on the Power/Interest Grid'),
    objective('analyze_salience', 'Apply the Salience Model to the Union Representative'),
    objective('update_register', 'Update the register when new stakeholder appears'),
  ],

  introDialogueId: 'dialogue_vane_stakeholders_intro',
  outroDialogueId: 'dialogue_vane_stakeholders_complete',
};

// =============================================================================
// ALL LEVELS ARRAY (Demo Scope: Levels 1-2)
// =============================================================================

export const ALL_LEVELS: GameLevel[] = [
  LEVEL_01_CHARTER,
  LEVEL_02_STAKEHOLDERS,
];

// Helper functions
export const getLevelById = (id: number): GameLevel | undefined =>
  ALL_LEVELS.find(level => level.id === id);

export const getLevelsByArc = (arc: string): GameLevel[] =>
  ALL_LEVELS.filter(level => level.arc === arc);

export const getNextLevel = (currentLevelId: number): GameLevel | undefined =>
  ALL_LEVELS.find(level => level.prerequisiteLevelId === currentLevelId);
