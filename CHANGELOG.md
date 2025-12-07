# Changelog

All notable changes to Project Ascend will be documented in this file.

---

## [Unreleased]

### 2025-12-07 15:34 EST - UI/UX Fixes and Prologue Removal

Session focused on fixing window management, app unlock flow, and removing the Prologue level.

#### Window Management Fix (`src/components/os/Dock.tsx`)
- **Issue**: PMIS app (and other apps) wouldn't reopen after being closed
- **Cause**: `closeWindow` action set `isOpen = false` but kept window in Redux array; `handleAppClick` only handled minimize/focus cases, never checked if window was closed
- **Fix**: Added check for `!existingWindow.isOpen` in `handleAppClick` to dispatch `openWindow` action when window was closed

#### App Unlock Flow Fix
- **Issue**: PMIS, Files, ProcessMap, and WikiBOK were accessible immediately on desktop instead of only Chatter
- **Cause 1**: Initial `unlockedApps` in `gameSlice.ts` was `['chatter', 'wikibok']`
- **Cause 2**: `BadgeGenerationScreen.tsx` called `startLevel(1)` which unlocked `['files', 'pmis', 'processmap']`
- **Fix 1**: Changed initial `unlockedApps` to `['chatter']` only (`src/features/gameSlice.ts:125`)
- **Fix 2**: Removed `startLevel(1)` call from `BadgeGenerationScreen.tsx` - apps now unlock progressively through Chatter conversations

#### Prologue Level Removal
Removed Level 0 (Prologue/"Day Zero") entirely as it wasn't adding value to the game flow.

**Files Modified:**

1. **`src/App.tsx`**
   - Removed `PrologueScene` import
   - Removed conditional render for `gameStage === 'Playing' && currentLevelId === 0`

2. **`src/data/levels.ts`**
   - Removed `LEVEL_PROLOGUE` definition
   - Removed from `ALL_LEVELS` array (now contains only `LEVEL_01_CHARTER` and `LEVEL_02_STAKEHOLDERS`)
   - Updated `LEVEL_01_CHARTER.prerequisiteLevelId` from `0` to `null`

3. **`src/features/gameSlice.ts`**
   - Changed initial `currentPhase` from `'Prologue'` to `'Initiation'`
   - Changed initial `currentArc` from `'Prologue'` to `'Arc1_Initiation'`
   - Changed initial `currentLevelId` from `0` to `1`
   - Updated `initializeLevelProgress()` to unlock Level 1 by default (was Level 0)
   - Removed `'Prologue'` from `currentPhase` type union
   - Removed Prologue phase handling from `startLevel` reducer

4. **`src/types/index.ts`**
   - Removed `'Prologue'` from `CampaignArc` type union

5. **`src/data/mentosHints.ts`**
   - Removed `Prologue` entry from `PHASE_HINTS`

6. **`src/features/decisionSlice.ts`**
   - Removed `identifiedViolation` from `keyDecisions` interface and initial state

**Note**: `PrologueScene.tsx` file still exists but is no longer used/imported - can be deleted manually.

#### Dock Centering Fix (`src/components/os/Dock.tsx`)
- **Issue**: Dock/icon menu was positioned more toward the right instead of centered
- **Fix**: Changed positioning from `left-1/2 -translate-x-1/2` to `left-0 right-0 flex justify-center` for proper flexbox centering

---

### 2025-12-07 21:30 - Content Verification: GDD Narrative Alignment

Comprehensive review of data files against Game Design Document v6.6 to ensure all NPC narrative points are correctly defined.

#### Marcus Role Correction (GDD Section 8)
- **Issue**: Marcus was incorrectly defined as "Head of Legacy Systems" concerned about payroll
- **Fix**: Changed to **Sales VP** - "Aggressive, bonus-focused" per GDD
- Updated Power/Interest from High/Low to **High/High** per GDD Level 2 requirements
- Changed concerns from "payroll systems" to "Q4 sales targets and Black Friday"
- Files modified: `initialData.ts`, `documents.ts`, `dialogueTrees.ts`

#### Sarah Role Correction (GDD Section 8)
- **Issue**: Sarah was incorrectly defined as "Data Privacy Officer" in Compliance Division
- **Fix**: Changed to **IT Lead** - "Helpful, technical" per GDD
- Moved from Compliance Division to Technology Division in Org Chart
- Changed attitude to Supportive (helpful per GDD)
- Power/Interest set to Low/High (technical lead, not decision-maker)
- Files modified: `initialData.ts`, `documents.ts`

#### Legal Counsel Added (GDD Section 8)
- **Issue**: Legal Counsel NPC was missing entirely
- **Fix**: Added contact `contact_legal` and stakeholder `sh_legal`
- Attributes: "Risk-averse, slow" per GDD - Low urgency, Discretionary salience
- File modified: `initialData.ts`

#### Regulatory Compliance Officer Enhanced (GDD Section 8)
- **Issue**: Not marked as External stakeholder per GDD
- **Fix**: Added `isExternal: true` property
- Added contact `contact_compliance` for Chatter integration
- Added `isExternal?: boolean` to Stakeholder type interface
- Files modified: `initialData.ts`, `types/index.ts`

#### Org Chart Updated (`documents.ts`)
- Restructured divisions: Added Sales Division with Marcus
- Moved Sarah to Technology Division as IT Lead
- Added Legal Division with Legal Counsel
- Updated Stakeholder Register document with corrected roles

#### Dialogue Updates (`dialogueTrees.ts`)
- `DIALOGUE_TEAM_INTRO`: Changed Marcus label to "Sales VP"
- `DIALOGUE_MARCUS_INTRO`: Rewrote dialogue to focus on Q4 sales, Black Friday, bonus targets
- Changed player collaboration prompt from "legacy systems" to "Sales team's concerns"

#### Email Updates (`initialData.ts`)
- `email_sarah_jenkins`: Updated sender to "Sarah (IT Lead)", subject to "Technical concerns about the migration"
- `email_marcus_concerns`: Updated sender to "Marcus Thompson (Sales VP)", content to focus on Q4 revenue and bonus targets

---

### 2025-12-07 18:45 - Level 2: Stakeholder & Email Enhancements

Implemented the "Hidden Stakeholder" and "Spam" mechanics for Level 2.

#### Email Type Updates (`src/types/index.ts`)
- Added `EmailFolder` type: `'inbox' | 'sent' | 'draft' | 'archive' | 'spam'`
- Added `folder` field to `Email` interface
- Added `IDENTIFY_STAKEHOLDER` trigger action type
- Added `triggerStakeholderId` field for explicit stakeholder identification

#### Spam Folder in EmailApp (`src/components/apps/email/EmailApp.tsx`)
- Added functional Spam folder button in the sidebar with red alert icon
- Shows unread count badge on the spam icon
- Active folder state tracking (`currentFolder`)
- Stakeholder identification when opening emails with `IDENTIFY_STAKEHOLDER` trigger
- Special notification for hidden compliance stakeholder discovery

#### Hidden Email in Spam (`src/data/initialData.ts`)
- Added `email_compliance_spam` - A regulatory affairs email hidden in spam that triggers discovery of the Compliance Body stakeholder (`sh_compliance`)
- Added `email_marcus_concerns` - Another stakeholder-linked email for Marcus
- Added `email_newsletter_spam` - Decoy spam email
- Updated all emails to include `folder` field
- Added `triggerAction: 'IDENTIFY_STAKEHOLDER'` and `triggerStakeholderId` to relevant emails

#### InboxList Folder Filtering (`src/components/apps/email/InboxList.tsx`)
- Updated to accept `currentFolder` prop
- Filters emails based on selected folder
- Shows folder-specific headers and empty states
- Added warning banner for spam folder hinting at hidden stakeholders

#### Email-to-Stakeholder Drag & Drop (`src/components/apps/pmis/PMISApp.tsx`)
- Enhanced `handleDragEnd` to use `triggerStakeholderId` from emails
- Added special notification for compliance stakeholder discovery
- Added "Already Identified" and "No Match Found" feedback notifications
- Improved matching logic with fallback to sender name matching

#### Salience Visual Indicators (`src/components/apps/pmis/StakeholderRegister.tsx`)
- Added `SalienceIndicator` component showing Power/Urgency/Legitimacy as colored icons (Crown, Zap, Scale)
- Added `SALIENCE_BADGE_STYLES` with color-coded styling for each salience class
- Updated `DraggableStakeholderRow` to display P/U/L indicators with tooltips
- Added column header for P/U/L in the stakeholder list
- Salience class badges now use color-coded backgrounds matching their type:
  - Definitive (red), Dominant (orange), Dangerous (purple), Dependent (blue)
  - Dormant (gray), Discretionary (green), Demanding (yellow), None (slate)

---

### 2025-12-07 16:15 - Level 1 Charter Mechanics Enhancements

Refined the "Redline" and "Strategy" mechanics to match GDD v6.6.

#### Financial Redline Protocol

**documents.ts**:
- Renamed `Budget: $500,000` to `Budget Request: $500,000` to clarify it's Vane's request, not the authorized amount
- Added `wrongSelectionReason` to warn players this isn't the correct budget
- Added new section "2.1 Investment Constraints" with the correct budget: `Maximum authorized investment to maintain positive ROI: $350,000`

**initialData.ts**:
- Added `ev_budget_350k` evidence item (correct, qualityScore: 100)
- Changed `ev_budget_500k` to be a distractor (isDistractor: true, qualityScore: 0)
- Updated `sec_budget` charter section to require type `Agreement` (both budget items have this type)

**DocumentViewer.tsx**:
- Updated handling for `ev_budget_500k` to show warning notification ("But is this the authorized amount?")
- Added handling for `ev_budget_350k` to show success notification

**documentTasks.ts**:
- Updated `task_level1_budget` to require `ev_budget_350k` as the correct answer
- Added specific feedback when player selects $500k: "Careful! This is Director Vane's request, not the authorized amount"

**CharterBuilder.tsx**:
- Added special validation for Financial Redline Protocol: If player assigns `ev_budget_500k` to budget section, they get error: "Budget Violation! $500,000 exceeds the authorized ROI cap of $350,000"

#### Strategic Alignment Check

**documents.ts**:
- Added new document `Benefits_Management_Plan.pdf` containing:
  - Strategic Focus: "Internal Operational Efficiency and Cost Reduction"
  - Explicit out-of-scope statement about customer-facing initiatives
  - Highlightable sections for task interaction

**documentTasks.ts**:
- Added `task_level1_strategy` task for the Benefits Management Plan
- Player must identify that "Internal Efficiency" is the focus (not Customer Loyalty)
- Added educational content for `strategic_alignment` feedback

**CharterBuilder.tsx**:
- Added `strategicAlignmentVerified` state toggle
- Added Strategic Alignment Check UI panel with:
  - ShieldCheck/ShieldAlert icons based on verification state
  - Toggle button to mark as verified
  - Hint text about Director Vane's "Customer Loyalty Module" request
- Validation now requires strategic alignment to be verified before charter submission

---

### 2025-12-07 14:40 - MentOS Guidance System

#### Added

**MentOS Guidance System** - The primary contextual hint mechanic for player guidance.

##### Files Created:

1. **`src/data/mentosHints.ts`** - Hint database with:
   - `OBJECTIVE_HINTS`: Maps each objective ID to contextual hints (Prologue, Level 1, Level 2)
   - `PHASE_HINTS`: Phase-level hints for Prologue, Initiation, Planning
   - `GENERAL_TIPS`: Random tips about WikiBOK, ProcessMap, ethics, etc.
   - Helper functions: `getHintForObjective()`, `getHintForPhase()`, `getRandomTip()`

2. **`src/components/os/MentOS.tsx`** - Floating orb widget with:
   - **Floating Orb Button**: Purple/blue/cyan gradient with pulse animation
   - **Context Awareness**: Reads `currentLevelId`, `levelProgress`, `currentPhase` from Redux
   - **Smart Hint Selection**: Shows hint for first incomplete objective, falls back to phase hint, then random tip
   - **Notification Dot**: Pulsing amber indicator when new hints are available
   - **Expandable Panel**: Click orb to reveal hint text with priority indicator (high/medium/low)
   - **Priority-based Styling**: Different glow colors based on hint importance

##### Integration:
- Added to `DesktopLayout.tsx` after onboarding is complete
- Positioned at `bottom-24 right-4` with `z-[90]` (below notifications, above Dock)

#### Fixed

- **`src/components/apps/pmis/PMISApp.tsx`**: Added missing `PieChart` import from lucide-react
- **`src/components/apps/pmis/PMISApp.tsx`**: Removed unused `currentLevelId` variable

---
