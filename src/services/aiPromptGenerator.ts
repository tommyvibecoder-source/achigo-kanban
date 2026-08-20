import { IdeaCard, Project, TeamMember } from '../types';

export type AiPromptTarget = 'antigravity' | 'claude' | 'openwork';

export function calculateTotalScore(score: IdeaCard['founderScore']): number {
  // Weighted score out of 100
  const impactWeight = 0.35;
  const urgencyWeight = 0.25;
  const simplicityWeight = 0.20;
  const strategicWeight = 0.20;

  const raw =
    score.userImpact * impactWeight +
    score.marketUrgency * urgencyWeight +
    score.implementationSimplicity * simplicityWeight +
    score.strategicFit * strategicWeight;

  return Math.round((raw / 5) * 100);
}

export function generateAiPrompt(
  idea: IdeaCard,
  project: Project,
  teamMembers: TeamMember[],
  target: AiPromptTarget = 'antigravity'
): string {
  const author = teamMembers.find((m) => m.id === idea.authorId)?.name || 'Product Team';
  const scorePercent = calculateTotalScore(idea.founderScore);
  const successPoints = idea.successCriteria.map((c) => `- [ ] ${c}`).join('\n');
  const teamVotes = Object.values(idea.votes)
    .map((v) => {
      const member = teamMembers.find((m) => m.id === v.memberId);
      return `- **${member?.name || 'Member'}** (${member?.role}): ${v.status.toUpperCase()}${v.comment ? ` — "${v.comment}"` : ''}`;
    })
    .join('\n');

  if (target === 'antigravity') {
    return `# Antigravity Feature Specification: [${idea.issueKey}] ${idea.title}

## Project Context
- **Project**: ${project.name} (${project.keyPrefix})
- **Description**: ${project.description}
- **Priority**: ${idea.priority.toUpperCase()} | **Founder Value Score**: ${scorePercent}/100
- **Author**: ${author}

---

## 1. Problem Statement & User Pain Point
${idea.painPoint}

## 2. Target Audience
${idea.targetAudience}

## 3. Proposed Feature & Natural Language Narrative
${idea.proposedSolution}

## 4. Core Value Proposition ("Why Now?")
${idea.valueProposition}

---

## 5. Acceptance Criteria & Definition of Done
${successPoints}

---

## 6. Team Deliberation & Consensus Notes
${teamVotes}

---

## Instructions for AI Dev Team
1. Review the natural language requirements and acceptance criteria above.
2. Formulate necessary UI components, state management, and backend/storage patterns.
3. Build the feature with clean, modular, accessible code and automated test coverage.
4. Verify against all acceptance checkboxes before declaring complete.
`;
  }

  if (target === 'claude') {
    return `### TASK: Build Feature [${idea.issueKey}] ${idea.title}

You are an expert full-stack engineer. Build the following feature for project "${project.name}".

#### Core Objective
${idea.summary}

#### The Problem & Pain Point
${idea.painPoint}

#### Target User
${idea.targetAudience}

#### Proposed Solution & Behavior
${idea.proposedSolution}

#### Value Proposition
${idea.valueProposition}

#### Acceptance Criteria
${successPoints}

#### Team Review Notes
${teamVotes}

Please implement this feature end-to-end. Ensure high code quality, accessibility, error handling, and unit test verification.
`;
  }

  // Openwork format
  return `---
title: "[${idea.issueKey}] ${idea.title}"
project: "${project.name}"
priority: "${idea.priority}"
score: "${scorePercent}%"
---

# Feature Brief: ${idea.title}

## Executive Summary
${idea.summary}

## User Problem & Pain Point
${idea.painPoint}

## Target Persona
${idea.targetAudience}

## Proposed Experience
${idea.proposedSolution}

## Success Metrics / Definition of Done
${successPoints}

## Team Consensus Log
${teamVotes}
`;
}
