import { Stakeholder, EvidenceItem, CharterSection, Email } from '../types';

export const INITIAL_EMAILS: Email[] = [
  {
    id: 'email_thorne_intro',
    sender: 'Director Thorne',
    subject: 'URGENT: Project Ascend Charter',
    preview: 'Welcome to the team. I need you to get the charter approved ASAP...',
    timestamp: '9:00 AM',
    isRead: false,
    categoryColor: '#ef4444', // Red for urgent
    triggerAction: 'UNLOCK_PMIS',
    body: `Welcome to the team.
    
I need you to get the charter approved ASAP. The merger depends on it.

I've attached the initial market analysis. Review it carefully.

- Elias Thorne`,
    relatedEvidenceId: 'ev_market_analysis'
  },
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

export const INITIAL_STAKEHOLDERS: Stakeholder[] = [
  {
    id: 'sh_elias',
    name: 'Elias Thorne',
    role: 'Sponsor (CEO)',
    avatarUrl: '/assets/avatars/elias.png',
    power: 'High',
    interest: 'High',
    attitude: 'Supportive',
    isIdentified: true,
    isAnalyzed: false,
    dialogueTreeId: 'dt_elias_intro',
    secret: null,
  },
  {
    id: 'sh_sarah',
    name: 'Sarah Jenkins',
    role: 'Functional Manager (IT)',
    avatarUrl: '/assets/avatars/sarah.png',
    power: 'Low',
    interest: 'High',
    attitude: 'Neutral', // Starts neutral, becomes supportive if consulted
    isIdentified: false,
    isAnalyzed: false,
    dialogueTreeId: 'dt_sarah_intro',
    secret: 'Concerns about legacy system compatibility',
  },
  {
    id: 'sh_mole',
    name: 'Marcus Reynolds',
    role: 'VP of Sales (Rival)',
    avatarUrl: '/assets/avatars/mole.png',
    power: 'High',
    interest: 'Low',
    attitude: 'Resistant',
    isIdentified: false,
    isAnalyzed: false,
    dialogueTreeId: 'dt_mole_intro',
    secret: 'Secretly delaying the project to fund his own initiative',
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
];

export const INITIAL_CHARTER_SECTIONS: CharterSection[] = [
  {
    id: 'sec_business_case',
    label: 'Business Case',
    requiredType: 'BusinessCase',
    assignedItemId: null,
    isLocked: false,
  },
  {
    id: 'sec_risks',
    label: 'Key Risks',
    requiredType: 'Risk',
    assignedItemId: null,
    isLocked: false,
  },
  {
    id: 'sec_scope',
    label: 'Scope Description',
    requiredType: 'Regulatory', // Mapping Legal Framework here for the vertical slice
    assignedItemId: null,
    isLocked: false,
  },
  {
    id: 'sec_schedule',
    label: 'Milestone Schedule',
    requiredType: 'Agreement', // Placeholder for future evidence
    assignedItemId: null,
    isLocked: false, 
  },
];