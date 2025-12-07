import { DocumentAnalysisTask } from '../types';

/**
 * Document Analysis Tasks
 * Defines the interactive analysis prompts for each level
 * Based on GDD v4.0 Level Design
 */

export const DOCUMENT_TASKS: DocumentAnalysisTask[] = [
  // ========================================
  // PROLOGUE: Day Zero - "The Clean Up"
  // ========================================
  {
    id: 'task_prologue_violation',
    documentId: 'doc_audit_report',
    taskType: 'find_violation',
    promptText: 'Highlight the specific violation that led to termination.',
    hintText: 'Look for unauthorized changes to project scope.',
    correctHighlightIds: ['hl_unauthorized_scope'],
    incorrectFeedback: {
      hl_timeline_delay:
        'Timeline delays are concerning, but they require schedule recovery - not termination. Look for a policy violation.',
      hl_budget_overrun:
        'Budget overruns should trigger Change Requests, but this was not the firing offense. What did the PM do without authorization?',
      hl_team_conflict:
        'Team conflicts require conflict resolution techniques, but this is not a policy violation.',
    },
    defaultIncorrectMessage:
      'This section does not describe the policy violation. Look for actions taken without proper authorization through the Change Control process.',
    successFeedback:
      'Correct! Unauthorized Scope Change (Gold Plating) is a violation of PMBOK standards. All changes must go through the Integrated Change Control process, regardless of who requests them.',
    isCompleted: false,
    levelId: 0,
    consequence: {
      type: 'complete_objective',
      payload: { objectiveId: 'obj_understand_violation' },
    },
  },

  // ========================================
  // LEVEL 1: The Handover - "The Intern's Trial"
  // ========================================
  {
    id: 'task_level1_roi',
    documentId: 'doc_business_case',
    taskType: 'find_justification',
    promptText:
      'The Sponsor needs to know the economic feasibility. Highlight the Justification.',
    hintText:
      'Economic feasibility is often expressed as Return on Investment (ROI) or payback period.',
    correctHighlightIds: ['hl_roi_20_percent'],
    incorrectFeedback: {
      ev_budget_500k:
        'The budget is the cost of the project, not the justification. The justification explains why the investment is worth making.',
      hl_maintenance_costs:
        'Current maintenance costs explain the problem, but not the value of the solution. Look for the expected return.',
      hl_project_timeline:
        'The timeline tells us when, not why. What financial benefit justifies this project?',
    },
    defaultIncorrectMessage:
      'The Business Case justification should explain the expected return on the investment. Look for ROI, NPV, or similar financial metrics.',
    successFeedback:
      'Correct! The Business Case provides the necessary information from a business standpoint to determine if expected outcomes justify the investment. The 20% ROI is the economic justification.',
    isCompleted: false,
    levelId: 1,
    consequence: {
      type: 'extract_evidence',
      payload: { evidenceId: 'ev_roi_justification' },
    },
  },
  {
    id: 'task_level1_budget',
    documentId: 'doc_business_case',
    taskType: 'find_budget',
    promptText: 'The Financial Redline Protocol: Find the AUTHORIZED budget cap for the Charter.',
    hintText: 'Director Vane requested $500k, but the Business Case defines a maximum investment to maintain positive ROI. Look for investment constraints.',
    correctHighlightIds: ['ev_budget_350k'],
    incorrectFeedback: {
      ev_budget_500k:
        'Careful! This is Director Vane\'s request, not the authorized amount. The Business Case defines a maximum investment to maintain positive ROI. Keep reading!',
      hl_roi_20_percent:
        'ROI is the return metric, not the budget cap. What is the maximum authorized investment?',
      hl_maintenance_costs:
        'These are current costs, not the new project budget.',
    },
    defaultIncorrectMessage:
      'Look for the maximum authorized investment that maintains positive ROI. Director Vane\'s request may exceed this limit.',
    successFeedback:
      'Correct! The Business Case caps the budget at $350,000 to maintain positive ROI. Using Vane\'s $500k request would violate financial policy. This is the "Redline Protocol" - always verify budget against the Business Case!',
    isCompleted: false,
    levelId: 1,
    unlockCondition: 'task_level1_roi',
    consequence: {
      type: 'extract_evidence',
      payload: { evidenceId: 'ev_budget_350k' },
    },
  },
  {
    id: 'task_level1_deliverables',
    documentId: 'doc_mou_client',
    taskType: 'find_deliverables',
    promptText:
      'We are working with an external client. Find the binding conditions.',
    hintText:
      'Agreements define what the project must deliver. Look for the Deliverables section.',
    correctHighlightIds: ['hl_deliverables_section'],
    incorrectFeedback: {
      hl_payment_terms:
        'Payment terms are contractual but do not define what must be delivered.',
      hl_signatures:
        'Signatures authorize the agreement but do not define the deliverables.',
      hl_effective_date:
        'The effective date tells us when, not what. Look for the specific outputs the project must produce.',
    },
    defaultIncorrectMessage:
      'Look for the section that describes what the project must produce or deliver to the client.',
    successFeedback:
      'Correct! Agreements define the initial intentions for a project and can be contracts, MOUs, or service level agreements. The Deliverables section defines binding conditions.',
    isCompleted: false,
    levelId: 1,
    consequence: {
      type: 'extract_evidence',
      payload: { evidenceId: 'ev_mou_deliverables' },
    },
  },

  // ========================================
  // LEVEL 1: Strategic Alignment Check
  // ========================================
  {
    id: 'task_level1_strategy',
    documentId: 'doc_benefits_plan',
    taskType: 'find_justification',
    promptText: 'Director Vane wants to add a "Customer Loyalty Module". Verify the project\'s strategic focus.',
    hintText: 'The Benefits Management Plan defines what type of strategic benefits this project should deliver. Is customer loyalty within scope?',
    correctHighlightIds: ['hl_strategic_focus'],
    incorrectFeedback: {
      hl_primary_benefit:
        'This describes a specific benefit, not the strategic focus. The strategic focus tells us what type of value we\'re pursuing.',
      hl_out_of_scope:
        'Good instinct! This confirms what\'s excluded. But first, find what the strategic focus actually IS.',
    },
    defaultIncorrectMessage:
      'The Benefits Management Plan defines the strategic direction. Look for the section that states what type of value this project should deliver.',
    successFeedback:
      'Correct! The strategic focus is "Internal Operational Efficiency and Cost Reduction" - NOT customer growth. Adding a Customer Loyalty Module would be a strategic misalignment. The Benefits Management Plan governs what the project should achieve!',
    isCompleted: false,
    levelId: 1,
    consequence: {
      type: 'complete_objective',
      payload: { objectiveId: 'verify_strategic_alignment' },
    },
  },

  // ========================================
  // LEVEL 2: Who's Who - "The New Kid"
  // ========================================
  {
    id: 'task_level2_hidden_stakeholder',
    documentId: 'doc_org_chart',
    taskType: 'find_stakeholder',
    promptText:
      'Someone in this organization chart may have been overlooked. Find the missing stakeholder.',
    hintText:
      'Compliance and regulatory roles are often overlooked in IT projects. Who handles data privacy?',
    correctHighlightIds: ['sh_sarah_discovery'],
    incorrectFeedback: {
      hl_vane:
        'Director Vane is the Project Sponsor and already a known stakeholder.',
      hl_marcus:
        'Marcus Chen (IT Director) has already been identified through Chatter.',
      hl_ceo:
        'The CEO is typically engaged only for strategic decisions, not day-to-day project involvement.',
    },
    defaultIncorrectMessage:
      'This person is already on your stakeholder list or not directly impacted. Look for someone with regulatory or compliance responsibilities.',
    successFeedback:
      'New stakeholder discovered! Sarah Chen (Data Privacy Officer) may have critical compliance requirements for your project. Remember: Stakeholder Identification is an iterative process - new stakeholders can emerge at any time.',
    isCompleted: false,
    levelId: 2,
    consequence: {
      type: 'identify_stakeholder',
      payload: { stakeholderId: 'sh_sarah', contactId: 'contact_sarah' },
    },
  },
];

// Helper functions
export function getTasksForDocument(documentId: string): DocumentAnalysisTask[] {
  return DOCUMENT_TASKS.filter((t) => t.documentId === documentId);
}

export function getTasksForLevel(levelId: number): DocumentAnalysisTask[] {
  return DOCUMENT_TASKS.filter((t) => t.levelId === levelId);
}

export function getActiveTaskForDocument(
  documentId: string,
  currentLevel: number,
  completedTasks: string[],
  completedObjectives: Record<string, boolean>
): DocumentAnalysisTask | null {
  const documentTasks = getTasksForDocument(documentId);

  return (
    documentTasks.find((task) => {
      // Skip completed tasks
      if (completedTasks.includes(task.id)) return false;

      // Check level requirement
      if (task.levelId > currentLevel) return false;

      // Check unlock condition
      if (task.unlockCondition) {
        // Check if it's a task ID or objective ID
        const isTaskUnlocked = completedTasks.includes(task.unlockCondition);
        const isObjectiveUnlocked = completedObjectives[task.unlockCondition];
        if (!isTaskUnlocked && !isObjectiveUnlocked) return false;
      }

      return true;
    }) || null
  );
}

export function getTaskById(taskId: string): DocumentAnalysisTask | undefined {
  return DOCUMENT_TASKS.find((t) => t.id === taskId);
}

// Educational content for feedback
export const EDUCATIONAL_CONTENT: Record<string, string> = {
  find_violation:
    'The PMBOK Guide emphasizes that ALL changes must go through the Integrated Change Control process (4.6). Even if a client or sponsor requests a change directly, the PM must document it as a Change Request and have it reviewed by the Change Control Board (CCB).',
  find_justification:
    'The Business Case (PMBOK 1.2.6.1) documents the economic feasibility of the project. It typically includes NPV, ROI, payback period, or benefit-cost ratio. Without a valid Business Case, the project should not be authorized.',
  find_deliverables:
    'Agreements (PMBOK 4.1.1.3) are inputs to the Develop Project Charter process. They define the initial intentions for a project undertaken for an external customer and may include contracts, MOUs, letters of intent, or SLAs.',
  find_stakeholder:
    'Stakeholder Identification (PMBOK 13.1) is performed iteratively throughout the project. New stakeholders can emerge at any phase, especially when regulatory requirements change or new team members join.',
  find_budget:
    'The Project Budget, as authorized in the Charter, defines the spending authority for the project. The "Financial Redline Protocol" requires verifying the budget against the Business Case\'s ROI constraints. A sponsor may request more than the authorized amount - the PM must use the Business Case to determine the correct cap.',
  strategic_alignment:
    'The Benefits Management Plan (PMBOK 1.2.6.2) defines the target benefits and strategic alignment of the project. Adding features outside the strategic focus (e.g., Customer Loyalty when the focus is Internal Efficiency) constitutes "scope creep" and requires a formal Change Request to the strategic objectives.',
};
