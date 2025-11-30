# Project Ascend: Game Design Document (Vertical Slice)

**Theme:** Corporate Simulation / Career RPG
**Phase Focus:** Initiating Process Group (Predictive Methodology)
**Role:** PMO Intern (The "Shadow" Project Manager)
**Target Audience:** Aspiring Project Managers (PMP Candidates)

---

## 1. Executive Summary

**Project Ascend** is a grounded simulation game where the player assumes the role of a **PMO Intern** at *Aethelgard Global*, a high-pressure corporate conglomerate.

**The Hook:** You are fighting for a permanent job. Your "Final Interview" is not a test—it's a real project. The Project Director has thrown you into the deep end: "Here is a mess of emails, contracts, and conflicting demands. Organize it. Initiate the project. If you survive the politics, you get the job."

**Learning Objective:** To assess the player's ability to execute the **Initiating Process Group** (Develop Project Charter, Identify Stakeholders) by simulating the cognitive load of a real Project Manager: filtering noise, identifying key players, and formalizing authority.

---

## 2. Narrative Architecture

### 2.1 The Scenario: "Project Genesis"
*   **Setting:** The player's desk (The "Cockpit"). A realistic OS interface featuring an Email Client, a Browser (for research), and the Company Intranet (PMIS).
*   **The Plot:** Aethelgard is launching a controversial new "Smart Office" initiative. The Senior PM abruptly quit.
*   **The Mentor (Quest Giver):** *Director Thorne*. He is stern, exacting, and follows the PMBOK Guide religiously. He provides the **Acceptance Criteria** for your tasks.
*   **The Conflict:** The project is messy. Stakeholders are arguing via email. The Business Case is buried in a PDF attachment. You must bring order to chaos.

### 2.2 Character Archetypes (The Stakeholders)
The player never sees 3D models. They interact with "People" through their digital footprints (Emails, Slack messages, Voicemails).

1.  **Elias Thorne (Sponsor):** The CEO.
    *   *Signature:* Short, demanding emails. All caps.
    *   *Player Task:* Identify him as **High Power / High Interest**.
2.  **Sarah Jenkins (Functional Manager - IT):**
    *   *Signature:* Long, technical rants about server capacity.
    *   *Player Task:* Identify her as a **Key Stakeholder** who provides "Expert Judgment" (Technical Specs).
3.  **The "Ghost" (Negative Stakeholder):** A VP of a rival department.
    *   *Signature:* Passive-aggressive concerns about budget.
    *   *Player Task:* Spot the resistance. Classify as "Monitor" or "Keep Satisfied" to prevent sabotage.

---

## 3. Gameplay Mechanics: The "Desktop Simulator"

The game takes place entirely on a simulated computer desktop. The "Game Loop" mimics the PMP workflow.

### 3.1 Mechanic: The Inbox Analysis (Identify Stakeholders)
*   **The Activity:** The player opens the "Inbox" app. It is full of 30+ unread messages.
*   **The Cognitive Task (Realism):** Reading comprehension and filtration.
    *   *Message A:* "Hey, can we order pizza for lunch?" (Noise - Ignore).
    *   *Message B:* "I need to review the security protocols before this goes live." - *Head of Security* (Signal - Stakeholder).
*   **The Interaction:**
    *   **[LMB Click]:** Player clicks the email body to read it.
    *   **[LMB Click + Hold]:** Player grabs the **Drag Handle (Grip Icon)** on the left of the email row.
    *   **[Drag]:** Player moves cursor to the open **Stakeholder Register App** window.
    *   **[Release]:** Player drops the email to generate a new entry.
    *   **[LMB Click]:** Player selects attributes (Role, Power, Interest) from dropdown menus.
*   **The Test:** If the player ignores the Head of Security, an event triggers later: "Security Breach! Project Delayed." -> **FAIL STATE**.

### 3.2 Mechanic: The Charter Builder (Develop Project Charter)
*   **The Activity:** The player opens the "Charter Creator v1.0" (The Company Template).
*   **The Puzzle:** The template has blank slots: *Business Case*, *Scope Description*, *Key Risks*, *Milestone Schedule*.
*   **The Inventory:** A "Downloads" folder containing raw files (PDFs, Spreadsheets, Memo.txt).
*   **The Interaction (Data Normalization):**
    *   **[Double-Click]:** Open "Financial_Report_Q3.xlsx" to find ROI figures.
    *   **[LMB Highlight]:** Select the specific ROI text/cell value.
    *   **[LMB Drag]:** Drag the highlighted text from the document into the **Business Case** slot of the Charter.
    *   **The Trap:** There is a file called "Detailed Server Schematics".
        *   *Incorrect Action:* Dragging this into "Scope Description".
        *   *Result:* Director Thorne rejects it. *"Too detailed! The Charter is high-level. This belongs in the Project Management Plan. Try again."*
    *   **The Correct Action:** Dragging "Upgrade Office Infrastructure" summary into "Scope Description".

### 3.3 The Decision Node: The Assumption Log
*   **Scenario:** An email from the Vendor says, "We *should* be able to deliver the hardware by June 1st, barring customs delays."
*   **Interaction:** A "Log This?" prompt appears.
*   **Choice A:** Ignore it (It's just an email).
*   **Choice B:** Log it as a **Risk**.
*   **Choice C:** Log it as an **Assumption** ("Hardware arrives by June 1st").
*   **Input:** **[LMB Click]** on the corresponding button in the prompt modal.
*   **Pedagogical Rationale:** The correct PMP action is **Choice C** (initially). This teaches the difference between a confirmed Fact and an Assumption that needs monitoring.

---

## 4. Systems Design & Assessment

### 4.1 The "Sponsor Approval" Meter (Grading System)
Instead of HP, the player has **Sponsor Confidence**.
*   **Starting Confidence:** 50%
*   **Correct Action:** Identifying a hidden stakeholder (+5%).
*   **Correct Action:** using correct "High Level" language in Charter (+10%).
*   **Mistake:** Putting detailed budget (down to the penny) in the Charter (-10% - "Micro-management penalty").
*   **Win State:** Confidence > 80% -> Charter Signed.
*   **Fail State:** Confidence < 20% -> "You are reassigned to mailroom duty."

### 4.2 Integrated PMP Concepts
| PMP Concept | Gameplay Source | Test Mechanic |
| :--- | :--- | :--- |
| **Enterprise Environmental Factors (EEF)** | "Company Policy Handbook" PDF on desktop | Player must check this file to see if "Overtime" is allowed before drafting the schedule. |
| **Organizational Process Assets (OPA)** | "Templates" Folder | Player uses the "Standard Charter Template" instead of writing from scratch (Efficiency Bonus). |
| **Expert Judgment** | "Chat App" | Player can message the "Senior Engineer" to ask for clarification. (Costs time). |
| **Business Case** | "CFO Email" | Player must extract the "Why" (ROI) from the email to justify the project. |

---

## 5. UI/UX Wireframe Concepts

### 5.1 The Desktop HUD
*   **Bottom Taskbar:**
    *   **Interaction:** **[LMB Click]** to toggle window visibility.
    *   Items: Email, Browser, Chat, Files, **PMIS (The Game App)**.
*   **Top Right:** "Date/Time" (The deadline is ticking).
*   **Notifications:** Pop-ups from "Director Thorne" giving hints or scolding mistakes.
    *   **Interaction:** **[LMB Click]** 'X' to dismiss, or **[LMB Click]** body to jump to relevant app.

### 5.2 The "Stakeholder Web" Tool
*   A visual tool within the PMIS.
*   **Interaction:** **[LMB Drag]** faces/names onto a **Power/Interest Grid**.
*   Visual Feedback: If placed correctly, the node turns Green. If wrong (e.g., Low Power placed in High Power), the node turns Red after the "Review Meeting."

---

## 6. Technical Specifications (Input Mapping)

This project utilizes a standard "Point and Click" interface typical of Management Simulations.

| Action Type | Input Method | Context |
| :--- | :--- | :--- |
| **Select / Interact** | Left Mouse Button (LMB) Click | Buttons, Menu Items, Taskbar Icons |
| **Open Item** | LMB Double-Click | Desktop Icons, File Attachments |
| **Context Menu** | Right Mouse Button (RMB) Click | Inspecting Emails, Files (shows "Properties") |
| **Move Window** | LMB Click (Title Bar) + Drag | Organizing the workspace |
| **Transfer Data** | LMB Click (Object/Text) + Hold + Drag | Moving Email to Register; Moving Text to Charter |
| **Type Data** | Keyboard (Alphanumeric) | Login Screen, Search Bars, Manual Form Entry |
| **Submit / Confirm** | 'Enter' Key | Login, Chat Messages |
| **Pause / System** | 'Esc' Key | Opens System Menu |

---

## 7. User Flow & UI States (Step-by-Step Workflow)

**Goal:** This section provides a linear script for the UI Developer to build the "Vertical Slice" sequence, including specific input triggers.

### 7.1 Scene 0: The Login (Immersion)
*   **Visual:** A black screen with retro-style white text: `AETHELGARD BIOS v4.0. Initializing...`
*   **UI Element:** A central **Login Box**.
    *   *Input Field:* "Enter Employee ID".
    *   *Button:* "Connect to Intranet".
*   **Workflow / Input:**
    1.  **[Keyboard Type]**: Player types name (e.g., "Intern").
    2.  **[Keyboard Enter]** OR **[LMB Click]**: Player activates "Connect" button.
*   **Audio:** Hard drive spinning up, fan noise.
*   **Rationale:** Establishes the "Simulation" tone immediately.

### 7.1.5 Scene 0.5: Onboarding (The Training Level)
*   **Trigger:** Immediately after Login success.
*   **UI Element:** A semi-transparent "System Overlay" (Modal).
    *   *Header:* "HR Onboarding Module - Level 1"
    *   *Body Text:*
        > "Welcome, Intern. Your goal is to initiate **Project Genesis**.
        >
        > 1. **Check Email:** Read instructions from Director Thorne.
        > 2. **Unlock PMIS:** Use information in emails to access the Project Management Information System.
        > 3. **Draft Charter:** Drag evidence from files into the Charter Builder.
        >
        > Good luck. Do not disappoint us."
    *   *Button:* "Begin Assignment" (Dismisses overlay).
*   **Workflow / Input:**
    1.  **[LMB Click]**: Player clicks "Begin Assignment" to dismiss the overlay and start the timer.
*   **Pedagogy:** Sets clear expectations and learning objectives before cognitive load increases.

### 7.2 Scene 1: The Desktop (The Hub)
*   **State:** The "Main Menu" is actually the **OS Desktop**.
*   **Wallpaper:** Aethelgard Corporate Logo (Grey/Blue).
*   **Taskbar (Bottom):**
    *   *Start Button:* (Opens System Menu/Pause).
    *   *Apps:* Mail (Bouncing), Files, Browser, **PMIS** (Locked/Greyed out).
    *   *Clock:* Displays real-time countdown (e.g., "Deadline: 48 Hours").
*   **Pedagogical Note:** This establishes the "Enterprise Environmental Factors (EEF)"—the software and culture the project lives in.

### 7.3 Scene 2: The Call to Action (Initiating)
*   **Event:** "Mail" icon has a red badge `(1)`.
*   **Workflow / Input:**
    1.  **[LMB Click]**: Player clicks "Mail" icon on taskbar.
*   **Window:** `Mail Client` opens (Floating Window, Draggable).
*   **Workflow / Input:**
    1.  **[LMB Click]**: Player selects the unread email from list by clicking the body.
*   **Content:** Email from *Director Thorne*.
    *   *Subject:* "Project Genesis - IMMEDIATE ACTION REQUIRED".
    *   *Body:* Briefing. "The previous PM quit. Identify your stakeholders immediately or we lose the contract."
*   **UI State Change:** The **PMIS** icon on the taskbar unlocks (Status: Active/Color).
*   **Notification:** Pop-up toast: *"New Tool Unlocked: Stakeholder Register"*.

### 7.4 Scene 3: The Stakeholder Identification (Core Loop A)
*   **Workflow / Input:**
    1.  **[LMB Click]**: Player clicks **PMIS** icon.
*   **Window:** `PMIS Dashboard` opens. Default tab: "Stakeholder Register".
*   **Workflow / Input (The Mechanics):**
    1.  Player arranges windows (Mail Left, PMIS Right) using **[LMB Drag Titlebar]**.
    2.  **[LMB Click + Hold]**: Player grabs the **"Grip" icon (Drag Handle)** on the left of the email row.
    3.  **[Drag]**: Moves cursor to `Stakeholder Register`.
    4.  **[Release]**: Drops header into the list area.
*   **Modal:** A "Profile Classification" card pops up.
    *   *Dropdowns:* Role, Power.
    *   *Button:* "Confirm Entry".
*   **Workflow / Input:**
    1.  **[LMB Click]**: Select "Functional Manager" from Role dropdown.
    2.  **[LMB Click]**: Select "High" from Power dropdown.
    3.  **[LMB Click]**: Click "Confirm Entry".
*   **Feedback:** The Register list populates with "Sarah Jenkins - IT Dept".

### 7.5 Scene 3.5: The Power/Interest Mapping (Analysis Tool)
*   **Transcript Reference:** *Identify Stakeholders* - "Analyze their interest and influence."
*   **Action:** Player clicks "Analysis View" toggle in PMIS.
*   **UI Element:** A 2x2 Grid appears (Y-Axis: Power, X-Axis: Interest).
*   **Workflow / Input:**
    1.  **[LMB Click + Hold]**: Player grabs the "Sarah Jenkins" card from the list.
    2.  **[Drag]**: Moves card to Top Right Quadrant (High Power / High Interest).
    3.  **[Release]**: Drops card.
*   **Feedback:** Card snaps into place. Tooltip: *"Key Player - Manage Closely"*.

### 7.6 Scene 4: The Charter Construction (Core Loop B)
*   **Event:** Thorne sends a second email: "Charter Template Attached."
*   **Workflow / Input:**
    1.  **[LMB Click]**: Open `Files` app -> "Downloads".
    2.  **[Double-Click]**: Open `Charter Creator` app.
*   **Window:** `Charter Creator` app opens.
    *   *Layout:* Left side = Blank Form Fields (Business Case, Risks). Right side = Reference Files (Docs).
*   **Workflow / Input (Data Normalization):**
    1.  **[Double-Click]**: Open `Financial_Report.pdf` (Preview window).
    2.  **[LMB Highlight]**: Select text "$4.5M ROI".
    3.  **[LMB Click + Hold]**: Grab highlighted text.
    4.  **[Drag]**: Move to "Business Case" field in Charter.
    5.  **[Release]**: Drop text.
*   **UI Feedback:**
    *   *Correct:* Field flashes Green. Audio chime.
    *   *Incorrect (Too Detailed):* Field flashes Red. Thorne Voiceover: *"Too granular! Summary level only."*

### 7.7 Scene 4.5: The Assumption Log (Constraint Analysis)
*   **Transcript Reference:** *Develop Project Charter* - "Difference between Assumption and Fact."
*   **Event:** A pop-up prompts: *"Vendor Email: Hardware 'should' arrive by June 1st."*
*   **UI Element:** A Modal Dialog with two buttons:
    *   [Log as Fact] (Incorrect)
    *   [Log as Assumption] (Correct)
*   **Workflow / Input:**
    1.  **[LMB Click]**: Player clicks [Log as Assumption].
*   **Feedback:** Item is added to the "Assumption Log" tab in PMIS. Thorne Voiceover: *"Good catch. We'll monitor that date."*

### 7.8 Scene 5: Submission & Evaluation (The End State)
*   **UI Element:** A large "Submit to Sponsor" button on the Charter App (bottom right).
*   **Workflow / Input:**
    1.  **[LMB Click]**: Player clicks Submit.
*   **Transition:** Screen dims. Text: "Awaiting Sponsor Signature..."
*   **Screen:** **Performance Report** (The "Win Screen").
    *   *Header:* "Project Authorized" (Success) or "Charter Rejected" (Fail).
    *   *Data Grid:*
        *   Stakeholders Found: 3/4
        *   Charter Accuracy: 85%
        *   **Sponsor Confidence Score:** High.
    *   *Button:* "Proceed to Planning Phase" (Next Level).
*   **Workflow / Input:**
    1.  **[LMB Click]**: Player clicks "Proceed".
