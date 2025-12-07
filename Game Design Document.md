# **Game Design Document: "Project Ascend - The Initiation Protocol"**

**Version:** 7.1
**Scope:** Initiating Process Group (Levels 1-2)
**Lead Architect:** Lead Instructional Game Designer

---

## **1. Executive Summary**

**Title:** Project Ascend: The Initiation Protocol
**Genre:** Narrative RPG / Desktop Simulator / Educational
**Target Audience:** PMP Candidates, Project Management Students.

**Visual Style:** "AscendOS" – A sleek, modern interface reminiscent of macOS/visionOS. Features glassmorphism, rounded corners, clean typography, and light/dark mode options.

**Core Concept:**
The player takes on the role of a **new Intern (Junior Project Manager)** at *Ascend Solutions*. You have replaced a PM who was fired for unauthorized spending. As an intern, you have zero political capital and must strictly adhere to the PMBOK Guide to survive the first week.

**Campaign Scope:**
This module focuses exclusively on the **Initiating Process Group**, covering the two critical processes required to formally start a project:
1.  **Develop Project Charter** (Process 4.1)
2.  **Identify Stakeholders** (Process 13.1)

**Educational Goal:**
To move beyond rote memorization to **Bloom's Taxonomy Level 4 (Analysis)**. Players do not just "review" documents; they must **synthesize** the Project Charter by actively gathering requirements, distinguishing between economic feasibility and value delivery, and integrating external agreements.

---

## **2. The "AscendOS" Interface (UI/UX)**

The game simulates a realistic desktop environment. All information is contained within specific applications to mimic a real-world workflow.

### **2.1 The Desktop**
A clean, modern workspace acting as the background.
*   **Function:** Holds desktop icons for files and shortcuts.
*   **Behavior:** Players open apps from the Dock to interact with the game world.

### **2.2 The Dock (Bottom Bar)**
A macOS-style application launcher containing the essential tools.
*   **State Behavior:** Apps can be "Active" (clickable) or "Greyed Out" (locked with a padlock icon) depending on the narrative phase.

| App | Description | Unlocked |
|-----|-------------|----------|
| **Chatter** | Branching dialogue system for Stakeholder interviews (Data Mining) | **Level 1** |
| **WikiBOK** | In-game PMBOK Guide encyclopedia | **Level 1** |
| **PMIS** | Project Management Information System (The central hub) | **Level 1** |
| **Email** | Narrative engine - incoming emails drive the plot | **Level 1** |
| **ExamSim** | Performance review module triggered after each level | **Level 1+** |

### **2.3 The PMIS Application**
The central command hub for the project. This application has been overhauled to support the **Synthesis Gameplay Loop**.

**Layout:**
*   **Main Workspace:** The center area where documents are drafted.
*   **The Context Sidebar (New Feature):** A dynamic, slide-out inventory panel on the right side of the window. It acts as a holding area for information gathered during gameplay.
    *   **Tab A: Clues:** Stores text snippets extracted from Chatter conversations (e.g., "ROI Target: 15%").
    *   **Tab B: Files:** Stores physical attachments unlocked via Chatter (e.g., "Vendor_Agreement.pdf").

**Tabs:**
| Tab | Description | Function |
|-----|-------------|----------|
| **Dashboard** | Project status summary | Visualizes the "Health" of the initiation phase. |
| **Doc Creator** | Business Document Builder | Interface to drag *Clues* into *Business Case* or *Benefits Plan* templates. |
| **Charter** | The Project Charter builder | Drag-and-drop zone for completed Business Docs and Agreements. |
| **Assumptions** | Assumption Log | **New Function:** The final destination for unverified claims (Clues that failed the Business Case check). |
| **Stakeholders** | Stakeholder Register | A grid to input Name, Power, Interest, and Classification. |

### **2.4 Guidance System: "MentOS"**
To ensure the player never feels lost, a multi-layered guidance system is integrated into the OS.

*   **1. The "Current Directive" Widget:** A persistent HUD element in the top-right corner.
    *   **Primary Directive:** Displays the high-level Phase Goal (e.g., "Objective: Authorization").
    *   **Current Task:** Displays the immediate next step (e.g., "Interview Legal Counsel for Contracts").
*   **2. The Tutorial Bot ("MentOS"):** A friendly, floating AI assistant character (a small, glowing orb).
    *   **Function:** Appears automatically when a player idles for 10 seconds or makes a mistake.
    *   **Dialogue:** Provides contextual pedagogical nudges.
    *   **Hint System:** Clicking the small "?" icon next to the task triggers MentOS to explain the *why* behind the task.

---

## **3. Gameplay Mechanics**

### **3.1 Core Loop: Discovery -> Analysis -> Authorization**
The game replaces standard validation with a three-phase construction loop:
1.  **Discovery (Chatter):** Player interviews stakeholders to "mine" data. Correct dialogue choices extract **Clues** (text snippets) or unlock **Files** (Agreements).
2.  **Analysis (PMIS - Doc Creator):** Player sorts collected Clues into the correct Business Document (Business Case vs. Benefits Management Plan).
    *   **Assumption Triage (New Mechanic):** Clues that represent uncertainty (e.g., "Facilities might be ready") will be rejected by Business Documents. The player must identify these as "Leftovers" and drag them into the **Assumption Log**.
3.  **Authorization (PMIS - Charter):** Player synthesizes the final Charter by combining the valid Business Documents and the Agreement File.

### **3.2 Chatter: The Mining Mechanic**
*   **Clue Mining:** When a Stakeholder reveals a critical piece of information (e.g., "We need to make $350k back"), the text highlights gold. The player clicks it to "Collect Clue," sending it to the **PMIS Context Sidebar**.
*   **File Unlocking:** When a Stakeholder provides a document (e.g., Legal sends a contract), a file attachment appears in the chat stream. Clicking it "Downloads" it to the **PMIS Context Sidebar**.

### **3.3 Document Synthesis (Drag-and-Drop)**
*   **Sorting:** In the PMIS, the player must drag Clues from the Sidebar to the correct slot.
    *   *Example:* Dragging "Strategic Goal: Internal Efficiency" into the **Business Case** will fail (incorrect). It belongs in the **Benefits Management Plan**.
*   **Feedback:** MentOS provides immediate feedback if the player confuses "Economic Feasibility" with "Strategic Alignment."

---

## **4. Onboarding: The Identity Protocol**

Before the simulation begins, the player initializes their workstation.

### **Stage 1: HR Portal**
*   **Action:** Player enters their Name and Job Title (Junior Project Manager).
*   **Context:** "Welcome to Ascend Solutions. Configuring user profile..."

### **Stage 2: Visual Avatar Selection**
*   **Action:** Player selects a visual avatar from a gallery of professional portraits.
*   **Constraint:** This selection is **purely cosmetic**.
*   **Output:** The selected face appears on the digital ID badge and in the corner of the OS.

### **Stage 3: System Boot**
*   **Narrative:** "User Profile Created. Access Level: Junior PM. Loading AscendOS..."
*   **UI State:** The AscendOS desktop loads fully.
*   **Guidance:** **MentOS** pops up: *"Welcome to your first day! Your inbox is already blinking. It looks like Director Vane needs you immediately."*
*   **Transition:** The **Email** app icon pulses, signaling the start of Level 1.

---

## **5. Campaign Progression: The Initiation Phase**

### **Level 1: The Authorization**
*   **Process:** **4.1 Develop Project Charter**
*   **Narrative:** Sponsor Vane wants to order equipment immediately. The previous PM left no documentation. You cannot create a Charter because the inputs (Business Case, Benefits Plan) are missing.
*   **Objective:** Reconstruct the Business Documents and synthesize a Charter to authorize the project.

**Phase 1: Discovery (Chatter)**
*   **Directive:** "Gather Requirements for Business Documents."
*   **Step A: The Financials (Sponsor Vane):**
    *   *Dialogue:* Challenge Vane on the budget.
    *   *Result:* He admits, "We have a hard cap. We must see a Return on Investment of $350k within 12 months."
    *   *Action:* Player clicks the highlighted text. **Clue Collected: "ROI Target: $350k"**.
*   **Step B: The Strategy (Strategy Lead):**
    *   *Dialogue:* Ask about the long-term goal.
    *   *Result:* "This isn't about profit. It's about Internal Efficiency to align with the Q4 Corporate Goal."
    *   *Action:* Player clicks highlighted text. **Clue Collected: "Strategic Align: Internal Efficiency"**.
*   **Step C: The Uncertainty (Sponsor Vane):**
    *   *Dialogue:* Ask about site readiness.
    *   *Result:* "Facilities will probably have the power ready by the time TechCore arrives."
    *   *Action:* Player clicks highlighted text. **Clue Collected: "Claim: Power Ready by Q1"**.
*   **Step D: The Agreement (Legal Counsel):**
    *   *Dialogue:* Ask about external vendors.
    *   *Result:* "We already signed a Master Services Agreement with TechCore. You must stick to their rates. Sending it now."
    *   *Event:* A file icon appears in the chat: `TechCore_MSA.pdf`.
    *   *Action:* Player clicks the file. **File Collected: Sent to PMIS Sidebar**.

**Phase 2: Analysis (PMIS > Doc Creator)**
*   **Directive:** "Sort Clues into Business Documents."
*   **Action:** Player opens **PMIS**. The Sidebar contains 3 Clues.
*   **Sorting Puzzle:**
    *   Player drags "ROI Target: $350k" -> **Business Case Template**. (Success)
    *   Player drags "Strategic Align: Internal Efficiency" -> **Benefits Management Plan Template**. (Success)
    *   Player drags "Claim: Power Ready by Q1" -> **Business Case Template**. (**Fail State**)
        *   *Feedback:* MentOS intervenes: *"Wait! Is this a proven financial fact? Or is the Sponsor just hoping it happens? Business Cases require data, not hope."*
    *   **The Triage:** Player realizes this is a "Leftover." They switch tabs to **Assumptions** and drag the "Claim" clue there.
        *   *Result:* The clue is accepted and labeled: **"Assumption 001: Site Power Availability."**

**Phase 3: Authorization (PMIS > Charter)**
*   **Directive:** "Synthesize Project Charter."
*   **Unlock:** The **Charter Tab** unlocks.
*   **Synthesis:**
    *   Input Slot 1: Drag **Business Case** (Internal).
    *   Input Slot 2: Drag **Benefits Management Plan** (Internal).
    *   Input Slot 3: Drag **TechCore_MSA.pdf** from the Sidebar (External).
*   **Result:** The Charter text auto-populates based on these valid inputs.
*   **Final Action:** Player signs the Charter.

*   **ExamSim:** 5 Questions on Inputs to Charter (Business Documents vs Agreements), and the difference between Business Case and Benefits Management Plan.

---

### **Level 2: The Stakeholder Hunt**
*   **Process:** **13.1 Identify Stakeholders**
*   **Narrative:** The Charter is signed. Now, who will impact this project? The register is empty.

**Gameplay Flow:**
1.  **Charter Extraction:**
    *   *Directive:* "Review Signed Charter for Key Roles."
    *   *Action:* Player highlights names in the signed Charter to auto-populate the first 2 stakeholders (Sponsor, Project Manager).
2.  **The Interrogation (Chatter):**
    *   *Target:* Marcus (Sales VP).
    *   *Mining:* Player chooses dialogue options to determine **Interest** (Bonus Targets) and **Power** (High).
3.  **The External Factor (Mastery Mechanic):**
    *   *Trigger:* During the interview, Marcus mentions "Environmental Regulations."
    *   *Action:* Player opens the **TechCore_MSA.pdf** (stored in Sidebar from Level 1).
    *   *Discovery:* Reading the PDF reveals a clause: *"Subject to review by Regulatory Compliance Officer."*
    *   *Action:* Player clicks the name in the PDF to add the "Regulatory Officer" to the Stakeholder list.
4.  **Data Entry:**
    *   Player opens **PMIS > Stakeholders**.
    *   Manually maps everyone on the **Power/Interest Grid**.

*   **ExamSim:** 5 Questions on Stakeholder Analysis, External vs Internal, and Power/Interest Grids.

---

## **6. Ending: The Phase Gate Review**

Instead of a "Career Ending," this module concludes with a formal **Phase Gate**.

**The Scene:**
Director Vane reviews your PMIS Dashboard.

**Outcomes:**

1.  **Kill Point (Failure):**
    *   *Condition:* Failed to synthesize Charter correctly (Wrong inputs) OR Missed Key Stakeholder.
    *   *Result:* "Project Cancelled. You ordered equipment without authority and ignored the VP of Sales. Please report to HR."

2.  **Conditional Pass (C Grade):**
    *   *Condition:* Charter signed, but Strategic Alignment confused in Phase 2.
    *   *Result:* "I'll approve this, but you confused our strategy with our financials. Be more careful in Planning."

3.  **Green Light (Success):**
    *   *Condition:* All documents correctly synthesized, Agreement utilized, Regulatory Officer identified.
    *   *Result:* "Excellent work. The Charter is solid, and you caught the regulatory requirement in the MSA. You are formally authorized to proceed to the Planning Phase."
    *   *Reward:* "Initiating Process Group" Achievement Badge.

---

## **7. Technical Architecture (Redux Slices)**

| Slice | Purpose |
|-------|---------|
| `gameSlice` | Tracks current level (1-2), Game Stage, and **Current Directive ID**. |
| `pmisSlice` | Tracks: `collectedClues` (Array), `sidebarFiles` (Array), `charterState` (Locked/Signed), `stakeholderList`. |
| `playerSlice` | Stores Player Name, Visual Avatar ID. |
| `examSlice` | Manages the question pool for Level 1 and Level 2. |

## **8. Asset Requirements**

*   **Documents (Files):**
    *   `TechCore_MSA.pdf` (The Agreement. Contains clause about Regulatory Officer).
*   **Document Templates (Containers):**
    *   `Business_Case_Template` (Accepts "ROI" clues).
    *   `Benefits_Plan_Template` (Accepts "Strategy" clues).
    *   `Project_Charter_Template` (Accepts completed docs + PDF).
*   **UI Elements:**
    *   `Sidebar_Panel.png` (The inventory container).
    *   `Clue_Icon.png` (Small text bubble icon).
    *   `File_Icon.png` (PDF icon).
    *   `MentOS_Avatar.png` (Glowing Orb).
*   **Text Strings (Clues):**
    *   "ROI Target: $350k within 12 months"
    *   "Strategic Align: Internal Efficiency"
    *   "Claim: Power Ready by Q1" (Assumption)
    *   "Goal: Improve Customer Loyalty" (Distractor/Trap)