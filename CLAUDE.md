# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Project Ascend is an educational game/simulation that teaches PMP (Project Management Professional) concepts through interactive gameplay. Players take the role of a Junior Project Manager navigating corporate scenarios in a desktop simulator interface ("AscendOS"). The game emphasizes "grounded simulation" - realistic cognitive tasks rather than arcade mechanics.

## Development Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # TypeScript compile + production build
npm run preview   # Preview production build locally
npm run lint      # ESLint check (ts,tsx files)
```

## Tech Stack

- **Framework**: React 18 + TypeScript (strict mode)
- **Build**: Vite 4.4
- **State**: Redux Toolkit + React-Redux
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Drag & Drop**: @dnd-kit/core
- **Icons**: Lucide React

## Architecture

### State Management (Redux Slices in `src/features/`)

- **gameSlice.ts**: Global game progression - `gameStage` ('Login'|'Investigation'|'Authorization'), resources (socialCapital, corporateCulture, riskMeter), progression flags
- **osSlice.ts**: Window management - open/close/minimize/maximize/z-index tracking
- **inventorySlice.ts**: Evidence items collected by the player
- **pmisSlice.ts**: PMIS app state - stakeholders, charter sections, assumption log entries

### Component Hierarchy

```
main.tsx (Redux Provider + DndContext)
└── App.tsx
    ├── LoginScreen (when gameStage === 'Login')
    └── DesktopLayout (main game interface)
        ├── Taskbar (window controls, clock)
        ├── OnboardingOverlay (tutorial)
        ├── WindowFrame (draggable window container)
        │   ├── EmailApp (narrative driver)
        │   └── PMISApp (project management hub)
        │       ├── StakeholderRegister (Power/Interest grid)
        │       ├── CharterBuilder (drag-drop evidence assignment)
        │       └── AssumptionLog (fact/assumption classification)
        └── ToastNotification
```

### Key Directories

- `src/components/apps/` - Application modules (email/, pmis/)
- `src/components/os/` - OS shell components (DesktopLayout, Taskbar, WindowFrame)
- `src/components/scenes/` - Full-screen scenes (LoginScreen, PerformanceReport)
- `src/components/common/` - Shared UI (DecisionModal, OnboardingOverlay, ToastNotification)
- `src/data/initialData.ts` - Seed data for stakeholders, charter sections, etc.
- `src/types/index.ts` - TypeScript interfaces (Stakeholder, EvidenceItem, CharterSection, etc.)

## Design Documentation

- **Game Design Document.md**: Narrative, mechanics, learning objectives, level design
- **Developer_Specifications.md**: Data models, state schemas, technical architecture
- **Implementation_Plan.md**: Development roadmap organized in phases

## Design Principles

1. **Grounded Simulation**: Mechanics must mimic real-world PM cognitive tasks (analyzing data, negotiating, sorting information) - reject arcade-style abstractions
2. **Constructive Alignment**: Every mechanic doubles as assessment - success means understanding the PMP concept
3. **Desktop Simulator Pattern**: The entire game runs within a simulated OS interface, making PMP concepts tangible through familiar UI metaphors
4. **Drag-and-Drop as Core Mechanic**: Evidence assignment and stakeholder placement use DnD to teach data normalization concepts
