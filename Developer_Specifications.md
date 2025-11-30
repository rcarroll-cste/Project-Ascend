# Developer Specifications: Project Ascend (Vertical Slice)

**Version:** 1.0
**Target Framework:** React + TypeScript (Web)
**State Management:** Redux Toolkit or Zustand

---

## 1. Data Models (TypeScript Interfaces)

### 1.1 Core Entities

```typescript
// Enums for PMP classifications
type PowerLevel = 'High' | 'Low' | 'Unknown';
type InterestLevel = 'High' | 'Low' | 'Unknown';
type StakeholderAttitude = 'Supportive' | 'Neutral' | 'Resistant' | 'Leading' | 'Unknown';
type EvidenceType = 'BusinessCase' | 'Agreement' | 'Risk' | 'TechnicalSpec' | 'Regulatory' | 'Template';

// The "NPC" entity
interface Stakeholder {
  id: string;
  name: string;
  role: string; // e.g., "CEO", "Functional Manager"
  avatarUrl: string;
  
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
interface EvidenceItem {
  id: string;
  name: string;
  description: string;
  type: EvidenceType;
  
  // Gameplay properties
  isDistractor: boolean; // If true, this item SHOULD NOT be used in the Charter (e.g., Detailed technical specs)
  qualityScore: number;  // 0-100, affects project quality if used
}

// The Charter Document (The final puzzle)
interface CharterSection {
  id: string; // e.g., "business_case", "high_level_risks"
  label: string;
  requiredType: EvidenceType; // The type of evidence that belongs here
  assignedItemId: string | null; // The ID of the EvidenceItem dropped here
  isLocked: boolean; // Some sections might be pre-filled by OPA Templates
}
```

---

## 2. State Management (Store Schema)

### 2.1 Game State Slice
```typescript
interface GameState {
  currentPhase: 'Initiation' | 'Planning'; // Demo is strictly 'Initiation'
  gameStage: 'Investigation' | 'Authorization'; // Exploration vs. Document Drafting
  
  // Global Resources
  socialCapital: number; // Currency for using "Expert Judgment"
  corporateCulture: number; // 0-100 (Health meter)
  riskMeter: number; // 0-100 (Risk of failure)
  
  // Progression Flags
  hasFoundMole: boolean;
  hasConsultedSME: boolean;
  charterSubmissionCount: number; // Limit to 3 attempts
}
```

### 2.2 Inventory Slice
```typescript
interface InventoryState {
  items: EvidenceItem[]; // All collected items
  selectedItemId: string | null; // For drag operations
}
```

### 2.3 Dashboard Slice (PMIS)
```typescript
interface PMISState {
  stakeholders: Stakeholder[];
  charterSections: CharterSection[];
  assumptionLog: AssumptionEntry[]; // Updated to track accuracy of classification
}

interface AssumptionEntry {
  id: string;
  content: string;
  category: 'Fact' | 'Assumption' | 'Risk';
  isCorrectlyClassified: boolean;
}
```

---

## 3. Game Logic & Algorithms

### 3.1 Charter Validation Logic
*Triggered when player clicks "Submit Charter" in the PMIS.*

```typescript
function validateCharter(sections: CharterSection[], inventory: EvidenceItem[]): ValidationResult {
  let score = 0;
  let errors = [];

  for (const section of sections) {
    const item = inventory.find(i => i.id === section.assignedItemId);
    
    // Check 1: Is a slot empty?
    if (!item) {
      errors.push(`Section ${section.label} is empty.`);
      continue;
    }

    // Check 2: Correct Type? (PMP Rule: Alignment)
    if (item.type !== section.requiredType) {
      errors.push(`Invalid artifact for ${section.label}. Expected ${section.requiredType}.`);
      continue;
    }

    // Check 3: Is it a Distractor? (PMP Rule: High-Level vs Detailed)
    // Example: Using "Server Rack Schematics" (Detailed) instead of "System Architecture Overview" (High Level)
    if (item.isDistractor) {
      errors.push(`Item '${item.name}' is too detailed for a Project Charter. Keep it high-level.`);
      score -= 20;
    } else {
      score += 25;
    }
  }

  // Check 4: Business Case Existence (Critical Pass/Fail)
  const businessCase = sections.find(s => s.id === 'business_case');
  if (!businessCase || !businessCase.assignedItemId) {
    return { success: false, message: "CRITICAL: No Business Case defined. Sponsor rejects authorization." };
  }

  if (score >= 80) return { success: true };
  return { success: false, errors };
}
```

### 3.2 Stakeholder Analysis Logic (The Grid Mini-game)
*Triggered when player drags a stakeholder avatar to a quadrant on the Power/Interest Grid.*

```typescript
function checkGridPlacement(stakeholder: Stakeholder, targetQuadrant: string): boolean {
  // Logic mapping PMP quadrant rules
  const correctQuadrant = getCorrectQuadrant(stakeholder.power, stakeholder.interest);
  // High Power / High Interest -> "Manage Closely"
  // High Power / Low Interest -> "Keep Satisfied"
  // Low Power / High Interest -> "Keep Informed"
  // Low Power / Low Interest -> "Monitor"

  if (targetQuadrant === correctQuadrant) {
    // Reward: Unlock hidden trait or bonus Social Capital
    return true;
  } else {
    // Penalty: Increase Risk Meter (Mismanaging stakeholder)
    return false;
  }
}
```

### 3.3 Assumption Log Logic (Decision Node)
*Triggered when player categorizes an email statement (Scene 4.5).*

```typescript
function evaluateAssumptionChoice(statementId: string, playerChoice: 'Fact' | 'Assumption'): ValidationResult {
  // Logic: "Should arrive by June 1st" is an Assumption, not a Fact.
  const correctAnswer = getCorrectClassification(statementId);
  
  if (playerChoice === correctAnswer) {
    return { success: true, message: "Correct. Vendor promises are assumptions until verified." };
  } else {
    return { success: false, message: "Incorrect. Treat unverified statements as Assumptions to avoid scope creep." };
  }
}
```

### 3.4 Performance Report Calculation (Scene 5)
*Calculates the final 'Sponsor Confidence' score.*

```typescript
function calculateSponsorConfidence(pmis: PMISState, game: GameState): number {
  let confidence = 50; // Base score
  
  // 1. Stakeholder Identification (+5% each)
  confidence += pmis.stakeholders.filter(s => s.isAnalyzed).length * 5;
  
  // 2. Charter Accuracy (Weighted)
  // ... (Calculated via validateCharter)
  
  // 3. Assumption Log Accuracy (+10% for correct distinction)
  const correctAssumptions = pmis.assumptionLog.filter(a => a.isCorrectlyClassified).length;
  confidence += correctAssumptions * 10;

  return Math.min(100, Math.max(0, confidence));
}
```

---

## 4. UI Component Architecture

### 4.1 Layout Hierarchy
*   `AppContainer`
    *   `NarrativeLayer` (Visual Novel style dialogue overlay)
    *   `GameLayer` (The Office View / Dashboard)
        *   `HUD` (Top bar: Risk Meter, Social Capital, Current Objective)
        *   `MainWorkspace` (Switchable Views)
            *   `View: OfficeExploration` (Clickable hotspots: Desk, Boardroom, Server Room)
            *   `View: PMIS_Dashboard` (The Computer Screen)
                *   `Tab: StakeholderRegister` (The Grid + List)
                *   `Tab: CharterBuilder` (The Drop Zones)
                *   `Tab: EmailClient` (Source of EvidenceItems)
                *   `Tab: AssumptionLog` (List of classified statements)
            *   `View: PerformanceReport` (End Game Screen)

### 4.2 Key Components
1.  **`DraggableEvidence`**: A card component representing an inventory item. Must support HTML5 Drag and Drop API.
2.  **`GridQuadrant`**: A drop target for the Stakeholder Analysis game. Must visually indicate "Hover" state.
3.  **`DecisionModal`**: A simple choice dialog (Fact vs. Assumption) triggered by email interactions.
4.  **`ConfidenceMeter`**: Visual gauge in the HUD showing current Sponsor Confidence (0-100%).

---

## 5. Asset Requirements (Placeholders)

### 5.1 Textures / Images
*   `bg_executive_office.jpg`: Background for Sponsor interaction.
*   `bg_server_room.jpg`: Background for Technical stakeholder interaction.
*   `avatar_elias.png`: CEO (Stern, older man).
*   `avatar_sarah.png`: IT Manager (Tired, glasses).
*   `icon_doc_business.png`: Icon for Business Case items.
*   `icon_doc_tech.png`: Icon for Technical Spec items.

### 5.2 JSON Data (Initial Seed)
*   `stakeholders.json`: Definition of Elias, Sarah, and The Mole.
*   `evidence.json`: 
    *   *Correct Items:* "Market Analysis Report", "Merger Legal Framework", "Risk Register Draft".
    *   *Distractors:* "Cafeteria Menu", "Python Code Snippet", "Server Wiring Diagram".

---

## 6. Implementation Steps (Dev Path)

1.  **Setup**: Initialize React project with Redux Toolkit.
2.  **State**: Implement `gameSlice` and `inventorySlice`.
3.  **UI Skeleton**: Create the HUD and PMIS Layout shell.
4.  **Mechanic 1**: Build the Drag-and-Drop system for `CharterBuilder`.
5.  **Logic**: Implement `validateCharter` function.
6.  **Mechanic 2**: Build the `StakeholderGrid` interactive component.
7.  **Narrative**: Hook up a simple dialogue system (Array of strings) to trigger state changes (adding items to inventory).