# Implementation Plan: Project Ascend - Initiation Protocol (Demo)

This document outlines the development plan for *Project Ascend* Demo, aligned with **Game Design Document v4.3 (Demo Scope Finalized)**.

---

## Overview

### Demo Scope
The demo is a **vertical slice** focusing exclusively on the **Initiating Process Group**. It covers:
- **2 Levels** (Level 1: The Handover, Level 2: Who's Who?)
- **2 PMBOK Processes** (4.1 Develop Project Charter, 13.1 Identify Stakeholders)
- **3 Outputs** (Project Charter, Assumption Log, Stakeholder Register)

### Current Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| AscendOS Desktop | ✅ Complete | Glassmorphism UI, Dock, Window management |
| LoginScreen | ✅ Complete | Modern styled login |
| PMIS App | ✅ Complete | Dashboard, ProcessMap, tabs |
| Mailbox App | ✅ Complete | Email narrative system |
| Chatter App | ✅ Complete | Dialogue trees, branching |
| Files App | ✅ Complete | Document browser |
| WikiBOK App | ✅ Complete | PMBOK reference |
| CharterBuilder | ✅ Complete | Drag-drop charter creation |
| AssumptionLog | ✅ Complete | Fact vs Assumption classification |
| StakeholderRegister | ✅ Complete | Power/Interest grid |
| Level System | ✅ Complete | Level-based progression |
| Onboarding/Identity Protocol | ❌ Not Started | HR Portal, Avatar, Badge |
| ExamSim Module | ❌ Not Started | Post-level assessments |
| PMIS Dashboard Refinements | 🔶 Partial | Authority Meter, Sentiment, RAG needed |

### Target Demo Completion
**~75% Complete** - Core mechanics exist. Remaining work focuses on:
1. Onboarding flow
2. ExamSim assessment module
3. Dashboard metric refinements
4. Level 1 & 2 interaction polish
5. Demo endings

---

## Phase 1: Onboarding - The Identity Protocol

**Goal:** Create immersive "New Hire" sequence before gameplay begins.

### 1.1 HR Portal Screen
**File:** `src/components/scenes/HRPortalScreen.tsx`

- [ ] Create full-screen HR Portal component
- [ ] Implement name input field with validation
- [ ] Display "Processing New Hire paperwork..." animation
- [ ] Style consistent with glassmorphism theme
- [ ] Store player name in Redux state

**UI Elements:**
- Ascend Solutions logo header
- "Human Resources Portal" subtitle
- Name/Nickname input field
- "Continue" button (disabled until name entered)
- Loading spinner during "processing"

### 1.2 Avatar Selection
**File:** `src/components/scenes/AvatarSelectionScreen.tsx`

- [ ] Create avatar selection grid (2x2)
- [ ] Design 4 corporate archetype avatars:
  1. The Eager Analyst
  2. The Seasoned Veteran
  3. The Tech Specialist
  4. The Minimalist
- [ ] Implement selection highlight state
- [ ] Store selected avatar in Redux state
- [ ] Add hover tooltip with archetype description

**Avatar Requirements:**
- Simple, professional icons (can use Lucide or custom SVG)
- Consistent style across all 4
- Clear visual selection state

### 1.3 Badge Generation
**File:** `src/components/scenes/BadgeGenerationScreen.tsx`

- [ ] Create ID Badge display component
- [ ] Animate badge "generation" (fade in sections)
- [ ] Display: Player Name, Avatar, Title ("Junior Project Manager")
- [ ] Add "Ascend Solutions" branding
- [ ] Implement fade-out transition to Desktop
- [ ] Trigger first email from Sponsor upon completion

### 1.4 State Management
**File:** `src/features/playerSlice.ts`

- [ ] Create new slice for player identity:
  ```typescript
  interface PlayerState {
    name: string;
    avatarId: 'analyst' | 'veteran' | 'specialist' | 'minimalist' | null;
    title: string;
    badgeGenerated: boolean;
  }
  ```
- [ ] Add actions: `setPlayerName`, `setAvatar`, `generateBadge`
- [ ] Update game flow to require onboarding completion

### 1.5 Flow Integration
**File:** `src/App.tsx`

- [ ] Add new game stages: 'HRPortal' → 'AvatarSelect' → 'BadgeGen' → 'Desktop'
- [ ] Update stage transitions
- [ ] Ensure player name displays in Chatter dialogue bubbles
- [ ] Update email addressing to use `[Player_Name]`

---

## Phase 2: PMIS Dashboard Refinements

**Goal:** Implement the three key metrics from GDD Section 2.3.

### 2.1 Authority Meter
**Location:** PMIS Dashboard

- [ ] Create `AuthorityMeter.tsx` component
- [ ] Start at 0% at game start
- [ ] Fill to 100% when Charter is signed
- [ ] Lock purchasing/spending actions when < 100%
- [ ] Visual: Progress bar with percentage label
- [ ] Add tooltip: "Your authority to make project decisions"

### 2.2 Stakeholder Sentiment
**Location:** PMIS Dashboard

- [ ] Create `SentimentMeter.tsx` component
- [ ] Display as horizontal bar chart or gauge
- [ ] Calculate aggregate from identified stakeholders' attitudes
- [ ] Update dynamically based on:
  - Interview dialogue choices (Chatter)
  - Stakeholder classification accuracy
  - Conflict resolution outcomes
- [ ] Color coding: Red (hostile) → Yellow (neutral) → Green (supportive)

### 2.3 Risk Level Indicator
**Location:** PMIS Dashboard

- [ ] Create `RiskIndicator.tsx` component
- [ ] RAG status light (Red/Amber/Green)
- [ ] Default: Green at game start
- [ ] Changes based on:
  - Unaddressed warnings during Charter phase
  - Missed assumptions
  - Ignored stakeholder concerns
- [ ] Add click to expand risk summary

### 2.4 Dashboard Layout Update
**File:** `src/components/apps/pmis/Dashboard.tsx`

- [ ] Reorganize layout to prominently feature:
  - Authority Meter (top)
  - Stakeholder Sentiment (middle)
  - Risk Level (side)
- [ ] Ensure responsive design within PMIS window

---

## Phase 3: Level 1 Polish - The Handover

**Goal:** Implement all GDD Section 6 Level 1 interactions.

### 3.1 The Authority Trap (Step 1)
**Teaches:** Q1 & Q5 from ExamSim

- [ ] Create Vane's opening Chatter message
- [ ] Dialogue: "Price hike coming tomorrow. Order the servers NOW. I'll sign the paperwork later."
- [ ] Option A: `[ORDER HARDWARE]` → System Lock
  - [ ] Red screen flash animation
  - [ ] "ACCESS DENIED: No Active Charter. [Player_Name] cannot authorize spend."
  - [ ] Return to dialogue (lesson learned)
- [ ] Option B: `[REFUSE & WAIT]` → Success path
  - [ ] Positive feedback: "Correct. I need the Charter first."
  - [ ] Proceed to next step

### 3.2 Economic Feasibility (Step 2)
**Teaches:** Q4

- [ ] Update ProcessMap Charter creation flow
- [ ] Lock "Budget" slot initially
- [ ] Require `Business_Case.pdf` to unlock Budget slot
- [ ] Create Business_Case.pdf document in Files
- [ ] Feedback on success: "Business Case Accepted: Financial Feasibility Verified."

### 3.3 Assumption Check (Step 3)
**Teaches:** Q9

- [ ] Vane remarks about cooling system during Charter review
- [ ] Dialogue: "Don't worry about the cooling system. Facilities promised they'd have the new AC units installed by our start date."
- [ ] Player must open Assumption Log
- [ ] Decision point:
  - [ ] `[Log as Constraint]` → Error: "Incorrect. A constraint is a limiting factor (budget/time). This is a statement considered true without proof."
  - [ ] `[Log as Assumption]` → Success: "Logged: Cooling system availability assumed true. Requires validation later."

### 3.4 Risk Misalignment (Step 4)
**Teaches:** Q2

- [ ] Trigger PMIS Dashboard alert during Charter generation
- [ ] Warning text: "Warning: Identified High-Level Risks (60% probability of reg failure) threaten Business Case ROI."
- [ ] Decision point:
  - [ ] `[IGNORE & SUBMIT]` → Failure: "Project rejected by Board. Risks outweighed benefits."
  - [ ] `[DISCUSS WITH SPONSOR]` → Success: Opens dialogue with Vane to realign

### 3.5 Granularity Trap (Step 5)
**Teaches:** Q5

- [ ] During Timeline section of Charter
- [ ] Two files available:
  - `Detailed_Gantt_Draft.xlsx`
  - `Milestone_Summary.docx`
- [ ] Drag Gantt → Rejected: "Too Detailed! Charters only contain high-level milestones."
- [ ] Drag Summary → Accepted

### 3.6 Budget Conflict (Step 6)
**Teaches:** Q3

- [ ] Finance stakeholder interrupts before final Charter submission
- [ ] Refuses to sign due to "unrealistic budget"
- [ ] Conflict Resolution dialogue:
  - [ ] *Forcing:* "The Sponsor approved it, just sign." → Bad Outcome (Sentiment drops)
  - [ ] *Withdrawal:* "I'll come back later." → Bad Outcome (Delay penalty)
  - [ ] *Collaborate:* "Let's review the data together to correct the estimate." → Success

### 3.7 Required Documents
**Location:** `src/data/`

- [ ] Create `Business_Case.pdf` content (highlight "20% ROI")
- [ ] Create `Detailed_Gantt_Draft.xlsx` (trap document)
- [ ] Create `Milestone_Summary.docx` (correct document)
- [ ] Ensure all documents accessible in Files app

---

## Phase 4: Level 2 Polish - Who's Who?

**Goal:** Implement all GDD Section 6 Level 2 interactions.

### 4.1 Sponsor's Lead (Step 1)
- [ ] Vane provides 3 initial stakeholder contacts via Chatter
- [ ] Contacts added to Chatter contact list
- [ ] Lesson reinforced: Sponsor is primary source for initial identification

### 4.2 Interview Mechanics (Step 2)
**File:** `src/data/dialogueTrees.ts`

- [ ] Create Marcus (Sales VP) interview dialogue
- [ ] Option A (Aggressive): "Sign off on this plan."
  - [ ] Result: Marcus shuts down, no data gained
  - [ ] Sentiment penalty
- [ ] Option B (Open-ended): "What are your concerns about the launch date?"
  - [ ] Result: Reveals "If we launch during Black Friday, my team will fail."
  - [ ] Unlock: "Key Interest: Avoid Black Friday"
  - [ ] Player must drag this to Stakeholder Register

### 4.3 Hidden Stakeholder Discovery (Step 3)
- [ ] IT Manager interview reveals Compliance Officer
- [ ] Dialogue: "Did you check with the Compliance Officer? She writes the rules."
- [ ] New contact appears in Chatter
- [ ] Visual feedback: "New Stakeholder Discovered"
- [ ] Lesson: Identification is iterative

### 4.4 Data Entry & Analysis (Step 4)
**File:** `src/components/apps/pmis/StakeholderRegister.tsx`

- [ ] Enhance with attribute assignment UI
- [ ] Power/Interest grid placement:
  - [ ] Marcus (VP): High Power / High Interest → "Manage Closely"
  - [ ] Compliance Officer: High Power / Low Interest → "Keep Satisfied"
- [ ] Validation feedback:
  - [ ] Correct placement: Positive feedback
  - [ ] Misclassifying VP as "Monitor": Sentiment drop, warning message

### 4.5 Salience Model Integration
- [ ] Add Salience Model view toggle (optional enhancement)
- [ ] Attributes: Power, Urgency, Legitimacy
- [ ] Q6 from ExamSim tests this concept

### 4.6 Interview Dialogue Trees
Create dialogues for:
- [ ] Director Vane (initial contacts)
- [ ] Marcus (Sales VP) - detailed interview
- [ ] IT Manager - reveals hidden stakeholder
- [ ] Compliance Officer - brief identification

---

## Phase 5: ExamSim Module

**Goal:** Create post-level assessment system.

### 5.1 ExamSim Application
**File:** `src/components/apps/ExamSimApp.tsx`

- [ ] Create new application component
- [ ] Add to Dock (icon: clipboard/checklist)
- [ ] Auto-launch at end of each level
- [ ] Display as modal overlay or full window

### 5.2 Question Bank Structure
**File:** `src/data/examQuestions.ts`

```typescript
interface ExamQuestion {
  id: string;
  level: number;
  pool: string;  // 'A', 'B', 'C', etc.
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  pmbok_reference: string;
}
```

### 5.3 Level 1 Question Pool
**10 Questions across 5 pools:**

**Pool A: Authority & Purpose (Q1-Q2)**
- [ ] Q1: Senior manager asks to commit resources, Charter not signed. Best action?
- [ ] Q2: Organizational goals vague. Which document establishes formal existence?

**Pool B: Inputs & Origins (Q3-Q4)**
- [ ] Q3: Which document justifies financial investment and ROI?
- [ ] Q4: Where did high-level requirements in Charter originate?

**Pool C: Content & Granularity (Q5-Q6)**
- [ ] Q5: Stakeholder demands detailed schedule in Charter. Response?
- [ ] Q6: Is detailed communication strategy appropriate for Charter?

**Pool D: Assumptions & Constraints (Q9-Q10)**
- [ ] Q9: Sponsor states vendor "likely" delivers on time without contract. Where to document?
- [ ] Q10: What are two primary outputs of Develop Project Charter?

**Pool E: Timing & Lifecycle (Q7-Q8)**
- [ ] Q7: During Planning, conflict on high-level boundaries. Source of truth?
- [ ] Q8: Sponsor wants to skip Charter. Primary risk?

### 5.4 Level 2 Question Pool
**10 Questions across 4 pools:**

**Pool A: Identification Strategy (Q1-Q3)**
- [ ] Q1: Charter signed. Immediate next step?
- [ ] Q2: Discover new regulatory body during execution. Procedure?
- [ ] Q3: New to company. Best person for initial stakeholder list?

**Pool B: Classification & Analysis (Q4-Q6)**
- [ ] Q4: Power/Interest Grid: High Power / Low Interest strategy?
- [ ] Q5: Power/Interest Grid: Low Power / High Interest strategy?
- [ ] Q6: Salience Model attributes?

**Pool C: Engagement Strategy (Q7-Q8)**
- [ ] Q7: Union Rep with power to halt work. Strategy?
- [ ] Q8: Resistant stakeholder lacks power. Strategy?

**Pool D: Tools & Outputs (Q9-Q10)**
- [ ] Q9: Need to understand confidential political goals. Best technique?
- [ ] Q10: Primary output document for stakeholder info?

### 5.5 ExamSim UI Components
- [ ] Question display with 4 answer options
- [ ] Progress indicator (Question X of 5)
- [ ] Answer selection and confirmation
- [ ] Immediate feedback (correct/incorrect with explanation)
- [ ] Final score summary
- [ ] "Continue" button to proceed

### 5.6 Random Selection Logic
- [ ] Select 5 questions from level's pool
- [ ] Ensure pool distribution (at least 1 from each pool if possible)
- [ ] Track questions answered for analytics (optional)

### 5.7 State Management
**File:** `src/features/examSlice.ts`

- [ ] Create slice for exam state:
  ```typescript
  interface ExamState {
    currentLevel: number;
    questions: ExamQuestion[];
    currentQuestion: number;
    answers: { questionId: string; selectedAnswer: number; correct: boolean }[];
    score: number;
    completed: boolean;
  }
  ```

---

## Phase 6: Demo Endings - Gate Review

**Goal:** Implement the three demo conclusion scenarios.

### 6.1 Ending Evaluation Logic
**File:** `src/features/gameSlice.ts`

- [ ] Create ending calculation function
- [ ] Track across levels:
  - Charter completion status
  - Assumption Log entries count
  - Stakeholder Register completeness
  - Chatter relationship scores
  - Conflict resolution outcomes

### 6.2 Ending 1: The False Start (Failure)
**Condition:** Charter signed but Stakeholder Register incomplete OR Assumption Log empty

- [ ] Create `FalseStartEnding.tsx` scene
- [ ] Message: "[Player_Name], you have authority, but your foundation is weak. You failed to log Assumptions or Identify Stakeholders."
- [ ] Show what was missing
- [ ] Option to retry or return to main menu

### 6.3 Ending 2: The Paper Pusher (Partial Success)
**Condition:** Documents correct but relationship scores low

- [ ] Create `PaperPusherEnding.tsx` scene
- [ ] Message: "[Player_Name], you followed the process, but lacked Interpersonal Skills."
- [ ] Show relationship score breakdown
- [ ] Acknowledge technical competence
- [ ] Option to retry for better outcome

### 6.4 Ending 3: The Initiator (Success)
**Condition:** Charter Approved + Assumptions Logged + High Stakeholder Accuracy + Good Rapport

- [ ] Create `InitiatorEnding.tsx` scene
- [ ] Director Vane email: "Excellent start, [Player_Name]. You are cleared for the Planning Phase."
- [ ] Unlock badge/achievement
- [ ] Teaser: "Planning Phase - Coming Soon"
- [ ] Return to main menu option

### 6.5 Gate Review Trigger
- [ ] Automatically trigger after Level 2 ExamSim completion
- [ ] Calculate ending based on tracked metrics
- [ ] Display appropriate ending scene

---

## Phase 7: Content & Polish

**Goal:** Final content creation and quality assurance.

### 7.1 Dialogue Content
- [ ] Review all Chatter dialogues for consistency
- [ ] Ensure player name substitution works everywhere
- [ ] Add character voice consistency (Vane: authoritative, Marcus: skeptical, etc.)

### 7.2 Email Content
- [ ] Opening email from Vane (addressed to [Player_Name])
- [ ] Charter completion acknowledgment
- [ ] Stakeholder-related emails
- [ ] Final "Phase Cleared" email

### 7.3 Document Content
- [ ] Business Case with realistic content
- [ ] Charter template with proper sections
- [ ] All Level 1 & 2 required documents

### 7.4 Feedback Messages
- [ ] All error messages are educational
- [ ] Success messages reinforce learning
- [ ] Tooltip content for UI elements

### 7.5 Visual Polish
- [ ] Consistent glassmorphism across all components
- [ ] Smooth transitions between screens
- [ ] Loading states where appropriate
- [ ] Badge/ID card visual design

### 7.6 Audio (Optional)
- [ ] Notification sounds for emails/messages
- [ ] Success/error feedback sounds
- [ ] Subtle UI interaction sounds

---

## Implementation Priority

### Sprint 1: Onboarding Flow
1. HRPortalScreen.tsx
2. AvatarSelectionScreen.tsx
3. BadgeGenerationScreen.tsx
4. playerSlice.ts
5. Flow integration in App.tsx

### Sprint 2: ExamSim Module
1. ExamSimApp.tsx
2. examQuestions.ts (all 20 questions)
3. examSlice.ts
4. Integration with level completion

### Sprint 3: PMIS Dashboard
1. AuthorityMeter.tsx
2. SentimentMeter.tsx
3. RiskIndicator.tsx
4. Dashboard layout update

### Sprint 4: Level 1 Interactions
1. Authority Trap dialogue
2. Business Case integration
3. Assumption Check flow
4. Risk Misalignment event
5. Granularity Trap documents
6. Budget Conflict dialogue

### Sprint 5: Level 2 Interactions
1. Interview dialogue trees
2. Hidden stakeholder discovery
3. Stakeholder attribute assignment
4. Sentiment feedback

### Sprint 6: Demo Endings
1. Ending evaluation logic
2. False Start scene
3. Paper Pusher scene
4. Initiator scene
5. Gate Review trigger

### Sprint 7: Polish & Testing
1. Content review
2. Visual consistency
3. Bug fixes
4. Playtest iterations

---

## Technical Considerations

### State Management
- Player identity stored in new `playerSlice`
- Exam progress in `examSlice`
- Level metrics for ending calculation in `gameSlice`

### Component Architecture
```
src/
├── components/
│   ├── scenes/
│   │   ├── HRPortalScreen.tsx      # NEW
│   │   ├── AvatarSelectionScreen.tsx # NEW
│   │   ├── BadgeGenerationScreen.tsx # NEW
│   │   └── endings/
│   │       ├── FalseStartEnding.tsx  # NEW
│   │       ├── PaperPusherEnding.tsx # NEW
│   │       └── InitiatorEnding.tsx   # NEW
│   ├── apps/
│   │   ├── ExamSimApp.tsx            # NEW
│   │   └── pmis/
│   │       ├── AuthorityMeter.tsx    # NEW
│   │       ├── SentimentMeter.tsx    # NEW
│   │       └── RiskIndicator.tsx     # NEW
├── features/
│   ├── playerSlice.ts                # NEW
│   └── examSlice.ts                  # NEW
├── data/
│   └── examQuestions.ts              # NEW
```

### Testing Checklist
- [ ] Full onboarding flow (name → avatar → badge → desktop)
- [ ] Level 1 all 6 steps with both success/failure paths
- [ ] Level 2 all 4 steps with interview variations
- [ ] ExamSim random question selection
- [ ] All 3 ending conditions trigger correctly
- [ ] Player name appears in all [Player_Name] locations

---

## Success Criteria

The demo is complete when:
1. ✅ Player can complete full onboarding and see personalized badge
2. ✅ Level 1 teaches Charter authority and assumption logging
3. ✅ Level 2 teaches stakeholder identification and analysis
4. ✅ ExamSim validates understanding with 5 random questions per level
5. ✅ One of 3 endings plays based on player performance
6. ✅ Player understands why solid Initiation foundation matters

---

## Appendix: GDD v4.3 Alignment Matrix

| GDD Section | Implementation Component | Status |
|-------------|--------------------------|--------|
| 2.1 Desktop | DesktopLayout.tsx | ✅ |
| 2.2 Dock | Dock.tsx | ✅ |
| 2.3 PMIS Dashboard | Dashboard.tsx | 🔶 |
| 4.1 Core Loop | gameSlice.ts, levels.ts | ✅ |
| 4.2 ProcessMap | ProcessMap.tsx | ✅ |
| 4.3 Chatter | ChatterApp.tsx | ✅ |
| 5 Onboarding | HRPortal*, Avatar*, Badge* | ❌ |
| 6 Level 1 | CharterBuilder, AssumptionLog | 🔶 |
| 6 Level 2 | StakeholderRegister | 🔶 |
| 6 ExamSim | ExamSimApp* | ❌ |
| 7 Endings | Ending scenes* | ❌ |

Legend: ✅ Complete | 🔶 Partial | ❌ Not Started | * = New component needed
