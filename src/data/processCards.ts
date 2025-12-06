import { ProcessCard } from '../types';

/**
 * PMBOK 6th Edition Process Cards
 * Organized by Process Group and Knowledge Area
 *
 * For MVP: Initiating (2) and key Planning processes (10)
 * Full implementation would include all 49 processes
 */

export const PROCESS_CARDS: ProcessCard[] = [
  // ========================================
  // INITIATING PROCESS GROUP (2 processes)
  // ========================================
  {
    id: 'proc_develop_charter',
    name: 'Develop Project Charter',
    processGroup: 'Initiating',
    knowledgeArea: 'Integration Management',
    description:
      'Create the document that formally authorizes the project and gives the PM authority to apply organizational resources.',
    isUnlocked: false,
    levelRequired: 1,
    requiredInputs: [
      {
        id: 'input_business_case',
        name: 'Business Case',
        documentType: 'BusinessCase',
        isRequired: true,
        description: 'Economic feasibility study justifying the project investment',
        qualityImpact: 40,
      },
      {
        id: 'input_agreements',
        name: 'Agreements',
        documentType: 'Agreement',
        isRequired: true,
        description: 'Contracts, MOUs, or SLAs defining initial project intentions',
        qualityImpact: 30,
      },
      {
        id: 'input_assumption_log',
        name: 'Assumption Log',
        documentType: 'AssumptionLog',
        isRequired: false,
        description: 'Factors considered true without proof for planning purposes',
        qualityImpact: 15,
      },
    ],
    optionalInputs: [
      {
        id: 'input_eef',
        name: 'Enterprise Environmental Factors',
        documentType: 'BusinessCase',
        isRequired: false,
        description: 'Organizational culture, market conditions, legal constraints',
        qualityImpact: 10,
      },
    ],
    outputs: [
      {
        id: 'output_charter',
        name: 'Project Charter',
        documentType: 'ProjectCharter',
        templateId: 'template_charter',
        qualityFormula: 'weighted',
      },
      {
        id: 'output_assumption_log_initial',
        name: 'Assumption Log (Initial)',
        documentType: 'AssumptionLog',
        templateId: 'template_assumption_log',
        qualityFormula: 'average',
      },
    ],
    toolsTechniques: ['Expert Judgment', 'Data Gathering', 'Interpersonal Skills', 'Meetings'],
  },
  {
    id: 'proc_identify_stakeholders',
    name: 'Identify Stakeholders',
    processGroup: 'Initiating',
    knowledgeArea: 'Stakeholder Management',
    description:
      'Identify people, groups, or organizations that could impact or be impacted by the project, and analyze their expectations.',
    isUnlocked: false,
    levelRequired: 2,
    requiredInputs: [
      {
        id: 'input_charter_for_stakeholders',
        name: 'Project Charter',
        documentType: 'ProjectCharter',
        isRequired: true,
        description: 'Provides high-level project information and key stakeholder list',
        qualityImpact: 50,
      },
      {
        id: 'input_agreements_stakeholders',
        name: 'Agreements',
        documentType: 'Agreement',
        isRequired: false,
        description: 'Identifies contracting parties and their interests',
        qualityImpact: 25,
      },
    ],
    outputs: [
      {
        id: 'output_stakeholder_register',
        name: 'Stakeholder Register',
        documentType: 'StakeholderRegister',
        templateId: 'template_stakeholder_register',
        qualityFormula: 'average',
      },
    ],
    toolsTechniques: [
      'Expert Judgment',
      'Data Gathering',
      'Data Analysis',
      'Data Representation',
      'Meetings',
    ],
  },

  // ========================================
  // PLANNING PROCESS GROUP (Key processes for MVP)
  // ========================================
  {
    id: 'proc_develop_pm_plan',
    name: 'Develop Project Management Plan',
    processGroup: 'Planning',
    knowledgeArea: 'Integration Management',
    description:
      'Define, prepare, and coordinate all plan components into an integrated project management plan.',
    isUnlocked: false,
    levelRequired: 3,
    requiredInputs: [
      {
        id: 'input_charter_for_plan',
        name: 'Project Charter',
        documentType: 'ProjectCharter',
        isRequired: true,
        description: 'High-level project description and requirements',
        qualityImpact: 30,
      },
      {
        id: 'input_subsidiary_plans',
        name: 'Subsidiary Plans',
        documentType: 'ScopeManagementPlan',
        isRequired: true,
        description: 'Scope, schedule, cost, and other management plans',
        qualityImpact: 50,
      },
    ],
    outputs: [
      {
        id: 'output_pm_plan',
        name: 'Project Management Plan',
        documentType: 'ScopeManagementPlan',
        templateId: 'template_pm_plan',
        qualityFormula: 'weighted',
      },
    ],
    toolsTechniques: ['Expert Judgment', 'Data Gathering', 'Interpersonal Skills', 'Meetings'],
  },
  {
    id: 'proc_plan_scope_mgmt',
    name: 'Plan Scope Management',
    processGroup: 'Planning',
    knowledgeArea: 'Scope Management',
    description:
      'Create a scope management plan that documents how scope will be defined, validated, and controlled.',
    isUnlocked: false,
    levelRequired: 3,
    requiredInputs: [
      {
        id: 'input_charter_for_scope',
        name: 'Project Charter',
        documentType: 'ProjectCharter',
        isRequired: true,
        description: 'High-level scope description',
        qualityImpact: 40,
      },
    ],
    outputs: [
      {
        id: 'output_scope_mgmt_plan',
        name: 'Scope Management Plan',
        documentType: 'ScopeManagementPlan',
        templateId: 'template_scope_mgmt',
        qualityFormula: 'average',
      },
      {
        id: 'output_requirements_mgmt_plan',
        name: 'Requirements Management Plan',
        documentType: 'RequirementsDoc',
        templateId: 'template_req_mgmt',
        qualityFormula: 'average',
      },
    ],
    toolsTechniques: ['Expert Judgment', 'Data Analysis', 'Meetings'],
  },
  {
    id: 'proc_collect_requirements',
    name: 'Collect Requirements',
    processGroup: 'Planning',
    knowledgeArea: 'Scope Management',
    description:
      'Determine, document, and manage stakeholder needs and requirements to meet project objectives.',
    isUnlocked: false,
    levelRequired: 3,
    requiredInputs: [
      {
        id: 'input_charter_for_req',
        name: 'Project Charter',
        documentType: 'ProjectCharter',
        isRequired: true,
        description: 'High-level requirements',
        qualityImpact: 30,
      },
      {
        id: 'input_stakeholder_register_for_req',
        name: 'Stakeholder Register',
        documentType: 'StakeholderRegister',
        isRequired: true,
        description: 'Identifies stakeholders to gather requirements from',
        qualityImpact: 40,
      },
    ],
    outputs: [
      {
        id: 'output_requirements_doc',
        name: 'Requirements Documentation',
        documentType: 'RequirementsDoc',
        templateId: 'template_requirements',
        qualityFormula: 'average',
      },
    ],
    toolsTechniques: [
      'Expert Judgment',
      'Data Gathering',
      'Data Analysis',
      'Decision Making',
      'Interpersonal Skills',
      'Context Diagram',
      'Prototypes',
    ],
  },
  {
    id: 'proc_define_scope',
    name: 'Define Scope',
    processGroup: 'Planning',
    knowledgeArea: 'Scope Management',
    description:
      'Develop a detailed description of the project and product, building on deliverables and acceptance criteria.',
    isUnlocked: false,
    levelRequired: 3,
    requiredInputs: [
      {
        id: 'input_charter_for_define',
        name: 'Project Charter',
        documentType: 'ProjectCharter',
        isRequired: true,
        description: 'High-level scope description',
        qualityImpact: 25,
      },
      {
        id: 'input_requirements_for_scope',
        name: 'Requirements Documentation',
        documentType: 'RequirementsDoc',
        isRequired: true,
        description: 'Detailed requirements to define scope against',
        qualityImpact: 50,
      },
    ],
    outputs: [
      {
        id: 'output_scope_statement',
        name: 'Project Scope Statement',
        documentType: 'ScopeManagementPlan',
        templateId: 'template_scope_statement',
        qualityFormula: 'weighted',
      },
    ],
    toolsTechniques: ['Expert Judgment', 'Data Analysis', 'Decision Making', 'Interpersonal Skills'],
  },
  {
    id: 'proc_create_wbs',
    name: 'Create WBS',
    processGroup: 'Planning',
    knowledgeArea: 'Scope Management',
    description:
      'Subdivide project deliverables and work into smaller, more manageable components.',
    isUnlocked: false,
    levelRequired: 4,
    requiredInputs: [
      {
        id: 'input_scope_statement_for_wbs',
        name: 'Project Scope Statement',
        documentType: 'ScopeManagementPlan',
        isRequired: true,
        description: 'Defines deliverables to decompose',
        qualityImpact: 60,
      },
      {
        id: 'input_requirements_for_wbs',
        name: 'Requirements Documentation',
        documentType: 'RequirementsDoc',
        isRequired: true,
        description: 'Details for work package definition',
        qualityImpact: 30,
      },
    ],
    outputs: [
      {
        id: 'output_wbs',
        name: 'Work Breakdown Structure',
        documentType: 'WBS',
        templateId: 'template_wbs',
        qualityFormula: 'weighted',
      },
      {
        id: 'output_scope_baseline',
        name: 'Scope Baseline',
        documentType: 'ScopeManagementPlan',
        templateId: 'template_scope_baseline',
        qualityFormula: 'average',
      },
    ],
    toolsTechniques: ['Expert Judgment', 'Decomposition'],
  },
  {
    id: 'proc_plan_schedule_mgmt',
    name: 'Plan Schedule Management',
    processGroup: 'Planning',
    knowledgeArea: 'Schedule Management',
    description:
      'Establish policies, procedures, and documentation for planning, developing, managing, executing, and controlling the project schedule.',
    isUnlocked: false,
    levelRequired: 4,
    requiredInputs: [
      {
        id: 'input_charter_for_schedule',
        name: 'Project Charter',
        documentType: 'ProjectCharter',
        isRequired: true,
        description: 'Summary milestone schedule',
        qualityImpact: 30,
      },
      {
        id: 'input_scope_mgmt_for_schedule',
        name: 'Scope Management Plan',
        documentType: 'ScopeManagementPlan',
        isRequired: true,
        description: 'Defines how scope affects schedule',
        qualityImpact: 40,
      },
    ],
    outputs: [
      {
        id: 'output_schedule_mgmt_plan',
        name: 'Schedule Management Plan',
        documentType: 'Schedule',
        templateId: 'template_schedule_mgmt',
        qualityFormula: 'average',
      },
    ],
    toolsTechniques: ['Expert Judgment', 'Data Analysis', 'Meetings'],
  },
  {
    id: 'proc_identify_risks',
    name: 'Identify Risks',
    processGroup: 'Planning',
    knowledgeArea: 'Risk Management',
    description:
      'Identify individual project risks as well as sources of overall project risk, documenting their characteristics.',
    isUnlocked: false,
    levelRequired: 3,
    requiredInputs: [
      {
        id: 'input_requirements_for_risk',
        name: 'Requirements Documentation',
        documentType: 'RequirementsDoc',
        isRequired: true,
        description: 'Requirements can reveal risks',
        qualityImpact: 30,
      },
      {
        id: 'input_stakeholder_register_for_risk',
        name: 'Stakeholder Register',
        documentType: 'StakeholderRegister',
        isRequired: true,
        description: 'Stakeholders may identify risks',
        qualityImpact: 25,
      },
      {
        id: 'input_assumption_log_for_risk',
        name: 'Assumption Log',
        documentType: 'AssumptionLog',
        isRequired: true,
        description: 'Assumptions can become risks if incorrect',
        qualityImpact: 35,
      },
    ],
    outputs: [
      {
        id: 'output_risk_register',
        name: 'Risk Register',
        documentType: 'RiskRegister',
        templateId: 'template_risk_register',
        qualityFormula: 'average',
      },
    ],
    toolsTechniques: [
      'Expert Judgment',
      'Data Gathering',
      'Data Analysis',
      'Interpersonal Skills',
      'Prompt Lists',
    ],
  },
  {
    id: 'proc_plan_stakeholder_engagement',
    name: 'Plan Stakeholder Engagement',
    processGroup: 'Planning',
    knowledgeArea: 'Stakeholder Management',
    description:
      'Develop approaches to involve project stakeholders based on their needs, expectations, interests, and potential impact.',
    isUnlocked: false,
    levelRequired: 3,
    requiredInputs: [
      {
        id: 'input_charter_for_engagement',
        name: 'Project Charter',
        documentType: 'ProjectCharter',
        isRequired: true,
        description: 'Key stakeholder information',
        qualityImpact: 25,
      },
      {
        id: 'input_stakeholder_register_for_engagement',
        name: 'Stakeholder Register',
        documentType: 'StakeholderRegister',
        isRequired: true,
        description: 'Full stakeholder analysis',
        qualityImpact: 50,
      },
    ],
    outputs: [
      {
        id: 'output_stakeholder_engagement_plan',
        name: 'Stakeholder Engagement Plan',
        documentType: 'StakeholderRegister',
        templateId: 'template_engagement_plan',
        qualityFormula: 'weighted',
      },
    ],
    toolsTechniques: [
      'Expert Judgment',
      'Data Gathering',
      'Data Analysis',
      'Decision Making',
      'Meetings',
    ],
  },
];

// Helper functions
export function getProcessesByGroup(
  group: ProcessCard['processGroup']
): ProcessCard[] {
  return PROCESS_CARDS.filter((p) => p.processGroup === group);
}

export function getProcessesByKnowledgeArea(knowledgeArea: string): ProcessCard[] {
  return PROCESS_CARDS.filter((p) => p.knowledgeArea === knowledgeArea);
}

export function getUnlockedProcesses(unlockedIds: string[]): ProcessCard[] {
  return PROCESS_CARDS.filter((p) => unlockedIds.includes(p.id));
}

export function getProcessById(id: string): ProcessCard | undefined {
  return PROCESS_CARDS.find((p) => p.id === id);
}

export function getProcessesForLevel(level: number): ProcessCard[] {
  return PROCESS_CARDS.filter((p) => p.levelRequired <= level);
}

// Process Group Colors for UI
export const PROCESS_GROUP_COLORS: Record<ProcessCard['processGroup'], { bg: string; border: string; text: string }> = {
  Initiating: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  Planning: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  Executing: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  Monitoring: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  Closing: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
};
