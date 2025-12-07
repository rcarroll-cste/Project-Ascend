import { DialogueTree } from '../types';

/**
 * Dialogue Trees for Project Ascend
 *
 * Prologue: Director Vane welcomes the player after cleanup
 * Level 1: Vane intro/outro for Charter development (4.1)
 * Level 2: Vane intro/outro for Stakeholder identification (13.1)
 * Level 2: Marcus's hostile message with IGNORE vs COLLABORATE choice
 */

// =============================================================================
// PROLOGUE: Day Zero - Vane Introduction (triggered after cleanup)
// =============================================================================
export const DIALOGUE_PROLOGUE_COMPLETE: DialogueTree = {
  id: 'dialogue_vane_intro',
  contactId: 'contact_vane',
  startNodeId: 'prologue_vane_1',
  nodes: [
    {
      id: 'prologue_vane_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "I see you've finished cleaning up Reynolds' mess.",
      autoAdvanceToNodeId: 'prologue_vane_2',
      delay: 1500,
    },
    {
      id: 'prologue_vane_2',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Gold plating. That's what we call adding scope without authorization. Reynolds thought he was being helpful. The board thought otherwise.",
      autoAdvanceToNodeId: 'prologue_vane_3',
      delay: 2000,
    },
    {
      id: 'prologue_vane_3',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Your first real assignment starts now: Project Titan. A server migration that's been stalled for months.",
      autoAdvanceToNodeId: 'prologue_vane_4',
      delay: 1800,
    },
    {
      id: 'prologue_vane_4',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "But remember - you have NO authority to spend resources or make commitments until you have a signed Charter.",
      delay: 1500,
      choices: [
        {
          id: 'prologue_understood',
          label: 'Understood',
          style: 'safe',
          consequences: [
            {
              type: 'advance_level',
              payload: { levelId: 1 },
            },
          ],
          nextNodeId: 'prologue_vane_final',
        },
      ],
    },
    {
      id: 'prologue_vane_final',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Good. The Business Case is in your files. Draft the Charter and bring it to me for signature. Don't disappoint me.",
      delay: 1200,
    },
  ],
};

// =============================================================================
// LEVEL 1: Charter Development - Intro Dialogue
// =============================================================================
export const DIALOGUE_VANE_CHARTER_INTRO: DialogueTree = {
  id: 'dialogue_vane_charter_intro',
  contactId: 'contact_vane',
  startNodeId: 'charter_intro_1',
  nodes: [
    {
      id: 'charter_intro_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Project Titan has been waiting long enough. The Board is getting impatient.",
      autoAdvanceToNodeId: 'charter_intro_2',
      delay: 1500,
    },
    {
      id: 'charter_intro_2',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Your job is to develop the Project Charter. This document formally authorizes the project and gives you authority to apply resources.",
      autoAdvanceToNodeId: 'charter_intro_3',
      delay: 2000,
    },
    {
      id: 'charter_intro_3',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "You'll need to identify valid inputs. The Business Case and agreements are essential. Marketing fluff and outdated RFPs are not.",
      autoAdvanceToNodeId: 'charter_intro_4',
      delay: 2000,
    },
    {
      id: 'charter_intro_4',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Also, start an Assumption Log. Vendors make promises - but promises aren't facts until they're verified.",
      delay: 1500,
      choices: [
        {
          id: 'charter_intro_ready',
          label: "I'll get started",
          style: 'safe',
          consequences: [
            {
              type: 'unlock_app',
              payload: { appId: 'pmis' },
            },
            {
              type: 'unlock_app',
              payload: { appId: 'files' },
            },
          ],
          nextNodeId: 'charter_intro_5',
        },
      ],
    },
    {
      id: 'charter_intro_5',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "One more thing - Finance has been pushing for early hardware orders. Don't cave to pressure. No spending without a signed Charter.",
      delay: 1800,
    },
  ],
};

// =============================================================================
// LEVEL 1: Charter Development - Outro Dialogue (on completion)
// =============================================================================
export const DIALOGUE_VANE_CHARTER_COMPLETE: DialogueTree = {
  id: 'dialogue_vane_charter_complete',
  contactId: 'contact_vane',
  startNodeId: 'charter_complete_1',
  nodes: [
    {
      id: 'charter_complete_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "I've reviewed your Charter. Solid work.",
      autoAdvanceToNodeId: 'charter_complete_2',
      delay: 1200,
    },
    {
      id: 'charter_complete_2',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "You correctly identified the valid inputs and separated assumptions from facts. That's more than Reynolds ever did.",
      autoAdvanceToNodeId: 'charter_complete_3',
      delay: 1800,
    },
    {
      id: 'charter_complete_3',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "The Charter is signed. You now have formal authority to proceed with Project Titan.",
      autoAdvanceToNodeId: 'charter_complete_4',
      delay: 1500,
    },
    {
      id: 'charter_complete_4',
      speaker: 'System',
      text: '📄 Project Charter has been signed by Director Vane.',
      autoAdvanceToNodeId: 'charter_complete_5',
      delay: 800,
    },
    {
      id: 'charter_complete_5',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "But authority alone won't make this project succeed. You need to know WHO your stakeholders are. That's your next task.",
      delay: 1500,
      choices: [
        {
          id: 'charter_complete_next',
          label: 'What should I focus on?',
          style: 'safe',
          consequences: [],
          nextNodeId: 'charter_complete_6',
        },
      ],
    },
    {
      id: 'charter_complete_6',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Identify all stakeholders who impact or are impacted by this project. Use the Power/Interest Grid. And remember - stakeholder identification is iterative. New players can emerge at any time.",
      delay: 2200,
    },
  ],
};

// =============================================================================
// LEVEL 2: Stakeholder Identification - Intro Dialogue
// =============================================================================
export const DIALOGUE_VANE_STAKEHOLDERS_INTRO: DialogueTree = {
  id: 'dialogue_vane_stakeholders_intro',
  contactId: 'contact_vane',
  startNodeId: 'stakeholders_intro_1',
  nodes: [
    {
      id: 'stakeholders_intro_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "With the Charter signed, it's time to identify your stakeholders.",
      autoAdvanceToNodeId: 'stakeholders_intro_2',
      delay: 1500,
    },
    {
      id: 'stakeholders_intro_2',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "A stakeholder is anyone who can impact your project - or be impacted by it. Miss someone important, and you'll pay for it later.",
      autoAdvanceToNodeId: 'stakeholders_intro_3',
      delay: 2000,
    },
    {
      id: 'stakeholders_intro_3',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Start by scanning the company directory. But don't stop there - check your emails carefully. Some stakeholders don't announce themselves.",
      autoAdvanceToNodeId: 'stakeholders_intro_4',
      delay: 2000,
    },
    {
      id: 'stakeholders_intro_4',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Use the Power/Interest Grid to classify them. High power, high interest stakeholders need to be managed closely.",
      delay: 1500,
      choices: [
        {
          id: 'stakeholders_intro_salience',
          label: 'What about the Salience Model?',
          style: 'safe',
          consequences: [],
          nextNodeId: 'stakeholders_intro_5',
        },
        {
          id: 'stakeholders_intro_start',
          label: "I'll start identifying stakeholders",
          style: 'safe',
          consequences: [
            {
              type: 'unlock_app',
              payload: { appId: 'email' },
            },
          ],
          nextNodeId: 'stakeholders_intro_6',
        },
      ],
    },
    {
      id: 'stakeholders_intro_5',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Smart question. The Salience Model classifies stakeholders by Power, Urgency, and Legitimacy. A 'Definitive' stakeholder has all three - they can't be ignored.",
      autoAdvanceToNodeId: 'stakeholders_intro_5b',
      delay: 2000,
    },
    {
      id: 'stakeholders_intro_5b',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Watch out for 'Dormant' stakeholders too - they have power but aren't currently engaged. That can change quickly.",
      delay: 1800,
      consequences: [
        {
          type: 'unlock_app',
          payload: { appId: 'email' },
        },
      ],
    },
    {
      id: 'stakeholders_intro_6',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Good. And one more thing - check your spam folder. You'd be surprised what ends up in there.",
      delay: 1500,
    },
  ],
};

// =============================================================================
// LEVEL 2: Stakeholder Identification - Outro Dialogue (on completion)
// =============================================================================
export const DIALOGUE_VANE_STAKEHOLDERS_COMPLETE: DialogueTree = {
  id: 'dialogue_vane_stakeholders_complete',
  contactId: 'contact_vane',
  startNodeId: 'stakeholders_complete_1',
  nodes: [
    {
      id: 'stakeholders_complete_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "I've reviewed your Stakeholder Register. Comprehensive work.",
      autoAdvanceToNodeId: 'stakeholders_complete_2',
      delay: 1200,
    },
    {
      id: 'stakeholders_complete_2',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "You found the hidden stakeholder - the Compliance Body. Many PMs miss them until it's too late and the project gets delayed.",
      autoAdvanceToNodeId: 'stakeholders_complete_3',
      delay: 2000,
    },
    {
      id: 'stakeholders_complete_3',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Your Power/Interest classifications look accurate. You understand that stakeholders in the 'Manage Closely' quadrant need the most attention.",
      autoAdvanceToNodeId: 'stakeholders_complete_4',
      delay: 2000,
    },
    {
      id: 'stakeholders_complete_4',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Remember - this register is a living document. New stakeholders will emerge. Old ones may change their position.",
      delay: 1500,
      choices: [
        {
          id: 'stakeholders_complete_next',
          label: "What's next?",
          style: 'safe',
          consequences: [],
          nextNodeId: 'stakeholders_complete_5',
        },
      ],
    },
    {
      id: 'stakeholders_complete_5',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Now we move to Planning. You'll need to develop the Project Management Plan - the 'meta-plan' that guides how we execute, monitor, and control this project.",
      autoAdvanceToNodeId: 'stakeholders_complete_6',
      delay: 2200,
    },
    {
      id: 'stakeholders_complete_6',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "The real work begins now. Don't let the politics distract you from what matters - delivering value.",
      delay: 1800,
    },
  ],
};

// =============================================================================
// LEVEL 3: Project Management Plan - Intro Dialogue
// =============================================================================
export const DIALOGUE_VANE_PMP_INTRO: DialogueTree = {
  id: 'dialogue_vane_pmp_intro',
  contactId: 'contact_vane',
  startNodeId: 'pmp_intro_1',
  nodes: [
    {
      id: 'pmp_intro_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Now that you have your Charter signed and stakeholders identified, it's time for the real planning work.",
      autoAdvanceToNodeId: 'pmp_intro_2',
      delay: 1500,
    },
    {
      id: 'pmp_intro_2',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "You need to develop the Project Management Plan - the 'meta-plan' that defines HOW you'll execute, monitor, and control this project.",
      autoAdvanceToNodeId: 'pmp_intro_3',
      delay: 2000,
    },
    {
      id: 'pmp_intro_3',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "The PMP contains two types of components: Subsidiary Plans and Baselines. Don't confuse these with Project Documents - those are separate.",
      autoAdvanceToNodeId: 'pmp_intro_4',
      delay: 2200,
    },
    {
      id: 'pmp_intro_4',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "First, choose your development approach. Will this be Predictive, Agile, or Hybrid? The scope is well-defined, so consider that.",
      delay: 1800,
      choices: [
        {
          id: 'pmp_intro_understand',
          label: "I'll analyze the options",
          style: 'safe',
          consequences: [],
          nextNodeId: 'pmp_intro_5',
        },
      ],
    },
    {
      id: 'pmp_intro_5',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "One more thing - Marcus has concerns about the Change Management Plan. Handle that conflict professionally. Collaboration usually beats force.",
      delay: 2000,
    },
  ],
};

// =============================================================================
// LEVEL 3: Project Management Plan - Outro Dialogue
// =============================================================================
export const DIALOGUE_VANE_PMP_COMPLETE: DialogueTree = {
  id: 'dialogue_vane_pmp_complete',
  contactId: 'contact_vane',
  startNodeId: 'pmp_complete_1',
  nodes: [
    {
      id: 'pmp_complete_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "I've reviewed your Project Management Plan. Well structured.",
      autoAdvanceToNodeId: 'pmp_complete_2',
      delay: 1200,
    },
    {
      id: 'pmp_complete_2',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "You correctly distinguished between Subsidiary Plans and Baselines. And you kept Project Documents separate - that's a mistake many junior PMs make.",
      autoAdvanceToNodeId: 'pmp_complete_3',
      delay: 2000,
    },
    {
      id: 'pmp_complete_3',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "The PMP is now your guiding document. Any changes to scope, schedule, or cost must go through formal change control.",
      autoAdvanceToNodeId: 'pmp_complete_4',
      delay: 1800,
    },
    {
      id: 'pmp_complete_4',
      speaker: 'System',
      text: '📋 Project Management Plan has been approved.',
      autoAdvanceToNodeId: 'pmp_complete_5',
      delay: 800,
    },
    {
      id: 'pmp_complete_5',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Next, you need to focus on Scope Management. Define what's in and what's out - clearly and unambiguously.",
      delay: 1500,
      choices: [
        {
          id: 'pmp_complete_next',
          label: "What's first in Scope Management?",
          style: 'safe',
          consequences: [],
          nextNodeId: 'pmp_complete_6',
        },
      ],
    },
    {
      id: 'pmp_complete_6',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Start with the Scope Management Plan - it defines HOW you'll define, validate, and control scope. Then collect requirements, define scope, and create the WBS.",
      delay: 2200,
    },
  ],
};

// =============================================================================
// LEVEL 4: Scope Management - Intro Dialogue
// =============================================================================
export const DIALOGUE_SCOPE_INTRO: DialogueTree = {
  id: 'dialogue_scope_intro',
  contactId: 'contact_vane',
  startNodeId: 'scope_intro_1',
  nodes: [
    {
      id: 'scope_intro_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Scope Management is where projects live or die. Get this wrong, and you'll be fighting scope creep for months.",
      autoAdvanceToNodeId: 'scope_intro_2',
      delay: 1800,
    },
    {
      id: 'scope_intro_2',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "The Scope Management Plan defines HOW you'll handle scope. It's not the scope itself - that comes later in the Scope Baseline.",
      autoAdvanceToNodeId: 'scope_intro_3',
      delay: 2000,
    },
    {
      id: 'scope_intro_3',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "You'll need to decide: How will the WBS be created? Who approves the baseline? How will changes be handled?",
      delay: 1800,
      choices: [
        {
          id: 'scope_intro_ccb',
          label: 'What about the CCB?',
          style: 'safe',
          consequences: [],
          nextNodeId: 'scope_intro_4',
        },
        {
          id: 'scope_intro_start',
          label: "I'll define the processes",
          style: 'safe',
          consequences: [],
          nextNodeId: 'scope_intro_5',
        },
      ],
    },
    {
      id: 'scope_intro_4',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "The Change Control Board reviews and approves changes. For this project, changes to the scope baseline need CCB approval. Document that clearly.",
      autoAdvanceToNodeId: 'scope_intro_5',
      delay: 2000,
    },
    {
      id: 'scope_intro_5',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "And watch out for Gold Plating - adding scope without going through change control. Reynolds' downfall, remember?",
      delay: 1800,
    },
  ],
};

// =============================================================================
// LEVEL 4: Scope Management - Outro Dialogue
// =============================================================================
export const DIALOGUE_SCOPE_COMPLETE: DialogueTree = {
  id: 'dialogue_scope_complete',
  contactId: 'contact_vane',
  startNodeId: 'scope_complete_1',
  nodes: [
    {
      id: 'scope_complete_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Your Scope Management Plan is solid. Clear processes, defined approval authorities, and proper change handling.",
      autoAdvanceToNodeId: 'scope_complete_2',
      delay: 1500,
    },
    {
      id: 'scope_complete_2',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Good work rejecting that Gold Plating attempt. Any additions to scope must go through formal change control - no exceptions.",
      autoAdvanceToNodeId: 'scope_complete_3',
      delay: 1800,
    },
    {
      id: 'scope_complete_3',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Now it's time to collect requirements. You'll need to interview stakeholders to understand their needs - business, functional, and non-functional.",
      delay: 1500,
    },
  ],
};

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
      text: 'Marcus (Sales VP) has joined the channel.',
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
      text: "I see you're planning a server migration.",
      autoAdvanceToNodeId: 'marcus_hostile_2',
      delay: 500,
    },
    {
      id: 'marcus_hostile_2',
      speaker: 'Marcus',
      speakerAvatar: '/assets/avatars/marcus.png',
      text: "Nobody consulted Sales. Q4 is our busiest quarter. If anything disrupts our systems during Black Friday, my team misses their bonus targets.",
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
      text: "Fine. But when Sales misses their numbers, don't blame me.",
      delay: 500,
    },
    {
      id: 'marcus_collaborate',
      speaker: 'Player',
      text: "Let's schedule an interview. I want to understand the Sales team's concerns about the migration timing.",
      autoAdvanceToNodeId: 'marcus_softens',
      delay: 300,
    },
    {
      id: 'marcus_softens',
      speaker: 'Marcus',
      speakerAvatar: '/assets/avatars/marcus.png',
      text: "...Alright. At least someone's listening. We have aggressive Q4 targets. Any downtime during peak sales season could cost millions.",
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

// =============================================================================
// DEMO: Level 1 - The Authority Trap (GDD v4.3 Step 1)
// =============================================================================
export const DIALOGUE_AUTHORITY_TRAP: DialogueTree = {
  id: 'dt_authority_trap',
  contactId: 'contact_vane',
  startNodeId: 'authority_trap_1',
  nodes: [
    {
      id: 'authority_trap_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Price hike coming tomorrow. Order the servers NOW. I'll sign the paperwork later.",
      delay: 1500,
      choices: [
        {
          id: 'order_hardware',
          label: 'ORDER HARDWARE',
          style: 'risky',
          consequences: [
            {
              type: 'game_over',
              payload: {
                reason: 'UNAUTHORIZED_SPEND',
                message: 'ACCESS DENIED: No Active Charter. You cannot authorize spend without formal project authorization.',
              },
            },
          ],
          nextNodeId: null,
        },
        {
          id: 'refuse_wait',
          label: 'REFUSE & WAIT',
          style: 'safe',
          consequences: [
            {
              type: 'add_notification',
              payload: {
                title: 'Correct Decision',
                message: 'No Charter = No Authority. You need formal authorization before committing resources.',
                type: 'success',
              },
            },
          ],
          nextNodeId: 'authority_trap_success',
        },
      ],
    },
    {
      id: 'authority_trap_success',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Correct. I was testing you. Reynolds would have ordered immediately. That's why he's gone.",
      autoAdvanceToNodeId: 'authority_trap_proceed',
      delay: 2000,
    },
    {
      id: 'authority_trap_proceed',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Good instincts. Now get me that Charter. The Business Case is in your files.",
      delay: 1500,
    },
  ],
};

// =============================================================================
// DEMO: Level 1 - Assumption vs Constraint (GDD v4.3 Step 3)
// =============================================================================
export const DIALOGUE_ASSUMPTION_CHECK: DialogueTree = {
  id: 'dt_assumption_check',
  contactId: 'contact_vane',
  startNodeId: 'assumption_1',
  nodes: [
    {
      id: 'assumption_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Don't worry about the cooling system. Facilities promised they'd have the new AC units installed by our start date.",
      delay: 2000,
      choices: [
        {
          id: 'log_constraint',
          label: 'LOG AS CONSTRAINT',
          style: 'risky',
          consequences: [
            {
              type: 'add_notification',
              payload: {
                title: 'Incorrect Classification',
                message: 'A constraint is a limiting factor (budget/time). This is a statement considered true without proof.',
                type: 'error',
              },
            },
          ],
          nextNodeId: 'assumption_wrong',
        },
        {
          id: 'log_assumption',
          label: 'LOG AS ASSUMPTION',
          style: 'safe',
          consequences: [
            {
              type: 'add_notification',
              payload: {
                title: 'Correct!',
                message: 'Logged: Cooling system availability assumed true. Requires validation later.',
                type: 'success',
              },
            },
          ],
          nextNodeId: 'assumption_correct',
        },
      ],
    },
    {
      id: 'assumption_wrong',
      speaker: 'System',
      text: "Incorrect. A 'promise' without a contract guarantee is an assumption - something believed true without proof. Try again.",
      autoAdvanceToNodeId: 'assumption_1',
      delay: 1500,
    },
    {
      id: 'assumption_correct',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Good. Now verify it with Facilities. Assumptions are risks waiting to happen.",
      delay: 1500,
    },
  ],
};

// =============================================================================
// DEMO: Level 1 - Risk Misalignment (GDD v4.3 Step 4)
// =============================================================================
export const DIALOGUE_RISK_MISALIGNMENT: DialogueTree = {
  id: 'dt_risk_misalignment',
  contactId: 'contact_vane',
  startNodeId: 'risk_1',
  nodes: [
    {
      id: 'risk_1',
      speaker: 'System',
      text: 'Warning: Identified High-Level Risks (60% probability of regulatory failure) threaten Business Case ROI.',
      autoAdvanceToNodeId: 'risk_2',
      delay: 1500,
    },
    {
      id: 'risk_2',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "I see the risk warning. What's your call?",
      delay: 1000,
      choices: [
        {
          id: 'ignore_submit',
          label: 'IGNORE & SUBMIT',
          style: 'risky',
          consequences: [
            {
              type: 'game_over',
              payload: {
                reason: 'SPONSOR_LOST_CONFIDENCE',
                message: 'Project rejected by Board. Risks outweighed benefits. Sponsor has lost confidence in your judgment.',
              },
            },
          ],
          nextNodeId: null,
        },
        {
          id: 'discuss_sponsor',
          label: 'DISCUSS WITH SPONSOR',
          style: 'safe',
          consequences: [
            {
              type: 'add_notification',
              payload: {
                title: 'Good Call',
                message: 'Discussing risks with the sponsor shows professional judgment.',
                type: 'success',
              },
            },
          ],
          nextNodeId: 'risk_discuss',
        },
      ],
    },
    {
      id: 'risk_discuss',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Smart move. Let's review the regulatory requirements together. We may need to adjust our approach.",
      autoAdvanceToNodeId: 'risk_resolution',
      delay: 2000,
    },
    {
      id: 'risk_resolution',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "I'll loop in Legal. We can mitigate this by adding a compliance review phase. Update the Charter accordingly.",
      delay: 1800,
    },
  ],
};

// =============================================================================
// DEMO: Level 1 - Budget Conflict (GDD v4.3 Step 6)
// =============================================================================
export const DIALOGUE_BUDGET_CONFLICT: DialogueTree = {
  id: 'dt_budget_conflict',
  contactId: 'contact_finance',
  startNodeId: 'budget_1',
  nodes: [
    {
      id: 'budget_1',
      speaker: 'Finance Director',
      speakerAvatar: '/assets/avatars/finance.png',
      text: "I'm not signing this Charter. The budget looks unrealistic. Where did these numbers come from?",
      delay: 1800,
      choices: [
        {
          id: 'force_sign',
          label: 'FORCE: "The Sponsor approved it, just sign."',
          style: 'risky',
          consequences: [
            {
              type: 'update_constraint',
              payload: { metric: 'morale', delta: -20 },
            },
            {
              type: 'add_notification',
              payload: {
                title: 'Conflict Escalated',
                message: 'Forcing creates resentment. Finance will be watching for any budget slip.',
                type: 'warning',
              },
            },
          ],
          nextNodeId: 'budget_forced',
        },
        {
          id: 'withdraw',
          label: 'WITHDRAW: "I\'ll come back later."',
          style: 'risky',
          consequences: [
            {
              type: 'update_constraint',
              payload: { metric: 'schedule', delta: -10 },
            },
            {
              type: 'add_notification',
              payload: {
                title: 'Delay',
                message: 'Withdrawal causes project delays. The issue remains unresolved.',
                type: 'warning',
              },
            },
          ],
          nextNodeId: 'budget_withdrawn',
        },
        {
          id: 'collaborate',
          label: 'COLLABORATE: "Let\'s review the data together."',
          style: 'safe',
          consequences: [
            {
              type: 'add_notification',
              payload: {
                title: 'Excellent Approach',
                message: 'Collaboration builds trust and leads to better outcomes.',
                type: 'success',
              },
            },
          ],
          nextNodeId: 'budget_collaborate',
        },
      ],
    },
    {
      id: 'budget_forced',
      speaker: 'Finance Director',
      speakerAvatar: '/assets/avatars/finance.png',
      text: "Fine. But I'll be auditing every expense. Don't expect any flexibility.",
      delay: 1500,
    },
    {
      id: 'budget_withdrawn',
      speaker: 'Finance Director',
      speakerAvatar: '/assets/avatars/finance.png',
      text: "Let me know when you have real numbers.",
      delay: 1000,
    },
    {
      id: 'budget_collaborate',
      speaker: 'Finance Director',
      speakerAvatar: '/assets/avatars/finance.png',
      text: "Alright, show me the breakdown. Let's see if we can make this work.",
      autoAdvanceToNodeId: 'budget_resolution',
      delay: 1500,
    },
    {
      id: 'budget_resolution',
      speaker: 'Finance Director',
      speakerAvatar: '/assets/avatars/finance.png',
      text: "I see the issue - the hardware estimates are outdated. Let me get you current pricing. That should bring this in line.",
      autoAdvanceToNodeId: 'budget_success',
      delay: 2000,
    },
    {
      id: 'budget_success',
      speaker: 'System',
      text: 'Budget conflict resolved through collaboration. Finance Director attitude: Supportive.',
      delay: 1000,
    },
  ],
};

// =============================================================================
// DEMO: Level 2 - Marcus Interview (GDD v4.3 Step 2)
// =============================================================================
export const DIALOGUE_MARCUS_INTERVIEW: DialogueTree = {
  id: 'dt_marcus_interview',
  contactId: 'contact_marcus',
  startNodeId: 'marcus_interview_1',
  nodes: [
    {
      id: 'marcus_interview_1',
      speaker: 'Marcus (Sales VP)',
      speakerAvatar: '/assets/avatars/marcus.png',
      text: "You wanted to talk about Project Titan?",
      delay: 1000,
      choices: [
        {
          id: 'aggressive',
          label: '"Sign off on this plan."',
          style: 'risky',
          consequences: [
            {
              type: 'update_constraint',
              payload: { metric: 'morale', delta: -15 },
            },
            {
              type: 'add_notification',
              payload: {
                title: 'Interview Failed',
                message: 'Marcus shuts down. No data gained. Use open-ended questions to build rapport.',
                type: 'error',
              },
            },
          ],
          nextNodeId: 'marcus_shuts_down',
        },
        {
          id: 'open_ended',
          label: '"What are your concerns about the launch date?"',
          style: 'safe',
          consequences: [
            {
              type: 'add_notification',
              payload: {
                title: 'Key Interest Discovered',
                message: 'You unlocked valuable stakeholder information.',
                type: 'success',
              },
            },
          ],
          nextNodeId: 'marcus_opens_up',
        },
      ],
    },
    {
      id: 'marcus_shuts_down',
      speaker: 'Marcus (Sales VP)',
      speakerAvatar: '/assets/avatars/marcus.png',
      text: "I'm too busy for this. Talk to my assistant.",
      delay: 1500,
    },
    {
      id: 'marcus_opens_up',
      speaker: 'Marcus (Sales VP)',
      speakerAvatar: '/assets/avatars/marcus.png',
      text: "If we launch during Black Friday, my team will fail. Q4 sales depend on system uptime.",
      autoAdvanceToNodeId: 'marcus_data_reveal',
      delay: 2000,
    },
    {
      id: 'marcus_data_reveal',
      speaker: 'System',
      text: 'Key Interest discovered: "Avoid Black Friday launch window." Add this to the Stakeholder Register.',
      autoAdvanceToNodeId: 'marcus_rapport',
      delay: 1500,
    },
    {
      id: 'marcus_rapport',
      speaker: 'Marcus (Sales VP)',
      speakerAvatar: '/assets/avatars/marcus.png',
      text: "Thanks for asking. Most PMs just tell us what's happening. It's refreshing to be heard.",
      delay: 1500,
    },
  ],
};

// =============================================================================
// DEMO: Level 2 - IT Manager reveals hidden stakeholder (GDD v4.3 Step 3)
// =============================================================================
export const DIALOGUE_HIDDEN_STAKEHOLDER: DialogueTree = {
  id: 'dt_hidden_stakeholder',
  contactId: 'contact_it_manager',
  startNodeId: 'it_manager_1',
  nodes: [
    {
      id: 'it_manager_1',
      speaker: 'IT Manager',
      speakerAvatar: '/assets/avatars/it_manager.png',
      text: "The server migration sounds straightforward, but there's something you should know...",
      autoAdvanceToNodeId: 'it_manager_2',
      delay: 1500,
    },
    {
      id: 'it_manager_2',
      speaker: 'IT Manager',
      speakerAvatar: '/assets/avatars/it_manager.png',
      text: "Did you check with the Compliance Officer? She writes the rules on data handling. Nothing moves without her approval.",
      delay: 2000,
      choices: [
        {
          id: 'who_compliance',
          label: 'Who is the Compliance Officer?',
          style: 'safe',
          consequences: [
            {
              type: 'add_contact',
              payload: { contactId: 'contact_compliance' },
            },
            {
              type: 'add_notification',
              payload: {
                title: 'New Stakeholder Discovered',
                message: 'Compliance Officer added to Chatter. Identification is iterative!',
                type: 'success',
              },
            },
          ],
          nextNodeId: 'it_manager_reveal',
        },
      ],
    },
    {
      id: 'it_manager_reveal',
      speaker: 'IT Manager',
      speakerAvatar: '/assets/avatars/it_manager.png',
      text: "Her name is Dr. Chen. She's in the Legal department but has oversight on all data projects. I'll add her to your contacts.",
      autoAdvanceToNodeId: 'it_manager_lesson',
      delay: 2000,
    },
    {
      id: 'it_manager_lesson',
      speaker: 'System',
      text: 'Lesson: Stakeholders lead to other stakeholders. Identification is iterative throughout the project.',
      delay: 1500,
    },
  ],
};

// =============================================================================
// GDD v7.1 DISCOVERY PHASE DIALOGUES WITH MINING MECHANICS
// =============================================================================

// Discovery Phase Step A: The Financials (Sponsor Vane) - Mining ROI Target
export const DIALOGUE_VANE_FINANCIALS: DialogueTree = {
  id: 'dt_vane_financials',
  contactId: 'contact_vane',
  startNodeId: 'vane_fin_1',
  nodes: [
    {
      id: 'vane_fin_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Before you draft the Charter, you need to understand the financial constraints.",
      autoAdvanceToNodeId: 'vane_fin_2',
      delay: 1200,
    },
    {
      id: 'vane_fin_2',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "The Board approved this project with conditions. We have a hard cap. We must see a Return on Investment of $350k within 12 months.",
      delay: 2000,
      miningTargets: [
        {
          text: 'Return on Investment of $350k within 12 months',
          evidenceId: 'ev_clue_roi_target',
          isCollected: false,
        },
      ],
      choices: [
        {
          id: 'vane_fin_understood',
          label: 'I understand the ROI requirements',
          style: 'safe',
          consequences: [],
          nextNodeId: 'vane_fin_3',
        },
        {
          id: 'vane_fin_question',
          label: 'What happens if we exceed budget?',
          style: 'neutral',
          consequences: [],
          nextNodeId: 'vane_fin_warning',
        },
      ],
    },
    {
      id: 'vane_fin_warning',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Then the project gets cancelled. And you get to explain to the Board why we wasted their money. Don't let that happen.",
      autoAdvanceToNodeId: 'vane_fin_3',
      delay: 1800,
    },
    {
      id: 'vane_fin_3',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Good. Now talk to the Strategy team about alignment. And check with Legal about the vendor agreement.",
      delay: 1500,
    },
  ],
};

// Discovery Phase Step B: The Strategy (Strategy Lead) - Mining Strategic Alignment
export const DIALOGUE_STRATEGY_LEAD: DialogueTree = {
  id: 'dt_strategy_lead',
  contactId: 'contact_strategy',
  startNodeId: 'strategy_1',
  nodes: [
    {
      id: 'strategy_1',
      speaker: 'Strategy Lead',
      speakerAvatar: '/assets/avatars/strategy.png',
      text: "Director Vane mentioned you'd be reaching out. You want to understand the strategic context?",
      delay: 1200,
      choices: [
        {
          id: 'strategy_ask',
          label: 'What are the long-term goals for this project?',
          style: 'safe',
          consequences: [],
          nextNodeId: 'strategy_2',
        },
      ],
    },
    {
      id: 'strategy_2',
      speaker: 'Strategy Lead',
      speakerAvatar: '/assets/avatars/strategy.png',
      text: "Here's the thing - this isn't about profit. It's about Internal Efficiency to align with the Q4 Corporate Goal.",
      delay: 1800,
      miningTargets: [
        {
          text: "Internal Efficiency to align with the Q4 Corporate Goal",
          evidenceId: 'ev_clue_strategic_align',
          isCollected: false,
        },
      ],
      autoAdvanceToNodeId: 'strategy_3',
    },
    {
      id: 'strategy_3',
      speaker: 'Strategy Lead',
      speakerAvatar: '/assets/avatars/strategy.png',
      text: "The old servers are causing 3-hour delays in daily reports. That's killing our competitive edge. Fix that, and the Board is happy.",
      delay: 2000,
      choices: [
        {
          id: 'strategy_thanks',
          label: 'This helps clarify the benefits. Thank you.',
          style: 'safe',
          consequences: [
            {
              type: 'add_notification',
              payload: {
                title: 'Strategic Context Gathered',
                message: 'You now understand the difference between ROI and strategic alignment.',
                type: 'success',
              },
            },
          ],
          nextNodeId: 'strategy_4',
        },
      ],
    },
    {
      id: 'strategy_4',
      speaker: 'Strategy Lead',
      speakerAvatar: '/assets/avatars/strategy.png',
      text: "Remember - ROI is for the Business Case. Strategic alignment is for the Benefits Management Plan. Don't confuse them.",
      delay: 1500,
    },
  ],
};

// Discovery Phase Step C: The Uncertainty (Vane again) - Mining Assumption
export const DIALOGUE_VANE_ASSUMPTION: DialogueTree = {
  id: 'dt_vane_assumption',
  contactId: 'contact_vane',
  startNodeId: 'vane_assume_1',
  nodes: [
    {
      id: 'vane_assume_1',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "One more thing about the site preparation...",
      autoAdvanceToNodeId: 'vane_assume_2',
      delay: 1000,
    },
    {
      id: 'vane_assume_2',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Facilities will probably have the power ready by the time TechCore arrives. They've promised Q1 delivery.",
      delay: 1800,
      miningTargets: [
        {
          text: 'Facilities will probably have the power ready',
          evidenceId: 'ev_clue_power_assumption',
          isCollected: false,
        },
      ],
      choices: [
        {
          id: 'vane_assume_accept',
          label: 'Understood. I\'ll plan accordingly.',
          style: 'neutral',
          consequences: [],
          nextNodeId: 'vane_assume_3',
        },
        {
          id: 'vane_assume_question',
          label: 'Is that confirmed or just expected?',
          style: 'safe',
          consequences: [
            {
              type: 'add_notification',
              payload: {
                title: 'Critical Thinking!',
                message: 'Questioning assumptions shows good PM instincts.',
                type: 'success',
              },
            },
          ],
          nextNodeId: 'vane_assume_honest',
        },
      ],
    },
    {
      id: 'vane_assume_honest',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "...It's expected. Facilities hasn't confirmed. Good catch. Log that as an assumption and verify it.",
      autoAdvanceToNodeId: 'vane_assume_3',
      delay: 1500,
    },
    {
      id: 'vane_assume_3',
      speaker: 'Director Vane',
      speakerAvatar: '/assets/avatars/vane.png',
      text: "Remember: Assumptions without verification become risks. Track them properly.",
      delay: 1500,
    },
  ],
};

// Discovery Phase Step D: The Agreement (Legal Counsel) - File Attachment
export const DIALOGUE_LEGAL_AGREEMENT: DialogueTree = {
  id: 'dt_legal_agreement',
  contactId: 'contact_legal',
  startNodeId: 'legal_1',
  nodes: [
    {
      id: 'legal_1',
      speaker: 'Legal Counsel',
      speakerAvatar: '/assets/avatars/legal.png',
      text: "You're the new PM on Titan? I've been waiting for someone to ask about the vendor contract.",
      delay: 1200,
      choices: [
        {
          id: 'legal_ask',
          label: 'What do I need to know about vendor agreements?',
          style: 'safe',
          consequences: [],
          nextNodeId: 'legal_2',
        },
      ],
    },
    {
      id: 'legal_2',
      speaker: 'Legal Counsel',
      speakerAvatar: '/assets/avatars/legal.png',
      text: "We already signed a Master Services Agreement with TechCore. You must stick to their rates. Any deviation requires renegotiation.",
      delay: 1800,
      autoAdvanceToNodeId: 'legal_3',
    },
    {
      id: 'legal_3',
      speaker: 'Legal Counsel',
      speakerAvatar: '/assets/avatars/legal.png',
      text: "Here - I'm sending you the contract. This is an official Agreement that must be referenced in your Charter.",
      delay: 1500,
      miningTargets: [
        {
          text: 'Master Services Agreement with TechCore',
          evidenceId: 'ev_file_techcore_msa',
          isCollected: false,
        },
      ],
      autoAdvanceToNodeId: 'legal_4',
    },
    {
      id: 'legal_4',
      speaker: 'System',
      text: '📎 File attached: TechCore_MSA.pdf',
      autoAdvanceToNodeId: 'legal_5',
      delay: 500,
    },
    {
      id: 'legal_5',
      speaker: 'Legal Counsel',
      speakerAvatar: '/assets/avatars/legal.png',
      text: "Read it carefully. There's a clause about regulatory compliance that might affect your timeline.",
      delay: 1500,
    },
  ],
};

// All dialogue trees for easy import
export const DIALOGUE_TREES: DialogueTree[] = [
  // GDD v7.1 Discovery Phase Dialogues (Mining Mechanics)
  DIALOGUE_VANE_FINANCIALS,
  DIALOGUE_STRATEGY_LEAD,
  DIALOGUE_VANE_ASSUMPTION,
  DIALOGUE_LEGAL_AGREEMENT,
  // Prologue & Arc 1 Dialogues
  DIALOGUE_PROLOGUE_COMPLETE,
  DIALOGUE_VANE_CHARTER_INTRO,
  DIALOGUE_VANE_CHARTER_COMPLETE,
  DIALOGUE_VANE_STAKEHOLDERS_INTRO,
  DIALOGUE_VANE_STAKEHOLDERS_COMPLETE,
  // Arc 2 Dialogues (Levels 3-10)
  DIALOGUE_VANE_PMP_INTRO,
  DIALOGUE_VANE_PMP_COMPLETE,
  DIALOGUE_SCOPE_INTRO,
  DIALOGUE_SCOPE_COMPLETE,
  // Demo-specific dialogues (GDD v4.3)
  DIALOGUE_AUTHORITY_TRAP,
  DIALOGUE_ASSUMPTION_CHECK,
  DIALOGUE_RISK_MISALIGNMENT,
  DIALOGUE_BUDGET_CONFLICT,
  DIALOGUE_MARCUS_INTERVIEW,
  DIALOGUE_HIDDEN_STAKEHOLDER,
  // Legacy dialogues
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
