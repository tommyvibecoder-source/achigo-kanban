import { describe, it, expect } from 'vitest';
import { calculateTotalScore, generateAiPrompt } from '../src/services/aiPromptGenerator';
import { IdeaCard, Project, TeamMember } from '../src/types';

describe('Founder Scoring Algorithm', () => {
  it('calculates 100% when all sliders are max (5/5)', () => {
    const score = calculateTotalScore({
      userImpact: 5,
      marketUrgency: 5,
      implementationSimplicity: 5,
      strategicFit: 5,
    });
    expect(score).toBe(100);
  });

  it('calculates 20% when all sliders are min (1/5)', () => {
    const score = calculateTotalScore({
      userImpact: 1,
      marketUrgency: 1,
      implementationSimplicity: 1,
      strategicFit: 1,
    });
    expect(score).toBe(20);
  });

  it('correctly weights high impact ideas', () => {
    const highImpact = calculateTotalScore({
      userImpact: 5,
      marketUrgency: 4,
      implementationSimplicity: 3,
      strategicFit: 4,
    });
    expect(highImpact).toBeGreaterThanOrEqual(80);
  });
});

describe('AI Prompt Generator', () => {
  const dummyProject: Project = {
    id: 'p1',
    keyPrefix: 'TEST',
    name: 'Test Project',
    description: 'A test project workspace',
    color: '#0052CC',
    icon: 'Bot',
    createdAt: '2026-08-01',
  };

  const dummyTeam: TeamMember[] = [
    { id: 'u1', name: 'Alex', role: 'CEO', avatar: '👨‍💼', color: '#000' },
    { id: 'u2', name: 'Sarah', role: 'Product', avatar: '👩‍💻', color: '#000' },
  ];

  const dummyIdea: IdeaCard = {
    id: 'i1',
    issueKey: 'TEST-101',
    projectId: 'p1',
    title: 'Smart Search',
    stage: 'approved',
    priority: 'high',
    summary: 'Instant fuzzy search across cards',
    targetAudience: 'Product team',
    painPoint: 'Hard to locate past ideas',
    proposedSolution: 'Client side indexing and fuzzy matching',
    valueProposition: 'Saves 15 mins daily',
    successCriteria: ['Search results under 50ms', 'Highlights query match'],
    founderScore: { userImpact: 5, marketUrgency: 4, implementationSimplicity: 4, strategicFit: 4 },
    authorId: 'u1',
    votes: {
      u1: { memberId: 'u1', status: 'approved', updatedAt: '2026-08-01' },
      u2: { memberId: 'u2', status: 'approved', updatedAt: '2026-08-01' },
    },
    comments: [],
    tags: ['Search'],
    createdAt: '2026-08-01',
    updatedAt: '2026-08-01',
  };

  it('generates Antigravity prompt with markdown structure', () => {
    const prompt = generateAiPrompt(dummyIdea, dummyProject, dummyTeam, 'antigravity');
    expect(prompt).toContain('# Antigravity Feature Specification: [TEST-101] Smart Search');
    expect(prompt).toContain('Problem Statement & User Pain Point');
    expect(prompt).toContain('Hard to locate past ideas');
    expect(prompt).toContain('Search results under 50ms');
  });

  it('generates Claude prompt formatted cleanly', () => {
    const prompt = generateAiPrompt(dummyIdea, dummyProject, dummyTeam, 'claude');
    expect(prompt).toContain('### TASK: Build Feature [TEST-101] Smart Search');
    expect(prompt).toContain('You are an expert full-stack engineer');
  });
});
