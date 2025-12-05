# **Game Design Document: "Project Ascend"**

**Version:** 4.0  
**Status:** Approved for Development  
**Lead Architect:** Lead Instructional Game Designer

---

## **1. Executive Summary**

**Title:** Project Ascend  
**Genre:** Narrative RPG / Desktop Simulator / Educational  
**Target Audience:** PMP Candidates, Project Management Students.

**Visual Style:** "AscendOS" – A sleek, modern interface reminiscent of macOS/visionOS. Features glassmorphism, rounded corners, clean typography, and light/dark mode options.

**Core Concept:**  
The player takes on the role of a **new Intern (Junior Project Manager)** at *Ascend Solutions*. You have replaced a PM who was fired for unauthorized spending. As an intern, you have zero political capital and must strictly adhere to the PMBOK Guide to survive. The game acts as a mentor, correcting "rookie mistakes" (like trying to plan without a charter) through narrative consequences. Unlike standard quizzes, **choices matter**. Prioritizing schedule over quality might save the deadline but cause bugs that tank the project in later levels.

**Educational Goal:**  
To move beyond rote memorization of the 49 PMBOK Processes to **Bloom’s Taxonomy Level 4 (Analysis)**. Players must understand *when* and *why* to apply a process. The gameplay is explicitly designed to model the scenarios found in the PMP Exam, ensuring players can answer situational questions correctly by referencing their in-game experience.

---

## **2. The "AscendOS" Interface (UI/UX)**

The entire game takes place on a single screen: the virtual desktop.

### **2.1 The Dock (Bottom Bar)**
Contains the essential tools.
1.  **Mailbox:** The Narrative Engine. Incoming emails drive the plot and offer branching choices.
2.  **Chatter:** A branching dialogue system (Team Management & Resource Control).
3.  **ProcessMap:** The central "Crafting" interface (The 49 Processes).
4.  **WikiBOK:** The in-game browser/encyclopedia (PMBOK Guide reference).
5.  **Files:** Inventory (Charters, Registers, Plans).
6.  **ExamSim:** A "Performance Review" module that triggers at the end of each level to test retention.

### **2.2 The PMIS (Project Management Information System)**
Replacing the traditional status bar is **"AscendTrack,"** the in-game PMIS. This software suite visualizes the Triple Constraint and tracks project health.

*   **Evolution Mechanic:** Initially, the PMIS is basic, showing only raw data. As the player advances and implements *Monitoring & Controlling* processes, the PMIS receives software updates, evolving into the "Ultimate PM Software" capable of predictive analytics (Earned Value Management forecasting).
*   **The Dashboard (HUD):**
    *   **Schedule Module:** Progress bar (Actual vs. Baseline). If "Actual" slips, the UI turns amber/red.
    *   **Cost Control Unit:** A depleting resource ($). Approving expensive risks lowers this. Hitting $0 triggers a "Budget Freeze" narrative branch.
    *   **Resource Histogram:** Tracks Team Morale. Low morale leads to slower task completion and "Chatter" silence.
    *   **Scope Validator:** A gauge visualizing "Gold Plating" vs. "Scope Creep."

---

## **3. Gameplay Mechanics (Deep Dive)**

### **3.1 Core Loop: Narrative-Driven Simulation**
1.  **Inciting Incident:** An email arrives (e.g., "The VP wants to add AR features, but we launch in 2 weeks").
2.  **Decision Point:** Player must decide based on PMBOK ethics and process.
3.  **Execution:** Player opens **ProcessMap** to formalize the decision.
4.  **Consequence:** The game state updates.
5.  **Assessment:** The **ExamSim** app launches to test retention of the specific mechanics just played.

### **3.2 ProcessMap: The "Contextual Crafting" System**
*   **The Action:** Player drags a "Process Card" (e.g., *Identify Risks*) into the center slot.
*   **The Nuance:** The player must select the *correct* Input documents.
    *   *Example:* Trying to run *Control Costs* without a *Project Funding Requirement* file triggers a "Missing Data" feedback loop.
*   **Delayed Feedback:** Creating a "bad" document (e.g., a vague Charter) enables "Scope Creep" events in later levels.

### **3.3 Chatter: The Branching Dialogue System**
Inspired by RPGs. This system specifically models **Soft Skills** and **Conflict Resolution** techniques (Problem Solving vs. Forcing vs. Withdrawal) required for the exam.

---

## **4. Campaign Progression: The 49-Process Roadmap**

The narrative is structured into 4 Arcs.

### **Arc 1: The Setup (Initiating Phase)**
*Narrative Arc: You are the Intern. You must authorize the project and identify who matters without stepping on toes.*

| Level | Title | Narrative & Mechanics | Key Learning Objectives (Exam Align) |
| :--- | :--- | :--- | :--- |
| **Prologue** | **Day Zero** | UI Tutorial. Forensic Cleanup. | • Code of Ethics & Professional Conduct<br>• Change Management Basics |
| **Lvl 1** | **The Handover** | Distinguish Valid Inputs. Analyze Business Case. Build Assumption Log. Construct Charter (Snippet Sorting). | • Distinguishing Business Case from other docs<br>• Assumption Log vs. Risk Register<br>• Charter = High Level vs. Detailed Plan |
| **Lvl 2** | **Who's Who?** | Identify Stakeholders. Salience Model & Power/Interest Grid. | • Iterative Identification<br>• Salience Attributes<br>• Decomposing broad groups |

### **Arc 2: The Blueprint (Planning Phase)**
*Narrative Arc: Detailed planning begins. You must define scope and schedule.*

| Level | Title | Narrative & Mechanics | Key Learning Objectives (Exam Align) |
| :--- | :--- | :--- | :--- |
| **Lvl 3** | **The Scope** | Collect Requirements. Define Scope. | • Scope Management Plan vs. Baseline<br>• Requirements Traceability |
| **Lvl 4** | **The Plan** | Build WBS and Schedule. | • Project Management Plan Components<br>• WBS vs. Activity List |

*(Remaining Arcs 3 & 4 continue through Execution, Monitoring, and Closing)*

---

## **5. Detailed Level Design (Vertical Slice)**

This section details the gameplay flow for the prologue and first two levels.

### **Prologue: Day Zero ("The Clean Up")**

**Objective:** Onboarding, UI Tutorial, and Establishing Narrative Stakes.  
**Primary Lesson:** Professional Responsibility and the danger of Scope Creep.

**1. Narrative Overview**
*   **Context:** The game boots up with a "System Migration" progress bar.
*   **Notification:** *"User Profile Migrated: [Player Name]. Access Level: Junior Intern."*
*   **Environment:** The virtual desktop is cluttered with the previous Project Manager’s files (personal photos, music, messy drafts).
*   **Inciting Email (HR):** *"Welcome to Ascend Solutions. You are occupying the terminal of the previous PM. Please archive his personal files. He was let go this morning for '**Compliance Violations**.' Do not repeat his mistakes."*

**2. UI/UX Interaction Flow (The Tutorial)**

*   **Step 1: Learning Mechanics (Drag & Drop)**
    *   **Action:** Player attempts to drag a folder labeled `Vacation_Photos` to the **Trash/Archive**.
    *   **Feedback:** The file moves smoothly. A tooltip appears: *"Drag files to move or process them."* (Teaches the core interaction for ProcessMap).

*   **Step 2: The Narrative Hook (The Lock)**
    *   **Action:** Player attempts to drag a folder labeled `Project_Titan_Drafts`.
    *   **Event:** The file snaps back. **Access Denied.**
    *   **System Alert:** *"Error: Audit Hold Active. You must review the Termination Report to clear this folder."*

*   **Step 3: Learning Analysis (The "Why")**
    *   **Action:** Player locates and double-clicks the file `Audit_Report_Termination.pdf`.
    *   **Mechanic:** The document opens. Text is redacted except for a few paragraphs.
    *   **System Prompt:** *"Highlight the specific violation that led to termination."*
    *   **Player Interaction:** Player highlights the sentence: *"Authorized **unapproved scope changes** directly from the client without a **Change Request**."*
    *   **Feedback:** *"Correct. **Unauthorized Scope Change** (Gold Plating) is a violation of PMBOK standards."* (Teaches the game's "Prime Directive").

*   **Step 4: Completion & Transition**
    *   **Event:** The `Project_Titan_Drafts` folder unlocks. Player drags it to Trash.
    *   **Visual:** The desktop wipes clean to the default "AscendOS" wallpaper.
    *   **Transition:** The **Chatter** icon blinks red. It is Director Vane.
    *   **Message:** *"I hope you are more organized than the last guy. We have a crisis. Check your **Business Case**."* (Seamless transition to Level 1).

---

### **Level 1: The Handover ("The Intern's Trial")**

**Objective:** Develop Project Charter (Process 4.1)  
**Primary Lesson:** Understanding Inputs (Business Case, Agreements), Creating an Assumption Log, and the "High-Level" nature of the Charter.

**1. Narrative Overview**
*   **Context:** Freshly cleaned desktop. No active project exists yet. The objective is "Prepare for Kick-off."
*   **Event:** Before meeting the Sponsor, the player must search the database to find the correct documentation and log initial assumptions.

**2. UI/UX Interaction Flow**

*   **Step 1: Investigation (The Hunt for the Business Case)**
    *   **Action:** Player opens the "Project_Archive" folder.
    *   **Challenge:** The folder contains multiple potential documents. The player must differentiate between informal notes and formal business documents.
        *   `Napkin_Sketch_Idea.jpg`
        *   `Meeting_Notes_Q1.docx`
        *   `Business_Case_Draft_v1.pdf` (Flagged as "Pending Approval")
        *   `Business_Case_FINAL_Approved.pdf`
    *   **Interaction (Wrong Choice):** Player clicks `Napkin_Sketch_Idea.jpg`.
        *   **Feedback:** *"Error: Informal documentation cannot authorize a project. Look for the formal **economic feasibility** study."*
    *   **Interaction (Wrong Choice):** Player clicks `Business_Case_Draft_v1.pdf`.
        *   **Feedback:** *"Error: This version is unapproved. You must use the finalized document."*
    *   **Interaction (Correct Choice):** Player selects `Business_Case_FINAL_Approved.pdf`.
        *   **Mechanic (Mini-Analysis):** The document opens. System prompts: *"The Sponsor needs to know the **economic feasibility**. Highlight the **Justification**."*
        *   **Player Highlight:** "20% **ROI** based on market demand."
        *   **Feedback:** *"Correct. The **Business Case** provides the necessary information from a business standpoint to determine if the expected outcomes justify the investment."*

*   **Step 2: Investigation (The "What" - Agreements)**
    *   **Action:** Player clicks the file `MOU_Client.pdf`.
    *   **Mechanic (Mini-Analysis):** System prompts: *"We are working with an external client. Find the **binding conditions**."*
    *   **Interaction:** Player highlights the "Deliverables" section.
    *   **Feedback:** *"Correct. **Agreements** define the initial intentions for a project and can be contracts, MOUs, or service level agreements."* (Definition Learned).

*   **Step 3: Creating the Assumption Log**
    *   **Action:** Player finds a sticky note on the digital desktop labeled "Notes from last PM."
    *   **Content:** "Client promised the new server hardware will arrive by June 1st. Not in the contract, but they swore it would happen."
    *   **Mechanic:** System prompts: *"This information is critical but unverified. How should it be documented?"*
    *   **Choice:**
        *   A) Add to **Risk Register**. (Incorrect - Risks are uncertain events that *might* happen. This is something treated as true for planning).
        *   B) Add to **Agreement**. (Incorrect - You cannot unilaterally modify the contract).
        *   C) Create **Assumption Log**. (Correct).
    *   **Interaction:** Player drags the sticky note into the **Assumption Log** tool.
    *   **Feedback:** *"Correct. An **Assumption Log** records factors considered to be true, real, or certain without proof. This is a key output of Developing the Project Charter."*

*   **Step 4: Synthesis (The Sponsor Dialogue)**
    *   **Event:** **Director Vane (Sponsor)** opens a Chatter window.
    *   **Dialogue:** *"I'm about to sign off, but I'm worried about the **budget**. Remind me why this is a priority?"*
    *   **Choice (Application of Knowledge):**
        *   A) *"Because we need new technology."* (Vague).
        *   B) *"Because the **Business Case** projects a 20% **ROI**."* -> **Success.** (Player applies the specific input found in Step 1).

*   **Step 5: The Authority Trap (Teaches Q1 & Q5)**
    *   **Action:** Vane continues: *"Okay, good. Price hike coming tomorrow. Order the servers NOW. I'll sign the **Charter** later."*
    *   **Choice:**
        *   A) `[ORDER HARDWARE]` -> **System Lock.** Screen flashes red. Notification: *"ACCESS DENIED: No Active **Charter**. Interns cannot authorize spend."*
        *   B) `[REFUSE & WAIT]` -> **Success.** Dialogue: *"Correct. I need the **Charter** first."*

*   **Step 6: The Drafting Table (Constructing the Charter)**
    *   **Action:** Player opens **ProcessMap** -> "**Develop Project Charter**."
    *   **Phase 1 (Inputs):** Player drags the analyzed `Business_Case_FINAL_Approved.pdf`, `MOU_Client.pdf` (Agreements), and the newly created `Assumption_Log` into the input slots.
    *   **Phase 2 (Drafting - Snippet Sorting):** Vane sends a blank template. *"Don't send me a novel. Keep it high-level. I need to know what 'Done' looks like and how much money you need."*
    *   **Mechanic:** Player must drag "Data Snippets" from a sidebar into the Charter sections.
        *   **Puzzle 1 (Scope):**
            *   *Option A:* "User authentication via biometric scanning." (Incorrect - Too detailed).
            *   *Option B:* "Secure system access for authorized personnel." (Correct - **High-Level Scope**).
        *   **Puzzle 2 (Schedule):**
            *   *Option A:* "Phase 1: June-Aug; Phase 2: Sept-Dec." (Correct - **Summary Milestone Schedule**).
            *   *Option B:* "Monday: Install SQL; Tuesday: Config Firewall." (Incorrect - Activity List).
        *   **Puzzle 3 (Authority):**
            *   *Option A:* "Intern_01 has authority to suggest changes." (Weak).
            *   *Option B:* "Intern_01 is authorized to apply organizational resources and manage the approved budget." (Correct - **PM Authority**).
    *   **Feedback:** *"Draft Accepted. **High-Level** nature verified. **Project Charter** Generated."*

*   **Step 7: The Budget Conflict (Teaches Q3)**
    *   **Event:** A Key Stakeholder (Finance) interrupts, refusing to sign because the **budget** looks unrealistic.
    *   **Dialogue Options (Conflict Resolution):**
        *   *Forcing:* "The Sponsor approved it, just sign." (Bad Outcome).
        *   *Withdrawal:* "I'll come back later." (Bad Outcome).
        *   *Collaborate/Problem Solve:* "Let's review the data together to correct the estimate." -> **Success.**

**3. Post-Level Assessment (The ExamSim)**
*   **Context:** The Mentor reviews your performance.
*   **Question 1:** "Sponsor asks to order materials before **Charter**. What do you do?" (Answer: Refuse/Wait).
*   **Question 2:** "High-level risks threaten **Business Case**. What do you do?" (Answer: Discuss with Sponsor).
*   **Question 3:** "Stakeholder refuses to sign due to **budget**. Best technique?" (Answer: Collaborate).
*   **Question 4:** "Primary input to justify investment?" (Answer: **Business Case**).
*   **Question 5:** "Information considered true without proof is recorded where?" (Answer: **Assumption Log**).

---

### **Level 2: Who's Who? ("The New Kid")**

**Objective:** Identify Stakeholders (Process 13.1)  
**Primary Lesson:** Stakeholder Analysis, Salience Model, and Iterative Identification.

**1. Narrative Overview**
*   **Context:** **Charter** is signed. As the "New Kid," you don't know the political landscape.
*   **Event:** The "**Identify Stakeholders**" process unlocks immediately (Teaches Q6).

**2. UI/UX Interaction Flow**

*   **Step 1: The Broad Entry (Teaches Q9)**
    *   **Action:** Player opens **ProcessMap** -> "**Identify Stakeholders**."
    *   **Event:** A helpful but naive team member suggests adding *"The Entire Company"* to the register.
    *   **Interaction:**
        *   *Accept:* **Error.** Feedback: *"Too Broad. You cannot manage 'Everyone'."*
        *   *Action:* Player uses the **Decompose Tool** (Scissors Icon) on the card.
        *   *Result:* Breaks into "HR", "IT Support", "Managers".

*   **Step 2: The Grid & Salience (Teaches Q7, Q8)**
    *   **Action:** Player sorts stakeholders.
    *   **Task:** Sort "Union Reps" (High Power / High Interest).
    *   **Mechanic:** Drag to Top-Right Quadrant. Label updates to **"Manage Closely"**.
    *   **New Mechanic (Salience View):** Player clicks a toggle button: `[VIEW: **SALIENCE MODEL**]`.
    *   **Visual Change:** The grid changes to a Venn Diagram.
    *   **Interaction:** Hovering over a stakeholder reveals three stats bars: **Power, Urgency, Legitimacy**.
    *   **Task:** Identify the stakeholder with all three (**Definitive Stakeholder**).

*   **Step 3: The Late Arrival (Teaches Q10)**
    *   **Event:** Player clicks "Finalize Register."
    *   **Narrative:** 10 seconds later, an email arrives. *"New Regulation passed. 'Compliance Body' is now involved."*
    *   **Choice:**
        *   A) `[IGNORE UNTIL PHASE 2]` -> **Penalty.** Project paused later.
        *   B) `[RE-OPEN REGISTER]` -> **Success.** Player adds the new entity immediately.
    *   **Feedback:** *"Correct. **Stakeholder Identification** is an iterative process."*

**3. Post-Level Assessment (The ExamSim)**
*   **Context:** The Mentor reviews your performance.
*   **Question 1:** "**Project Charter** completed. Next step?" (Answer: **Identify Stakeholders**).
*   **Question 2:** "Union workers with High Power/High Interest. Classification?" (Answer: **Manage Closely**).
*   **Question 3:** "**Salience Model** attributes?" (Answer: **Power, Urgency, Legitimacy**).
*   **Question 4:** "Team suggests 'The Entire Company'. Action?" (Answer: Break into categories).
*   **Question 5:** "New regulatory body appears later. Action?" (Answer: Update register/New analysis).

---

## **6. Narrative Endings**

The game concludes with one of three evaluations based on the player's cumulative choices:

1.  **The "Gold Plater" (Technical Success, Business Failure):** You delivered a perfect product, but 3 months late and over budget. The company loses money.
2.  **The "Iron Fist" (Business Success, Team Failure):** You hit the deadline and budget, but your team burned out and quit. High turnover score.
3.  **The "PMP Master" (True Ending):** You balanced the constraints, managed stakeholders with empathy, and followed the 49 processes correctly. Unlocks "Senior PM" Mode (New Game+).