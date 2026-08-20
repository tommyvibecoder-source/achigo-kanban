import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority, IssueType } from '../../types';
import {
  X,
  Sparkles,
  Plus,
  Lightbulb,
  Bug,
  Zap,
  Search,
  CheckSquare,
  Palette,
  ShieldAlert
} from 'lucide-react';

interface TemplateOption {
  id: string;
  title: string;
  issueType: IssueType;
  icon: React.FC<{ className?: string }>;
  defaults: {
    title: string;
    summary: string;
    targetAudience: string;
    painPoint: string;
    proposedSolution: string;
    valueProposition: string;
    successCriteria: string[];
    priority: Priority;
    tags: string[];
  };
}

export const NewIdeaModal: React.FC = () => {
  const {
    isNewIdeaModalOpen,
    setIsNewIdeaModalOpen,
    createIdea,
    activeProject,
    activeUser,
  } = useApp();

  const issueTypeOptions: { id: IssueType; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { id: 'feature', label: 'Feature Request', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'bug', label: 'Bug / Defect', icon: Bug, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'improvement', label: 'Improvement', icon: Zap, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'research', label: 'Tech Spike / Research', icon: Search, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'task', label: 'Engineering Task', icon: CheckSquare, color: 'text-slate-600 bg-slate-100 border-slate-300' },
    { id: 'design', label: 'UI/UX Design Spec', icon: Palette, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { id: 'security', label: 'Security & Compliance', icon: ShieldAlert, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  ];

  const templates: TemplateOption[] = [
    {
      id: 'blank',
      title: 'Blank Idea Canvas',
      issueType: 'feature',
      icon: Lightbulb,
      defaults: {
        title: '',
        summary: '',
        targetAudience: '',
        painPoint: '',
        proposedSolution: '',
        valueProposition: '',
        successCriteria: ['User can access the feature in 1 click', 'Meets basic UX and performance benchmarks'],
        priority: 'high',
        tags: ['New Feature'],
      },
    },
    {
      id: 'bug-fix',
      title: 'Bug Report Template',
      issueType: 'bug',
      icon: Bug,
      defaults: {
        title: 'Fix: Checkout Flow Timeout on Slow Networks',
        summary: 'Payment request hangs indefinitely when user network latency exceeds 3 seconds.',
        targetAudience: 'End customers attempting payment.',
        painPoint: 'Users are billed twice or abandon cart due to infinite loading spinner without timeout error.',
        proposedSolution: 'Add 5-second AbortController on fetch request and render retry banner with idempotency key.',
        valueProposition: 'Restores checkout completion rate and prevents duplicate charge disputes.',
        successCriteria: [
          'Times out cleanly after 5 seconds with friendly error message',
          'Allows user to retry with 1 click without re-entering form data',
          'Prevents duplicate API submission via idempotency token',
        ],
        priority: 'critical',
        tags: ['BugFix', 'Payments', 'Reliability'],
      },
    },
    {
      id: 'improvement',
      title: 'Performance Improvement',
      issueType: 'improvement',
      icon: Zap,
      defaults: {
        title: 'Optimize Initial Dashboard Query Latency',
        summary: 'Reduce initial data load time from 1.8s to <400ms using query memoization.',
        targetAudience: 'Daily active operators.',
        painPoint: 'Dashboard takes nearly 2 seconds to load when user has over 500 records.',
        proposedSolution: 'Introduce client-side cache and index key lookup.',
        valueProposition: 'Drastically improves perceived snappiness and user retention.',
        successCriteria: [
          'Initial load under 400ms on 4G connections',
          'Passes performance lighthouse benchmark > 95',
        ],
        priority: 'high',
        tags: ['Performance', 'Optimization'],
      },
    },
  ];

  const [title, setTitle] = useState('');
  const [issueType, setIssueType] = useState<IssueType>('feature');
  const [summary, setSummary] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [valueProposition, setValueProposition] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [tagsInput, setTagsInput] = useState('Core Product');
  const [successCriteria, setSuccessCriteria] = useState<string[]>([
    'Meets user story acceptance criteria',
    'Passes automated unit tests',
  ]);

  const [impact, setImpact] = useState(4);
  const [simplicity, setSimplicity] = useState(4);

  if (!isNewIdeaModalOpen) return null;

  const applyTemplate = (t: TemplateOption) => {
    setTitle(t.defaults.title);
    setIssueType(t.issueType);
    setSummary(t.defaults.summary);
    setTargetAudience(t.defaults.targetAudience);
    setPainPoint(t.defaults.painPoint);
    setProposedSolution(t.defaults.proposedSolution);
    setValueProposition(t.defaults.valueProposition);
    setPriority(t.defaults.priority);
    setTagsInput(t.defaults.tags.join(', '));
    setSuccessCriteria(t.defaults.successCriteria);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !painPoint.trim()) {
      alert('Please provide an Item Title and Problem/Need description.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    createIdea({
      projectId: activeProject?.id || 'proj-1',
      title: title.trim(),
      issueType,
      stage: 'backlog',
      priority,
      summary: summary.trim() || title.trim(),
      targetAudience: targetAudience.trim() || 'AchiGO users & team',
      painPoint: painPoint.trim(),
      proposedSolution: proposedSolution.trim() || summary.trim(),
      valueProposition: valueProposition.trim() || 'Solves key user friction point',
      successCriteria: successCriteria.length > 0 ? successCriteria : ['Verified and complete'],
      founderScore: {
        userImpact: impact,
        marketUrgency: 4,
        implementationSimplicity: simplicity,
        strategicFit: 4,
      },
      authorId: activeUser.id,
      tags,
    });

    setIsNewIdeaModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Scope New Item for {activeProject?.name}
              </h3>
              <p className="text-xs text-slate-500">
                Create a feature, bug report, improvement, or spike for AchiGO projects
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewIdeaModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Template Selector */}
        <div className="px-6 py-2.5 bg-blue-50/70 border-b border-blue-100 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-blue-900">Choose Starter Template:</span>
          <div className="flex flex-wrap gap-2">
            {templates.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-2xs"
                >
                  <Icon className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Issue Type Category Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Engineering Issue Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 text-xs">
              {issueTypeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = issueType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIssueType(opt.id)}
                    className={`p-2 rounded-lg border text-left flex flex-col items-center justify-center space-y-1 text-center transition-all ${
                      isSelected
                        ? `${opt.color} font-bold ring-2 ring-blue-500 shadow-xs`
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                issueType === 'bug'
                  ? 'e.g. Fix: Token expired error on session refresh'
                  : issueType === 'improvement'
                  ? 'e.g. Optimize: Cache user profiles in LocalStorage'
                  : 'e.g. Feature: Instant Document Export'
              }
              className="w-full text-xs p-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-semibold"
            />
          </div>

          {/* Problem & Pain Point */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex justify-between">
              <span>
                {issueType === 'bug'
                  ? 'Bug Description & Steps to Reproduce *'
                  : issueType === 'improvement'
                  ? 'Current Limitation / Inefficiency *'
                  : 'Customer Pain Point / Problem Statement *'}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">What hurts today?</span>
            </label>
            <textarea
              required
              rows={3}
              value={painPoint}
              onChange={(e) => setPainPoint(e.target.value)}
              placeholder={
                issueType === 'bug'
                  ? '1. Navigate to Settings -> 2. Click Save -> 3. Error modal appears with status 500...'
                  : 'Describe the user friction or engineering gap in natural language...'
              }
              className="w-full text-xs p-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Proposed Solution */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              {issueType === 'bug'
                ? 'Expected Fix & Desired Behavior'
                : 'Proposed Solution & Experience Narrative'}
            </label>
            <textarea
              rows={3}
              value={proposedSolution}
              onChange={(e) => setProposedSolution(e.target.value)}
              placeholder="Describe the solution or expected fix in plain English..."
              className="w-full text-xs p-2.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Target Audience & Value Prop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Target Persona / Affected Users
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Enterprise customers, Mobile users"
                className="w-full text-xs p-2 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Value Proposition ("Why Now?")
              </label>
              <input
                type="text"
                value={valueProposition}
                onChange={(e) => setValueProposition(e.target.value)}
                placeholder="e.g. Unblocks release, saves 3 hours weekly"
                className="w-full text-xs p-2 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Priority & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Priority Tier
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none capitalize font-medium"
              >
                <option value="critical">Critical (P0 - Blocker)</option>
                <option value="high">High (P1 - Core focus)</option>
                <option value="medium">Medium (P2 - Standard)</option>
                <option value="low">Low (P3 - Minor polish)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Backend, UI/UX, Security, QA"
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Quick Founder Scoring */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Impact vs Simplicity Assessment</span>
              <span className="text-[10px] text-slate-400 font-normal">Plots 2D Matrix</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>User Impact:</span>
                  <span className="font-mono font-bold text-blue-600">{impact}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={impact}
                  onChange={(e) => setImpact(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Simplicity (Ease of Dev):</span>
                  <span className="font-mono font-bold text-blue-600">{simplicity}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={simplicity}
                  onChange={(e) => setSimplicity(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsNewIdeaModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Backlog & Open Deliberation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
