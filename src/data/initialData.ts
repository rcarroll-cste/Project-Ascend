import { Stakeholder, EvidenceItem, CharterSection, Email, ChatterContact } from '../types';

// Emails are secondary to Chatter in the GDD flow, but still useful for evidence/reference
export const INITIAL_EMAILS: Email[] = [
  {
    id: 'email_it_support',
    sender: 'IT Support',
    subject: 'System Access Credentials',
    preview: 'Here are your login details for the PMIS system.',
    timestamp: '8:45 AM',
    isRead: true,
    folder: 'inbox',
    categoryColor: '#3B82F6',
    body: `Your access to the Project Management Information System (PMIS) has been provisioned.

Username: pm_lead
Password: [REDACTED]

Please do not share these credentials.`
  },
  {
    id: 'email_sarah_jenkins',
    sender: 'Sarah (IT Lead)',
    subject: 'Technical concerns about the migration',
    preview: 'Hi, I heard you\'re leading the server migration. As IT Lead, I have some technical insights...',
    timestamp: 'Yesterday',
    isRead: true,
    folder: 'inbox',
    categoryColor: '#10B981',
    body: `Hi,

I heard you're leading the server migration project. As IT Lead, I've been working with our legacy systems for years.

I have some technical insights about the integration challenges we might face. The legacy databases have some quirks that aren't documented anywhere.

Can we set up a time to chat? I'd like to help make this migration successful.

Best,
Sarah
IT Lead`,
    triggerAction: 'IDENTIFY_STAKEHOLDER',
    triggerStakeholderId: 'sh_sarah',
  },
  {
    id: 'email_marcus_concerns',
    sender: 'Marcus Thompson (Sales VP)',
    subject: 'RE: Server Migration Timeline - URGENT',
    preview: 'I need to discuss serious concerns about the migration timing...',
    timestamp: '2 days ago',
    isRead: false,
    folder: 'inbox',
    categoryColor: '#F59E0B',
    body: `To whom it may concern,

I've reviewed the preliminary migration timeline and I have SERIOUS concerns. Q4 is our biggest quarter - Black Friday alone represents 30% of our annual revenue.

If the systems go down during peak sales season, my team misses their bonus targets. That affects morale, retention, and ultimately the company's bottom line.

I tried to raise this with the previous PM, but my concerns were dismissed. I hope we can have a more productive conversation this time.

Marcus Thompson
VP of Sales`,
    triggerAction: 'IDENTIFY_STAKEHOLDER',
    triggerStakeholderId: 'sh_marcus',
  },
  // SPAM FOLDER - Hidden Stakeholder Discovery (Level 2 mechanic)
  {
    id: 'email_compliance_spam',
    sender: 'Regulatory Affairs Division',
    subject: '[EXTERNAL] Mandatory Compliance Review Required',
    preview: 'URGENT: Your project requires regulatory compliance assessment before...',
    timestamp: '3 days ago',
    isRead: false,
    folder: 'spam',
    categoryColor: '#EF4444',
    body: `IMPORTANT NOTICE FROM THE REGULATORY COMPLIANCE OFFICE

Dear Project Manager,

Our records indicate that the "Server Migration Project" falls under the scope of data handling regulations (Sections 7.2, 7.3, and 12.1 of the Corporate Compliance Framework).

REQUIRED ACTIONS:
1. Complete Form RC-2024 (Data Migration Impact Assessment)
2. Schedule a compliance review meeting within 10 business days
3. Ensure data retention policies are documented before migration begins

Failure to comply may result in project suspension and regulatory penalties.

Contact: compliance.officer@regulatory.gov.corp
Direct Line: ext. 4421

This is an automated notice from the Regulatory Compliance Office.
---
If you believe you received this message in error, please contact the Compliance Body directly.`,
    triggerAction: 'IDENTIFY_STAKEHOLDER',
    triggerStakeholderId: 'sh_compliance',
  },
  {
    id: 'email_newsletter_spam',
    sender: 'Corporate Newsletter',
    subject: 'This Week at Ascend Corp - Team Building Photos Inside!',
    preview: 'Check out the highlights from last week\'s company picnic...',
    timestamp: '5 days ago',
    isRead: true,
    folder: 'spam',
    categoryColor: '#9CA3AF',
    body: `ASCEND CORP WEEKLY NEWSLETTER

Hello Team!

Here are this week's highlights:
- Company Picnic Photos (See attachment)
- New Coffee Machine in Break Room B
- Reminder: Parking Lot C closed for maintenance

Have a great week!
- Corporate Communications`
  }
];

// Chatter contacts - the primary narrative driver per GDD
export const INITIAL_CONTACTS: ChatterContact[] = [
  {
    id: 'contact_vane',
    name: 'Director Vane',
    role: 'CEO',
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
    role: 'Sales VP',
    avatarUrl: '/assets/avatars/marcus.png',
    isUnlocked: false, // Unlocks in Level 2 via Team Channel
    hasUnreadMessages: false,
  },
  {
    id: 'contact_sarah',
    name: 'Sarah',
    role: 'IT Lead',
    avatarUrl: '/assets/avatars/sarah.png',
    isUnlocked: false, // Discovered via Org Chart hunt
    hasUnreadMessages: false,
  },
  {
    id: 'contact_legal',
    name: 'Legal Counsel',
    role: 'Legal Department',
    avatarUrl: '/assets/avatars/legal.png',
    isUnlocked: false, // Unlocks when player discusses risks with Vane
    hasUnreadMessages: false,
  },
  {
    id: 'contact_compliance',
    name: 'Compliance Officer',
    role: 'Regulatory Compliance (External)',
    avatarUrl: '/assets/avatars/compliance.png',
    isUnlocked: false, // Discovered via spam folder in Level 2
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
    role: 'Sales VP',
    avatarUrl: '/assets/avatars/marcus.png',
    power: 'High',
    interest: 'High', // Sales VP is High Power/High Interest per GDD Level 2
    attitude: 'Resistant', // Aggressive, bonus-focused per GDD - starts resistant
    // Salience Model attributes (GDD v3.3)
    urgency: 'High', // Bonus targets create urgency
    legitimacy: 'High',
    salienceClass: 'Definitive', // Power + Urgency + Legitimacy = Definitive
    isIdentified: false, // Identified in Level 2 via Team Channel
    isAnalyzed: false,
    dialogueTreeId: 'dt_marcus_intro',
    secret: 'Bonus targets depend on Q4 sales - avoid Black Friday launch window',
  },
  {
    id: 'sh_sarah',
    name: 'Sarah',
    role: 'IT Lead',
    avatarUrl: '/assets/avatars/sarah.png',
    power: 'Low', // Technical lead, influential but not decision-maker
    interest: 'High', // Technical lead, highly interested in migration success
    attitude: 'Supportive', // Helpful, technical per GDD
    // Salience Model attributes (GDD v3.3)
    urgency: 'High', // Technical work needs timely input
    legitimacy: 'High',
    salienceClass: 'Dependent', // Legitimacy + Urgency = Dependent
    isIdentified: false, // Discovered via email or Org Chart hunt in Level 2
    isAnalyzed: false,
    dialogueTreeId: 'dt_sarah_intro',
    secret: 'Technical insights about legacy data integration challenges',
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
  // GDD v6.6: Legal Counsel - Risk-averse, slow
  {
    id: 'sh_legal',
    name: 'Legal Counsel',
    role: 'Legal Department',
    avatarUrl: '/assets/avatars/legal.png',
    power: 'Low', // Influential but not primary decision maker
    interest: 'Low', // Risk-averse, not actively engaged unless needed
    attitude: 'Neutral', // Risk-averse per GDD
    urgency: 'Low', // Slow per GDD
    legitimacy: 'High',
    salienceClass: 'Discretionary', // Legitimacy only
    isIdentified: false, // Discovered when discussing risks with Vane
    isAnalyzed: false,
    isExternal: false,
    dialogueTreeId: '',
    secret: 'Can slow down projects with excessive legal review but protects company',
  },
  // GDD v6.6 Level 2 Step 3: Late Arrival - Regulatory Compliance Officer (External)
  {
    id: 'sh_compliance',
    name: 'Regulatory Compliance Officer',
    role: 'Regulatory Oversight (External)',
    avatarUrl: '/assets/avatars/compliance.png',
    power: 'High',
    interest: 'High',
    attitude: 'Neutral', // Formal, bureaucratic per GDD
    urgency: 'High',
    legitimacy: 'High',
    salienceClass: 'Definitive',
    isIdentified: false, // Discovered late in Level 2 via spam folder
    isAnalyzed: false,
    isExternal: true, // External stakeholder per GDD Section 8
    dialogueTreeId: '',
    secret: 'New regulations that affect project scope',
  },
];

export const INITIAL_EVIDENCE: EvidenceItem[] = [
  // Correct Items - Server Migration Narrative
  {
    id: 'ev_market_analysis',
    name: 'Server Capacity Analysis',
    description: 'Detailed analysis of current server infrastructure capacity and cloud migration benefits.',
    type: 'BusinessCase',
    isDistractor: false,
    qualityScore: 95,
  },
  {
    id: 'ev_legal_framework',
    name: 'Data Compliance Protocols',
    description: 'Regulatory requirements and data handling procedures for the server migration.',
    type: 'Regulatory',
    isDistractor: false,
    qualityScore: 90,
  },
  {
    id: 'ev_risk_register',
    name: 'Risk Register Draft',
    description: 'Initial assessment of high-level risks including system downtime and data integrity.',
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
  // GDD v6.6 Financial Redline Protocol - Budget evidence items
  {
    id: 'ev_budget_350k',
    name: 'Budget: $350,000',
    description: 'Maximum authorized investment to maintain positive ROI from Business Case',
    type: 'Agreement',
    isDistractor: false,
    qualityScore: 100,
  },
  {
    id: 'ev_budget_500k',
    name: 'Budget Request: $500,000',
    description: 'Director Vane\'s initial budget request - exceeds authorized ROI cap',
    type: 'Agreement',
    isDistractor: true, // This is the wrong budget!
    qualityScore: 0,
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
    requiredType: 'BusinessCase', // Server Capacity Analysis goes here
    assignedItemId: null,
    isLocked: false,
  },
  {
    id: 'sec_budget',
    label: 'Budget Authorization',
    requiredType: 'Agreement', // Requires ev_budget_350k (correct) not ev_budget_500k (distractor)
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

// Process Cards for ProcessMap - now imported from dedicated file
// Re-export for backwards compatibility
export { PROCESS_CARDS as INITIAL_PROCESS_CARDS } from './processCards';

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
