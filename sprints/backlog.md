# Engineering Backlog

## Intake & Requirements (Product Owner)

### [PROJ-01] Multi-Project Space Management
- **As a** startup founder or team member,
- **I want** to create and switch between distinct product workspaces,
- **So that** ideas and workflows across our different apps/ventures remain well-organized and isolated.
- **Acceptance Criteria**:
  - Given a user in the PM app, they can see a switcher of available projects (with space icons and colors).
  - Given a user creates a new project, a new workspace is initialized with its own Backlog, Kanban, and team members.
  - Changes in one project space do not pollute other project spaces.

### [PROJ-02] Jira-Confluence Natural Language Idea Scoping & PRD Studio
- **As a** founder or product lead,
- **I want** to document ideas in natural language answering core product questions (Problem, Target User, Solution, Value Proposition, Success Metrics),
- **So that** our team can easily understand and refine the concept without premature technical jargon.
- **Acceptance Criteria**:
  - Clean modal/page with intuitive form fields for Problem Statement, User Story, Value Proposition, and Success Criteria.
  - Real-time preview of the living PRD.
  - Tagging system, issue key assignment (`AI-101`, `FIN-204`), and priority levels.

### [PROJ-03] Startup Scoring & Priority Matrix
- **As a** product team,
- **I want** to score ideas based on User Impact, Market Urgency, and Implementation Simplicity,
- **So that** our team can objectively prioritize our highest leverage ideas.
- **Acceptance Criteria**:
  - Intuitive slider/stepper scoring model.
  - Calculated Priority Tier badge (Critical, High, Medium, Low).
  - Visual 2D Impact vs. Simplicity Matrix view.

### [PROJ-04] Collaborative Team Deliberation & Unanimous Consensus Gate
- **As a** collaborative startup team,
- **I want** all team members to review, discuss, and vote on an idea,
- **So that** no idea moves forward into development until 100% unanimous approval is reached.
- **Acceptance Criteria**:
  - Ability to switch active team member persona (e.g., Alex / Founder, Sarah / Product, David / Tech Lead, Elena / UX Lead).
  - Each member can cast their vote (`Approved`, `Needs Discussion`, `Pending`) with feedback comments.
  - Kanban card shows visual consensus indicator (e.g., "3/4 Approved - Locked").
  - The system strictly blocks moving a card into "In AI Production" until all active team members approve.

### [PROJ-05] Jira-Style Kanban & Backlog Views
- **As a** developer and founder,
- **I want** to view and manage ideas across standard stages (*Backlog*, *Refinement*, *Approved*, *In AI Production*, *Shipped*),
- **So that** our team has a clear overview of what is being brainstormed, what is approved, and what is shipped.
- **Acceptance Criteria**:
  - Kanban board with drag-and-drop or 1-click stage advancement.
  - Backlog prioritized list view.
  - Quick search and filtering by priority, tags, and consensus status.

### [PROJ-06] 1-Click AI Prompt / Development Brief Exporter
- **As a** startup building with Antigravity, Claude, or Openwork,
- **I want** to export any approved idea into an AI coding agent prompt,
- **So that** our AI dev team can immediately start building the exact feature with zero friction.
- **Acceptance Criteria**:
  - 1-click "Copy for Antigravity" / "Copy for Claude" / "Copy for Openwork" button.
  - Beautifully formatted Markdown prompt containing the problem, specs, success criteria, and context.
