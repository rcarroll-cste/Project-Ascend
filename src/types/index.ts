// Enums/Types for PMP classifications
export type PowerLevel = 'High' | 'Low' | 'Unknown';
export type InterestLevel = 'High' | 'Low' | 'Unknown';
export type StakeholderAttitude = 'Supportive' | 'Neutral' | 'Resistant' | 'Leading' | 'Unknown';
export type EvidenceType = 'BusinessCase' | 'Agreement' | 'Risk' | 'TechnicalSpec' | 'Regulatory' | 'Template';

// The "NPC" entity
export interface Stakeholder {
  id: string;
  name: string;
  role: string; // e.g., "CEO", "Functional Manager"
  avatarUrl: string; // Path to asset
  
  // Attributes to be discovered via gameplay
  power: PowerLevel;
  interest: InterestLevel;
  attitude: StakeholderAttitude;
  
  // State flags
  isIdentified: boolean; // Has the player met them?
  isAnalyzed: boolean;   // Has the player placed them on the grid correctly?
  
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
  gameStage: 'Login' | 'Investigation' | 'Authorization';
  
  // Global Resources
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
  type: 'PMIS' | 'Email' | 'Browser' | 'Document'; // Types of windows
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