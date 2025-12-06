// Enums/Types for PMP classifications
export type PowerLevel = 'High' | 'Low' | 'Unknown';
export type InterestLevel = 'High' | 'Low' | 'Unknown';
export type UrgencyLevel = 'High' | 'Low' | 'Unknown';
export type LegitimacyLevel = 'High' | 'Low' | 'Unknown';
export type StakeholderAttitude = 'Supportive' | 'Neutral' | 'Resistant' | 'Leading' | 'Unknown';
export type SalienceClass = 'Definitive' | 'Dominant' | 'Dangerous' | 'Dependent' | 'Dormant' | 'Discretionary' | 'Demanding' | 'None';
export type EvidenceType = 'BusinessCase' | 'Agreement' | 'Risk' | 'TechnicalSpec' | 'Regulatory' | 'Template' | 'Timeline';

// Document types for ProcessMap inputs/outputs
export type DocumentType =
  | 'BusinessCase'
  | 'Agreement'
  | 'ProjectCharter'
  | 'StakeholderRegister'
  | 'ScopeManagementPlan'
  | 'RequirementsDoc'
  | 'WBS'
  | 'Schedule'
  | 'CostBaseline'
  | 'RiskRegister'
  | 'ChangeRequest'
  | 'LessonsLearned'
  | 'AssumptionLog';

// Document Analysis Task Types
export type AnalysisTaskType =
  | 'find_violation'
  | 'find_justification'
  | 'find_deliverables'
  | 'find_stakeholder'
  | 'find_budget'
  | 'free_exploration';

// Triple Constraint Metrics (Status HUD)
export interface ConstraintMetrics {
  schedule: number;  // 0-100, % of schedule remaining
  budget: number;    // 0-100, % of budget remaining
  morale: number;    // 0-100, team morale
  scope: number;     // 0-100, 50 = balanced, <50 = scope creep, >50 = gold plating
}

// Game Over Reasons
export type GameOverReason = 'UNAUTHORIZED_SPEND' | 'BUDGET_DEPLETED' | 'SPONSOR_LOST_CONFIDENCE';

// App IDs for unlock tracking
export type AppId = 'chatter' | 'email' | 'pmis' | 'files' | 'browser' | 'wikibok' | 'examsim' | 'processmap';

// Dialogue/Chatter System Types
export interface DialogueChoice {
  id: string;
  label: string;
  style: 'safe' | 'risky' | 'neutral'; // Visual hint (blue/red/gray outline)
  consequences: DialogueConsequence[];
  nextNodeId: string | null; // null = end conversation
}

export interface DialogueConsequence {
  type: 'unlock_app' | 'game_over' | 'update_stakeholder' | 'add_notification' | 'unlock_process' | 'advance_level' | 'add_contact' | 'add_inventory' | 'identify_stakeholder' | 'decompose_stakeholder' | 'update_constraint';
  payload: Record<string, unknown>;
}

export interface DialogueNode {
  id: string;
  speaker: string; // 'Director Vane', 'Marcus', 'System', 'Player'
  speakerAvatar?: string;
  text: string;
  choices?: DialogueChoice[]; // If present, wait for player choice
  autoAdvanceToNodeId?: string; // If no choices, auto-advance after typing
  delay?: number; // ms delay before showing this node
  consequences?: DialogueConsequence[]; // Optional consequences triggered when this node is reached
}

export interface DialogueTree {
  id: string;
  contactId: string;
  nodes: DialogueNode[];
  startNodeId: string;
}

// Chatter Contact
export interface ChatterContact {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  isUnlocked: boolean;
  hasUnreadMessages: boolean;
  lastMessage?: string;
}

// Conversation History Entry
export interface ConversationMessage {
  nodeId: string;
  speaker: string;
  text: string;
  timestamp: number;
  isPlayerChoice?: boolean;
}

// Process Card for ProcessMap
export interface ProcessCard {
  id: string;
  name: string;
  processGroup: 'Initiating' | 'Planning' | 'Executing' | 'Monitoring' | 'Closing';
  knowledgeArea: string;
  description: string;
  isUnlocked: boolean;
  levelRequired: number;
  // Enhanced fields for ProcessMap execution
  requiredInputs: ProcessInput[];
  optionalInputs?: ProcessInput[];
  outputs: ProcessOutput[];
  toolsTechniques: string[];
}

// Process Input/Output definitions
export interface ProcessInput {
  id: string;
  name: string;
  documentType: DocumentType;
  isRequired: boolean;
  description: string;
  qualityImpact: number; // 0-100, how much this affects output quality
}

export interface ProcessOutput {
  id: string;
  name: string;
  documentType: DocumentType;
  templateId: string;
  qualityFormula: 'average' | 'minimum' | 'weighted';
}

// Process Execution Record
export interface ProcessExecution {
  id: string;
  processId: string;
  timestamp: number;
  inputs: { inputId: string; documentId: string; quality: number }[];
  outputQuality: number;
  outputDocumentId: string;
  wasSuccessful: boolean;
  missingInputs: string[];
}

// Generated Document from ProcessMap
export interface GeneratedDocument {
  id: string;
  name: string;
  processId: string;
  createdAt: number;
  quality: number; // 0-100
  content: DocumentContent[];
  isUsableAsInput: boolean;
}

// Document for Files App
export interface GameDocument {
  id: string;
  name: string;
  folder: 'Documents' | 'Templates' | 'OrgCharts' | 'Generated';
  content: DocumentContent[];
  isDiscovered: boolean;
  // Document Analysis properties
  activeTaskId?: string;
  availableTasks?: string[];
  hasBeenAnalyzed?: boolean;
}

export interface DocumentContent {
  type: 'text' | 'heading' | 'highlight' | 'image' | 'redacted';
  text?: string;
  highlightId?: string; // If highlightable, links to evidence
  evidenceType?: EvidenceType;
  // Document Analysis properties
  isSelectableForTask?: boolean;
  analysisLabel?: string;
  wrongSelectionReason?: string;
}

// Document Analysis Task
export interface DocumentAnalysisTask {
  id: string;
  documentId: string;
  taskType: AnalysisTaskType;
  promptText: string;
  hintText?: string;
  correctHighlightIds: string[];
  incorrectFeedback: Record<string, string>;
  defaultIncorrectMessage: string;
  successFeedback: string;
  isCompleted: boolean;
  levelId: number;
  unlockCondition?: string;
  consequence?: DocumentTaskConsequence;
}

export interface DocumentTaskConsequence {
  type: 'extract_evidence' | 'identify_stakeholder' | 'unlock_document' | 'complete_objective' | 'advance_stage';
  payload: Record<string, unknown>;
}

// Highlight Attempt Record
export interface HighlightAttempt {
  taskId: string;
  documentId: string;
  highlightId: string;
  wasCorrect: boolean;
  timestamp: number;
}

// Highlight Feedback Display
export interface HighlightFeedback {
  type: 'correct' | 'incorrect' | 'hint';
  title: string;
  message: string;
  educationalContent?: string;
}

// Level/Progression State
export interface LevelObjective {
  id: string;
  description: string;
  isCompleted: boolean;
}

export interface LevelState {
  currentLevel: number;
  levelTitle: string;
  objectives: LevelObjective[];
  isLevelComplete: boolean;
}

// The "NPC" entity
export interface Stakeholder {
  id: string;
  name: string;
  role: string; // e.g., "CEO", "Functional Manager"
  avatarUrl: string; // Path to asset

  // Power/Interest Grid attributes
  power: PowerLevel;
  interest: InterestLevel;
  attitude: StakeholderAttitude;

  // Salience Model attributes (Level 2)
  urgency: UrgencyLevel;
  legitimacy: LegitimacyLevel;
  salienceClass?: SalienceClass;

  // State flags
  isIdentified: boolean; // Has the player met them?
  isAnalyzed: boolean;   // Has the player placed them on the grid correctly?

  // Decomposition (for broad stakeholder groups)
  isDecomposable?: boolean;
  childStakeholderIds?: string[];
  parentStakeholderId?: string;

  // Dialogue/Narrative data
  dialogueTreeId: string;
  secret: string | null; // e.g., "Knows about the incompatibility"
}

// Inventory Items (Collected clues/documents)
export interface EvidenceItem {
  id: string;
  name: string;
  description: string;
  type: EvidenceType;
  
  // Gameplay properties
  isDistractor: boolean; // If true, this item SHOULD NOT be used in the Charter
  qualityScore: number;  // 0-100, affects project quality if used
}

// The Charter Document (The final puzzle)
export interface CharterSection {
  id: string; // e.g., "business_case", "high_level_risks"
  label: string;
  requiredType: EvidenceType; // The type of evidence that belongs here
  assignedItemId: string | null; // The ID of the EvidenceItem dropped here
  isLocked: boolean; // Some sections might be pre-filled by OPA Templates
}

// Assumption Log Entry
export interface AssumptionEntry {
  id: string;
  content: string;
  category: 'Fact' | 'Assumption' | 'Risk';
  isCorrectlyClassified: boolean;
}

// Global Game State
export interface GameState {
  currentPhase: 'Initiation' | 'Planning';
  gameStage: 'Login' | 'Investigation' | 'Authorization' | 'GameOver';

  // Level Progression
  currentLevel: number;
  levelTitle: string;
  levelObjectives: Record<string, boolean>;

  // Triple Constraint HUD (GDD v3.3)
  constraints: ConstraintMetrics;

  // Global Resources (legacy, may be replaced by constraints)
  socialCapital: number; // Currency for using "Expert Judgment"
  corporateCulture: number; // 0-100 (Health meter)
  riskMeter: number; // 0-100 (Risk of failure)

  // Progression Flags
  hasFoundMole: boolean;
  hasConsultedSME: boolean;
  charterSubmissionCount: number; // Limit to 3 attempts
  isPMISUnlocked: boolean;
  notifications: Notification[];
  isOnboardingCompleted: boolean;

  // ExamSim (Post-Level Assessment)
  examPending: boolean;
  pendingExamLevel: number | null;

  // App Unlock Tracking
  unlockedApps: AppId[];
  unlockedProcesses: string[]; // Process card IDs

  // Game Over State
  isGameOver: boolean;
  gameOverReason: GameOverReason | null;
}

// PMIS Dashboard State
export interface PMISState {
  stakeholders: Stakeholder[];
  charterSections: CharterSection[];
  assumptionLog: AssumptionEntry[];
}
// Inventory State
export interface InventoryState {
  items: EvidenceItem[];
  selectedItemId: string | null;
}

// OS / Window Management State
export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  type: 'PMIS' | 'Email' | 'Browser' | 'Document' | 'Chatter' | 'Files' | 'WikiBOK' | 'ProcessMap'; // Types of windows
  contentId?: string; // Optional ID to link to specific content (e.g. document ID)
}

export interface DesktopState {
  windows: WindowState[];
  activeWindowId: string | null;
}

// Email Types
export interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  categoryColor?: string; // Hex code for the dot
  body?: string;
  relatedEvidenceId?: string; // ID of the evidence item attached or related
  triggerAction?: 'UNLOCK_PMIS' | null; // Special actions when opened
}

// Notification System
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number; // ms
}

// ExamSim Types (Post-Level Assessment)
export interface ExamQuestion {
  id: string;
  levelId: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExamAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface ExamResult {
  levelId: number;
  score: number;
  totalQuestions: number;
  passed: boolean;
  answers: ExamAnswer[];
  completedAt: number;
}

export interface ExamState {
  isExamActive: boolean;
  currentLevelId: number | null;
  currentQuestionIndex: number;
  answers: ExamAnswer[];
  results: ExamResult[];
}

// ProcessMap State
export interface ProcessMapState {
  selectedProcessId: string | null;
  assignedInputs: Record<string, string>; // inputSlotId -> documentId
  executionHistory: ProcessExecution[];
  generatedDocuments: GeneratedDocument[];
  activeTab: 'library' | 'active' | 'history';
}

// Document Analysis State
export interface DocumentAnalysisState {
  activeTask: DocumentAnalysisTask | null;
  completedTasks: string[];
  attemptHistory: HighlightAttempt[];
  selectedHighlightId: string | null;
  lastFeedback: HighlightFeedback | null;
}