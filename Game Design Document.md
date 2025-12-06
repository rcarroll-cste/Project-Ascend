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

## **4. Campaign Progression: The Initiating & Planning Roadmap (Levels 1-26)**

The campaign is rigorously structured to follow the PMBOK Guide's logical flow for the first two Process Groups.

### **Arc 1: Initiation (The Handover)**
*Narrative Context: You are the Intern. You must authorize the project and identify who matters without stepping on toes.*

| Level | Process (PMBOK) | Narrative Title | Core Gameplay Loop | Key Learning Objectives |
| :--- | :--- | :--- | :--- | :--- |
| **Prologue** | *N/A* | **Day Zero** | UI Tutorial. Forensic Cleanup of previous PM's mess. | Code of Ethics; Change Management Basics. |
| **Lvl 1** | 4.1 Develop Project Charter | **The Authorization** | Locate Business Case; filter valid inputs; draft high-level Charter. | Distinguishing Business Case from Charter; Assumption Log creation. |
| **Lvl 2** | 13.1 Identify Stakeholders | **The Politics** | Analyze emails to find hidden stakeholders; populate Register; map Power/Interest. | Salience Model; Stakeholder Analysis; Iterative nature of identification. |

### **Arc 2: Planning - The Blueprint (Scope & Schedule)**
*Narrative Context: Authorization is granted. Now you must define WHAT we are building and WHEN it will be done.*

| Level | Process (PMBOK) | Narrative Title | Core Gameplay Loop | Key Learning Objectives |
| :--- | :--- | :--- | :--- | :--- |
| **Lvl 3** | 4.2 Develop Proj. Mgmt. Plan | **The Master Plan** | Assemble subsidiary plans into a cohesive document; choose lifecycle (Predictive). | Integration Management; Plan vs. Project Documents; Baselines defined. |
| **Lvl 4** | 5.1 Plan Scope Mgmt. | **Setting Boundaries** | Write the "Rulebook" for scope; decide how to handle "Gold Plating". | Scope Management Plan vs. Scope Baseline. |
| **Lvl 5** | 5.2 Collect Requirements | **The Wishlist** | Interview stakeholders; filter "needs" vs "wants"; build Traceability Matrix. | Requirements Documentation; Traceability Matrix; Elicitation techniques. |
| **Lvl 6** | 5.3 Define Scope | **Drawing the Line** | Draft Project Scope Statement; reject out-of-scope requests. | Product vs. Project Scope; Project Exclusions; Constraints. |
| **Lvl 7** | 5.4 Create WBS | **Decomposition** | Drag & drop deliverables into a hierarchy; define Work Packages. | Decomposition; 100% Rule; Scope Baseline components. |
| **Lvl 8** | 6.1 Plan Schedule Mgmt. | **Time Rules** | Set units of measure (hours vs days); define variance thresholds. | Schedule Management Plan; Level of Accuracy; Units of Measure. |
| **Lvl 9** | 6.2 Define Activities | **Action Items** | Break Work Packages into Activities; create Activity List. | Activities vs. Deliverables; Rolling Wave Planning. |
| **Lvl 10** | 6.3 Sequence Activities | **The Logic Puzzle** | Connect activities (FS, SS, FF); apply leads and lags. | PDM (Precedence Diagramming Method); Dependencies (Mandatory vs. Discretionary). |
| **Lvl 11** | 6.4 Est. Activity Durations | **The Timeline** | Apply PERT/Three-Point estimates to uncertain tasks. | Analogous vs. Parametric vs. Bottom-up; Reserve Analysis. |
| **Lvl 12** | 6.5 Develop Schedule | **Critical Path** | Calculate float; identify Critical Path; compress schedule (Crashing/Fast Tracking). | Critical Path Method; Schedule Baseline; Schedule Compression. |

### **Arc 3: Planning - The Constraints (Cost, Quality, Resources)**
*Narrative Context: We know the work. Now we need the budget, the standards, and the team.*

| Level | Process (PMBOK) | Narrative Title | Core Gameplay Loop | Key Learning Objectives |
| :--- | :--- | :--- | :--- | :--- |
| **Lvl 13** | 7.1 Plan Cost Mgmt. | **The Wallet** | Set precision levels; define reporting formats for finance. | Cost Management Plan contents. |
| **Lvl 14** | 7.2 Estimate Costs | **The Price Tag** | Estimate costs for resources; apply contingency reserves. | Types of Cost (Direct/Indirect); Accuracy ranges (ROM). |
| **Lvl 15** | 7.3 Determine Budget | **Funding the Baseline** | Aggregate costs to Cost Baseline; reconcile with funding limits. | Cost Baseline vs. Project Budget; Management Reserves; S-Curve. |
| **Lvl 16** | 8.1 Plan Quality Mgmt. | **Defining "Done"** | Set Quality Metrics; choose standards to follow. | Cost of Quality (Prevention/Appraisal/Failure); Quality Metrics. |
| **Lvl 17** | 9.1 Plan Resource Mgmt. | **Team Strategy** | Create OBS; define Recognition & Rewards policy. | RACI Charts; Resource Management Plan. |
| **Lvl 18** | 9.2 Est. Activity Resources | **The Headcount** | Assign specific skills/materials to activities; bottom-up estimation. | Resource Requirements; Basis of Estimates. |

### **Arc 4: Planning - The Safety Net (Comm, Risk, Procurement, Stakeholder)**
*Narrative Context: The core plan is ready. Now we protect it against chaos.*

| Level | Process (PMBOK) | Narrative Title | Core Gameplay Loop | Key Learning Objectives |
| :--- | :--- | :--- | :--- | :--- |
| **Lvl 19** | 10.1 Plan Comm. Mgmt. | **The Signal** | Analyze "Who needs what?"; choose Push/Pull methods. | Comm. Requirements Analysis; 5 W's of Communication. |
| **Lvl 20** | 11.1 Plan Risk Mgmt. | **Rules of Engagement** | Define Risk Categories (RBS); set Probability/Impact Matrix. | Risk Management Plan; Risk Appetite/Thresholds. |
| **Lvl 21** | 11.2 Identify Risks | **The Brainstorm** | Review docs to find threats/opportunities; write Risk Statements. | Risk Register creation; SWOT Analysis; Prompt Lists. |
| **Lvl 22** | 11.3 Perform Qual. Risk | **The Filter** | Rank risks (High/Med/Low); prioritize for action. | Probability & Impact Matrix; Data Quality Assessment. |
| **Lvl 23** | 11.4 Perform Quant. Risk | **The Simulation** | Run Monte Carlo sim; calculate overall project risk. | Sensitivity Analysis (Tornado Diagram); EMV (Expected Monetary Value). |
| **Lvl 24** | 11.5 Plan Risk Responses | **Fight or Flight** | Choose strategies (Avoid, Mitigate, Transfer, Accept). | Strategies for Threats vs. Opportunities; Contingency Plans. |
| **Lvl 25** | 12.1 Plan Procurement | **Buy vs. Build** | Make-or-Buy analysis; choose Contract Type (Fixed Price vs T&M). | Procurement SOW; Source Selection Criteria; Contract Types. |
| **Lvl 26** | 13.2 Plan Stakeholder Eng. | **Keeping them Happy** | Adjust engagement strategies (Unaware -> Supportive). | Stakeholder Engagement Assessment Matrix. |

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

### **Level 1: The Authorization**
**Process:** 4.1 Develop Project Charter (Initiating)
**Objective:** Formally authorize the project and the Intern's authority.
**Key Concepts:** Business Case vs. Agreements, Assumption Log, High-Level Info.

**1. Narrative Hook**
*   **Context:** The cleanup is done. Director Vane (Sponsor) pings you: *"Okay, the board greenlit the 'Titan Upgrade'. Get the paperwork done so I can sign it. Don't spend a dime until then."*
*   **Conflict:** You have nothing but a messy folder of old files. You must find the *authority* to start.

**2. Gameplay Mechanics**
*   **Step 1: Input Analysis (The Filter)**
    *   **Task:** Drag valid inputs into the **ProcessMap** slot.
    *   **Inventory:**
        *   `Email_Idea_Chain.msg` (Invalid: Informal)
        *   `Business_Case_APPROVED.pdf` (Valid: Shows Economic Feasibility/ROI)
        *   `SOW_Draft_v3.docx` (Valid: Agreement/SOW)
        *   `Meeting_Notes_Friday.txt` (Invalid: Not an organizational asset)
    *   **Learning Moment:** Clicking `Business_Case` triggers a highlight task: *"Find the Justification."* Player highlights **"20% ROI projected."**
*   **Step 2: The Assumption Log (Tool & Technique)**
    *   **Event:** A sticky note on the desktop reads: *"Vendor said hardware arrives June 1st (verbal promise)."*
    *   **Decision:** Where does this go?
        *   A) *Risk Register* (Incorrect - it's not uncertain yet).
        *   B) *Project Charter* (Incorrect - too detailed).
        *   C) *Assumption Log* (Correct - assumed true for planning).
*   **Step 3: Drafting the Charter (The Output)**
    *   **Mechanic:** Drag snippets to sections.
        *   **Scope Section:** Drag *"Secure Login System"* (Correct) vs. *"SQL Database v4.2"* (Incorrect - too detailed).
        *   **Schedule Section:** Drag *"Milestone: Phase 1 Complete - Aug"* (Correct) vs. *"Task: Install Server - Monday"* (Incorrect).
*   **Step 4: The Authorization Trap**
    *   **Event:** Before signing, Vane says: *"Actually, buy the servers now. Prices go up at midnight."*
    *   **Choice:**
        *   `[Buy Now]` -> **FAIL.** *"Violation: You spent funds without a Charter."*
        *   `[Wait for Signature]` -> **SUCCESS.** *"Correct. The Charter grants the authority to apply resources."*

---

### **Level 2: The Politics**
**Process:** 13.1 Identify Stakeholders (Initiating)
**Objective:** Identify who impacts or is impacted by the project.
**Key Concepts:** Salience Model, Power/Interest Grid, Iterative Analysis.

**1. Narrative Hook**
*   **Context:** Charter signed. Vane says: *"Great. Now figure out who we need to keep happy. Don't miss anyone, or they'll bite us later."*

**2. Gameplay Mechanics**
*   **Step 1: Data Gathering (Brainstorming)**
    *   **Task:** Scan the `Company_Directory.xls` and `Email_Inbox`.
    *   **Mechanic:** Click names to "Tag" them as stakeholders.
    *   **Hidden Stakeholder:** An email from "Legal_Compliance" is buried in the spam folder. Failure to tag them causes issues in Level 20.
*   **Step 2: Data Representation (Power/Interest Grid)**
    *   **Task:** Place tagged stakeholders on the grid.
        *   **CFO (High Power/High Interest):** -> *Manage Closely*
        *   **End Users (Low Power/High Interest):** -> *Keep Informed*
        *   **Vendor (High Power/Low Interest):** -> *Keep Satisfied*
*   **Step 3: The Salience Model (Advanced Analysis)**
    *   **Event:** A Union Representative demands a meeting.
    *   **Analysis Tool:** The view shifts to a Venn Diagram (Power, Urgency, Legitimacy).
    *   **Task:** Categorize the Union Rep.
        *   *Has Power?* Yes (Can strike).
        *   *Has Urgency?* Yes (Demands immediate meeting).
        *   *Has Legitimacy?* Yes (Contractual right).
    *   **Result:** Labeled **Definitive Stakeholder**. (Must attend to immediately).
*   **Step 4: The Iterative Lesson**
    *   **Event:** You click "Finish."
    *   **Consequence:** A new email arrives *after* you finish: *"Oh, by the way, the Marketing VP wants in."*
    *   **Choice:**
        *   `[Ignore]` -> **Penalty.**
        *   `[Update Register]` -> **Success.** *"Correct. Identification happens throughout the project."*

---

### **Level 3: The Master Plan**
**Process:** 4.2 Develop Project Management Plan (Planning)
**Objective:** Define *how* the project will be executed, monitored, and controlled.
**Key Concepts:** Subsidiary Plans vs. Baselines, Life Cycle Selection, Project Management Plan components.

**1. Narrative Hook**
*   **Context:** Stakeholders are identified (Level 2). Director Vane sends a high-priority message: *"The Board is nervous. They want to know exactly HOW you plan to deliver Titan. I don't want a schedule yet; I want the rulebook. Get me the Project Management Plan by 5 PM."*
*   **Conflict:** The development team is eager to start coding immediately (Agile/Ad-hoc), while the Client demands strict milestone approvals (Predictive). You must align the Lifecycle to the Business Case.

**2. Gameplay Mechanics**
*   **Step 1: Life Cycle Selection (The Foundation)**
    *   **Action:** Open the **PMIS** "Project Strategy" module.
    *   **Input Data:** Review `SOW_Client.pdf` ("Strict budget cap", "Fixed scope") and `Team_Email_Agile.msg` ("We want to run 2-week sprints").
    *   **Decision:** Select Development Approach.
        *   A) *Agile/Adaptive* (Incorrect - "Risk of scope creep breaks fixed budget contract").
        *   B) *Predictive/Waterfall* (Correct - "Aligns with fixed scope/budget constraints").
        *   C) *Hybrid* (Partial Credit - "Good for team, but requires careful contract renegotiation").
*   **Step 2: Assembling the Plan (Integration)**
    *   **Mechanic:** **ProcessMap** "Crafting".
    *   **Task:** Assemble the *Project Management Plan* from available components.
    *   **Inventory Sort:**
        *   *Drag:* Scope Mgmt Plan, Schedule Mgmt Plan, Cost Mgmt Plan (Correct - These are Subsidiary Plans).
        *   *Drag:* Scope Baseline, Schedule Baseline (Correct - These are Baselines).
        *   *Reject:* `Risk_Register.xls`, `Stakeholder_Register.xls` (Correct - These are *Project Documents*, not part of the Plan).
    *   **Feedback Loop:** If Player adds the Risk Register, the system warns: *"Documents are not the plan. The Plan tells you HOW to manage risks; the Register is WHERE you list them."*
*   **Step 3: The Kickoff Meeting (Facilitation)**
    *   **Event:** **Chatter** Group Chat: "Project Titan Kickoff".
    *   **Conflict:** Lead Dev Marcus says: *"Why do we need a Change Management Plan? If we see a bug, we fix it. Don't slow us down with paperwork."*
    *   **Dialogue Choice (Conflict Management):**
        *   A) *Forcing:* "Because I'm the PM and I said so." (Result: Low Morale).
        *   B) *Smoothing:* "It's just a formality for the client, don't worry about it." (Result: Risk of unauthorized changes later).
        *   C) *Problem Solving:* "We need a mechanism to approve changes so we don't blow the fixed budget. It protects the team from scope creep." (Result: +Trust, +Alignment).

**3. Key Learning Objectives**
*   **Integration Management:** The PMP is the "meta-plan" that coordinates all other plans.
*   **Differentiation:** Distinguishing between the *Project Management Plan* (the "How") and *Project Documents* (the "What/Who").

---

### **Level 4: Setting Boundaries**
**Process:** 5.1 Plan Scope Management (Planning)
**Objective:** Document how scope will be defined and controlled.
**Key Concepts:** Scope Mgmt Plan vs. Scope Baseline.

**1. Narrative Hook**
*   **Context:** The client sends an email: *"We might want VR support too."*
*   **Goal:** You aren't defining the scope yet; you are defining *how* you will handle requests like that.

**2. Gameplay Mechanics**
*   **Step 1: Drafting the Policy**
    *   **Tool:** **Scope Management Plan** editor.
    *   **Decision 1:** How do we create the WBS?
        *   *Option:* "Decomposition" (Correct).
    *   **Decision 2:** How do we approve the Baseline?
        *   *Option:* "Formal Sign-off by Client" (Correct).
    *   **Decision 3:** How do we handle changes?
        *   *Option:* "Change Control Board (CCB)" (Correct).
*   **Step 2: The "Gold Plating" Trap**
    *   **Event:** A developer emails: *"I added a cool dark mode feature. It wasn't asked for, but they'll love it."*
    *   **Choice:**
        *   `[Keep it]` -> **Penalty.** (Gold Plating wastes resources).
        *   `[Remove it]` -> **Success.** *"Correct. Zero Gold Plating allowed."*

---

### **Level 5: The Wishlist**
**Process:** 5.2 Collect Requirements (Planning)
**Objective:** Elicit needs from stakeholders.
**Key Concepts:** Requirements Traceability Matrix (RTM), Elicitation Techniques.

**1. Narrative Hook**
*   **Context:** The team is ready to gather specs. You must interview the stakeholders identified in Level 2.

**2. Gameplay Mechanics**
*   **Step 1: The Interviews (Data Gathering)**
    *   **Action:** Click on stakeholders in the **Chatter** list to "Interview."
    *   **CFO:** *"I need the system to cost less than $50k annually."* (Business Requirement).
    *   **End User:** *"I need to login with FaceID."* (Solution/Functional Requirement).
    *   **Compliance Officer:** *"Data must be encrypted at rest."* (Non-functional/Quality Requirement).
*   **Step 2: Building the RTM (Traceability)**
    *   **Tool:** **Traceability Matrix**.
    *   **Task:** Link each requirement to a **Business Need**.
    *   **Puzzle:** The Marketing VP asks for *"A flashing logo on the home screen."*
    *   **Action:** Try to link to Business Case ROI.
    *   **Result:** Link Fails. *"No Business Value found."*
    *   **Decision:** Move to **Deferred/Rejected** list.

---

### **Level 6: Drawing the Line**
**Process:** 5.3 Define Scope (Planning)
**Objective:** Create the Project Scope Statement.
**Key Concepts:** Project Scope vs. Product Scope, Exclusions.

**1. Narrative Hook**
*   **Context:** You have a mountain of requirements (from Level 5). Now you must decide what is IN and what is OUT.

**2. Gameplay Mechanics**
*   **Step 1: Filtering the List**
    *   **Input:** Requirements Documentation (from Level 5).
    *   **Task:** Drag items to "In Scope" or "Out of Scope" bucket.
    *   **Constraint:** Budget is tight.
    *   **Action:** Move *"VR Support"* to **Out of Scope** (Exclusion).
*   **Step 2: Writing the Scope Statement**
    *   **Mechanic:** Fill in the blanks.
    *   **Deliverables:** "Server Hardware, Software License, User Manual."
    *   **Exclusions:** "Client Training, VR Module, Ongoing Maintenance."
    *   **Acceptance Criteria:** "System uptime 99.9%."
*   **Step 3: The "Scope Creep" Challenge**
    *   **Event:** Client emails: *"I assumed 'Maintenance' was included. Why isn't it?"*
    *   **Response:**
        *   A) *"We can add it."* -> **Fail.** (Scope Creep).
        *   B) *"It is listed in the **Exclusions**. We can add it as a new project phase."* -> **Success.**

---

### **Level 7: Decomposition**
**Process:** 5.4 Create WBS (Planning)
**Objective:** Break down deliverables into Work Packages.
**Key Concepts:** 100% Rule, Work Packages vs. Activities.

**1. Narrative Hook**
*   **Context:** Scope is defined. Now break it down so the team can execute. *"I don't know how to build a 'Secure System'. Break it into chunks."*

**2. Gameplay Mechanics**
*   **Step 1: The Wall of Post-its (Decomposition)**
    *   **UI:** A hierarchical tree view.
    *   **Root Node:** Project Titan.
    *   **Level 2:** Hardware, Software, Training.
    *   **Task:** Drag "Install Server" card.
    *   **Puzzle:** Where does it go?
        *   *Under Software?* (No).
        *   *Under Hardware?* (Yes).
*   **Step 2: The 100% Rule**
    *   **Event:** Player tries to delete a "Testing" branch to save space.
    *   **Feedback:** *"Error: 100% Rule Violation. If you remove Testing, the parent deliverable is incomplete."*
*   **Step 3: Defining Work Packages**
    *   **Task:** Drill down until the card turns **Green** (Work Package Level).
    *   **Rule:** A Work Package is the lowest level of the WBS (e.g., "Config Firewall"), not a verb/activity (e.g., "Typing code").
    *   **Outcome:** The **Scope Baseline** is now complete (Scope Statement + WBS + WBS Dictionary).

---

### **Level 8: Time Rules**
**Process:** 6.1 Plan Schedule Management (Planning)
**Objective:** Define the criteria and activities for developing, monitoring, and controlling the schedule.
**Key Concepts:** Schedule Management Plan, Units of Measure, Level of Accuracy.

**1. Narrative Hook**
*   **Context:** The WBS is approved. Now you need to figure out *how* to track time. Vane asks: *"Are we tracking this in hours, days, or weeks? And how much slip is too much?"*

**2. Gameplay Mechanics**
*   **Step 1: Configuring the Schedule Tool**
    *   **Tool:** **AscendTrack** Settings.
    *   **Decision 1 (Units of Measure):**
        *   *Option A:* Minutes (Too granular - micromanagement).
        *   *Option B:* Hours/Days (Correct for this project size).
        *   *Option C:* Months (Too vague).
    *   **Decision 2 (Level of Accuracy):**
        *   *Option:* "+/- 10%" (Correct).
    *   **Decision 3 (Variance Thresholds):**
        *   *Option:* "Alert Sponsor if SV > 10%." (Correct).
*   **Step 2: The "Sandbagging" Debate**
    *   **Chatter:** A developer says: *"Let's just double every estimate to be safe."*
    *   **Response:**
        *   A) *"Great idea, we'll never be late."* -> **Fail.** (Parkinson's Law).
        *   B) *"No. We use realistic estimates and hold a separate **Contingency Reserve**."* -> **Success.**

---

### **Level 9: Action Items**
**Process:** 6.2 Define Activities (Planning)
**Objective:** Decompose Work Packages into Activities.
**Key Concepts:** Activities vs. Deliverables, Rolling Wave Planning.

**1. Narrative Hook**
*   **Context:** You have a WBS with "Work Packages" (Nouns). Now the team needs "Activities" (Verbs) to actually do the work.

**2. Gameplay Mechanics**
*   **Step 1: The Decomposition Tool**
    *   **Input:** WBS Work Package: "Secure Login System".
    *   **Task:** Break it down into activities.
    *   **Action:** Type/Select verbs.
        *   *Activity 1:* "Code Login API."
        *   *Activity 2:* "Design DB Schema."
        *   *Activity 3:* "Unit Test Login."
*   **Step 2: Rolling Wave Planning**
    *   **Event:** You reach a Work Package for "Phase 2 Deployment" (6 months away).
    *   **Decision:** Do we detail this now?
        *   A) *Detail every minute task now.* -> **Fail.** (Waste of time/High uncertainty).
        *   B) *Leave as Planning Package.* -> **Success.** (Rolling Wave Planning).

---

### **Level 10: The Logic Puzzle**
**Process:** 6.3 Sequence Activities (Planning)
**Objective:** Identify relationships among activities.
**Key Concepts:** PDM (Precedence Diagramming Method), Dependencies (FS, SS, FF, SF), Leads & Lags.

**1. Narrative Hook**
*   **Context:** You have a list of activities. Now put them in order.
*   **Puzzle:** "You can't test code before you write it."

**2. Gameplay Mechanics**
*   **Step 1: The Network Diagram**
    *   **UI:** A canvas with nodes (Activities).
    *   **Task:** Draw lines to connect them.
    *   **Logic Puzzle 1:** Connect "Pour Foundation" and "Frame Walls".
        *   *Relationship:* Finish-to-Start (FS).
    *   **Logic Puzzle 2:** Connect "Write Draft" and "Edit Draft".
        *   *Relationship:* Start-to-Start (SS) with a Lag. (Editors can start a few days after writers begin).
*   **Step 2: Mandatory vs. Discretionary**
    *   **Event:** Team wants to do "User Testing" *after* "Global Launch" to save time.
    *   **Choice:**
        *   A) *Allow it.* -> **Disaster.** (Bugs in production).
        *   B) *Enforce Mandatory Dependency.* -> **Success.** (Testing *must* precede Launch).

---

### **Level 11: The Timeline**
**Process:** 6.4 Estimate Activity Durations (Planning)
**Objective:** Estimate work periods for activities.
**Key Concepts:** Analogous, Parametric, Three-Point Estimating, Reserve Analysis.

**1. Narrative Hook**
*   **Context:** The sequence is set. Now, how long will it take?
*   **Resource:** You have historical data from "Project Gemini" (Previous project).

**2. Gameplay Mechanics**
*   **Step 1: Choosing the Method**
    *   **Task 1:** "Install Standard Server." (Repetitive task).
        *   *Method:* **Parametric**. (1 server = 2 hours. 10 servers = 20 hours).
    *   **Task 2:** "Solve Unknown Bug." (Uncertain).
        *   *Method:* **Three-Point (PERT)**.
        *   *Input:* Optimistic (2h), Most Likely (5h), Pessimistic (20h).
        *   *Calculation:* (O + 4M + P) / 6. Player must select the weighted average.
*   **Step 2: Reserve Analysis**
    *   **Action:** Add **Contingency Reserves** to high-risk activities.
    *   **Feedback:** Visual "Buffer" segments appear on the Gantt chart.

---

### **Level 12: Critical Path**
**Process:** 6.5 Develop Schedule (Planning)
**Objective:** Analyze sequences and durations to create the Schedule Baseline.
**Key Concepts:** Critical Path Method (CPM), Float, Schedule Compression (Crashing/Fast Tracking).

**1. Narrative Hook**
*   **Context:** You have a draft schedule. It says completion in **December**.
*   **Crisis:** Director Vane screams: *"We need to launch in **November**! Fix it!"*

**2. Gameplay Mechanics**
*   **Step 1: Identifying the Critical Path**
    *   **UI:** The Network Diagram highlights the longest path in Red.
    *   **Task:** Identify which tasks have **Zero Float**.
*   **Step 2: Compression (The Trade-off)**
    *   **Goal:** Reduce duration by 4 weeks.
    *   **Option A (Crashing):** "Pay overtime / Hire contractors."
        *   *Consequence:* Cost increases. Risk remains same.
    *   **Option B (Fast Tracking):** "Do 'Testing' and 'Documentation' in parallel."
        *   *Consequence:* Cost stays same. **Risk Increases** (Rework likely).
    *   **Option C (Cut Scope):** "Remove VR Module."
        *   *Consequence:* Requires Change Request (Scope Change).
    *   **Solution:** Player must choose based on current constraints (e.g., if Budget is tight, Fast Track. If Risk is high, Crash).

---

### **Level 13: The Wallet**
**Process:** 7.1 Plan Cost Management (Planning)
**Objective:** Establish policies for planning, managing, and controlling costs.
**Key Concepts:** Units of Measure, Precision, Accuracy, Reporting Formats.

**1. Narrative Hook**
*   **Context:** Schedule is set. Now you must set the rules for the money. Finance sends a memo: *"We need weekly burn reports in USD, rounded to the nearest $100."*

**2. Gameplay Mechanics**
*   **Step 1: Drafting the Plan**
    *   **Input Panel:** Select parameters.
        *   *Units of Measure:* "Currency (USD)" (Correct) vs. "Hours" (Incorrect - that's schedule).
        *   *Level of Precision:* "$100" (Correct) vs. "$0.01" (Too granular for executive reports).
        *   *Level of Accuracy:* "+/- 10%" (Correct).
*   **Step 2: Earned Value Rules**
    *   **Decision:** How do we measure performance?
        *   *Option A:* "Just track cash spent." -> **Fail.** (Doesn't measure value).
        *   *Option B:* "Earned Value Management (EVM)." -> **Success.** (Integrates Scope, Schedule, Cost).

---

### **Level 14: The Price Tag**
**Process:** 7.2 Estimate Costs (Planning)
**Objective:** Develop an approximation of costs for resources.
**Key Concepts:** Direct vs. Indirect Costs, Contingency Reserves, Rough Order of Magnitude (ROM).

**1. Narrative Hook**
*   **Context:** Vane asks: *"How much will 'Phase 1' cost? Don't just guess."*
*   **Resource:** `Vendor_Quotes.pdf` and `Salary_Grid.xls`.

**2. Gameplay Mechanics**
*   **Step 1: Calculating Activity Costs**
    *   **Task:** Estimate "Install Server".
    *   **Inputs:**
        *   Labor: 10 hours @ $50/hr = $500.
        *   Hardware: $2,000.
        *   *Result:* $2,500.
*   **Step 2: Direct vs. Indirect**
    *   **Event:** Finance asks you to include "Electricity Bill" in the activity cost.
    *   **Choice:**
        *   A) *Add it.* -> **Warning.** "This is an Indirect Cost (Overhead), usually handled at the project level, not activity level."
        *   B) *Exclude.* -> **Success.**
*   **Step 3: Reserves**
    *   **Action:** Apply **Contingency Reserve** (10% for "Known-Unknowns").
    *   **Outcome:** Final Estimate = $2,750.

---

### **Level 15: Funding the Baseline**
**Process:** 7.3 Determine Budget (Planning)
**Objective:** Aggregate estimated costs to establish the Cost Baseline.
**Key Concepts:** Cost Baseline vs. Project Budget, Management Reserve, S-Curve.

**1. Narrative Hook**
*   **Context:** You have activity estimates. Now roll them up into the total budget for approval.

**2. Gameplay Mechanics**
*   **Step 1: Aggregation (The Roll-up)**
    *   **Visual:** Animation showing Activity Estimates -> Work Package Estimates -> Control Account Estimates -> **Cost Baseline**.
*   **Step 2: The Management Reserve (The Secret Stash)**
    *   **Event:** Vane asks: *"What if something totally unexpected happens? Like a meteor hitting the data center?"*
    *   **Action:** Add **Management Reserve** (5% for "Unknown-Unknowns").
    *   **Learning Moment:** The Game explains: *Management Reserve is NOT part of the Cost Baseline, but IS part of the Project Budget.*
*   **Step 3: The Funding Limit Reconciliation**
    *   **Constraint:** The Client pays $10k per month.
    *   **Problem:** Your schedule requires spending $15k in Month 2.
    *   **Task:** Adjust the schedule (level resources) to fit the funding limit.

---

### **Level 16: Defining "Done"**
**Process:** 8.1 Plan Quality Management (Planning)
**Objective:** Identify quality requirements and standards.
**Key Concepts:** Cost of Quality (Prevention/Appraisal/Failure), Quality Metrics.

**1. Narrative Hook**
*   **Context:** "We need it fast and cheap."
*   **Response:** "Fast, Cheap, Good. Pick two." You need to define "Good."

**2. Gameplay Mechanics**
*   **Step 1: Defining Metrics**
    *   **Task:** Set pass/fail criteria for "Login System".
    *   **Input:** "Load time must be under 2 seconds."
    *   **Metric:** "Performance < 2000ms."
*   **Step 2: Cost of Quality (COQ)**
    *   **Challenge:** Allocate budget to Quality.
    *   **Option A (Prevention):** "Train developers on secure coding." (High upfront cost, low failure cost).
    *   **Option B (Appraisal):** "Hire extra testers." (Medium cost).
    *   **Option C (Failure):** "Fix bugs after release." (Zero upfront cost, Massive failure cost).
    *   **Correct Strategy:** Balance Prevention and Appraisal to minimize Failure costs.

---

### **Level 17: Team Strategy**
**Process:** 9.1 Plan Resource Management (Planning)
**Objective:** Define how to estimate, acquire, manage, and use team resources.
**Key Concepts:** RACI Chart, Organizational Breakdown Structure (OBS), Recognition Plan.

**1. Narrative Hook**
*   **Context:** Who is doing what? And who is the boss of whom?

**2. Gameplay Mechanics**
*   **Step 1: The RACI Chart**
    *   **Task:** Assign roles for "Code Review".
    *   **Puzzle:**
        *   *Responsible:* Developer.
        *   *Accountable:* Only ONE person (Tech Lead).
        *   *Consulted:* Security Expert.
        *   *Informed:* Project Manager.
    *   **Trap:** Making two people Accountable. -> **Error.** *"Ambiguity in command."*
*   **Step 2: Recognition Plan**
    *   **Decision:** How to motivate the team?
        *   *Option:* "Pizza party." (Weak).
        *   *Option:* "Certifications and Bonuses linked to performance." (Strong).

---

### **Level 18: The Headcount**
**Process:** 9.2 Estimate Activity Resources (Planning)
**Objective:** Estimate team resources and materials.
**Key Concepts:** Resource Requirements, Basis of Estimates, Bottom-up Estimating.

**1. Narrative Hook**
*   **Context:** You have the plan. Now you need the bodies.

**2. Gameplay Mechanics**
*   **Step 1: Assigning Skills**
    *   **Task:** "Database Migration" Activity.
    *   **Resource Pool:**
        *   *Intern:* $20/hr (Low Skill, High Risk).
        *   *Senior DBA:* $150/hr (High Skill, Low Risk).
    *   **Decision:** Select Senior DBA. (Critical task requires expertise).
*   **Step 2: Resource Calendar**
    *   **Event:** You try to assign the DBA to "Week 4".
    *   **Alert:** *"Resource Unavailable: Vacation."*
    *   **Action:** Update the Schedule to accommodate the Resource Calendar.

---

## **6. Narrative Endings**

The game concludes with one of three evaluations based on the player's cumulative choices:

1.  **The "Gold Plater" (Technical Success, Business Failure):** You delivered a perfect product, but 3 months late and over budget. The company loses money.
2.  **The "Iron Fist" (Business Success, Team Failure):** You hit the deadline and budget, but your team burned out and quit. High turnover score.
3.  **The "PMP Master" (True Ending):** You balanced the constraints, managed stakeholders with empathy, and followed the 49 processes correctly. Unlocks "Senior PM" Mode (New Game+).