# Changelog

All notable changes to the **Tech Production Kanban** platform will be documented in this file.

## [1.0.0] - 2026-08-20

### Added
- **Jira-Style Kanban Board**: 5 stage workflow (*Backlog*, *Under Refinement*, *Consensus Reached*, *In AI Production*, *Shipped*) with drag and drop, issue keys (`AI-101`), and priority filters.
- **Confluence-Style Living PRDs**: Rich document viewer with natural language scoping (Problem statement, target persona, proposed solution, value proposition, and testable Definition of Done criteria).
- **Unanimous Consensus Gate**: Enforced 100% team sign-off requirement before ideas can transition into AI production.
- **Interactive Team Impersonator**: 1-click active user switcher to test multi-member deliberation, approval votes, and objection notes.
- **Startup Scoring & 2D Matrix**: Weighted formula (Impact, Urgency, Simplicity, Strategic Fit) and interactive 4-quadrant visual matrix (*Quick Wins*, *Strategic Bets*, *Low Hanging Fruit*, *Deprioritize*).
- **1-Click AI Prompt Exporter**: Instant formatting for Google Antigravity, Claude Code, and Openwork.
- **Multi-Project Spaces**: Independent project workspaces with custom prefixes, color coding, and seed data.
- **Offline Storage & Backup**: Full `localStorage` persistence with JSON export and import.
- **Automated Test Suite**: Unit tests for scoring formulas and consensus gate logic via Vitest.
