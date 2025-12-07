# **Game Design Document: "Project Ascend - The Initiation Protocol"**

**Version:** 6.6
**Scope:** Initiating Process Group (Levels 0-2)
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
To move beyond rote memorization to **Bloom's Taxonomy Level 4 (Analysis)**. Players learn why "Initiating" is not just paperwork, but the act of securing authority and understanding the political landscape before work begins.

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
| **Chatter** | Branching dialogue system for Stakeholder interviews | **Immediate** (Only active app at start) |
| **WikiBOK** | In-game PMBOK Guide encyclopedia | Level 0 (Post-Tutorial) |
| **Files** | Document viewer (Business Case, Agreements) | Level 1 |
| **PMIS** | Project Management Information System (The central hub) | Level 1 |
| **ProcessMap** | A drag-and-drop tool to visualize Inputs/Tools/Outputs | Level 1 |
| **Email** | Narrative engine - incoming emails drive the plot | Level 1 |
| **ExamSim** | Performance review module triggered after each level | Level 1+ |

### **2.3 The PMIS Application**
The central command hub for the project. For this module, it features **4 specific tabs**:

| Tab | Description | Function |
|-----|-------------|----------|
| **Dashboard** | Project status summary | Visualizes the "Health" of the initiation phase. |
| **Charter** | The Project Charter builder | Drag-and-drop zone for Business Case and Agreements. |
| **Assumptions** | Assumption Log | Interface to classify "Facts" vs "Assumptions". |
| **Stakeholders** | Stakeholder Register | A grid to input Name, Power, Interest, and Classification. |

### **2.4 Guidance System: "MentOS"**
To ensure the player never feels lost, a multi-layered guidance system is integrated into the OS.

*   **1. The "Current Directive" Widget:** A persistent HUD element in the top-right corner.
    *   **Primary Directive:** Displays the high-level Phase Goal (e.g., "Objective: Obtain Project Authorization").
    *   **Current Task:** Displays the immediate next step (e.g., "Locate the Business Case in Files App").
*   **2. The Tutorial Bot ("MentOS"):** A friendly, floating AI assistant character (a small, glowing orb).
    *   **Function:** Appears automatically when a player idles for 10 seconds or makes a mistake.
    *   **Dialogue:** Provides contextual pedagogical nudges (e.g., "I noticed you're trying to spend money. Have you checked if a Charter exists yet?").
    *   **Hint System:** Clicking the small "?" icon next to the task triggers MentOS to explain the *why* behind the task.
*   **3. Visual Constraints:**
    *   Irrelevant apps are **greyed out** and locked with a padlock icon.
    *   **Contextual Cursors:** The mouse cursor changes based on the required action (e.g., turns into a **Red Pen** during the Charter Review phase).

---

## **3. Gameplay Mechanics**

### **3.1 Core Loop: The "Check-Act" Cycle**
1.  **Trigger:** An email or Chatter message arrives.
2.  **Guidance Update:** The **Current Directive** updates, and **MentOS** highlights the relevant app.
3.  **Validation:** Player checks **WikiBOK** or **Files** to see if they have authority.
4.  **Action:** Player performs the correct PMBOK process (e.g., refuse to spend until Charter is signed).
5.  **Documentation:** Player updates the **PMIS** (Log the assumption, Add the stakeholder).
6.  **Assessment:** **ExamSim** launches to test the concept just applied.

### **3.2 ProcessMap: The "Contextual Crafting" System**
*   **Location:** A standalone app.
*   **The Mechanic:** To officially "start" a process, the player must configure the input/output flow.
*   **Example (Level 1):**
    *   *Center:* **Develop Project Charter**
    *   *Input Slots:* Player drags **Business Case** and **Agreements** here.
    *   *Output Slots:* Player drags **Project Charter** and **Assumption Log** here.
    *   *Fail State:* Dragging "Gantt Chart" or "Detailed Budget" (these are Planning outputs, not Initiating).

### **3.3 Chatter: The Detective Mechanic**
Used primarily for **Stakeholder Analysis**.
*   **Mechanic:** Players choose dialogue options to extract three data points: **Interest**, **Power**, and **Attitude**.
*   **Key Feature:** "Hidden Stakeholders." Mentioning a specific topic (e.g., "Compliance") with one NPC unlocks a new contact in the directory.

---

## **4. Onboarding: The Identity Protocol**

Before the simulation begins, the player initializes their workstation.

### **Stage 1: HR Portal**
*   **Action:** Player enters their Name and Job Title (Junior Project Manager).
*   **Context:** "Welcome to Ascend Solutions. Configuring user profile..."

### **Stage 2: Visual Avatar Selection**
*   **Action:** Player selects a visual avatar from a gallery of professional portraits.
*   **Constraint:** This selection is **purely cosmetic**. It does not affect stats or gameplay mechanics.
*   **Output:** The selected face appears on the digital ID badge and in the corner of the OS.

### **Stage 3: System Boot (Restricted Mode)**
*   **Narrative:** "User Profile Created. Access Level: Probationary."
*   **UI State:** The AscendOS desktop loads.
*   **Restriction:** **Chatter** is the ONLY icon in color. All other apps (Files, PMIS, Email, WikiBOK) are **greyed out** and unclickable.
*   **Guidance:** **MentOS** pops up: *"Welcome, Intern! I've locked your other apps until you check in with your supervisor. Click 'Chatter' to begin."*
*   **Objective:** The player is forced to click **Chatter** to receive their first instruction.

---

## **5. Campaign Progression: The Initiation Phase**

The game consists of a Prologue and two core Levels.

### **Prologue (Level 0): "Day Zero"**
*   **Narrative:** You are locked out of the main systems. The only active channel is a blinking notification in **Chatter**.
*   **Objective:** Complete the dialogue tree with the "System Admin" bot to unlock the rest of the OS.
*   **Lesson:** Professional Responsibility. The bot asks ethical questions (e.g., "Do you want to see the old PM's private files?"). Answering correctly (No) unlocks the **WikiBOK** and **Email** apps.

### **Level 1: The Authorization**
*   **Process:** **4.1 Develop Project Charter**
*   **Narrative:** The Sponsor (Director Vane) wants you to start ordering equipment *now* to beat a price hike.
*   **Conflict:** You have no authority yet.
*   **Gameplay Flow:**
    1.  **Refusal:** Choose dialogue to politely refuse spending until authorized.
        *   *Directive:* "Find justification for the project."
    2.  **Financial Check (The Redline Protocol):**
        *   *Trigger:* Email from Vane: *"Draft Charter attached. I put in $500k for the budget. That should cover the new equipment and the deluxe warranty."*
        *   *Guidance:* Directive updates to **"Verify Financial Alignment."**
        *   *Intervention:* If player attempts to sign the Charter immediately, **MentOS** intervenes: *"Wait! You cannot authorize spending without verifying the Return on Investment. Check the Business Case."*
        *   *Correction:* Player opens **Files > Business Case**. The text explicitly reads: **"Maximum authorized investment to maintain positive ROI: $350,000."**
        *   *Mechanic:* Player uses a "Redline Tool" cursor to drag the correct $350k figure onto the Charter.
        *   *Feedback:* Vane replies: *"Fine. We will stick to the $350k cap found in the Business Case, but that means we have to cut the warranty."*
    3.  **Strategic Check (The Alignment Puzzle):**
        *   *Action:* Vane asks to add a "Customer Loyalty Module" to the project.
        *   *Validation:* Open **Files > Benefits Management Plan**.
        *   *Discovery:* The plan states the strategy is "Internal Efficiency," not "Customer Growth."
        *   *Decision:* Player must flag this misalignment in the Charter draft to get full points.
        *   *Lesson:* The Benefits Management Plan governs the Strategic goals.
    4.  **Drafting:** Use the **PMIS > Charter** tab to finalize the document.
        *   *Challenge:* Filter out "Detailed Schedule" (trap) and include "Summary Milestones" (correct).
    5.  **Assumption Logging:** Vane mentions "Facilities will probably have the power ready."
        *   *Directive:* "Log Sponsor's statement as an Assumption."
        *   *Action:* Player inputs this into **PMIS > Assumptions**.
*   **ExamSim:** 5 Questions on Charter purpose, inputs (Business Case vs Benefits Plan), and authority.

### **Level 2: The Stakeholder Hunt**
*   **Process:** **13.1 Identify Stakeholders**
*   **Narrative:** The Charter is signed. Now, who will impact this project? The register is empty.
*   **Gameplay Flow:**
    1.  **Charter Extraction:**
        *   *Directive:* "Review Signed Charter for Key Roles."
        *   *Action:* Player highlights names in the signed Charter to auto-populate the first 2 stakeholders (Sponsor, Project Manager).
    2.  **The Interrogation:** Use **Chatter** to interview the Sales VP.
        *   *Choice:* Ask about "Bonus Targets" (Interest) vs "Staffing" (Resources).
        *   *Result:* Discover he is **High Power / High Interest**.
    3.  **The External Factor (Mastery Mechanic):**
        *   *Action:* During the interview, someone mentions "Environmental Regulations."
        *   *Directive:* "Investigate Legal Obligations in Files."
        *   *Investigation:* Player opens **Files > Agreements**.
        *   *Discovery:* Find the contact info for the "Regulatory Compliance Officer" (External Stakeholder).
        *   *Mapping:* Player must map this external person on the grid.
    4.  **Data Entry:** Player opens **PMIS > Stakeholders** and manually maps everyone on the **Power/Interest Grid**.
*   **ExamSim:** 5 Questions on Stakeholder Analysis, External vs Internal, and Power/Interest Grids.

---

## **6. Ending: The Phase Gate Review**

Instead of a "Career Ending," this module concludes with a formal **Phase Gate**.

**The Scene:**
Director Vane reviews your PMIS Dashboard.

**Outcomes:**

1.  **Kill Point (Failure):**
    *   *Condition:* Failed to sign Charter OR Missed Key Stakeholder (High Power/High Interest).
    *   *Result:* "Project Cancelled. You ordered equipment without authority and ignored the VP of Sales. Please report to HR."

2.  **Conditional Pass (C Grade):**
    *   *Condition:* Charter signed, but Strategic Alignment ignored or External Stakeholder missed.
    *   *Result:* "I'll approve this, but you missed a regulatory requirement. We are now at risk of fines. Fix the Register immediately."

3.  **Green Light (Success):**
    *   *Condition:* All documents correct, Strategic Alignment verified, Regulatory Officer identified.
    *   *Result:* "Excellent work. You caught the misalignment with the Benefits Plan and identified the Regulator early. You are formally authorized to proceed to the Planning Phase."
    *   *Reward:* "Initiating Process Group" Achievement Badge.

---

## **7. Technical Architecture (Redux Slices)**

| Slice | Purpose |
|-------|---------|
| `gameSlice` | Tracks current level (0-2), Game Stage, and **Current Directive ID**. |
| `pmisSlice` | Stores the state of the Charter (Signed/Unsigned), Assumption Log (Array of strings), and Stakeholder Register (Array of Objects). |
| `playerSlice` | Stores Player Name, Visual Avatar ID. |
| `examSlice` | Manages the question pool for Level 1 and Level 2. |
| `constraintSlice` | Tracks the "projected" health of Budget/Schedule/Scope (backend only, no HUD). |

## **8. Asset Requirements**

*   **Documents:**
    *   `Business_Case.pdf` (Valid Input - Financials. Contains text: **"Maximum authorized investment to maintain positive ROI: $350,000."**)
    *   `Benefits_Management_Plan.pdf` (Valid Input - Strategy. Contains text: **"Strategic Focus: Internal Operational Efficiency and Cost Reduction."**)
    *   `Vendor_Agreement.pdf` (Valid Input - External Stakeholders)
    *   `Detailed_Gantt.xlsx` (Invalid Input / Trap)
    *   `Project_Charter_Template` (The container)
*   **UI Elements:**
    *   `Directive_Widget_Background.png`
    *   `MentOS_Avatar.png` (Glowing Orb)
    *   `Padlock_Icon.png` (For greyed-out apps)
    *   `Redline_Cursor.png` (For L1 Mechanic)
*   **NPCs:**
    *   Director Vane (Sponsor) - Stern, impatient.
    *   Marcus (Sales VP) - Aggressive, bonus-focused.
    *   Sarah (IT Lead) - Helpful, technical.
    *   Legal Counsel - Risk-averse, slow.
    *   Regulatory Compliance Officer (External) - Formal, bureaucratic.