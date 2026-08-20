# ADR 0001: Architecture for Jira & Confluence Inspired Tech Production Kanban

## Status
Accepted

## Context
The startup team needs a responsive, client-side web application to manage product ideation across multiple projects. The core value of the tool is enabling fast, natural-language idea scoping, team collaboration, founder scoring, unanimous approval gates before production, and instant AI-prompt generation for tools like Google Antigravity, Claude, and Openwork.

## Decision
1. **Frontend Architecture**:
   - Built with **React 18**, **TypeScript**, and **Vite** for fast performance, developer ergonomics, and rock-solid type safety.
   - **Tailwind CSS** with a modern design system inspired by Atlassian Jira and Confluence (clean navigation, distinct project spaces, issue chips, high contrast accessibility, dark/light aesthetics).
   - **Lucide Icons** for semantic UI iconography.
   - HTML5 & accessible drag-and-drop mechanics for smooth Kanban card reordering and column transitions.

2. **State & Storage Architecture**:
   - Client-side storage layer via `localStorage` with versioned migrations, robust default seed data featuring realistic startup projects ("AI Productivity Engine", "Fintech Mobile Wallet", "SaaS Analytics"), and full JSON export/import capability.
   - State management via React Context (`AppContext`) with atomic actions for Project CRUD, Idea CRUD, Team Member simulation, Consensus Voting, and Stage Progression.

3. **Consensus Engine**:
   - Every project defines its active team members.
   - Every idea tracks votes per team member (`approved`, `needs_discussion`, `pending`).
   - Transition to `in_production` strictly enforces unanimous approval (`votes.every(v => v.status === 'approved')`).
   - If an idea has unresolved objections, the UI displays clear feedback indicating which members requested changes and why.

4. **AI Prompt Generator**:
   - Generates structured, high-context prompts matching the instruction format of Antigravity operating models, Claude Code tasks, and Openwork tasks.

## Alternatives Considered
- *Server-based backend with PostgreSQL*: Overly complex for an initial standalone prototype and would require manual local DB setup for the user. Client-side storage provides instantaneous local bootup, full offline capability, and immediate web testing with zero backend friction.
- *Vanilla JS*: Lacks component modularity and type safety required for complex multi-view state.

## Consequences
- **Positive**: Instant bootup, zero setup friction, full data persistence, clean testability, rich interactive UI.
- **Negative**: Multi-device sync requires manual JSON export/import until cloud sync is added in future iterations.
