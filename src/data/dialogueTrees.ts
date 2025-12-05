import { DialogueTree } from '../types';

/**
 * Dialogue Trees for Project Ascend
 *
 * Level 1: Director Vane's initial message with ORDER HARDWARE vs DRAFT CHARTER choice
 * Level 2: Marcus's hostile message with IGNORE vs COLLABORATE choice
 */

// Level 1: The Handover - Director Vane's introduction
export const DIALOGUE_VANE_INTRO: DialogueTree = {
  id: 'dt_vane_intro',
  contactId: 'contact_vane',
  startNodeId: 'vane_welcome',
  nodes: [
    {
      id: 'vane_welcome',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: 'Welcome aboard.',
      autoAdvanceToNodeId: 'vane_request',
      delay: 500,
    },
    {
      id: 'vane_request',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: 'We need to start the Server Migration immediately. Email IT and order the hardware today. Speed is everything.',
      delay: 1000,
      choices: [
        {
          id: 'choice_order_hardware',
          label: 'ORDER HARDWARE',
          style: 'risky',
          consequences: [
            {
              type: 'game_over',
              payload: {
                reason: 'UNAUTHORIZED_SPEND',
                message: 'You attempted to spend company resources without authorization. A Project Manager has no authority to spend money or utilize resources without a signed Charter.',
              },
            },
          ],
          nextNodeId: null,
        },
        {
          id: 'choice_draft_charter',
          label: 'DRAFT CHARTER',
          style: 'safe',
          consequences: [
            {
              type: 'add_notification',
              payload: {
                title: 'Good thinking!',
                message: 'You need a signed Charter before spending resources.',
                type: 'success',
              },
            },
            {
              type: 'unlock_app',
              payload: { appId: 'files' },
            },
            {
              type: 'unlock_app',
              payload: { appId: 'pmis' },
            },
            {
              type: 'unlock_process',
              payload: { processId: 'proc_develop_charter' },
            },
            {
              type: 'add_inventory',
              payload: {
                // GDD v3.3: Add all charter evidence including timeline docs
                items: ['ev_market_analysis', 'ev_risk_register', 'ev_legal_framework', 'ev_milestone_summary', 'ev_detailed_gantt'],
              },
            },
          ],
          nextNodeId: 'vane_fine',
        },
      ],
    },
    {
      id: 'vane_fine',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: 'Fine. Get it done quickly. The Business Case is in your Files. I expect to sign the Charter by end of day.',
      delay: 500,
    },
  ],
};

// Level 2: Team channel intro (triggers when Charter is signed)
export const DIALOGUE_TEAM_INTRO: DialogueTree = {
  id: 'dt_team_intro',
  contactId: 'contact_team',
  startNodeId: 'team_welcome',
  nodes: [
    {
      id: 'team_welcome',
      speaker: 'System',
      text: 'You have been added to the Project Team channel.',
      autoAdvanceToNodeId: 'team_marcus_joins',
      delay: 500,
    },
    {
      id: 'team_marcus_joins',
      speaker: 'System',
      text: 'Marcus (Head of Legacy Systems) has joined the channel.',
      delay: 300,
      // Note: Contact unlock is handled by the app when Charter is signed
    },
  ],
};

// Level 2: Marcus's hostile introduction (appears in Team Channel after Charter signed)
export const DIALOGUE_MARCUS_INTRO: DialogueTree = {
  id: 'dt_marcus_intro',
  contactId: 'contact_marcus',
  startNodeId: 'marcus_hostile',
  nodes: [
    {
      id: 'marcus_hostile',
      speaker: 'Marcus',
      speakerAvatar: '/assets/avatars/marcus.png',
      text: "I see you're moving the servers.",
      autoAdvanceToNodeId: 'marcus_hostile_2',
      delay: 500,
    },
    {
      id: 'marcus_hostile_2',
      speaker: 'Marcus',
      speakerAvatar: '/assets/avatars/marcus.png',
      text: "Nobody asked me. Those mainframes run payroll. Don't touch them.",
      delay: 800,
      choices: [
        {
          id: 'choice_ignore',
          label: 'IGNORE',
          style: 'risky',
          consequences: [
            {
              type: 'update_stakeholder',
              payload: {
                stakeholderId: 'sh_marcus',
                updates: { attitude: 'Resistant', isIdentified: true },
              },
            },
            {
              type: 'add_notification',
              payload: {
                title: 'Marcus is unhappy',
                message: 'Ignoring stakeholders can have hidden consequences...',
                type: 'warning',
              },
            },
          ],
          nextNodeId: 'marcus_ignored',
        },
        {
          id: 'choice_collaborate',
          label: 'COLLABORATE',
          style: 'safe',
          consequences: [
            {
              type: 'update_stakeholder',
              payload: {
                stakeholderId: 'sh_marcus',
                updates: { attitude: 'Neutral', isIdentified: true },
              },
            },
            {
              type: 'add_notification',
              payload: {
                title: 'Stakeholder engaged',
                message: 'Marcus appreciates being consulted.',
                type: 'success',
              },
            },
          ],
          nextNodeId: 'marcus_collaborate',
        },
      ],
    },
    {
      id: 'marcus_ignored',
      speaker: 'Marcus',
      speakerAvatar: '/assets/avatars/marcus.png',
      text: "Fine. But don't say I didn't warn you.",
      delay: 500,
    },
    {
      id: 'marcus_collaborate',
      speaker: 'Player',
      text: "Let's schedule an interview. I want to understand your concerns about the legacy systems.",
      autoAdvanceToNodeId: 'marcus_softens',
      delay: 300,
    },
    {
      id: 'marcus_softens',
      speaker: 'Marcus',
      speakerAvatar: '/assets/avatars/marcus.png',
      text: "...Alright. At least someone's listening. The payroll system is mission-critical. We need to plan the migration carefully.",
      delay: 800,
    },
  ],
};

// Level 2: Broad Entry - Team suggests "The Entire Company"
export const DIALOGUE_BROAD_STAKEHOLDER: DialogueTree = {
  id: 'dt_broad_stakeholder',
  contactId: 'contact_team',
  startNodeId: 'team_broad_suggestion',
  nodes: [
    {
      id: 'team_broad_suggestion',
      speaker: 'Team Member',
      text: "I've been thinking about stakeholders. Shouldn't we just add 'The Entire Company' to the register? Everyone is affected by this migration.",
      delay: 1000,
      choices: [
        {
          id: 'choice_accept_broad',
          label: 'ACCEPT (ADD "THE ENTIRE COMPANY")',
          style: 'risky',
          consequences: [
            {
              type: 'identify_stakeholder',
              payload: { stakeholderId: 'sh_entire_company' },
            },
            {
              type: 'add_notification',
              payload: {
                title: 'Stakeholder Added',
                message: '"The Entire Company" added to register. But can you really manage everyone as a single group?',
                type: 'warning',
              },
            },
          ],
          nextNodeId: 'team_broad_accepted',
        },
        {
          id: 'choice_decompose',
          label: 'DECOMPOSE INTO CATEGORIES',
          style: 'safe',
          consequences: [
            {
              type: 'add_notification',
              payload: {
                title: 'Good thinking!',
                message: 'Breaking down broad groups into specific categories makes them manageable.',
                type: 'success',
              },
            },
          ],
          nextNodeId: 'team_decompose_approved',
        },
      ],
    },
    {
      id: 'team_broad_accepted',
      speaker: 'Team Member',
      text: "Okay, I've added it. Though... it does seem a bit vague. How do we even engage with 'everyone'?",
      delay: 500,
      autoAdvanceToNodeId: 'team_broad_hint',
    },
    {
      id: 'team_broad_hint',
      speaker: 'System',
      text: 'Hint: Broad stakeholder groups should be decomposed into specific, manageable categories. Use the Decompose tool (scissors icon) on this entry.',
      delay: 800,
    },
    {
      id: 'team_decompose_approved',
      speaker: 'Team Member',
      text: "That makes sense. Let's break it down into HR, IT Support, and Department Managers. Each group has different interests and needs.",
      delay: 500,
      autoAdvanceToNodeId: 'team_decompose_result',
    },
    {
      id: 'team_decompose_result',
      speaker: 'System',
      text: 'Three new stakeholder categories have been added: HR Department, IT Support, Department Managers.',
      delay: 500,
      consequences: [
        {
          type: 'decompose_stakeholder',
          payload: { parentId: 'sh_entire_company' },
        },
      ],
    },
  ],
};

// Level 2: Late Arrival Event - Compliance Body appears after finalization
export const DIALOGUE_LATE_ARRIVAL: DialogueTree = {
  id: 'dt_late_arrival',
  contactId: 'contact_team',
  startNodeId: 'late_arrival_alert',
  nodes: [
    {
      id: 'late_arrival_alert',
      speaker: 'System',
      text: 'URGENT: New email received from Regulatory Affairs.',
      delay: 500,
      autoAdvanceToNodeId: 'late_arrival_email',
    },
    {
      id: 'late_arrival_email',
      speaker: 'Regulatory Affairs',
      text: "The Data Protection Compliance Body has requested to be included in all IT infrastructure projects. They have oversight authority on data handling procedures.",
      delay: 1000,
      choices: [
        {
          id: 'choice_ignore_late',
          label: 'IGNORE (REGISTER IS FINALIZED)',
          style: 'risky',
          consequences: [
            {
              type: 'add_notification',
              payload: {
                title: 'Compliance Ignored',
                message: 'Ignoring regulatory bodies can lead to project delays or legal issues.',
                type: 'error',
              },
            },
            {
              type: 'update_constraint',
              payload: { metric: 'schedule', delta: -20 },
            },
          ],
          nextNodeId: 'late_arrival_ignored',
        },
        {
          id: 'choice_reopen_register',
          label: 'RE-OPEN REGISTER',
          style: 'safe',
          consequences: [
            {
              type: 'identify_stakeholder',
              payload: { stakeholderId: 'sh_compliance' },
            },
            {
              type: 'add_notification',
              payload: {
                title: 'Register Updated',
                message: 'Compliance Body added. Good project managers stay flexible!',
                type: 'success',
              },
            },
          ],
          nextNodeId: 'late_arrival_added',
        },
      ],
    },
    {
      id: 'late_arrival_ignored',
      speaker: 'System',
      text: 'The Compliance Body has escalated. Project review meeting scheduled. Timeline impact: -20%.',
      delay: 800,
    },
    {
      id: 'late_arrival_added',
      speaker: 'Regulatory Affairs',
      text: 'Thank you for including us. We look forward to collaborating on the data migration protocols.',
      delay: 500,
      autoAdvanceToNodeId: 'late_arrival_complete',
    },
    {
      id: 'late_arrival_complete',
      speaker: 'System',
      text: 'Stakeholder identification is an iterative process. New stakeholders can emerge at any project phase.',
      delay: 500,
    },
  ],
};

// All dialogue trees for easy import
export const DIALOGUE_TREES: DialogueTree[] = [
  DIALOGUE_VANE_INTRO,
  DIALOGUE_MARCUS_INTRO,
  DIALOGUE_TEAM_INTRO,
  DIALOGUE_BROAD_STAKEHOLDER,
  DIALOGUE_LATE_ARRIVAL,
];

// Helper to get dialogue tree by ID
export function getDialogueTree(id: string): DialogueTree | undefined {
  return DIALOGUE_TREES.find((tree) => tree.id === id);
}

// Helper to get dialogue tree by contact ID
export function getDialogueTreeByContact(contactId: string): DialogueTree | undefined {
  return DIALOGUE_TREES.find((tree) => tree.contactId === contactId);
}
