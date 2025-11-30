# Implementation Plan: Project Ascend (Vertical Slice)

This document outlines the step-by-step development plan to build the Vertical Slice of *Project Ascend*, based on the **Game Design Document** and **Developer Specifications**.

## Phase 1: Foundation & Architecture
**Goal:** Establish the technical baseline and state management systems.

- [ ] **1.1 Project Scaffolding** (In Progress)
    - [x] Initialize Vite + React + TypeScript project.
    - [x] Configure Tailwind CSS.
    - [ ] Install Redux Toolkit (`@reduxjs/toolkit`, `react-redux`).
    - [ ] Set up project folder structure (`src/features`, `src/assets`, `src/hooks`).

- [ ] **1.2 Data Modeling**
    - [ ] Create `src/types/index.ts` containing the interfaces from `Developer_Specifications.md` (Stakeholder, EvidenceItem, CharterSection).
    - [ ] Create `src/data/initialData.ts` with the seed JSON for Stakeholders (Elias, Sarah) and Evidence Items.

- [ ] **1.3 State Management (Redux Store)**
    - [ ] **Game Slice (`gameSlice.ts`)**: Track `currentPhase`, `gameStage`, `socialCapital`, `sponsorConfidence`.
    - [ ] **Inventory Slice (`inventorySlice.ts`)**: Manage collected EvidenceItems.
    - [ ] **PMIS Slice (`pmisSlice.ts`)**: Manage Stakeholder status, Charter slots, and Assumption Log.
    - [ ] **OS Slice (`osSlice.ts`)**: Manage window states (Open/Closed/Minimized) for the "Desktop" simulation.

---

## Phase 2: The Desktop Environment (UI Shell)
**Goal:** Build the "Simulated OS" that serves as the game's container.

- [ ] **2.1 Desktop Layout**
    - [ ] Create `DesktopLayout.tsx`: The background container.
    - [ ] Implement `Taskbar.tsx`: Bottom bar with clock and app icons.
    - [ ] Implement `Wallpaper`: Static background image.

- [ ] **2.2 Window Manager System**
    - [ ] Create `WindowFrame.tsx`: Reusable draggable component with Close/Minimize controls.
    - [ ] Implement Z-index management (clicking a window brings it to front).

- [ ] **2.3 Scene 0: Login Screen**
    - [ ] Create `LoginScreen.tsx`: "Aethelgard BIOS" aesthetic.
    - [ ] Connect "Connect" button to transition `gameStage` to `Investigation`.

---

## Phase 3: Core Applications (The "Apps")
**Goal:** Build the interactive tools the player uses to solve puzzles.

- [ ] **3.1 Email Client (Scene 2)**
    - [ ] Refactor existing prototype into a functional App within the Window System.
    - [ ] Implement `EmailViewer`: Display emails from `initialData.ts`.
    - [ ] **Interaction:** Draggable headers (Evidence extraction).

- [ ] **3.2 PMIS Dashboard (The Hub)**
    - [ ] Create `PMISApp.tsx`: The container for the project management tools.
    - [ ] Implement Tab Navigation: "Stakeholders", "Charter", "Assumptions".

- [ ] **3.3 Stakeholder Register (Scene 3 & 3.5)**
    - [ ] **List View:** Display identified stakeholders.
    - [ ] **Analysis View (Grid):** Implement `GridQuadrant` drop zones.
    - [ ] **Logic:** Implement `checkGridPlacement` validation logic.

- [ ] **3.4 Charter Creator (Scene 4)**
    - [ ] **Layout:** Left side form slots, Right side "Inventory/Files".
    - [ ] **Drag-and-Drop:** Allow dropping `EvidenceItems` into `CharterSections`.
    - [ ] **Logic:** Implement `validateCharter` logic (checking for Distractors vs. Correct items).

- [ ] **3.5 Assumption Log (Scene 4.5)**
    - [ ] Implement `DecisionModal.tsx`: The "Fact vs Assumption" popup.
    - [ ] Connect Email interaction to trigger this modal.
    - [ ] Display logged items in the PMIS tab.

---

## Phase 4: Game Loop & Logic Integration
**Goal:** Connect the UI mechanics to the progression system.

- [ ] **4.1 Notification System**
    - [ ] Create `ToastNotification.tsx`: For "Director Thorne" messages.
    - [ ] Trigger hints when the player makes mistakes (e.g., placing detailed specs in Charter).

- [ ] **4.2 Progression Triggers**
    - [ ] **Email Unlocks:** Opening specific emails unlocks PMIS features.
    - [ ] **Submission Handler:** "Submit Charter" button triggers the final validation.

- [ ] **4.3 Scene 5: Performance Report**
    - [ ] Create `PerformanceReport.tsx`: The "Win/Fail" screen.
    - [ ] Implement `calculateSponsorConfidence` function to determine the ending.

---

## Phase 5: Polish & Refinement
**Goal:** Add the "Juice" and final assets.

- [ ] **5.1 Visual Polish**
    - [ ] Add retro/corporate sound effects (Startup chime, Error buzzer, Email swoosh).
    - [ ] Apply "Superhuman" styling to the Email Client (already drafted).

- [ ] **5.2 User Testing**
    - [ ] Verify drag-and-drop works on all intended targets.
    - [ ] Verify the "Fail State" triggers correctly if confidence is too low.