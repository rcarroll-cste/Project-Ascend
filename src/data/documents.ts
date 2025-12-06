import { GameDocument } from '../types';

/**
 * Documents for the Files App
 *
 * Prologue: Audit_Report_Termination.pdf for finding the violation
 * Level 1: Business_Case.pdf with highlightable ROI and budget
 * Level 1: MOU_Client.pdf with deliverables
 * Level 2: Org_Chart with hidden Sarah (Data Privacy Officer)
 */

export const INITIAL_DOCUMENTS: GameDocument[] = [
  // ========================================
  // PROLOGUE: Audit Report (The Clean Up)
  // ========================================
  {
    id: 'doc_audit_report',
    name: 'Audit_Report_Termination.pdf',
    folder: 'Documents',
    isDiscovered: true,
    availableTasks: ['task_prologue_violation'],
    content: [
      {
        type: 'heading',
        text: 'INTERNAL AUDIT REPORT',
      },
      {
        type: 'text',
        text: 'Subject: Termination of Employment - Project Titan PM',
      },
      {
        type: 'text',
        text: 'Date: [REDACTED]',
      },
      {
        type: 'text',
        text: 'Classification: CONFIDENTIAL',
      },
      {
        type: 'heading',
        text: 'Summary of Findings',
      },
      {
        type: 'text',
        text: 'The following issues were identified during the compliance audit of Project Titan:',
      },
      {
        type: 'highlight',
        text: 'Issue 1: The project exceeded its timeline by 3 months due to resource constraints.',
        highlightId: 'hl_timeline_delay',
        isSelectableForTask: true,
        analysisLabel: 'Timeline Issue',
        wrongSelectionReason: 'Timeline delays require schedule recovery but are not policy violations.',
      },
      {
        type: 'highlight',
        text: 'Issue 2: Budget overrun of $50,000 on hardware procurement.',
        highlightId: 'hl_budget_overrun',
        isSelectableForTask: true,
        analysisLabel: 'Budget Issue',
        wrongSelectionReason: 'Budget overruns should trigger Change Requests but this was not the termination cause.',
      },
      {
        type: 'highlight',
        text: 'Issue 3: Team conflict between Development and QA leads.',
        highlightId: 'hl_team_conflict',
        isSelectableForTask: true,
        analysisLabel: 'Team Conflict',
        wrongSelectionReason: 'Conflicts require resolution techniques but are not policy violations.',
      },
      {
        type: 'heading',
        text: 'Critical Policy Violation',
      },
      {
        type: 'highlight',
        text: 'Authorized unapproved scope changes directly from the client without a Change Request.',
        highlightId: 'hl_unauthorized_scope',
        isSelectableForTask: true,
        analysisLabel: 'Scope Violation',
        evidenceType: 'Regulatory',
      },
      {
        type: 'text',
        text: 'This action bypassed the Integrated Change Control process and violated company policy Section 4.6.',
      },
      {
        type: 'heading',
        text: 'Recommendation',
      },
      {
        type: 'text',
        text: 'Immediate termination. All future PMs must follow established change management procedures.',
      },
      {
        type: 'text',
        text: '────────────────────────',
      },
      {
        type: 'text',
        text: 'Signed: Internal Audit Committee',
      },
    ],
  },

  // ========================================
  // LEVEL 1: Business Case (Enhanced)
  // ========================================
  {
    id: 'doc_business_case',
    name: 'Business_Case.pdf',
    folder: 'Documents',
    isDiscovered: true,
    availableTasks: ['task_level1_roi', 'task_level1_budget'],
    content: [
      {
        type: 'heading',
        text: 'SERVER MIGRATION PROJECT',
      },
      {
        type: 'heading',
        text: 'Business Case Summary',
      },
      {
        type: 'text',
        text: 'This document outlines the strategic rationale for migrating our legacy server infrastructure to the new cloud-based platform.',
      },
      {
        type: 'heading',
        text: '1. Executive Summary',
      },
      {
        type: 'highlight',
        text: 'The current server infrastructure is reaching end-of-life. Maintenance costs have increased 40% year-over-year.',
        highlightId: 'hl_maintenance_costs',
        isSelectableForTask: true,
        analysisLabel: 'Current Costs',
        wrongSelectionReason: 'Current costs explain the problem, not the solution\'s value.',
      },
      {
        type: 'text',
        text: 'A migration to modern infrastructure will reduce operational costs and improve system reliability.',
      },
      {
        type: 'heading',
        text: '2. Financial Analysis',
      },
      {
        type: 'text',
        text: 'Projected costs and benefits:',
      },
      {
        type: 'text',
        text: '- Current annual maintenance: $180,000',
      },
      {
        type: 'text',
        text: '- Projected cloud costs: $95,000/year',
      },
      {
        type: 'highlight',
        text: 'Budget: $500,000',
        highlightId: 'ev_budget_500k',
        evidenceType: 'Agreement',
        isSelectableForTask: true,
        analysisLabel: 'Budget',
      },
      {
        type: 'highlight',
        text: 'Expected Return on Investment: 20% over 3 years',
        highlightId: 'hl_roi_20_percent',
        isSelectableForTask: true,
        analysisLabel: 'ROI Justification',
        evidenceType: 'BusinessCase',
      },
      {
        type: 'heading',
        text: '3. Timeline',
      },
      {
        type: 'highlight',
        text: 'Target completion: Q4 2024. Phase 1 (June-Aug), Phase 2 (Sept-Dec).',
        highlightId: 'hl_project_timeline',
        isSelectableForTask: true,
        analysisLabel: 'Timeline',
        wrongSelectionReason: 'The timeline tells us when, not why. Look for financial justification.',
      },
      {
        type: 'text',
        text: 'Critical path dependencies include legacy system documentation and data migration verification.',
      },
      {
        type: 'heading',
        text: '4. Stakeholder Impact',
      },
      {
        type: 'text',
        text: 'All departments will be affected during the migration window. Key stakeholders include IT Operations, Finance (payroll systems), and Compliance.',
      },
    ],
  },

  // ========================================
  // LEVEL 1: MOU Client Agreement (New)
  // ========================================
  {
    id: 'doc_mou_client',
    name: 'MOU_Client.pdf',
    folder: 'Documents',
    isDiscovered: true,
    availableTasks: ['task_level1_deliverables'],
    content: [
      {
        type: 'heading',
        text: 'MEMORANDUM OF UNDERSTANDING',
      },
      {
        type: 'text',
        text: 'Between: Ascend Solutions ("Provider")',
      },
      {
        type: 'text',
        text: 'And: TechCorp Industries ("Client")',
      },
      {
        type: 'heading',
        text: '1. Purpose',
      },
      {
        type: 'text',
        text: 'This MOU establishes the framework for the Server Migration Project engagement between the parties.',
      },
      {
        type: 'heading',
        text: '2. Effective Date',
      },
      {
        type: 'highlight',
        text: 'This agreement becomes effective upon signature by both parties.',
        highlightId: 'hl_effective_date',
        isSelectableForTask: true,
        analysisLabel: 'Effective Date',
        wrongSelectionReason: 'The effective date tells us when the agreement starts, not what must be delivered.',
      },
      {
        type: 'heading',
        text: '3. Deliverables',
      },
      {
        type: 'highlight',
        text: 'The Provider shall deliver: (a) Complete migration of all legacy systems to cloud infrastructure, (b) Data integrity verification reports, (c) Staff training documentation, (d) 90-day post-migration support.',
        highlightId: 'hl_deliverables_section',
        isSelectableForTask: true,
        analysisLabel: 'Deliverables',
        evidenceType: 'Agreement',
      },
      {
        type: 'heading',
        text: '4. Payment Terms',
      },
      {
        type: 'highlight',
        text: 'Payment shall be made in three installments: 30% upon signing, 40% at midpoint, 30% upon completion.',
        highlightId: 'hl_payment_terms',
        isSelectableForTask: true,
        analysisLabel: 'Payment Terms',
        wrongSelectionReason: 'Payment terms are contractual but do not define what must be delivered.',
      },
      {
        type: 'heading',
        text: '5. Signatures',
      },
      {
        type: 'highlight',
        text: 'Director Vane (Ascend Solutions) | John Smith (TechCorp Industries)',
        highlightId: 'hl_signatures',
        isSelectableForTask: true,
        analysisLabel: 'Signatures',
        wrongSelectionReason: 'Signatures authorize the agreement but do not define the deliverables.',
      },
    ],
  },

  // ========================================
  // LEVEL 2: Org Chart (Hidden Object Hunt)
  // ========================================
  {
    id: 'doc_org_chart',
    name: 'Org_Chart.pdf',
    folder: 'OrgCharts',
    isDiscovered: true,
    availableTasks: ['task_level2_hidden_stakeholder'],
    content: [
      {
        type: 'heading',
        text: 'ASCEND SOLUTIONS - ORGANIZATION CHART',
      },
      {
        type: 'text',
        text: 'Executive Team',
      },
      {
        type: 'highlight',
        text: '├── Director Vane (CEO)',
        highlightId: 'hl_vane',
        isSelectableForTask: true,
        analysisLabel: 'CEO',
        wrongSelectionReason: 'Director Vane is the Project Sponsor and already a known stakeholder.',
      },
      {
        type: 'text',
        text: '│   ├── VP Operations',
      },
      {
        type: 'text',
        text: '│   ├── VP Finance',
      },
      {
        type: 'text',
        text: '│   └── VP Technology',
      },
      {
        type: 'text',
        text: '',
      },
      {
        type: 'text',
        text: 'Technology Division',
      },
      {
        type: 'highlight',
        text: '├── Marcus (Head of Legacy Systems)',
        highlightId: 'hl_marcus',
        isSelectableForTask: true,
        analysisLabel: 'IT Director',
        wrongSelectionReason: 'Marcus Chen (IT Director) has already been identified through Chatter.',
      },
      {
        type: 'text',
        text: '├── DevOps Team',
      },
      {
        type: 'text',
        text: '└── Infrastructure Team',
      },
      {
        type: 'text',
        text: '',
      },
      {
        type: 'text',
        text: 'Compliance Division',
      },
      {
        type: 'highlight',
        text: '├── Sarah (Data Privacy Officer)',
        highlightId: 'sh_sarah_discovery',
        evidenceType: 'Regulatory',
        isSelectableForTask: true,
        analysisLabel: 'Data Privacy',
      },
      {
        type: 'text',
        text: '└── Legal Team',
      },
      {
        type: 'text',
        text: '',
      },
      {
        type: 'text',
        text: 'Finance Division',
      },
      {
        type: 'text',
        text: '├── Accounting',
      },
      {
        type: 'text',
        text: '└── Payroll Systems',
      },
    ],
  },

  // Generated Document: Signed Charter (created when player completes Level 1)
  {
    id: 'doc_charter_signed',
    name: 'Project_Charter_Signed.pdf',
    folder: 'Generated',
    isDiscovered: false, // Only appears after player signs the charter
    content: [
      {
        type: 'heading',
        text: 'PROJECT CHARTER',
      },
      {
        type: 'heading',
        text: 'Server Migration Project',
      },
      {
        type: 'text',
        text: 'Status: APPROVED',
      },
      {
        type: 'text',
        text: '',
      },
      {
        type: 'heading',
        text: 'Purpose',
      },
      {
        type: 'text',
        text: '[Populated from player assignment]',
      },
      {
        type: 'heading',
        text: 'Budget',
      },
      {
        type: 'text',
        text: '$500,000',
      },
      {
        type: 'heading',
        text: 'Key Risks',
      },
      {
        type: 'text',
        text: '[Populated from player assignment]',
      },
      {
        type: 'text',
        text: '',
      },
      {
        type: 'text',
        text: '────────────────────────',
      },
      {
        type: 'text',
        text: 'Authorized by: Director Vane',
      },
      {
        type: 'text',
        text: 'Date: [Auto-populated]',
      },
    ],
  },

  // Generated Document: Stakeholder Register (created when player completes Level 2)
  {
    id: 'doc_stakeholder_register',
    name: 'Stakeholder_Register.xlsx',
    folder: 'Generated',
    isDiscovered: false, // Only appears after completing stakeholder analysis
    content: [
      {
        type: 'heading',
        text: 'STAKEHOLDER REGISTER',
      },
      {
        type: 'text',
        text: 'Project: Server Migration',
      },
      {
        type: 'text',
        text: '',
      },
      {
        type: 'text',
        text: '| Name | Role | Power | Interest | Strategy |',
      },
      {
        type: 'text',
        text: '|------|------|-------|----------|----------|',
      },
      {
        type: 'text',
        text: '| Director Vane | Sponsor | High | High | Manage Closely |',
      },
      {
        type: 'text',
        text: '| Marcus | Legacy Systems | High | Low | Keep Satisfied |',
      },
      {
        type: 'text',
        text: '| Sarah | Data Privacy | High | High | Manage Closely |',
      },
    ],
  },
];

// Helper to get document by ID
export function getDocument(id: string): GameDocument | undefined {
  return INITIAL_DOCUMENTS.find((doc) => doc.id === id);
}

// Helper to get documents by folder
export function getDocumentsByFolder(folder: GameDocument['folder']): GameDocument[] {
  return INITIAL_DOCUMENTS.filter((doc) => doc.folder === folder && doc.isDiscovered);
}
