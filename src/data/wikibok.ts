/**
 * WikiBOK Data - In-game PMBOK Reference Encyclopedia
 *
 * Provides contextual help and reference material for PMP concepts
 * that players encounter during gameplay.
 */

export interface WikiArticle {
  id: string;
  title: string;
  category: 'Process' | 'Knowledge Area' | 'Tool' | 'Concept';
  tags: string[];
  content: string;
  relatedArticles?: string[];
}

export const WIKI_CATEGORIES = [
  { id: 'process', label: 'Processes', icon: 'Workflow' },
  { id: 'knowledge', label: 'Knowledge Areas', icon: 'BookOpen' },
  { id: 'tool', label: 'Tools & Techniques', icon: 'Wrench' },
  { id: 'concept', label: 'Key Concepts', icon: 'Lightbulb' },
];

export const WIKI_ARTICLES: WikiArticle[] = [
  // === PROCESSES ===
  {
    id: 'develop_charter',
    title: 'Develop Project Charter (4.1)',
    category: 'Process',
    tags: ['initiating', 'integration', 'charter', 'authority'],
    content: `# Develop Project Charter

**Process Group:** Initiating
**Knowledge Area:** Project Integration Management

## Purpose
The Develop Project Charter process creates a document that formally authorizes the existence of a project and provides the project manager with the authority to apply organizational resources to project activities.

## Key Inputs
- **Business Case**: Documents the economic feasibility and justification for the project
- **Agreements**: Contracts, MOUs, or other formal agreements
- **Enterprise Environmental Factors**: Organizational culture, market conditions
- **Organizational Process Assets**: Templates, historical information

## Key Outputs
- **Project Charter**: The formal authorization document
- **Assumption Log**: Initial list of assumptions and constraints

## Important Concepts
1. **No Charter = No Authority**: Without a signed charter, the PM cannot commit organizational resources
2. **High-Level Content Only**: The charter contains milestone summaries, not detailed Gantt charts
3. **Sponsor Signs**: The charter must be signed by someone external to the project with funding authority

## Exam Tips
- The charter is developed BEFORE detailed planning begins
- It provides a direct link between the project and organizational strategic objectives
- High-level risks belong in the charter; detailed risk analysis comes later`,
    relatedArticles: ['identify_stakeholders', 'business_case', 'project_sponsor'],
  },

  {
    id: 'identify_stakeholders',
    title: 'Identify Stakeholders (13.1)',
    category: 'Process',
    tags: ['initiating', 'stakeholder', 'analysis', 'register'],
    content: `# Identify Stakeholders

**Process Group:** Initiating
**Knowledge Area:** Project Stakeholder Management

## Purpose
Identify all people, groups, or organizations that could impact or be impacted by the project, and analyze their expectations, involvement, and potential impact.

## Key Inputs
- **Project Charter**: Provides authority and key stakeholder info
- **Agreements**: May identify external stakeholders
- **Enterprise Environmental Factors**: Organizational structure, culture

## Key Outputs
- **Stakeholder Register**: List of stakeholders with analysis data
- **Change Requests**: Updates to project documents as needed

## Important Concepts
1. **Iterative Process**: Stakeholder identification continues throughout the project
2. **Don't Be Too Broad**: "The Entire Company" is not a valid stakeholder entry
3. **Analysis First**: Identify stakeholders BEFORE you can classify them

## Tools & Techniques
- Expert Judgment
- Data Gathering (questionnaires, brainstorming)
- Data Analysis (stakeholder analysis, document analysis)
- Stakeholder Mapping/Representation

## Exam Tips
- This is the SECOND process in Initiating (after Charter)
- New stakeholders can appear at ANY time during the project
- Failure to identify key stakeholders is a common cause of project failure`,
    relatedArticles: ['power_interest_grid', 'salience_model', 'stakeholder_register'],
  },

  // === TOOLS & TECHNIQUES ===
  {
    id: 'power_interest_grid',
    title: 'Power/Interest Grid',
    category: 'Tool',
    tags: ['stakeholder', 'analysis', 'grid', 'matrix'],
    content: `# Power/Interest Grid

A stakeholder classification model that groups stakeholders based on their level of authority (power) and their level of concern (interest) regarding project outcomes.

## The Four Quadrants

### High Power / High Interest: "Manage Closely"
- Key players who must be fully engaged
- Consult frequently and involve in decision-making
- Examples: Sponsor, key customers, regulatory bodies

### High Power / Low Interest: "Keep Satisfied"
- Can impact project but currently not engaged
- Provide information but don't overwhelm with details
- Examples: Senior executives, board members

### Low Power / High Interest: "Keep Informed"
- Cannot directly impact project but care about outcomes
- Keep updated with regular communications
- Examples: End users, community groups

### Low Power / Low Interest: "Monitor"
- Minimal impact and concern
- Monitor but don't over-communicate
- Examples: General public, distant stakeholders

## Application
1. List all identified stakeholders
2. Assess each stakeholder's power level
3. Assess each stakeholder's interest level
4. Plot on the grid
5. Develop engagement strategies per quadrant

## Exam Tips
- This is ONE of several stakeholder classification models
- "Manage Closely" requires the MOST effort
- Classification may change over time`,
    relatedArticles: ['salience_model', 'identify_stakeholders', 'stakeholder_register'],
  },

  {
    id: 'salience_model',
    title: 'Salience Model',
    category: 'Tool',
    tags: ['stakeholder', 'analysis', 'classification', 'venn'],
    content: `# Salience Model

A stakeholder classification model that describes classes of stakeholders based on their power, urgency, and legitimacy.

## The Three Attributes

### Power
The ability of stakeholders to impose their will on the project. Can come from:
- Formal authority (organizational position)
- Control of resources
- Expertise or information

### Urgency
The degree to which stakeholder claims require immediate attention. Based on:
- Time sensitivity
- Criticality of the need

### Legitimacy
The perceived validity of a stakeholder's involvement. Based on:
- Legal/contractual rights
- Organizational authority
- Moral/ethical claims

## Stakeholder Classes

| Class | Power | Urgency | Legitimacy |
|-------|-------|---------|------------|
| Definitive | Yes | Yes | Yes |
| Dominant | Yes | No | Yes |
| Dangerous | Yes | Yes | No |
| Dependent | No | Yes | Yes |
| Dormant | Yes | No | No |
| Discretionary | No | No | Yes |
| Demanding | No | Yes | No |
| Non-stakeholder | No | No | No |

## Key Points
- **Definitive stakeholders** have all three attributes and are highest priority
- **Dangerous stakeholders** may resort to coercion (power + urgency, no legitimacy)
- Attributes can CHANGE over time

## Exam Tips
- Know all three attributes: Power, Urgency, Legitimacy
- Definitive = All three = Top priority
- The model uses a Venn diagram visualization`,
    relatedArticles: ['power_interest_grid', 'identify_stakeholders'],
  },

  // === KEY CONCEPTS ===
  {
    id: 'business_case',
    title: 'Business Case',
    category: 'Concept',
    tags: ['initiating', 'charter', 'justification', 'feasibility'],
    content: `# Business Case

A documented economic feasibility study used to establish the validity of the benefits of a selected component.

## Purpose
- Justifies the investment in the project
- Provides the basis for authorizing project activities
- Serves as a reference throughout the project lifecycle

## Typical Contents
1. **Business Need**: Why the project is needed
2. **Analysis of the Situation**: Current state and problem statement
3. **Recommended Solution**: Proposed approach
4. **Evaluation**: Cost-benefit analysis, ROI, payback period
5. **Project Boundaries**: High-level scope and assumptions

## Relationship to Project Charter
- The Business Case is an INPUT to the Develop Project Charter process
- It provides the justification that appears in the charter
- The PM typically does NOT create the business case (created by sponsor/business analyst)

## Exam Tips
- The Business Case is created BEFORE the project is authorized
- It answers "Why should we do this project?"
- It's updated throughout the project to reflect changing conditions
- The PM uses it as a reference but doesn't own it`,
    relatedArticles: ['develop_charter', 'project_sponsor'],
  },

  {
    id: 'project_sponsor',
    title: 'Project Sponsor',
    category: 'Concept',
    tags: ['stakeholder', 'authority', 'governance', 'funding'],
    content: `# Project Sponsor

A person or group who provides resources and support for the project and is accountable for enabling success.

## Key Responsibilities
1. **Champion the Project**: Advocate at the executive level
2. **Provide Resources**: Secure funding and resources
3. **Sign the Charter**: Formally authorize the project
4. **Resolve Escalations**: Handle issues beyond PM authority
5. **Accept Deliverables**: Final approval of project outputs

## Relationship with PM
- The Sponsor is typically the PM's primary escalation path
- Sponsor has HIGHER authority than the PM
- PM reports project status to the Sponsor
- Major decisions often require Sponsor approval

## Important Distinctions
| Sponsor | Project Manager |
|---------|-----------------|
| External to project team | Leads project team |
| Provides funding | Manages budget |
| Signs charter | Develops charter |
| Accepts final deliverables | Creates deliverables |

## Exam Tips
- The Sponsor, not the PM, signs the Project Charter
- When the PM lacks authority, escalate to the Sponsor
- The Sponsor is accountable for the business value`,
    relatedArticles: ['develop_charter', 'business_case'],
  },

  {
    id: 'conflict_resolution',
    title: 'Conflict Resolution Techniques',
    category: 'Concept',
    tags: ['team', 'communication', 'soft skills', 'negotiation'],
    content: `# Conflict Resolution Techniques

Methods for managing and resolving conflicts that arise during a project.

## The Five Techniques

### 1. Collaborate / Problem Solve
- **Approach**: Work together to find a win-win solution
- **When to Use**: When relationships and objectives are both important
- **Outcome**: Best long-term results, builds consensus
- **Example**: "Let's review the data together to find the right budget."

### 2. Compromise / Reconcile
- **Approach**: Each party gives up something
- **When to Use**: When a quick, acceptable solution is needed
- **Outcome**: Neither fully satisfied, but workable
- **Example**: "We'll split the difference on the timeline."

### 3. Smooth / Accommodate
- **Approach**: Emphasize agreement, downplay differences
- **When to Use**: To maintain harmony, preserve relationships
- **Outcome**: May not address root cause
- **Example**: "We all want what's best for the project."

### 4. Force / Direct
- **Approach**: Push one viewpoint at the expense of others
- **When to Use**: Emergencies, when you're right and it matters
- **Outcome**: Win-lose, may damage relationships
- **Example**: "The Sponsor approved it, just sign it."

### 5. Withdraw / Avoid
- **Approach**: Retreat from conflict, postpone
- **When to Use**: When cooling off is needed, issue is trivial
- **Outcome**: Problem may recur
- **Example**: "Let's discuss this later."

## Exam Tips
- **Collaborate** is usually the BEST answer on the exam
- **Force** and **Withdraw** generally have negative outcomes
- Consider the situation: sometimes quick action trumps consensus`,
    relatedArticles: ['develop_charter'],
  },

  {
    id: 'stakeholder_register',
    title: 'Stakeholder Register',
    category: 'Concept',
    tags: ['stakeholder', 'document', 'analysis', 'output'],
    content: `# Stakeholder Register

A project document containing identification, assessment, and classification information about project stakeholders.

## Contents
1. **Identification Information**
   - Name, organizational position, role
   - Contact information
   - Location

2. **Assessment Information**
   - Major requirements and expectations
   - Potential influence on the project
   - Phase of most interest

3. **Classification**
   - Internal/External
   - Supporter/Neutral/Resistor
   - Power/Interest levels
   - Salience attributes

## Maintenance
- Created during Identify Stakeholders process
- Updated throughout the project
- Referenced in many other processes
- May contain sensitive information (handle appropriately)

## Relationship to Other Documents
- Outputs from: Identify Stakeholders (13.1)
- Input to: Many planning and executing processes
- Updated by: Monitor Stakeholder Engagement

## Exam Tips
- The register is a LIVING document, not a one-time output
- New stakeholders should be added immediately when discovered
- Sensitive information may be stored separately`,
    relatedArticles: ['identify_stakeholders', 'power_interest_grid', 'salience_model'],
  },
];

// Helper functions
export const getArticleById = (id: string): WikiArticle | undefined => {
  return WIKI_ARTICLES.find((a) => a.id === id);
};

export const getArticlesByCategory = (category: string): WikiArticle[] => {
  return WIKI_ARTICLES.filter((a) => a.category.toLowerCase() === category.toLowerCase());
};

export const searchArticles = (query: string): WikiArticle[] => {
  const lowerQuery = query.toLowerCase();
  return WIKI_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.tags.some((t) => t.includes(lowerQuery)) ||
      a.content.toLowerCase().includes(lowerQuery)
  );
};
