# Changelog

All notable changes to Project Ascend will be documented in this file.

---

## [Unreleased]

### 2025-12-07 20:04 EST - Document Analysis Slice Removal (Chatter Mining Replacement)

Deleted `documentAnalysisSlice.ts` as it has been replaced by the Chatter mining mechanics per GDD v7.2.

#### Files Deleted

- **`src/features/documentAnalysisSlice.ts`** - Redux slice for document analysis tasks (replaced by Chatter mining)
- **`src/components/common/DocumentViewer.tsx`** - Unused document viewer component (depended on deleted slice, not imported anywhere)

#### Files Modified

1. **`src/store.ts`**:
   - Removed `documentAnalysisReducer` import
   - Removed `documentAnalysis` from reducer configuration

2. **`src/components/apps/pmis/StakeholderRegister.tsx`**:
   - Removed `DecomposeToolButton` and `DecomposeModal` imports (file was previously deleted)
   - Removed `decomposeTarget` state variable
   - Removed `onDecomposeClick` prop from `DraggableStakeholderRow` component
   - Removed Decompose Modal JSX
   - Removed unused `AnimatePresence` import

#### Verification

- **PMISApp tabs confirmed**: Dashboard, Stakeholders, Doc Creator, Charter, Assumptions (+ Signed Charter for Level 2+)
- **ChatterApp and EmailApp**: Both properly configured in Dock.tsx and DesktopLayout.tsx for launching from Dock
- **Build**: `npm run build` succeeds
- **Dev server**: Starts without errors

---

### 2025-12-07 20:30 EST - PMIS Cleanup (Remove Communications Tab & Obsolete Components)

Removed the Communications tab from PMIS (Email is now a standalone Dock app) and deleted unused components.

#### PMISApp.tsx Changes

1. **Removed imports**:
   - `MessageSquare` icon from lucide-react
   - `EmailApp` component from email app
   - `useDroppable` from @dnd-kit/core

2. **Removed Communications tab**:
   - Removed `'communications'` from Tab type union
   - Removed `StakeholderDropZone` component (was used for drag-drop from email to stakeholder register)
   - Removed Communications tab button from navigation
   - Removed Communications tab content section (EmailApp + StakeholderDropZone)

#### Files Deleted

- **`src/components/apps/pmis/DecomposeTool.tsx`** - Unused decomposition tool
- **`src/components/apps/pmis/RequirementsCollector.tsx`** - Unused requirements collector
- **`src/components/apps/pmis/PMPBuilder.tsx`** - Unused PMP builder
- **`src/components/apps/pmis/ScopeManagementBuilder.tsx`** - Unused scope management builder

---

### 2025-12-07 20:05 EST - Remove Obsolete Applications

Removed deprecated applications that are no longer part of the game design.

#### Files Deleted

- **`src/components/apps/processmap/`** - Entire directory (9 files: ProcessMapApp.tsx, ProcessCard.tsx, ProcessCardDeck.tsx, ExecutionSlot.tsx, InputPanel.tsx, OutputPreview.tsx, MissingDataFeedback.tsx, ProcessExecutionModal.tsx, index.ts)
- **`src/features/processMapSlice.ts`** - Process Map Redux slice
- **`src/components/apps/files/`** - Entire directory (5 files: FilesApp.tsx, TaskPromptBanner.tsx, HighlightableBlock.tsx, HighlightFeedbackModal.tsx, DocumentViewer.tsx)
- **`src/components/os/AscendTrack/`** - Entire directory (2 files: index.tsx, ConstraintModule.tsx)

#### Files Created

- **`src/components/common/DocumentViewer.tsx`** - Moved from files app (used by PrologueScene)
- **`src/components/common/TaskPromptBanner.tsx`** - Supporting component for DocumentViewer
- **`src/components/common/HighlightableBlock.tsx`** - Supporting component for DocumentViewer
- **`src/components/common/HighlightFeedbackModal.tsx`** - Supporting component for DocumentViewer

#### Files Modified

1. **`src/store.ts`**:
   - Removed `processMapReducer` import and reducer

2. **`src/types/index.ts`**:
   - Removed `'files'` and `'processmap'` from `AppId` type

3. **`src/components/os/DesktopLayout.tsx`**:
   - Removed FilesApp and ProcessMapApp imports
   - Removed GitBranch icon import
   - Removed 'Files' and 'ProcessMap' cases from getWindowIcon and renderWindowContent

4. **`src/components/os/Dock.tsx`**:
   - Removed Folder and GitBranch icon imports
   - Removed processmap and files entries from DOCK_APPS array

5. **`src/components/os/Taskbar.tsx`**:
   - Removed Folder and GitBranch icon imports
   - Removed Files and ProcessMap DesktopIcon entries

6. **`src/components/scenes/PrologueScene.tsx`**:
   - Removed `unlockApp('files')` and `unlockApp('processmap')` from handleProceedToLevel1

7. **`src/data/levels.ts`**:
   - Removed `'files'` and `'processmap'` from Level 1 unlocksApps array

---

### 2025-12-07 19:15 EST - Chatter Contact Names & Neutral Choice Styling

Updated Chatter contacts and conversation choice styling for consistency.

#### Files Modified

1. **`src/data/initialData.ts`**:
   - Renamed `Legal Counsel` contact to `Victoria Ashford` with role `General Counsel`
   - Renamed `Strategy Lead` contact to `David Chen` with role `VP of Strategy`

2. **`src/components/apps/chatter/ChatterChoices.tsx`**:
   - Changed all dialogue choices to use neutral slate styling (no color-coded hints)
   - Removed pulse animation from risky choices
   - Prevents telegraphing outcomes to players through UI color cues

---

### 2025-12-07 18:48 EST - Title Cards (Level Transition Signaling Events)

Implemented cinematic "Level Title Cards" per GDD v7.2 Section 5 to signal phase transitions.

#### Files Created

- **`src/components/scenes/TitleCardScene.tsx`** - Full-screen cinematic transition component with:
  - Dark background with scanline/CRT glow effects
  - Boot sequence typography (white/cyan monospace with glow)
  - Staggered animations for subtitle, title, and decorative elements
  - Blinking `[ PRESS ENTER TO CONTINUE ]` prompt
  - Enter key and click handlers to advance

#### Files Modified

1. **`src/features/gameSlice.ts`**:
   - Added `TitleCardData` interface
   - Added `'TitleCard'` to `gameStage` type union
   - Added `titleCardData` state property
   - Added `showTitleCard` and `clearTitleCard` actions
   - Updated `advanceToNextLevel` to show title card before next level

2. **`src/App.tsx`**:
   - Added `TitleCardScene` import
   - Added conditional render for `gameStage === 'TitleCard'`

3. **`src/components/scenes/onboarding/BadgeGenerationScreen.tsx`**:
   - Changed post-onboarding to dispatch `showTitleCard` for Level 1 instead of directly going to Playing

#### Transition Flow

1. **Post-Onboarding → Level 1**: Badge screen → Title Card → Playing
2. **Level 1 Complete → Level 2**: Level Complete → Title Card → Playing
3. **Level 2 Complete → Ending**: Directly to Ending screen

---

### 2025-12-07 18:40 EST - Level 2: Signed Charter View (Stakeholder Hunt)

Implemented the "Stakeholder Hunt" mechanic for Level 2 per GDD v7.2 Section 5.

#### New Component: `src/components/apps/pmis/SignedCharterView.tsx`

A new component that renders the signed Project Charter with interactive stakeholder identification.

**Features:**
- **Full Charter Rendering**: Displays all charter sections including Project Title, Sponsor, Project Manager, Business Case, Benefits Plan, External Agreements, Assumptions, and Authorization
- **Stakeholder Hunt Mechanic**: Clickable highlighted names (Director Vane, Project Manager) in amber color with sparkle animation on hover
- **Visual Feedback**:
  - Uncollected targets: Amber/gold highlighting with sparkle icon
  - Collected targets: Green text with checkmark icon
  - Hover tooltips guide the player
- **Progress Tracking**: Shows "Stakeholders Found: X/Y" counter in header
- **Redux Integration**: Dispatches `identifyStakeholder` action when names are clicked
- **Objective Completion**: Triggers `completeObjective` for `charter_extraction` when all charter stakeholders are identified
- **Professional Layout**: Styled as an official document with signature sections

#### PMISApp Integration (`src/components/apps/pmis/PMISApp.tsx`)

1. **New Import**: Added `SignedCharterView` component and `ScrollText` icon
2. **Extended Tab Type**: Added `'signed-charter'` to the `Tab` union type
3. **Smart Default Tab**: Level 1 shows `'charter'` (builder), Level 2+ shows `'signed-charter'`
4. **Conditional Tab Button**: "Signed Charter" tab only visible for `currentLevelId >= 2`
5. **Renamed Tab**: "Project Charter" renamed to "Charter Builder" for clarity
6. **Content Rendering**: Added conditional render for `SignedCharterView` component

#### Hunt Targets (Extensible)

The charter includes 2 stakeholder hunt targets:
- **Director Vane** - Sponsor (CEO) - `sh_vane`
- **Project Manager** - Project Manager (You) - `sh_player`

Additional targets can be added to the `CHARTER_HUNT_TARGETS` array.

#### GDD Alignment

Per GDD v7.2 Level 2 "Charter Extraction" directive:
> *"Player highlights names in the signed Charter to auto-populate the first 2 stakeholders (Sponsor, Project Manager)."*

---

### 2025-12-07 18:33 EST - Doc Creator & Charter Builder Inventory Refactor

Removed local inventories from Doc Creator and Charter Builder to accept drops from the global ContextSidebar.

#### DocCreator.tsx Changes

1. **Removed local sidebar** - Deleted the left "Clue Inventory" panel (previously showed collected clues)
2. **Removed `DraggableClue` component** - No longer needed since draggable clues are now provided by ContextSidebar
3. **Cleaned up imports**:
   - Removed `useDraggable` from @dnd-kit/core
   - Removed `BookOpen`, `Lightbulb` from lucide-react
   - Removed `getLevelById` import
4. **Removed unused variables**: `currentLevel`, `clueItems`, `isItemAssigned`
5. **Drop zones remain functional** - Accept clue items (`type: 'doc-clue'`) dragged from the global ContextSidebar

#### CharterBuilder.tsx Changes

1. **Removed right column** - Deleted the "Charter Inputs" inventory panel (previously showed completed documents and agreements)
2. **Removed draggable components**:
   - `DraggableCompletedDocument` - Now provided by ContextSidebar
   - `DraggableEvidence` - Now provided by ContextSidebar
3. **Cleaned up imports**:
   - Removed `useDraggable` from @dnd-kit/core
   - Removed `BookOpen`, `FileCheck` from lucide-react
   - Removed `getLevelById` import
4. **Removed unused variables**: `currentLevel`, `availableCompletedDocs`, `availableAgreements`, `completedBusinessCase`, `completedBenefitsPlan`, `objectivesStatus`, `completedObjectivesCount`
5. **Drop zones remain functional** - Accept:
   - `CompletedBusinessDocument` items (`type: 'completed-document'`) from Redux
   - Agreement files (`type: 'evidence'`) from the global Sidebar

#### Architecture Improvement

Both components now rely entirely on the global `ContextSidebar` for drag sources, creating a cleaner architecture where inventory management is centralized. This eliminates duplicate inventory displays and provides a consistent drag-and-drop experience across PMIS tabs.

---

### 2025-12-07 23:28 EST - PMIS Layout Refactor (Global Sidebar)

Refactored PMISApp layout to make the ContextSidebar global across all tabs.

#### Layout Changes (`src/components/apps/pmis/PMISApp.tsx`)

1. **Restructured content area layout** - Changed from `flex-1 overflow-hidden` to `flex-1 overflow-hidden flex` to create a horizontal flex container
2. **Created main content wrapper** - Added a new `div` with `flex-1 overflow-hidden` to contain all tab content
3. **Made ContextSidebar global** - Moved `<ContextSidebar />` outside of individual tab conditionals, placed as sibling to main content area so it appears on the right side of all tabs
4. **Simplified tab content** - Removed nested flex containers from `doc-creator` and `charter` tabs since sidebar is now global

#### Drag & Drop
- `DndContext` already wraps the entire component (lines 380-464), so drag operations work seamlessly across the sidebar and any tab's content area

---

### 2025-12-07 23:21 EST - PMIS Context Sidebar

Implemented the persistent, slide-out inventory panel for the PMIS application per GDD v7.1.

#### New Component Created

**`src/components/apps/pmis/ContextSidebar.tsx`** - Slide-out inventory panel with:

##### Tab Features
- **Tab A - Clues**: Lists collected BusinessCase items (Financial/Strategic text snippets extracted from Chatter conversations)
- **Tab B - Files**: Lists collected Agreement items (PDFs like TechCore_MSA.pdf)

##### Visual Features
- **Slide-out animation**: Uses Framer Motion for smooth expand/collapse transitions (280px expanded, 48px collapsed)
- **Collapsible design**: Toggle button on the left edge to minimize when not needed
- **Distinct icons**:
  - Clues: Yellow lightbulb icon with yellow accent border
  - Files: Blue/red document icons (red for PDFs)
- **Badge counts**: Shows number of items in each tab and total count when collapsed
- **Empty states**: Helpful guidance when no items collected

##### Drag & Drop Integration
- **Clue items** are draggable with type `'doc-clue'` - compatible with Doc Creator drop zones
- **File items** are draggable with type `'evidence'` - compatible with Charter Builder drop zones
- Uses `@dnd-kit/core` for drag-and-drop functionality, consistent with the existing codebase

#### PMISApp Integration (`src/components/apps/pmis/PMISApp.tsx`)
- Added `ContextSidebar` import
- Integrated sidebar for **Doc Creator** tab (wraps DocCreator in flex container)
- Integrated sidebar for **Charter Builder** tab (wraps CharterBuilder in flex container)
- Sidebar appears as a persistent right-side panel that can be collapsed

#### Usage
Items collected during Chatter conversations appear in the Context Sidebar and can be dragged directly to:
- Doc Creator zones (Clues → Business Case, Benefits Plan, or Assumption Log)
- Charter Builder sections (Files/Agreements → Agreement section)

---

### 2025-12-07 23:14 EST - Chatter File Attachments

Implemented file attachment rendering in Chatter messages to allow "downloading" agreements and other documents from dialogue.

#### Type Updates (`src/types/index.ts:217`)
- Added optional `attachment?: string` property to `DialogueNode` interface for storing evidence item IDs

#### ChatterMessage Component (`src/components/apps/chatter/ChatterMessage.tsx`)
- Added new props: `attachment`, `isAttachmentDownloaded`, `onDownloadAttachment`
- Added imports for `FileText`, `Download`, `Check` icons and `EvidenceItem` type
- **New File Card UI**:
  - Renders below message bubble when attachment exists
  - Shows file icon (blue when downloadable, green when downloaded)
  - Displays file name and evidence type
  - Download/check icon indicates current state
  - Click handler triggers download callback
  - Disabled state when already downloaded

#### ChatterApp Updates (`src/components/apps/chatter/ChatterApp.tsx`)
- Added `inventoryItems` selector to track downloaded items
- **New Helper Functions**:
  - `getAttachmentForNode(nodeId)`: Retrieves evidence item from dialogue node's attachment ID
  - `isAttachmentDownloaded(evidenceId)`: Checks if item exists in inventory
- **New Handler `handleDownloadAttachment()`**:
  - Adds evidence item to inventory via `addItem` action
  - Shows "Downloaded to Sidebar" toast notification
- Updated message rendering to pass attachment props to `ChatterMessage`

#### Usage Example
```typescript
// In dialogue tree definition
{
  id: 'node_agreement',
  speaker: 'Legal Counsel',
  text: "Here's the Master Services Agreement we discussed.",
  attachment: 'ev_file_techcore_msa',  // EvidenceItem ID from INITIAL_EVIDENCE
  autoAdvanceToNodeId: 'node_next'
}
```

---

### 2025-12-07 22:46 EST - Content Synchronization (Level 1)

Synchronized Level 1 assets and data with GDD v7.1 requirements, adding phase tracking to enforce the gameplay flow.

#### Evidence Items Verification
Confirmed `src/data/initialData.ts` contains the correct GDD v7.1 evidence items:
- `ev_clue_roi_target`: "ROI Target: $350k"
- `ev_clue_strategic_align`: "Strategic Align: Internal Efficiency"
- `ev_clue_power_assumption`: "Claim: Power Ready by Q1"
- `ev_file_techcore_msa`: "TechCore_MSA.pdf"

#### Level 1 Phase Tracking (New Feature)
Added state management to enforce the Level 1 progression flow: **Chatter (Discovery) -> Doc Creator (Analysis) -> Charter (Authorization)**

**New Type** (`src/types/index.ts:28-32`):
```typescript
export type Level1Phase = 'Discovery' | 'Analysis' | 'Authorization';
```

**State Changes** (`src/features/gameSlice.ts`):
- Added `level1Phase: Level1Phase` to `GameStateV2` interface
- Initial value: `'Discovery'` (Chatter phase)

**New Actions**:
- `setLevel1Phase`: Directly set the phase
- `advanceLevel1Phase`: Progress through phases sequentially
  - Discovery -> Analysis: Unlocks PMIS (Doc Creator)
  - Analysis -> Authorization: Unlocks Charter tab
  - Authorization completion triggers level complete

**New Selectors**:
- `selectLevel1Phase`: Get current Level 1 phase
- `selectIsLevel1PhaseActive(state, phase)`: Check if specific phase is active

#### Files Modified
- `src/types/index.ts` - Added `Level1Phase` type
- `src/features/gameSlice.ts` - Added phase state, actions, and selectors

---

### 2025-12-07 22:38 EST - PMIS Authorization Phase (Charter Synthesis)

Updated the CharterBuilder to consume the outputs of the Analysis phase (Doc Creator), implementing the GDD v7.1 three-phase flow: Discovery → Analysis → Authorization.

#### Types (`src/types/index.ts`)
- Added `CompletedBusinessDocument` interface to represent outputs from the Analysis phase (Doc Creator)
  - Fields: `id`, `type` ('BusinessCase' | 'BenefitsManagementPlan'), `name`, `description`, `assignedClueIds`, `isComplete`, `completedAt`, `qualityScore`
- Updated `PMISState` interface to include `completedDocuments: CompletedBusinessDocument[]`

#### Redux State (`src/features/pmisSlice.ts`)
- Added `completedDocuments: []` to initial state
- New reducer actions:
  - `completeBusinessDocument`: Creates/updates a completed document from Analysis phase
  - `markDocumentComplete`: Marks a document as complete with quality score
  - `assignCompletedDocumentToSection`: Assigns a completed document to a charter section

#### Doc Creator Updates (`src/components/apps/pmis/DocCreator.tsx`)
- Now generates `CompletedBusinessDocument` objects when clues are correctly sorted:
  - ROI clue → Business Case → generates "Completed Business Case" (qualityScore: 100)
  - Strategic Alignment clue → Benefits Plan → generates "Completed Benefits Management Plan" (qualityScore: 95)
- Updated success notification to indicate documents are "ready for the Charter"

#### Charter Sections (`src/data/initialData.ts`)
- Restructured `INITIAL_CHARTER_SECTIONS` to match GDD v7.1 Phase 3 Authorization:
  - `sec_business_case`: Accepts completed Business Case (Internal document)
  - `sec_benefits_plan`: Accepts completed Benefits Management Plan (Internal document)
  - `sec_agreement`: Accepts external Agreement files (e.g., TechCore_MSA.pdf)

#### Charter Builder Overhaul (`src/components/apps/pmis/CharterBuilder.tsx`)
- **New `DraggableCompletedDocument` component**:
  - Distinct visual styling with document-type icons (Briefcase for Business Case, Target for Benefits Plan)
  - Shows clue count and quality score
  - Color-coded backgrounds (emerald for Business Case, blue for Benefits Plan)
- **Updated `CharterSectionZone` component**:
  - Now accepts `completedDocuments` and `expectedDocType` props
  - Displays both completed documents and evidence items appropriately
  - Shows document details including clue count and quality percentage
  - Dynamic placeholder text based on expected document type
- **Updated validation logic**:
  - Validates completed document types match section expectations
  - Provides clear error messages when wrong document type is used
  - Instructs players to use completed documents from Doc Creator, not raw clues
- **Redesigned sidebar inventory**:
  - Split into "Completed Documents (from Analysis)" and "External Agreements" sections
  - Shows "Analysis Phase Status" summary with Business Case and Benefits Plan completion checkmarks
  - Empty state guides players to complete Analysis phase first

#### PMISApp Drag Handler (`src/components/apps/pmis/PMISApp.tsx`)
- Added handler for `completed-document` drag type to `charter-section` targets
- Validates document type matches section expectation before assignment
- Shows success/warning notifications based on drop validity

#### Bug Fixes
- Fixed unused variable warnings in `App.tsx`, `CharterBuilder.tsx`, and `PMISApp.tsx`

#### The Complete GDD v7.1 Flow
1. **Discovery Phase (Chatter)**: Player mines clues from stakeholder conversations
2. **Analysis Phase (Doc Creator)**: Player sorts clues into Business Case, Benefits Plan, or Assumption Log → generates "Completed" documents
3. **Authorization Phase (Charter)**: Player drags completed Business Case, Benefits Plan, and external Agreements into Charter sections → Charter is synthesized and authorized

---

### 2025-12-07 17:26 EST - PMIS Doc Creator (GDD v7.1 Analysis Phase)

Implemented the "Doc Creator" tab for the PMIS Analysis Phase, allowing players to sort collected clues into Business Documents or the Assumption Log.

#### New Component Created

**`src/components/apps/pmis/DocCreator.tsx`** - Complete sorting interface with:
- **Sidebar (EvidenceList)**: Displays collected clues with category color-coding
  - Financial clues: Green left border
  - Strategic clues: Blue left border
  - Assumption clues: Amber left border
- **Three Document Drop Zones**:
  - **Business Case**: Accepts Financial/ROI clues (e.g., ROI Target $350k)
  - **Benefits Management Plan**: Accepts Strategic/Value clues (e.g., Strategic Alignment)
  - **Assumption Log**: Accepts unverified claims (e.g., "Power Ready by Q1")
- **Clue Category Detection**: `getClueCategory()` function analyzes evidence items to determine correct destination
- **MentOS Feedback Modal**: Pedagogical feedback on incorrect drops with contextual hints
- **Progress Summary**: Shows document status with item counts per zone
- **Level Objectives Panel**: Displays relevant objectives with completion tracking

#### Validation Logic

- **Correct Drops**: Items added to zone, success notification shown
- **Incorrect Drops**: MentOS modal appears with:
  - Title explaining the error (e.g., "Wrong Document!")
  - Message about the item's actual category
  - Hint about where the item should go
- **Assumption Triage (GDD Key Mechanic)**: When player tries to put an assumption into Business Case, MentOS asks "Is this a proven fact? Or is this just a hope?"

#### Redux State Updates

**`src/features/pmisSlice.ts`**:
- Added `documentAssignments: Record<string, string[]>` to initial state
- New actions:
  - `assignClueToDocument({ zoneId, itemId })`: Adds clue to document zone
  - `removeClueFromDocument({ zoneId, itemId })`: Removes clue from zone
  - `clearDocumentAssignments()`: Resets all assignments

**`src/types/index.ts`**:
- Updated `PMISState` interface to include `documentAssignments` property

#### PMISApp Integration

**`src/components/apps/pmis/PMISApp.tsx`**:
- Added "Doc Creator" tab with FolderOpen icon in navigation
- Added handler for `doc-clue` to `doc-zone` drag-and-drop events
- Dispatches `doc-creator-drop` custom event for DocCreator to handle

#### Drag-and-Drop Implementation

- Uses `@dnd-kit/core` (consistent with existing patterns)
- `DraggableClue` component for sidebar items
- `DocumentDropZone` component for each document target
- Custom event pattern (`doc-creator-drop`) for validation in component

---

### 2025-12-07 17:14 EST - Chatter Mining Mechanic (GDD v7.1 Discovery Phase)

Implemented the "Clue Mining" mechanic for the Discovery Phase, allowing players to extract clues from dialogue text.

#### Data Structure Updates (`src/types/index.ts`)
- **Added `MiningTarget` interface** with:
  - `text`: The exact text to highlight in dialogue (must match dialogue text)
  - `evidenceId`: The evidence item ID to unlock when collected
  - `isCollected`: State tracking whether the clue has been mined
- **Updated `DialogueNode` interface** with optional `miningTargets?: MiningTarget[]` property

#### ChatterMessage Component (`src/components/apps/chatter/ChatterMessage.tsx`)
- Added `miningTargets` and `onMineClue` props
- **New `renderTextWithMiningTargets()` function**:
  - Renders minable text highlighted in **gold/amber color** with sparkle icon animation
  - Provides click handler to collect clues
  - Shows visual feedback: underline, hover scale effects
  - Collected clues display strikethrough styling with green checkmark
  - Tooltip guidance for uncollected vs collected states

#### ChatterApp Updates (`src/components/apps/chatter/ChatterApp.tsx`)
- Added `collectMiningTarget` action import from dialogueSlice
- Added `collectedMiningTargets` state selector
- **New `handleMineClue()` callback**:
  - Finds evidence item by ID from INITIAL_EVIDENCE
  - Dispatches `addItem` to add evidence to inventory
  - Dispatches `collectMiningTarget` to mark as collected
  - Shows success toast notification with clue name
- **New `getMiningTargetsForNode()` helper**:
  - Merges dialogue node mining targets with collection state
  - Returns updated `isCollected` status based on Redux state
- Passed `miningTargets` and `onMineClue` props to ChatterMessage component

#### DialogueSlice Updates (`src/features/dialogueSlice.ts`)
- Added `collectedMiningTargets: string[]` to DialogueState interface
- Added `collectMiningTarget` reducer action (prevents duplicates)
- Updated `resetDialogue` to clear collected mining targets

#### New GDD Discovery Phase Dialogues (`src/data/dialogueTrees.ts`)
Created 4 new dialogue trees matching GDD v7.1 Phase 1 (Discovery):

1. **`DIALOGUE_VANE_FINANCIALS`** (Step A: The Financials)
   - Mining target: "Return on Investment of $350k within 12 months"
   - Evidence: `ev_clue_roi_target`

2. **`DIALOGUE_STRATEGY_LEAD`** (Step B: The Strategy)
   - Mining target: "Internal Efficiency to align with the Q4 Corporate Goal"
   - Evidence: `ev_clue_strategic_align`
   - Teaches distinction between ROI (Business Case) vs Strategic Alignment (Benefits Plan)

3. **`DIALOGUE_VANE_ASSUMPTION`** (Step C: The Uncertainty)
   - Mining target: "Facilities will probably have the power ready"
   - Evidence: `ev_clue_power_assumption` (TRAP - this is an assumption, not a fact)
   - Player can question if this is confirmed or expected

4. **`DIALOGUE_LEGAL_AGREEMENT`** (Step D: The Agreement)
   - Mining target: "Master Services Agreement with TechCore"
   - Evidence: `ev_file_techcore_msa`
   - Includes file attachment system message

#### New Evidence Items (`src/data/initialData.ts`)
Added 4 GDD v7.1 Discovery Phase evidence items:
- `ev_clue_roi_target`: ROI clue for Business Case (qualityScore: 100)
- `ev_clue_strategic_align`: Strategic alignment clue for Benefits Plan (qualityScore: 95)
- `ev_clue_power_assumption`: **Distractor/Trap** - should go to Assumption Log, not Business Case (qualityScore: 0)
- `ev_file_techcore_msa`: Agreement file attachment (qualityScore: 100)

#### New Contact (`src/data/initialData.ts`)
- Added `contact_strategy` (Strategy Lead) for Strategic Planning dialogues

---

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
