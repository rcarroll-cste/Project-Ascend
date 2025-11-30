# Orchestrator Task Queue: Project Ascend Vertical Slice

This document serves as the master task list for the Orchestrator to execute the development of Project Ascend's Vertical Slice.

## Phase 1: Foundation & Architecture
- [ ] **Task 1.1: Project Scaffolding**
  - **Mode:** Code
  - **Objective:** Install dependencies and set up folder structure.
  - **Instructions:**
    1. Install `npm install @reduxjs/toolkit react-redux @dnd-kit/core @dnd-kit/utilities`.
    2. Create directories: `src/features`, `src/assets`, `src/hooks`, `src/types`, `src/data`.
- [ ] **Task 1.2: Data Modeling**
  - **Mode:** Code
  - **Objective:** Define TypeScript interfaces and initial seed data.
  - **Instructions:**
    1. Create `src/types/index.ts` with `Stakeholder`, `EvidenceItem`, `CharterSection` interfaces.
    2. Create `src/data/initialData.ts` with Elias, Sarah, Mole, and evidence items.
- [ ] **Task 1.3: Redux Store Implementation**
  - **Mode:** Code
  - **Objective:** Implement Redux store and slices.
  - **Instructions:**
    1. Create `src/features/gameSlice.ts`, `inventorySlice.ts`, `pmisSlice.ts`, `osSlice.ts`.
    2. Configure `src/store.ts`.
    3. Wrap `App` with `Provider` in `src/main.tsx`.

## Phase 2: The Desktop Environment (UI Shell)
- [ ] **Task 2.1: Desktop & Taskbar**
  - **Mode:** Code
  - **Objective:** Build the OS container.
  - **Instructions:** Implement `DesktopLayout.tsx` and `Taskbar.tsx` (clock, start button, app icons).
- [ ] **Task 2.2: Window Manager System**
  - **Mode:** Code
  - **Objective:** Build the windowing logic.
  - **Instructions:** Create `WindowFrame.tsx` with drag/close/minimize functionality and z-indexing.
- [ ] **Task 2.3: Scene 0 (Login)**
  - **Mode:** Code
  - **Objective:** Create the boot sequence.
  - **Instructions:** Implement `LoginScreen.tsx` with BIOS aesthetic and login button.

## Phase 3: Core Applications
- [ ] **Task 3.1: Email Client**
  - **Mode:** Code
  - **Objective:** Build the email app.
  - **Instructions:** Refactor email prototype into a windowed app with draggable headers for evidence extraction.
- [ ] **Task 3.2: PMIS Dashboard Skeleton**
  - **Mode:** Code
  - **Objective:** Build the PMIS container.
  - **Instructions:** Create `PMISApp.tsx` with tabs for Stakeholders, Charter, Assumptions.
- [ ] **Task 3.3: Stakeholder Register & Grid**
  - **Mode:** Code
  - **Objective:** Implement Stakeholder analysis.
  - **Instructions:** Build list view and `AnalysisGrid` with drag-and-drop validation.
- [ ] **Task 3.4: Charter Creator**
  - **Mode:** Code
  - **Objective:** Build Charter puzzle.
  - **Instructions:** Implement `CharterBuilder` with drop zones for evidence and validation logic.
- [ ] **Task 3.5: Assumption Log**
  - **Mode:** Code
  - **Objective:** Build Assumption logging.
  - **Instructions:** Implement `DecisionModal` and Assumption Log tab.

## Phase 4: Game Loop & Logic
- [ ] **Task 4.1: Progression System**
  - **Mode:** Code
  - **Objective:** Connect logic to UI.
  - **Instructions:** Implement `validateCharter` and `calculateSponsorConfidence`.
- [ ] **Task 4.2: Notifications & Performance Report**
  - **Mode:** Code
  - **Objective:** Feedback and End Game.
  - **Instructions:** Implement `ToastNotification` and `PerformanceReport`.