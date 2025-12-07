import { ExamQuestion } from '../types';

// =============================================================================
// EXAM QUESTIONS - GDD v4.3 Demo Scope
// =============================================================================
// Level 1: The Handover (Process 4.1 - Develop Project Charter)
// Level 2: Who's Who? (Process 13.1 - Identify Stakeholders)
//
// Each level has 10 questions across multiple pools.
// ExamSim randomly selects 5 questions per level.
// =============================================================================

export const EXAM_QUESTIONS: ExamQuestion[] = [
  // ===========================================================================
  // LEVEL 1 - THE HANDOVER (Develop Project Charter)
  // ===========================================================================

  // Pool A: Authority & Purpose (Q1-Q2)
  {
    id: 'L1_Q1',
    levelId: 1,
    question: 'A senior manager asks you to commit resources to a new initiative, but the Project Charter is not yet signed. What is the BEST course of action?',
    options: [
      'Commit the resources to maintain a good relationship with the manager',
      'Refuse until the Charter is formally signed and you have authority',
      'Ask the team to start working unofficially',
      'Escalate immediately to the CEO',
    ],
    correctIndex: 1,
    explanation: 'Without a signed Charter, the project manager has no formal authority to commit resources. The Charter formally authorizes the project and gives the PM authority to apply organizational resources.',
  },
  {
    id: 'L1_Q2',
    levelId: 1,
    question: 'You realize the organizational goals for the project are vague. Which document establishes the project\'s formal existence and provides the PM with authority?',
    options: [
      'Project Management Plan',
      'Business Case',
      'Project Charter',
      'Scope Statement',
    ],
    correctIndex: 2,
    explanation: 'The Project Charter formally authorizes the existence of a project and provides the project manager with authority to apply organizational resources to project activities.',
  },

  // Pool B: Inputs & Origins (Q3-Q4)
  {
    id: 'L1_Q3',
    levelId: 1,
    question: 'Which document justifies the financial investment and expected ROI for a project?',
    options: [
      'Project Charter',
      'Business Case',
      'Statement of Work',
      'Requirements Document',
    ],
    correctIndex: 1,
    explanation: 'The Business Case documents the business need and cost-benefit analysis that justifies the project investment. It is a key input to Develop Project Charter.',
  },
  {
    id: 'L1_Q4',
    levelId: 1,
    question: 'The sponsor asks why certain high-level requirements are included in the Project Charter. Where did these likely originate?',
    options: [
      'The project team brainstorming session',
      'Agreements, Contracts, or the Business Case',
      'The Risk Register',
      'Previous project lessons learned',
    ],
    correctIndex: 1,
    explanation: 'High-level requirements in the Charter typically come from agreements/contracts (external projects) or the Business Case (internal projects). These establish the initial scope boundaries.',
  },

  // Pool C: Content & Granularity (Q5-Q6)
  {
    id: 'L1_Q5',
    levelId: 1,
    question: 'A stakeholder demands a detailed activity-by-activity schedule in the Project Charter. What is your response?',
    options: [
      'Include the detailed schedule to satisfy the stakeholder',
      'Reject the request; Charters contain only Summary Milestones',
      'Create a separate document with the detailed schedule',
      'Defer the decision until Planning',
    ],
    correctIndex: 1,
    explanation: 'The Project Charter contains only summary milestone schedules, not detailed activity-level schedules. Detailed scheduling occurs during the Planning phase in the Develop Schedule process.',
  },
  {
    id: 'L1_Q6',
    levelId: 1,
    question: 'Is a detailed communication strategy appropriate for inclusion in a Project Charter?',
    options: [
      'Yes, all communication details should be in the Charter',
      'Yes, but only for external stakeholders',
      'No, that belongs in the Project Management Plan',
      'No, communication is not documented anywhere',
    ],
    correctIndex: 2,
    explanation: 'Detailed communication strategies belong in the Communications Management Plan, which is part of the Project Management Plan developed during Planning. The Charter only provides high-level information.',
  },

  // Pool D: Assumptions & Constraints (Q9-Q10 per GDD numbering)
  {
    id: 'L1_Q9',
    levelId: 1,
    question: 'The sponsor states that "Vendor X will likely deliver on time" without a contract guarantee. Where do you document this?',
    options: [
      'Risk Register',
      'Project Charter under Constraints',
      'Assumption Log',
      'Issues Log',
    ],
    correctIndex: 2,
    explanation: 'Statements believed to be true without proof are documented in the Assumption Log. Assumptions carry risk and should be validated. Constraints are limiting factors imposed on the project.',
  },
  {
    id: 'L1_Q10',
    levelId: 1,
    question: 'What are the two primary outputs of the Develop Project Charter process?',
    options: [
      'Project Charter and Project Management Plan',
      'Project Charter and Assumption Log',
      'Business Case and Project Charter',
      'Project Charter and Stakeholder Register',
    ],
    correctIndex: 1,
    explanation: 'The Develop Project Charter process (4.1) produces two outputs: the Project Charter and the Assumption Log. The Assumption Log captures high-level assumptions and constraints.',
  },

  // Pool E: Timing & Lifecycle (Q7-Q8)
  {
    id: 'L1_Q7',
    levelId: 1,
    question: 'During Planning, a conflict arises regarding the project\'s high-level boundaries and scope. Which document is the source of truth?',
    options: [
      'Scope Management Plan',
      'Work Breakdown Structure',
      'Project Charter',
      'Requirements Traceability Matrix',
    ],
    correctIndex: 2,
    explanation: 'The Project Charter is the source of truth for high-level scope, boundaries, and project objectives. It serves as the foundational reference throughout the project lifecycle.',
  },
  {
    id: 'L1_Q8',
    levelId: 1,
    question: 'The sponsor wants to skip the Project Charter to "save time." What is the primary risk of this approach?',
    options: [
      'The project may go over budget',
      'Scope Creep and lack of formal authority',
      'Team morale may suffer',
      'Documentation will be incomplete',
    ],
    correctIndex: 1,
    explanation: 'Skipping the Charter means no formal project authorization, no defined scope boundaries, and no PM authority. This leads to scope creep, unclear expectations, and lack of stakeholder alignment.',
  },

  // ===========================================================================
  // LEVEL 2 - WHO'S WHO? (Identify Stakeholders)
  // ===========================================================================

  // Pool A: Identification Strategy (Q1-Q3)
  {
    id: 'L2_Q1',
    levelId: 2,
    question: 'The Project Charter has just been signed. What is your immediate next step?',
    options: [
      'Begin detailed planning',
      'Identify Stakeholders',
      'Create the WBS',
      'Develop the Schedule',
    ],
    correctIndex: 1,
    explanation: 'After the Charter is signed, the next process is Identify Stakeholders (13.1). This ensures all people and organizations impacted by the project are known before planning begins.',
  },
  {
    id: 'L2_Q2',
    levelId: 2,
    question: 'You discover a new regulatory body that affects your project halfway through execution. What is the correct procedure?',
    options: [
      'Ignore them since planning is complete',
      'Add them to the Stakeholder Register immediately; identification is iterative',
      'Wait until the next project phase',
      'Ask the sponsor to handle them',
    ],
    correctIndex: 1,
    explanation: 'Stakeholder identification is an iterative process that continues throughout the project. New stakeholders should be added to the register immediately when discovered.',
  },
  {
    id: 'L2_Q3',
    levelId: 2,
    question: 'You are new to the company and need to identify stakeholders. Who is the BEST person to ask for the initial list?',
    options: [
      'The previous project manager',
      'The Project Sponsor',
      'The HR department',
      'Your direct team members',
    ],
    correctIndex: 1,
    explanation: 'The Project Sponsor is the primary source for initial stakeholder identification. They have organizational knowledge, authority, and vested interest in identifying key players.',
  },

  // Pool B: Classification & Analysis (Q4-Q6)
  {
    id: 'L2_Q4',
    levelId: 2,
    question: 'On the Power/Interest Grid, a stakeholder with High Power but Low Interest should be managed using which strategy?',
    options: [
      'Manage Closely',
      'Keep Informed',
      'Keep Satisfied',
      'Monitor',
    ],
    correctIndex: 2,
    explanation: 'High Power/Low Interest stakeholders should be kept satisfied. They have the power to impact the project but are not actively engaged, so maintain their support without overwhelming them.',
  },
  {
    id: 'L2_Q5',
    levelId: 2,
    question: 'On the Power/Interest Grid, a stakeholder with Low Power but High Interest should be managed using which strategy?',
    options: [
      'Manage Closely',
      'Keep Informed',
      'Keep Satisfied',
      'Monitor',
    ],
    correctIndex: 1,
    explanation: 'Low Power/High Interest stakeholders should be kept informed. While they cannot directly influence the project, their interest means they want to know what is happening.',
  },
  {
    id: 'L2_Q6',
    levelId: 2,
    question: 'What are the three attributes used in the Salience Model to classify stakeholders?',
    options: [
      'Power, Interest, Influence',
      'Power, Urgency, Legitimacy',
      'Authority, Interest, Impact',
      'Engagement, Support, Resistance',
    ],
    correctIndex: 1,
    explanation: 'The Salience Model uses three attributes: Power (ability to impose will), Urgency (need for immediate attention), and Legitimacy (appropriate involvement). Stakeholders with all three are "Definitive."',
  },

  // Pool C: Engagement Strategy (Q7-Q8)
  {
    id: 'L2_Q7',
    levelId: 2,
    question: 'A Union Representative has the power to halt work and has deep interest in the project outcome. What is the appropriate engagement strategy?',
    options: [
      'Monitor',
      'Keep Informed',
      'Keep Satisfied',
      'Manage Closely',
    ],
    correctIndex: 3,
    explanation: 'High Power/High Interest stakeholders must be managed closely. They can significantly impact the project and are actively engaged, requiring regular communication and attention.',
  },
  {
    id: 'L2_Q8',
    levelId: 2,
    question: 'A stakeholder is resistant to the project but lacks any real power to affect it. What is the appropriate engagement strategy?',
    options: [
      'Manage Closely',
      'Keep Informed / Monitor',
      'Ignore completely',
      'Escalate to the sponsor',
    ],
    correctIndex: 1,
    explanation: 'Low Power stakeholders (even if resistant) should be kept informed or monitored. Their resistance is less impactful, but keeping them informed may help shift their attitude over time.',
  },

  // Pool D: Tools & Outputs (Q9-Q10)
  {
    id: 'L2_Q9',
    levelId: 2,
    question: 'You need to understand a stakeholder\'s confidential political goals and hidden concerns. What is the BEST technique?',
    options: [
      'Send a survey',
      'Interviews/Conversations',
      'Review organizational documents',
      'Check the organizational chart',
    ],
    correctIndex: 1,
    explanation: 'One-on-one interviews and conversations are the best way to uncover confidential or politically sensitive information. Surveys and documents cannot capture nuanced, hidden concerns.',
  },
  {
    id: 'L2_Q10',
    levelId: 2,
    question: 'What is the primary output document that captures all stakeholder information?',
    options: [
      'Project Charter',
      'Communication Management Plan',
      'Stakeholder Register',
      'RACI Chart',
    ],
    correctIndex: 2,
    explanation: 'The Stakeholder Register is the primary output of Identify Stakeholders. It contains identification information, assessment information, and stakeholder classification for all identified stakeholders.',
  },
];

// Helper to get questions by level
export const getQuestionsByLevel = (levelId: number): ExamQuestion[] => {
  return EXAM_QUESTIONS.filter(q => q.levelId === levelId);
};

// Helper function to get random questions for exam
export const getRandomExamQuestions = (levelId: number, count: number = 5): ExamQuestion[] => {
  const levelQuestions = getQuestionsByLevel(levelId);
  const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Passing score threshold (percentage)
export const PASSING_SCORE = 80; // 4 out of 5 = 80%

// Question pools for reference (GDD v4.3)
export const QUESTION_POOLS = {
  level1: {
    A: ['L1_Q1', 'L1_Q2'],        // Authority & Purpose
    B: ['L1_Q3', 'L1_Q4'],        // Inputs & Origins
    C: ['L1_Q5', 'L1_Q6'],        // Content & Granularity
    D: ['L1_Q9', 'L1_Q10'],       // Assumptions & Constraints
    E: ['L1_Q7', 'L1_Q8'],        // Timing & Lifecycle
  },
  level2: {
    A: ['L2_Q1', 'L2_Q2', 'L2_Q3'], // Identification Strategy
    B: ['L2_Q4', 'L2_Q5', 'L2_Q6'], // Classification & Analysis
    C: ['L2_Q7', 'L2_Q8'],          // Engagement Strategy
    D: ['L2_Q9', 'L2_Q10'],         // Tools & Outputs
  },
};
