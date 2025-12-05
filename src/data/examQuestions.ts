import { ExamQuestion } from '../types';

/**
 * ExamSim Questions per GDD v3.3
 *
 * These questions are shown at the end of each level to test retention
 * of the specific mechanics and PMBOK concepts just played.
 */

export const EXAM_QUESTIONS: ExamQuestion[] = [
  // ===== LEVEL 1: The Handover (Develop Project Charter) =====

  // Q1: Authority Trap
  {
    id: 'l1_q1_authority',
    levelId: 1,
    question: 'Your sponsor asks you to order materials before the Project Charter is signed. What should you do?',
    options: [
      'Order the materials immediately to save time',
      'Refuse and wait for the Charter to be authorized first',
      'Order half the materials as a compromise',
      'Delegate the decision to a team member',
    ],
    correctIndex: 1,
    explanation: 'Without an authorized Project Charter, the PM has no authority to commit organizational resources. The Charter formally authorizes the project and grants the PM authority to apply resources.',
  },

  // Q2: Risk Misalignment
  {
    id: 'l1_q2_risks',
    levelId: 1,
    question: 'High-level risks are identified that threaten the Business Case ROI. What is the BEST course of action?',
    options: [
      'Ignore the risks and proceed with the Charter',
      'Cancel the project immediately',
      'Discuss with the Sponsor to realign expectations',
      'Hide the risks from stakeholders',
    ],
    correctIndex: 2,
    explanation: 'When high-level risks threaten the business case, the PM should discuss with the Sponsor to realign expectations and determine if the project should proceed, be modified, or be cancelled.',
  },

  // Q3: Budget Conflict (Conflict Resolution)
  {
    id: 'l1_q3_conflict',
    levelId: 1,
    question: 'A key stakeholder refuses to sign the Charter because they believe the budget is unrealistic. What conflict resolution technique should you use?',
    options: [
      'Forcing - Insist the Sponsor approved it',
      'Withdrawal - Come back later when they calm down',
      'Collaborate/Problem Solve - Review the data together',
      'Smoothing - Emphasize areas of agreement',
    ],
    correctIndex: 2,
    explanation: 'Collaborating (Problem Solving) incorporates multiple viewpoints to reach consensus. By reviewing the data together, you can correct any errors and build stakeholder buy-in.',
  },

  // Q4: Economic Feasibility
  {
    id: 'l1_q4_business_case',
    levelId: 1,
    question: 'What is the PRIMARY input document used to justify the investment in a project?',
    options: [
      'Project Management Plan',
      'Business Case',
      'Work Breakdown Structure',
      'Risk Register',
    ],
    correctIndex: 1,
    explanation: 'The Business Case documents the economic feasibility study and justifies the project investment. It is a key input to the Develop Project Charter process.',
  },

  // Q5: Charter Authority
  {
    id: 'l1_q5_no_charter',
    levelId: 1,
    question: 'Midway through execution, it is discovered that no Project Charter exists. What is the MOST significant impact?',
    options: [
      'The schedule will be delayed',
      'The PM lacks formal authority to apply resources',
      'The budget cannot be tracked',
      'Stakeholders cannot be identified',
    ],
    correctIndex: 1,
    explanation: 'The Project Charter formally authorizes the project and gives the PM authority to apply organizational resources. Without it, the PM has no formal authority.',
  },

  // ===== LEVEL 2: Who\'s Who? (Identify Stakeholders) =====

  // Q6: Next Step After Charter
  {
    id: 'l2_q1_next_step',
    levelId: 2,
    question: 'The Project Charter has been completed and authorized. What is the NEXT step in the Initiating Process Group?',
    options: [
      'Create the WBS',
      'Develop the Project Management Plan',
      'Identify Stakeholders',
      'Define Scope',
    ],
    correctIndex: 2,
    explanation: 'After the Charter is authorized, the next process in Initiating is Identify Stakeholders (13.1). Planning processes like WBS and PMP come later.',
  },

  // Q7: Power/Interest Grid
  {
    id: 'l2_q2_grid',
    levelId: 2,
    question: 'Union representatives have High Power and High Interest in your project. How should they be classified on the Power/Interest Grid?',
    options: [
      'Monitor (Minimal effort)',
      'Keep Informed',
      'Keep Satisfied',
      'Manage Closely',
    ],
    correctIndex: 3,
    explanation: 'Stakeholders with High Power and High Interest should be placed in the "Manage Closely" quadrant. They require the most attention and engagement.',
  },

  // Q8: Salience Model Attributes
  {
    id: 'l2_q3_salience',
    levelId: 2,
    question: 'What are the THREE attributes used in the Salience Model for stakeholder classification?',
    options: [
      'Power, Budget, Timeline',
      'Power, Urgency, Legitimacy',
      'Influence, Interest, Impact',
      'Authority, Control, Engagement',
    ],
    correctIndex: 1,
    explanation: 'The Salience Model classifies stakeholders based on three attributes: Power (ability to impose will), Urgency (need for immediate attention), and Legitimacy (appropriate involvement).',
  },

  // Q9: Broad Stakeholder Groups
  {
    id: 'l2_q4_decompose',
    levelId: 2,
    question: 'A team member suggests adding "The Entire Company" to the stakeholder register. What is the BEST response?',
    options: [
      'Accept the suggestion as-is',
      'Ignore the suggestion entirely',
      'Break it down into specific categories (HR, IT, Managers, etc.)',
      'Add only department heads',
    ],
    correctIndex: 2,
    explanation: 'Broad stakeholder groups like "The Entire Company" are too vague to manage effectively. They should be decomposed into specific, manageable categories.',
  },

  // Q10: Iterative Identification
  {
    id: 'l2_q5_late_stakeholder',
    levelId: 2,
    question: 'A new regulatory body is identified after you\'ve "finalized" the stakeholder register. What should you do?',
    options: [
      'Ignore them until the next project phase',
      'Wait until the next planning cycle',
      'Update the register immediately and perform new analysis',
      'Note it for lessons learned',
    ],
    correctIndex: 2,
    explanation: 'Stakeholder identification is an iterative process that continues throughout the project. New stakeholders should be added and analyzed immediately when discovered.',
  },
];

// Helper to get questions by level
export const getQuestionsByLevel = (levelId: number): ExamQuestion[] => {
  return EXAM_QUESTIONS.filter(q => q.levelId === levelId);
};

// Passing score threshold (percentage)
export const PASSING_SCORE = 80; // 4 out of 5 = 80%
