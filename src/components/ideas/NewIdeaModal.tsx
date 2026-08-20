import React, { useState, useEffect } from 'react';
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

  const templates: TemplateOption[] = [
    {
      id: 'feature',
      title: 'Customer Feature Request',
      issueType: 'feature',
      icon: Sparkles,
      defaults: {
        title: 'Real-time Team Activity Stream',
        summary: 'Live feed displaying card movements, consensus votes, and PRD updates.',
        targetAudience: 'Distributed engineering teams & product managers.',
        painPoint: 'Teammates cannot see recent progress without refreshing the app.',
        proposedSolution: 'Build a lightweight WebSocket or polling activity ticker in the sidebar.',
        valueProposition: 'Increases transparency and reduces sync meeting overhead by 40%.',
        successCriteria: [
          'Events appear in <500ms',
          'Users can filter by card ID and member',
        ],
        priority: 'high',
        tags: ['Collaboration', 'Real-time'],
      },
    },
    {
      id: 'bug',
      title: 'Critical Bug / Defect',
      issueType: 'bug',
      icon: Bug,
      defaults: {
        title: 'Fix Safari Dropdown Z-Index Clipping',
        summary: 'Header profile menu clips behind the Kanban board on Safari iOS.',
        targetAudience: 'Mobile Safari users.',
        painPoint: 'Users cannot tap the logout or profile button on mobile screens.',
        proposedSolution: 'Add z-50 and fix stacking context on the top header navigation.',
        valueProposition: 'Restores usability for 35% of mobile operators.',
        successCriteria: [
          'Tested on Safari 17+ and iOS 16+',
          'Dropdown renders cleanly above Kanban canvas',
        ],
        priority: 'critical',
        tags: ['Bug', 'Mobile', 'Safari'],
      },
    },
    {
      id: 'perf',
      title: 'Performance & Latency Improvement',
      issueType: 'improvement',
      icon: Zap,
      defaults: {
        title: 'Optimize Initial Board Load Latency',
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

  const resetForm = () => {
    setTitle('');
    setIssueType('feature');
    setSummary('');
    setTargetAudience('');
    setPainPoint('');
    setProposedSolution('');
    setValueProposition('');
    setPriority('high');
    setTagsInput('Core Product');
    setSuccessCriteria([
      'Meets user story acceptance criteria',
      'Passes automated unit tests',
    ]);
    setImpact(4);
    setSimplicity(4);
  };

  // Reset form whenever modal opens
  useEffect(() => {
    if (isNewIdeaModalOpen) {
      resetForm();
    }
  }, [isNewIdeaModalOpen]);

  if (!isNewIdeaModalOpen) return null;

  const handleClose = () => {
    resetForm();
    setIsNewIdeaModalOpen(false);
  };

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

    resetForm();
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
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Starter Templates */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Or Choose a Starter Template:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-left transition-all group"
                  >
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 group-hover:text-blue-700 mb-1">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="truncate">{tpl.title}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2">{tpl.defaults.summary}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Issue Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Issue Category / Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'feature', label: 'Feature Request', icon: Sparkles, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                { type: 'bug', label: 'Bug / Defect', icon: Bug, color: 'text-rose-600 bg-rose-50 border-rose-200' },
                { type: 'improvement', label: 'Improvement', icon: Zap, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                { type: 'research', label: 'Tech Spike', icon: Search, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                { type: 'task', label: 'Engineering Task', icon: CheckSquare, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                { type: 'design', label: 'UI/UX Design Spec', icon: Palette, color: 'text-purple-600 bg-purple-50 border-purple-200' },
                { type: 'security', label: 'Security & Audit', icon: ShieldAlert, color: 'text-red-700 bg-red-50 border-red-200' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = issueType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setIssueType(item.type as IssueType)}
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Priority */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Stripe Subscription Billing Webhook Integration"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical (Blocker)</option>
              </select>
            </div>
          </div>

          {/* Pain Point (Problem Narrative) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Problem Statement / Root Friction *
            </label>
            <textarea
              required
              rows={2}
              value={painPoint}
              onChange={(e) => setPainPoint(e.target.value)}
              placeholder="What actual user pain point, failure, or business bottleneck does this address?..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Proposed Solution Narrative */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Proposed Solution & Behavior
            </label>
            <textarea
              rows={2}
              value={proposedSolution}
              onChange={(e) => setProposedSolution(e.target.value)}
              placeholder="Describe how the system or user flow should behave once built..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Value Proposition & Target Audience */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Target User / Persona
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Operations leads, new signups..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Auth, Billing, Mobile"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Success Criteria List */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
              <span>Acceptance Criteria Checklist</span>
              <span className="text-[10px] text-slate-500 lowercase">Required for QA verification</span>
            </label>
            {successCriteria.map((crit, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={crit}
                  onChange={(e) => {
                    const next = [...successCriteria];
                    next[idx] = e.target.value;
                    setSuccessCriteria(next);
                  }}
                  className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded-md outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setSuccessCriteria(successCriteria.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSuccessCriteria([...successCriteria, ''])}
              className="text-xs text-blue-600 hover:underline font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Acceptance Criterion</span>
            </button>
          </div>

          {/* Initial Founder Scoring Sliders */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>User & Business Impact</span>
                <span className="font-mono font-bold text-blue-600">{impact} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={impact}
                onChange={(e) => setImpact(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                <span>Implementation Simplicity</span>
                <span className="font-mono font-bold text-emerald-600">{simplicity} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={simplicity}
                onChange={(e) => setSimplicity(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-all"
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
