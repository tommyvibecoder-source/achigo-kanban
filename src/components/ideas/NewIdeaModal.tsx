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
  ShieldAlert,
  Wrench,
  CheckCircle2
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
    teamMembers,
  } = useApp();

  // Mode: 'quick_task' (ordinary, no scoring, no consensus) vs 'full_spec' (scored, consensus)
  const [mode, setMode] = useState<'quick_task' | 'full_spec'>('quick_task');

  // Form Fields
  const [title, setTitle] = useState('');
  const [issueType, setIssueType] = useState<IssueType>('task');
  const [summary, setSummary] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [valueProposition, setValueProposition] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assigneeId, setAssigneeId] = useState<string>(activeUser.id);
  const [tagsInput, setTagsInput] = useState('Task');
  const [successCriteria, setSuccessCriteria] = useState<string[]>([
    'Task completed and verified',
  ]);

  const [impact, setImpact] = useState(3);
  const [simplicity, setSimplicity] = useState(4);

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

  const resetForm = () => {
    setTitle('');
    setIssueType(mode === 'quick_task' ? 'task' : 'feature');
    setSummary('');
    setTargetAudience('');
    setPainPoint('');
    setProposedSolution('');
    setValueProposition('');
    setPriority('medium');
    setAssigneeId(activeUser.id);
    setTagsInput(mode === 'quick_task' ? 'Chore, Config' : 'Core Product');
    setSuccessCriteria(['Task completed and verified']);
    setImpact(3);
    setSimplicity(4);
  };

  useEffect(() => {
    if (isNewIdeaModalOpen) {
      resetForm();
    }
  }, [isNewIdeaModalOpen, mode]);

  if (!isNewIdeaModalOpen) return null;

  const handleClose = () => {
    resetForm();
    setIsNewIdeaModalOpen(false);
  };

  const applyTemplate = (t: TemplateOption) => {
    setMode('full_spec');
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
    if (!title.trim()) {
      alert('Please provide a Task / Item Title.');
      return;
    }

    const isQuick = mode === 'quick_task';
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    createIdea({
      projectId: activeProject?.id || 'proj-1',
      title: title.trim(),
      issueType: isQuick ? 'task' : issueType,
      isQuickTask: isQuick,
      requiresConsensus: !isQuick, // Ordinary tasks do NOT require consensus
      stage: 'backlog',
      priority,
      summary: summary.trim() || title.trim(),
      targetAudience: isQuick ? 'Internal Team' : targetAudience.trim() || 'AchiGO users & team',
      painPoint: isQuick ? (summary.trim() || 'General maintenance / configuration task') : painPoint.trim() || title.trim(),
      proposedSolution: isQuick ? summary.trim() : proposedSolution.trim() || summary.trim(),
      valueProposition: isQuick ? 'System stability and configuration maintenance' : valueProposition.trim() || 'Solves key user friction point',
      successCriteria: isQuick ? ['Task complete'] : successCriteria.length > 0 ? successCriteria : ['Verified and complete'],
      founderScore: {
        userImpact: isQuick ? 3 : impact,
        marketUrgency: isQuick ? 3 : 4,
        implementationSimplicity: isQuick ? 5 : simplicity,
        strategicFit: isQuick ? 3 : 4,
      },
      authorId: activeUser.id,
      assigneeId,
      tags: tags.length > 0 ? tags : [isQuick ? 'Task' : 'Product'],
    });

    resetForm();
    setIsNewIdeaModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-lg text-white ${mode === 'quick_task' ? 'bg-amber-600' : 'bg-blue-600'}`}>
              {mode === 'quick_task' ? <Wrench className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {mode === 'quick_task' ? 'Add Ordinary / Quick Task' : `Scope Product Feature for ${activeProject?.name}`}
              </h3>
              <p className="text-xs text-slate-500">
                {mode === 'quick_task'
                  ? 'Quick task for configuration, chores, or maintenance (No consensus needed)'
                  : 'Full product specification with founder scoring and team consensus'}
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

        {/* Mode Selector Switcher Tab */}
        <div className="p-2.5 bg-slate-100/70 border-b border-slate-200 flex space-x-2">
          <button
            type="button"
            onClick={() => setMode('quick_task')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              mode === 'quick_task'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>⚡ Ordinary Task (No Consensus)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('full_spec')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              mode === 'full_spec'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>✨ Full Product Spec (Scored & Consensus)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* ============================================================ */}
          {/* MODE 1: ORDINARY / QUICK TASK FORM (MINIMAL & FAST) */}
          {/* ============================================================ */}
          {mode === 'quick_task' ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Direct Track Task:</strong> Can be moved across Kanban stages freely without requiring unanimous consensus voting or complex scoring.
                </span>
              </div>

              {/* Task Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Configure Neon DB SSL & connection pooling on Vercel"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-amber-500 focus:bg-white font-medium"
                />
              </div>

              {/* Priority & Assignee */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Assignee
                  </label>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-amber-500 focus:bg-white"
                  >
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.avatar} {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Task Details / Configuration Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Task Notes / Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Add any setup steps, commands, or documentation links..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Config, DevOps, Setup, Chore"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                />
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* MODE 2: FULL PRODUCT SPECIFICATION FORM (SCORED & CONSENSUS) */
            /* ============================================================ */
            <div className="space-y-5 animate-in fade-in">
              {/* Quick Starter Templates */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Choose a Starter Template:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {templates.map((tpl) => {
                    const Icon = tpl.icon;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => applyTemplate(tpl)}
                        className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-left transition-all group"
                      >
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 group-hover:text-blue-700 mb-0.5">
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
                    { type: 'feature', label: 'Feature Request', icon: Sparkles },
                    { type: 'bug', label: 'Bug / Defect', icon: Bug },
                    { type: 'improvement', label: 'Improvement', icon: Zap },
                    { type: 'research', label: 'Tech Spike', icon: Search },
                    { type: 'task', label: 'Engineering Task', icon: CheckSquare },
                    { type: 'design', label: 'UI/UX Design', icon: Palette },
                    { type: 'security', label: 'Security Audit', icon: ShieldAlert },
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
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white"
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
                  rows={2}
                  value={painPoint}
                  onChange={(e) => setPainPoint(e.target.value)}
                  placeholder="What actual user pain point, failure, or business bottleneck does this address?..."
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white"
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
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Initial Founder Scoring Sliders */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
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
            </div>
          )}

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
              className={`px-5 py-2.5 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition-all ${
                mode === 'quick_task'
                  ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{mode === 'quick_task' ? 'Add Task to Board (Direct Track)' : 'Add to Backlog & Open Deliberation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
