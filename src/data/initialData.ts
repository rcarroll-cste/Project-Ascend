import { Stakeholder, EvidenceItem, CharterSection, Email, ChatterContact, ProcessCard } from '../types';

// Emails are secondary to Chatter in the GDD flow, but still useful for evidence/reference
export const INITIAL_EMAILS: Email[] = [
  {
    id: 'email_it_support',
    sender: 'IT Support',
    subject: 'System Access Credentials',
    preview: 'Here are your login details for the PMIS system.',
    timestamp: '8:45 AM',
    isRead: true,
    categoryColor: '#3B82F6',
    body: `Your access to the Project Management Information System (PMIS) has been provisioned.

Username: pm_lead
Password: [REDACTED]

Please do not share these credentials.`
  },
  {
    id: 'email_sarah_jenkins',
    sender: 'Sarah Jenkins',
    subject: 'Quick question about the legacy data',
    preview: 'Hi, I heard you\'re leading the new project. We have some concerns...',
    timestamp: 'Yesterday',
    isRead: true,
    categoryColor: '#10B981',
    body: `Hi,

I heard you're leading the new project. We have some concerns about how the new system will integrate with our legacy databases.

Can we set up a time to chat?

Best,
Sarah`
  }
];

// Chatter contacts - the primary narrative driver per GDD
export const INITIAL_CONTACTS: ChatterContact[] = [
  {
    id: 'contact_vane',
    name: 'Director Vane',
    role: 'Sponsor (CEO)',
    avatarUrl: '/assets/avatars/vane.png',
    isUnlocked: true, // Available from start
    hasUnreadMessages: true, // Level 1 starts with message from Vane
    lastMessage: 'Welcome aboard...',
  },
  {
    id: 'contact_team',
    name: 'Team Channel',
    role: 'Project Team',
    avatarUrl: '/assets/avatars/team.png',
    isUnlocked: false, // Unlocks after Charter signed
    hasUnreadMessages: false,
  },
  {
    id: 'contact_marcus',
    name: 'Marcus',
    role: 'Head of Legacy Systems',
    avatarUrl: '/assets/avatars/marcus.png',
    isUnlocked: false, // Unlocks in Level 2 via Team Channel
    hasUnreadMessages: false,
  },
  {
    id: 'contact_sarah',
    name: 'Sarah',
    role: 'Data Privacy Officer',
    avatarUrl: '/assets/avatars/sarah.png',
    isUnlocked: false, // Discovered via Org Chart hunt
    hasUnreadMessages: false,
  },
];

export const INITIAL_STAKEHOLDERS: Stakeholder[] = [
  {
    id: 'sh_vane',
    name: 'Director Vane',
    role: 'Sponsor (CEO)',
    avatarUrl: '/assets/avatars/vane.png',
    power: 'High',
    interest: 'High',
    attitude: 'Supportive',
    // Salience Model attributes (GDD v3.3)
    urgency: 'High',
    legitimacy: 'High',
    salienceClass: 'Definitive', // Power + Urgency + Legitimacy = Definitive
    isIdentified: true, // Known from start via Chatter
    isAnalyzed: false,
    dialogueTreeId: 'dt_vane_intro',
    secret: null,
  },
  {
    id: 'sh_marcus',
    name: 'Marcus',
    role: 'Head of Legacy Systems',
    avatarUrl: '/assets/avatars/marcus.png',
    power: 'High',
    interest: 'Low', // Correct placement: Keep Satisfied quadrant
    attitude: 'Resistant', // Starts resistant, can soften if player collaborates
    // Salience Model attributes (GDD v3.3)
    urgency: 'Low',
    legitimacy: 'High',
    salienceClass: 'Dominant', // Power + Legitimacy = Dominant
    isIdentified: false, // Identified in Level 2 via Team Channel
    isAnalyzed: false,
    dialogueTreeId: 'dt_marcus_intro',
    secret: 'Those mainframes run payroll - touching them could cause disaster',
  },
  {
    id: 'sh_sarah',
    name: 'Sarah',
    role: 'Data Privacy Officer',
    avatarUrl: '/assets/avatars/sarah.png',
    power: 'High',
    interest: 'High', // Correct placement: Manage Closely quadrant
    attitude: 'Neutral',
    // Salience Model attributes (GDD v3.3)
    urgency: 'High',
    legitimacy: 'High',
    salienceClass: 'Definitive', // Power + Urgency + Legitimacy = Definitive
    isIdentified: false, // Hidden - discovered via Org Chart hunt in Level 2
    isAnalyzed: false,
    dialogueTreeId: 'dt_sarah_intro',
    secret: 'Critical compliance requirements that could halt the project',
  },
  // GDD v3.3 Level 2 Step 1: Broad Entry - Decomposable stakeholder group
  {
    id: 'sh_entire_company',
    name: 'The Entire Company',
    role: 'All Employees',
    avatarUrl: '/assets/avatars/group.png',
    power: 'Low',
    interest: 'Low',
    attitude: 'Unknown',
    urgency: 'Low',
    legitimacy: 'Low',
    salienceClass: 'None',
    isIdentified: false, // Added via team suggestion in Level 2
    isAnalyzed: false,
    isDecomposable: true, // Can be broken down
    childStakeholderIds: ['sh_hr', 'sh_it_support', 'sh_managers'],
    dialogueTreeId: '',
    secret: null,
  },
  // GDD v3.3 Level 2 Step 3: Late Arrival - Compliance Body
  {
    id: 'sh_compliance',
    name: 'Compliance Body',
    role: 'Regulatory Oversight',
    avatarUrl: '/assets/avatars/compliance.png',
    power: 'High',
    interest: 'High',
    attitude: 'Neutral',
    urgency: 'High',
    legitimacy: 'High',
    salienceClass: 'Definitive',
    isIdentified: false, // Discovered late in Level 2
    isAnalyzed: false,
    dialogueTreeId: '',
    secret: 'New regulations that affect project scope',
  },
];

export const INITIAL_EVIDENCE: EvidenceItem[] = [
  // Correct Items
  {
    id: 'ev_market_analysis',
    name: 'Market Analysis Report',
    description: 'Detailed analysis of the current market trends supporting the merger.',
    type: 'BusinessCase',
    isDistractor: false,
    qualityScore: 95,
  },
  {
    id: 'ev_legal_framework',
    name: 'Merger Legal Framework',
    description: 'Regulatory requirements and legal boundaries for the merger.',
    type: 'Regulatory',
    isDistractor: false,
    qualityScore: 90,
  },
  {
    id: 'ev_risk_register',
    name: 'Risk Register Draft',
    description: 'Initial assessment of high-level risks including cultural alignment.',
    type: 'Risk',
    isDistractor: false,
    qualityScore: 85,
  },
  // Distractors
  {
    id: 'ev_cafeteria_menu',
    name: 'Cafeteria Menu',
    description: 'Weekly lunch schedule.',
    type: 'Template', // Misusing 'Template' for generic document
    isDistractor: true,
    qualityScore: 0,
  },
  {
    id: 'ev_python_code',
    name: 'Python Code Snippet',
    description: 'A script for data migration. Too technical for the charter.',
    type: 'TechnicalSpec',
    isDistractor: true,
    qualityScore: 10,
  },
  {
    id: 'ev_wiring_diagram',
    name: 'Server Wiring Diagram',
    description: 'Detailed schematic of the server room cabling.',
    type: 'TechnicalSpec',
    isDistractor: true,
    qualityScore: 15,
  },
  // GDD v3.3 Step 4: Granularity Trap - Timeline documents
  {
    id: 'ev_milestone_summary',
    name: 'Milestone Summary',
    description: 'High-level project milestones for executive review.',
    type: 'Timeline',
    isDistractor: false,
    qualityScore: 90,
  },
  {
    id: 'ev_detailed_gantt',
    name: 'Detailed Gantt Draft',
    description: 'Comprehensive task-level schedule with dependencies and resources.',
    type: 'TechnicalSpec', // Wrong type for charter - too detailed
    isDistractor: true,
    qualityScore: 20, // Low score - too detailed for charter
  },
];

// Charter sections per GDD v3.3: 4 slots - [Purpose], [Budget], [Timeline], [Risks]
export const INITIAL_CHARTER_SECTIONS: CharterSection[] = [
  {
    id: 'sec_purpose',
    label: 'Purpose / Business Case',
    requiredType: 'BusinessCase', // Market Analysis Report goes here
    assignedItemId: null,
    isLocked: false,
  },
  {
    id: 'sec_budget',
    label: 'Budget Justification',
    requiredType: 'Regulatory', // Legal Framework provides budget justification
    assignedItemId: null,
    isLocked: false,
  },
  {
    id: 'sec_timeline',
    label: 'Timeline (High-Level)',
    requiredType: 'Timeline', // Milestone Summary only - Step 4 Granularity Trap
    assignedItemId: null,
    isLocked: false,
  },
  {
    id: 'sec_risks',
    label: 'High-Level Risks',
    requiredType: 'Risk', // Risk Register Draft goes here
    assignedItemId: null,
    isLocked: false,
  },
];

// Process Cards for ProcessMap - initially only Level 1 process is unlocked
export const INITIAL_PROCESS_CARDS: ProcessCard[] = [
  {
    id: 'proc_develop_charter',
    name: 'Develop Project Charter',
    processGroup: 'Initiating',
    knowledgeArea: 'Integration Management',
    description: 'Create the document that formally authorizes the project and gives the PM authority to apply resources.',
    isUnlocked: false, // Unlocked when player chooses "Draft Charter" in Chatter
    levelRequired: 1,
  },
  {
    id: 'proc_identify_stakeholders',
    name: 'Identify Stakeholders',
    processGroup: 'Initiating',
    knowledgeArea: 'Stakeholder Management',
    description: 'Identify people, groups, or organizations that could impact or be impacted by the project.',
    isUnlocked: false, // Unlocked after Charter is signed
    levelRequired: 2,
  },
];

// GDD v3.3 Phase 3: Decomposition Mappings
// Maps broad stakeholder groups to their specific categories
export const DECOMPOSITION_MAPPINGS: Record<string, { children: Stakeholder[] }> = {
  sh_entire_company: {
    children: [
      {
        id: 'sh_hr',
        name: 'HR Department',
        role: 'Human Resources',
        avatarUrl: '/assets/avatars/hr.png',
        power: 'Low',
        interest: 'High',
        attitude: 'Neutral',
        urgency: 'Low',
        legitimacy: 'High',
        salienceClass: 'Discretionary',
        isIdentified: true,
        isAnalyzed: false,
        dialogueTreeId: '',
        secret: null,
      },
      {
        id: 'sh_it_support',
        name: 'IT Support',
        role: 'Technical Support',
        avatarUrl: '/assets/avatars/it.png',
        power: 'Low',
        interest: 'High',
        attitude: 'Supportive',
        urgency: 'High',
        legitimacy: 'High',
        salienceClass: 'Dependent',
        isIdentified: true,
        isAnalyzed: false,
        dialogueTreeId: '',
        secret: null,
      },
      {
        id: 'sh_managers',
        name: 'Department Managers',
        role: 'Middle Management',
        avatarUrl: '/assets/avatars/managers.png',
        power: 'High',
        interest: 'Low',
        attitude: 'Neutral',
        urgency: 'Low',
        legitimacy: 'High',
        salienceClass: 'Dominant',
        isIdentified: true,
        isAnalyzed: false,
        dialogueTreeId: '',
        secret: null,
      },
    ],
  },
};