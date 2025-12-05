# Implementation Plan: Project Ascend (Vertical Slice)

This document outlines the development plan for the Vertical Slice of *Project Ascend*, aligned with **Game Design Document v3.2**.

## Phase 1: Foundation & Architecture ✅ COMPLETE

**Goal:** Establish the technical baseline and state management systems.

- [x] **1.1 Project Scaffolding**
    - [x] Initialize Vite + React + TypeScript project
    - [x] Configure Tailwind CSS
    - [x] Install Redux Toolkit, react-redux, @dnd-kit/core, framer-motion

- [x] **1.2 Data Modeling**
    - [x] Create `src/types/index.ts` with all interfaces (Stakeholder, EvidenceItem, CharterSection, DialogueNode, etc.)
    - [x] Create `src/data/initialData.ts` with stakeholders, evidence, charter sections, contacts
    - [x] Create `src/data/dialogueTrees.ts` with Level 1-2 dialogue trees
    - [x] Create `src/data/documents.ts` for Files app content

- [x] **1.3 State Management (Redux Store)**
    - [x] **Game Slice**: Track level, phase, stage, resources, unlocked apps/processes, game over state
    - [x] **Inventory Slice**: Manage collected EvidenceItems
    - [x] **PMIS Slice**: Manage Stakeholders, Charter slots, Assumption Log
    - [x] **OS Slice**: Manage window states (open/closed/minimized/z-index)
    - [x] **Dialogue Slice**: Manage Chatter contacts, conversations, current dialogue node

---

## Phase 2: The Desktop Environment (UI Shell) ✅ COMPLETE

**Goal:** Build the "Simulated OS" that serves as the game's container.

- [x] **2.1 Desktop Layout**
    - [x] Create `DesktopLayout.tsx`: Main container with background
    - [x] Implement `Taskbar.tsx`: Bottom bar with clock and app icons
    - [x] App unlock states with visual indicators (locked/unlocked/badge)

- [x] **2.2 Window Manager System**
    - [x] Create `WindowFrame.tsx`: Draggable windows with Close/Minimize/Maximize
    - [x] Implement z-index management (click to bring to front)

- [x] **2.3 Scene 0: Login Screen**
    - [x] Create `LoginScreen.tsx`: Retro BIOS aesthetic
    - [x] Transition to Investigation stage on login

- [x] **2.4 Game Over Screen**
    - [x] Create `GameOverScreen.tsx`: Display reason and PMP learning point
    - [x] Retry button to restart level

---

## Phase 3: Core Applications (The "Apps") ✅ MOSTLY COMPLETE

**Goal:** Build the interactive tools the player uses.

- [x] **3.1 Chatter App (NEW - Primary Narrative Driver)**
    - [x] `ChatterApp.tsx`: Contact sidebar + conversation panel
    - [x] `ChatterMessage.tsx`: Message bubbles with typing animation
    - [x] `ChatterChoices.tsx`: Branching choice buttons (safe/risky styling)
    - [x] Process dialogue consequences (unlock apps, game over, notifications)

- [x] **3.2 Files App (NEW)**
    - [x] `FilesApp.tsx`: Folder tree + file grid
    - [x] `DocumentViewer.tsx`: Document content with highlightable text
    - [x] Click-to-extract key inputs mechanic

- [x] **3.3 Email Client**
    - [x] `EmailApp.tsx`: Inbox list with email viewer
    - [x] Evidence attachment display

- [x] **3.4 PMIS Dashboard**
    - [x] `PMISApp.tsx`: Tab navigation hub
    - [x] Tab routing: Stakeholders, Charter, Assumptions, Report

- [x] **3.5 Stakeholder Register**
    - [x] List View: Display identified stakeholders
    - [x] Analysis Grid: Power/Interest quadrant drop zones
    - [ ] Hidden stakeholder discovery from Org Chart (wiring needed)

- [x] **3.6 Charter Builder**
    - [x] 3 slots per GDD: [Purpose], [Budget], [Risks]
    - [x] Drag-and-drop evidence to sections
    - [x] Submission validation and attempt counter

- [x] **3.7 Assumption Log**
    - [x] Fact/Assumption/Risk classification modal
    - [x] Correctness validation with feedback

---

## Phase 4: Game Loop & Logic Integration 🔄 IN PROGRESS

**Goal:** Connect the UI mechanics to the progression system.

- [x] **4.1 Notification System**
    - [x] `ToastNotification.tsx`: Floating alerts
    - [x] Type-specific styling (success/warning/error)

- [ ] **4.2 Level 1 Flow ("The Handover")**
    - [x] Chatter opens with Director Vane message
    - [x] Choice: ORDER HARDWARE → Game Over / DRAFT CHARTER → Unlock Files + PMIS
    - [ ] Files: Open Business_Case.pdf, highlight "$500k" → adds to inventory
    - [ ] PMIS: Fill Charter slots with evidence
    - [ ] Submit Charter → Digital signature animation → Level 2 trigger

- [ ] **4.3 Level 2 Flow ("Who's Who?")**
    - [ ] Team Channel unlocks after Charter signed
    - [ ] Marcus messages with hostile dialogue
    - [ ] Choice: IGNORE (hidden penalty) / COLLABORATE (softens Marcus)
    - [ ] Stakeholder Grid: Place Marcus correctly
    - [ ] Files: Discover Sarah in Org Chart
    - [ ] Place Sarah → Generate Register → Level complete

- [x] **4.4 Scene: Performance Report**
    - [x] `PerformanceReport.tsx`: Scoring algorithm
    - [x] Pass/fail threshold with feedback

---

## Phase 5: Polish & Refinement ⏳ PENDING

**Goal:** Add the "Juice" and final assets.

- [ ] **5.1 Audio System**
    - [ ] Implement Web Audio synthesis or load audio assets
    - [ ] Sounds: notification, success, error, click, unlock

- [ ] **5.2 Visual Polish**
    - [ ] Add unlock glow animations on taskbar icons
    - [ ] Screen shake on Game Over
    - [ ] Digital signature animation for Charter submission

- [ ] **5.3 User Testing**
    - [ ] Verify Level 1-2 complete flow
    - [ ] Verify Game Over triggers correctly
    - [ ] Test drag-and-drop on all targets

---

## Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Types/Interfaces | ✅ Complete | All GDD entities modeled |
| Redux State | ✅ Complete | 5 slices: game, inventory, pmis, os, dialogue |
| Login Screen | ✅ Complete | Retro BIOS style |
| Desktop/Windows | ✅ Complete | Full window management |
| Chatter App | ✅ Complete | Dialogue trees, choices, consequences |
| Files App | ✅ Complete | Document viewer, highlight mechanic |
| PMIS Hub | ✅ Complete | Tab navigation |
| Charter Builder | ✅ Complete | 3 slots, drag-drop |
| Stakeholder Register | ✅ Complete | List + Grid views |
| Game Over Screen | ✅ Complete | Educational feedback |
| Level 1 Wiring | 🔄 Partial | Chatter flow works, Files→Charter needs connection |
| Level 2 Wiring | ⏳ Pending | Team Channel + hidden object hunt |
| Audio/Polish | ⏳ Pending | Placeholder only |

---

## Next Steps (Priority Order)

1. **Wire Level 1 Flow**: Connect Files highlight → Inventory → Charter submit → Level 2 trigger
2. **Wire Level 2 Flow**: Team Channel unlock, Marcus dialogue, Org Chart discovery
3. **Add Audio**: Implement notification/success/error sounds
4. **Polish**: Animations for unlocks, submissions, transitions
