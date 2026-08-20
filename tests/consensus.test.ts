import { describe, it, expect } from 'vitest';
import { IdeaCard, TeamMember, KanbanStage } from '../src/types';

describe('Unanimous Consensus & QA Gate Logic', () => {
  const team: TeamMember[] = [
    { id: 'u1', name: 'Zogo', username: 'zogo', role: 'CEO', roleType: 'founder', avatar: '👨‍💼', color: '#000', passcode: 'zogo2026' },
    { id: 'u2', name: 'Achiri', username: 'achiri', role: 'Product', roleType: 'founder', avatar: '👩‍💻', color: '#000', passcode: 'achiri2026' },
    { id: 'u3', name: 'David', username: 'david', role: 'Tech Lead', roleType: 'lead', avatar: '🧑‍🔬', color: '#000', passcode: 'david123' },
  ];

  function evaluateConsensus(idea: IdeaCard, roster: TeamMember[]) {
    let approvedCount = 0;
    const missing: TeamMember[] = [];
    const objections: { member: TeamMember; comment?: string }[] = [];

    roster.forEach((m) => {
      const vote = idea.votes[m.id];
      if (vote && vote.status === 'approved') {
        approvedCount++;
      } else {
        missing.push(m);
        if (vote && vote.status === 'needs_discussion') {
          objections.push({ member: m, comment: vote.comment });
        }
      }
    });

    const isUnanimous = approvedCount === roster.length && roster.length > 0;
    return { isUnanimous, approvedCount, missing, objections };
  }

  function canAdvanceToStage(idea: IdeaCard, targetStage: KanbanStage, roster: TeamMember[]) {
    const consensus = evaluateConsensus(idea, roster);
    const consensusStages: KanbanStage[] = ['approved', 'prompt_creation', 'in_production', 'manual_testing', 'shipped'];

    if (consensusStages.includes(targetStage) && !consensus.isUnanimous) {
      return { allowed: false, reason: 'Consensus required' };
    }

    if (targetStage === 'shipped' && idea.manualTests && idea.manualTests.length > 0) {
      const failed = idea.manualTests.filter((t) => !t.passed);
      if (failed.length > 0) {
        return { allowed: false, reason: `${failed.length} manual tests unverified` };
      }
    }

    return { allowed: true };
  }

  it('passes consensus and allows moving to Prompt Creation when 100% of team approves', () => {
    const idea: IdeaCard = {
      id: 'i1',
      issueKey: 'AI-101',
      projectId: 'p1',
      title: 'Auto Summary',
      issueType: 'feature',
      stage: 'refinement',
      priority: 'high',
      summary: '',
      targetAudience: '',
      painPoint: '',
      proposedSolution: '',
      valueProposition: '',
      successCriteria: [],
      founderScore: { userImpact: 4, marketUrgency: 4, implementationSimplicity: 4, strategicFit: 4 },
      authorId: 'u1',
      votes: {
        u1: { memberId: 'u1', status: 'approved', updatedAt: '2026-08-01' },
        u2: { memberId: 'u2', status: 'approved', updatedAt: '2026-08-01' },
        u3: { memberId: 'u3', status: 'approved', updatedAt: '2026-08-01' },
      },
      comments: [],
      tags: [],
      createdAt: '2026-08-01',
      updatedAt: '2026-08-01',
    };

    const result = canAdvanceToStage(idea, 'prompt_creation', team);
    expect(result.allowed).toBe(true);
  });

  it('blocks shipping if manual tests are failing or unverified', () => {
    const idea: IdeaCard = {
      id: 'i1',
      issueKey: 'AI-101',
      projectId: 'p1',
      title: 'Voice Triggers',
      issueType: 'bug',
      stage: 'manual_testing',
      priority: 'high',
      summary: '',
      targetAudience: '',
      painPoint: '',
      proposedSolution: '',
      valueProposition: '',
      successCriteria: [],
      founderScore: { userImpact: 4, marketUrgency: 4, implementationSimplicity: 4, strategicFit: 4 },
      authorId: 'u1',
      votes: {
        u1: { memberId: 'u1', status: 'approved', updatedAt: '2026-08-01' },
        u2: { memberId: 'u2', status: 'approved', updatedAt: '2026-08-01' },
        u3: { memberId: 'u3', status: 'approved', updatedAt: '2026-08-01' },
      },
      manualTests: [
        { id: 't1', scenario: 'Test button click', expectedResult: 'Opens popup', passed: true },
        { id: 't2', scenario: 'Test offline mode', expectedResult: 'Shows warning', passed: false },
      ],
      comments: [],
      tags: [],
      createdAt: '2026-08-01',
      updatedAt: '2026-08-01',
    };

    const shipResult = canAdvanceToStage(idea, 'shipped', team);
    expect(shipResult.allowed).toBe(false);
    expect(shipResult.reason).toContain('manual tests unverified');
  });

  it('allows shipping when all manual test scenarios are passed', () => {
    const idea: IdeaCard = {
      id: 'i1',
      issueKey: 'AI-101',
      projectId: 'p1',
      title: 'Voice Triggers',
      issueType: 'improvement',
      stage: 'manual_testing',
      priority: 'high',
      summary: '',
      targetAudience: '',
      painPoint: '',
      proposedSolution: '',
      valueProposition: '',
      successCriteria: [],
      founderScore: { userImpact: 4, marketUrgency: 4, implementationSimplicity: 4, strategicFit: 4 },
      authorId: 'u1',
      votes: {
        u1: { memberId: 'u1', status: 'approved', updatedAt: '2026-08-01' },
        u2: { memberId: 'u2', status: 'approved', updatedAt: '2026-08-01' },
        u3: { memberId: 'u3', status: 'approved', updatedAt: '2026-08-01' },
      },
      manualTests: [
        { id: 't1', scenario: 'Test button click', expectedResult: 'Opens popup', passed: true },
        { id: 't2', scenario: 'Test offline mode', expectedResult: 'Shows warning', passed: true },
      ],
      comments: [],
      tags: [],
      createdAt: '2026-08-01',
      updatedAt: '2026-08-01',
    };

    const shipResult = canAdvanceToStage(idea, 'shipped', team);
    expect(shipResult.allowed).toBe(true);
  });
});
