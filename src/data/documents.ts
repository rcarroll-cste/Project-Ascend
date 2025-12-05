import { GameDocument } from '../types';

/**
 * Documents for the Files App
 *
 * Level 1: Business_Case.pdf with highlightable "$500k" budget
 * Level 2: Org_Chart with hidden Sarah (Data Privacy Officer)
 */

export const INITIAL_DOCUMENTS: GameDocument[] = [
  // Level 1 Document: Business Case
  {
    id: 'doc_business_case',
    name: 'Business_Case.pdf',
    folder: 'Documents',
    isDiscovered: true, // Available from start (unlocked with Files app)
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
        type: 'text',
        text: 'The current server infrastructure is reaching end-of-life. Maintenance costs have increased 40% year-over-year. A migration to modern infrastructure will reduce operational costs and improve system reliability.',
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
      },
      {
        type: 'text',
        text: '- Expected ROI: 18 months',
      },
      {
        type: 'heading',
        text: '3. Timeline',
      },
      {
        type: 'text',
        text: 'Target completion: Q4 2024',
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

  // Level 2 Document: Org Chart (Hidden Object Hunt)
  {
    id: 'doc_org_chart',
    name: 'Org_Chart.pdf',
    folder: 'OrgCharts',
    isDiscovered: true,
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
        type: 'text',
        text: '├── Director Vane (CEO)',
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
        type: 'text',
        text: '├── Marcus (Head of Legacy Systems)',
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
        evidenceType: 'Regulatory', // Not really evidence, but triggers stakeholder discovery
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
