// =============================================================================
// MENTOS HINT DATABASE
// Contextual hints mapped to level objectives and game states
// =============================================================================

export interface MentosHint {
  id: string;
  text: string;
  priority: 'low' | 'medium' | 'high';
}

// Hints mapped by objective ID
export const OBJECTIVE_HINTS: Record<string, MentosHint> = {
  // =============================================================================
  // PROLOGUE: Day Zero
  // =============================================================================
  archive_personal_files: {
    id: 'hint_archive_personal',
    text: 'Check the Files app for any personal documents left behind. Personal files should be archived, not deleted - we may need them for reference.',
    priority: 'medium',
  },
  find_violation: {
    id: 'hint_find_violation',
    text: 'The Audit Report should contain clues about what went wrong. Look for any unauthorized changes or "gold plating" - adding unrequested features is a common PM pitfall.',
    priority: 'high',
  },
  unlock_project_files: {
    id: 'hint_unlock_files',
    text: 'Project Titan drafts may be locked. Check if there are any access credentials in the emails or documents.',
    priority: 'medium',
  },
  complete_cleanup: {
    id: 'hint_complete_cleanup',
    text: 'Make sure all personal files are archived and the desktop is organized. A clean handoff is essential for project continuity.',
    priority: 'low',
  },

  // =============================================================================
  // LEVEL 1: The Authorization (4.1 Develop Project Charter)
  // =============================================================================
  filter_valid_inputs: {
    id: 'hint_valid_inputs',
    text: 'Remember: The Project Charter needs valid INPUTS. The Business Case and Statement of Work are key inputs, but not everything in your inbox qualifies!',
    priority: 'high',
  },
  highlight_justification: {
    id: 'hint_roi',
    text: 'The Business Case should contain the ROI justification. Look for financial metrics that explain why this project is worth doing.',
    priority: 'medium',
  },
  create_assumption_log: {
    id: 'hint_assumption_log',
    text: 'Is that vendor promise a FACT or an ASSUMPTION? Facts are verified; assumptions need validation. The Assumption Log tracks these uncertainties.',
    priority: 'high',
  },
  draft_charter: {
    id: 'hint_charter_draft',
    text: 'The Charter should include: project purpose, high-level requirements, success criteria, and the PM\'s authority level. Keep it high-level - detailed planning comes later.',
    priority: 'medium',
  },
  resist_pressure: {
    id: 'hint_resist_pressure',
    text: 'Be careful! Spending money or committing resources BEFORE the Charter is approved violates project governance. Politely defer until authorization is official.',
    priority: 'high',
  },

  // =============================================================================
  // LEVEL 2: The Politics (13.1 Identify Stakeholders)
  // =============================================================================
  scan_directory: {
    id: 'hint_scan_directory',
    text: 'The Company Directory is a good starting point, but don\'t assume it lists everyone. Stakeholders can be internal, external, or hidden.',
    priority: 'low',
  },
  tag_stakeholders: {
    id: 'hint_tag_stakeholders',
    text: 'Tag everyone who might be impacted by or can impact the project. It\'s better to over-identify early than miss a key player.',
    priority: 'medium',
  },
  find_hidden_stakeholder: {
    id: 'hint_hidden_stakeholder',
    text: 'Not all stakeholders announce themselves. Check less obvious places - spam folders, CC\'d emails, or referenced names in documents.',
    priority: 'high',
  },
  place_power_interest: {
    id: 'hint_power_interest',
    text: 'The Power/Interest Grid helps prioritize engagement: High Power + High Interest = Manage Closely. Low Power + Low Interest = Monitor.',
    priority: 'medium',
  },
  analyze_salience: {
    id: 'hint_salience',
    text: 'The Salience Model uses three dimensions: Power, Urgency, and Legitimacy. A stakeholder with all three is a "Definitive" stakeholder - highest priority!',
    priority: 'high',
  },
  update_register: {
    id: 'hint_update_register',
    text: 'Stakeholder identification is ITERATIVE. When new stakeholders emerge, add them to the register immediately and assess their influence.',
    priority: 'medium',
  },
};

// Hints for specific game phases/arcs
export const PHASE_HINTS: Record<string, MentosHint> = {
  Initiation: {
    id: 'hint_phase_initiation',
    text: 'The Initiation Phase is about getting formal authorization. No charter = no project. Focus on building a solid foundation before planning begins.',
    priority: 'medium',
  },
  Planning: {
    id: 'hint_phase_planning',
    text: 'Planning is where most of the PM\'s work happens. Rushing through planning leads to problems in execution. Take your time here.',
    priority: 'medium',
  },
};

// General tips that can appear when no specific objective hint is relevant
export const GENERAL_TIPS: MentosHint[] = [
  {
    id: 'tip_wikibok',
    text: 'Not sure about a PM concept? Check WikiBOK for definitions and explanations. Knowledge is power!',
    priority: 'low',
  },
  {
    id: 'tip_processmap',
    text: 'The Process Map shows how PMBOK processes connect. Use it to understand inputs, tools & techniques, and outputs.',
    priority: 'low',
  },
  {
    id: 'tip_triple_constraint',
    text: 'Keep an eye on the AscendTrack panel. Budget, Schedule, and Morale are your key constraints. Balance is everything.',
    priority: 'medium',
  },
  {
    id: 'tip_save_often',
    text: 'Your decisions have consequences. Think before you act - some choices can\'t be undone.',
    priority: 'low',
  },
  {
    id: 'tip_stakeholders',
    text: 'Remember: Stakeholders aren\'t just executives. Anyone impacted by the project - or who can impact it - counts.',
    priority: 'low',
  },
  {
    id: 'tip_ethics',
    text: 'PMI\'s Code of Ethics emphasizes honesty, responsibility, respect, and fairness. Keep these in mind when facing tough decisions.',
    priority: 'medium',
  },
];

// Helper function to get hint for an objective
export const getHintForObjective = (objectiveId: string): MentosHint | null => {
  return OBJECTIVE_HINTS[objectiveId] ?? null;
};

// Helper function to get hint for current phase
export const getHintForPhase = (phase: string): MentosHint | null => {
  return PHASE_HINTS[phase] ?? null;
};

// Helper function to get a random general tip
export const getRandomTip = (): MentosHint => {
  const index = Math.floor(Math.random() * GENERAL_TIPS.length);
  return GENERAL_TIPS[index];
};
