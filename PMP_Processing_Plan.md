# PMP Transcript Processing Plan

This plan outlines the normalization tasks to be executed by the PMP Engine.

**Output Directory:** `Processed_Transcripts/`

## Files to Process

| # | Input File | Target Output File | Status |
|---|------------|--------------------|--------|
| 1 | `Transcripts/70. Introduction to Traditional Project Management.txt` | `Processed_Transcripts/70. Introduction to Traditional Project Management_processed.txt` | Pending |
| 2 | `Transcripts/71. Introduction to the process groups.txt` | `Processed_Transcripts/71. Introduction to the process groups_processed.txt` | Pending |
| 3 | `Transcripts/72. 49 Process of Traditional Project Management.txt` | `Processed_Transcripts/72. 49 Process of Traditional Project Management_processed.txt` | Pending |
| 4 | `Transcripts/73. 5 Process Groups.txt` | `Processed_Transcripts/73. 5 Process Groups_processed.txt` | Pending |
| 5 | `Transcripts/74. Processes ITTOs.txt` | `Processed_Transcripts/74. Processes ITTOs_processed.txt` | Pending |
| 6 | `Transcripts/75. Enterprise Environmental Factors.txt` | `Processed_Transcripts/75. Enterprise Environmental Factors_processed.txt` | Pending |
| 7 | `Transcripts/76. Organization Process Assets.txt` | `Processed_Transcripts/76. Organization Process Assets_processed.txt` | Pending |
| 8 | `Transcripts/77. Project Documents.txt` | `Processed_Transcripts/77. Project Documents_processed.txt` | Pending |
| 9 | `Transcripts/78. Project Management Plan.txt` | `Processed_Transcripts/78. Project Management Plan_processed.txt` | Pending |
| 10 | `Transcripts/79. Expert Judgement.txt` | `Processed_Transcripts/79. Expert Judgement_processed.txt` | Pending |
| 11 | `Transcripts/80. Data Gathering, Analysis, Representation, and Decision Making.txt` | `Processed_Transcripts/80. Data Gathering, Analysis, Representation, and Decision Making_processed.txt` | Pending |
| 12 | `Transcripts/81. Interpersonal and Team Skills.txt` | `Processed_Transcripts/81. Interpersonal and Team Skills_processed.txt` | Pending |
| 13 | `Transcripts/82. Meetings.txt` | `Processed_Transcripts/82. Meetings_processed.txt` | Pending |
| 14 | `Transcripts/83. PMIS.txt` | `Processed_Transcripts/83. PMIS_processed.txt` | Pending |
| 15 | `Transcripts/84. Change Request.txt` | `Processed_Transcripts/84. Change Request_processed.txt` | Pending |
| 16 | `Transcripts/85. Work Performance Data, Info and report.txt` | `Processed_Transcripts/85. Work Performance Data, Info and report_processed.txt` | Pending |
| 17 | `Transcripts/86. Updates.txt` | `Processed_Transcripts/86. Updates_processed.txt` | Pending |
| 18 | `Transcripts/87. Develop Project Charter.txt` | `Processed_Transcripts/87. Develop Project Charter_processed.txt` | Pending |
| 19 | `Transcripts/88. Identify stakeholders.txt` | `Processed_Transcripts/88. Identify stakeholders_processed.txt` | Pending |

## Execution Strategy
The Orchestrator will loop through this list and create a `new_task` for each item using the `pmp-engine` mode.