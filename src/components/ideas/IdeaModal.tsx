import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateTotalScore, generateAiPrompt } from '../../services/aiPromptGenerator';
import { IdeaCard, Priority, KanbanStage, VoteStatus, IssueType } from '../../types';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Bot,
  Trash2,
  Save,
  Send,
  ShieldCheck,
  Plus,
  Minus,
  FlaskConical,
  PenTool,
  Check,
  Copy,
  Sparkles,
  Wrench
} from 'lucide-react';

export const IdeaModal: React.FC = () => {
  const {
    activeIdea,
    setActiveIdea,
    updateIdea,
    deleteIdea,
    teamMembers,
    activeUser,
    voteOnIdea,
    addComment,
    checkConsensus,
    canMoveToStage,
    setAiPromptModalIdea,
    activeProject,
    toggleManualTest,
    addManualTest,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'scoring' | 'prompt' | 'testing' | 'consensus' | 'discussion'>('details');
  const [editedIdea, setEditedIdea] = useState<IdeaCard | null>(activeIdea);
  const [commentInput, setCommentInput] = useState('');
  const [voteComment, setVoteComment] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [newCriterionInput, setNewCriterionInput] = useState('');
  const [newScenarioInput, setNewScenarioInput] = useState('');
  const [newExpectedInput, setNewExpectedInput] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [promptCopied, setPromptCopied] = useState(false);

  React.useEffect(() => {
    setEditedIdea(activeIdea);
  }, [activeIdea]);

  if (!activeIdea || !editedIdea) return null;

  const score = calculateTotalScore(editedIdea.founderScore);
  const consensus = checkConsensus(editedIdea);
  const myVote = editedIdea.votes[activeUser.id];
  const manualTests = editedIdea.manualTests || [];
  const passedTestsCount = manualTests.filter((t) => t.passed).length;

  const handleSave = () => {
    updateIdea(editedIdea);
    setFeedbackNotice('Changes saved!');
    setTimeout(() => setFeedbackNotice(null), 2000);
  };

  const handleVote = (status: VoteStatus) => {
    voteOnIdea(editedIdea.id, status, voteComment);
    setVoteComment('');
    setFeedbackNotice(`Vote cast as ${status.replace('_', ' ')}!`);
    setTimeout(() => setFeedbackNotice(null), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(editedIdea.id, commentInput);
    setCommentInput('');
  };

  const handleAddTag = () => {
    if (!newTagInput.trim() || editedIdea.tags.includes(newTagInput.trim())) return;
    setEditedIdea({
      ...editedIdea,
      tags: [...editedIdea.tags, newTagInput.trim()],
    });
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedIdea({
      ...editedIdea,
      tags: editedIdea.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleAddCriterion = () => {
    if (!newCriterionInput.trim()) return;
    setEditedIdea({
      ...editedIdea,
      successCriteria: [...editedIdea.successCriteria, newCriterionInput.trim()],
    });
    setNewCriterionInput('');
  };

  const handleRemoveCriterion = (idx: number) => {
    setEditedIdea({
      ...editedIdea,
      successCriteria: editedIdea.successCriteria.filter((_, i) => i !== idx),
    });
  };

  const handleAddNewTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScenarioInput.trim()) return;
    addManualTest(editedIdea.id, newScenarioInput, newExpectedInput || 'Passed');
    setNewScenarioInput('');
    setNewExpectedInput('');
  };

  const stages: { key: KanbanStage; label: string }[] = [
    { key: 'backlog', label: 'Backlog' },
    { key: 'refinement', label: 'Refinement' },
    { key: 'approved', label: 'Consensus Reached' },
    { key: 'prompt_creation', label: 'Prompt Creation ✍️' },
    { key: 'in_production', label: 'In AI Production ⚡' },
    { key: 'manual_testing', label: 'Manual Testing 🧪' },
    { key: 'shipped', label: 'Shipped 🚀' },
  ];

  const generatedPrompt = activeProject
    ? generateAiPrompt(editedIdea, activeProject, teamMembers, editedIdea.targetAiTool || 'antigravity')
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[94vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5 truncate flex-1">
            <span className="text-xs font-mono font-bold px-2 py-1 bg-blue-100 text-blue-900 rounded border border-blue-200 shrink-0">
              {editedIdea.issueKey}
            </span>

            {/* Issue Type Select */}
            <select
              value={editedIdea.issueType || 'feature'}
              onChange={(e) => setEditedIdea({ ...editedIdea, issueType: e.target.value as IssueType })}
              className="text-xs font-semibold px-2 py-1 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 capitalize shrink-0"
            >
              <option value="feature">✨ Feature</option>
              <option value="bug">🐛 Bug</option>
              <option value="improvement">⚡ Improvement</option>
              <option value="research">🔍 Spike</option>
              <option value="task">☑️ Task</option>
              <option value="design">🎨 Design</option>
              <option value="security">🛡️ Security</option>
            </select>

            <div className="truncate flex-1">
              <input
                type="text"
                value={editedIdea.title}
                onChange={(e) => setEditedIdea({ ...editedIdea, title: e.target.value })}
                className="font-bold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white outline-none px-1 rounded transition-colors w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setAiPromptModalIdea(editedIdea)}
              className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>Export AI Prompt</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>

            <button
              onClick={() => setActiveIdea(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Progress Tracker */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="font-semibold text-slate-500 mr-1 text-[11px]">Workflow Stage:</span>
            {stages.map((st) => {
              const isActive = editedIdea.stage === st.key;
              const check = canMoveToStage(editedIdea, st.key);
              return (
                <button
                  key={st.key}
                  disabled={!check.allowed && !isActive}
                  onClick={() => {
                    if (check.allowed) {
                      setEditedIdea({ ...editedIdea, stage: st.key });
                      updateIdea({ ...editedIdea, stage: st.key });
                    }
                  }}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : check.allowed
                      ? 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      : 'bg-slate-200/50 text-slate-400 cursor-not-allowed border border-transparent'
                  }`}
                  title={!check.allowed ? check.reason : `Set stage to ${st.label}`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            {editedIdea.isQuickTask || editedIdea.requiresConsensus === false || editedIdea.issueType === 'task' ? (
              <span className="flex items-center space-x-1 text-xs font-bold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-full border border-amber-300">
                <Wrench className="w-3.5 h-3.5 text-amber-700" />
                <span>⚡ Ordinary Task (No Consensus Needed)</span>
              </span>
            ) : consensus.allowed ? (
              <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Team Approved</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-xs font-medium text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-300">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{consensus.approvedCount}/{consensus.totalMembers} Approved</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-800'
            }`}
          >
            Natural Language PRD
          </button>
          <button
            onClick={() => setActiveTab('scoring')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'scoring' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-800'
            }`}
          >
            Founder Scoring ({score}%)
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`py-3 border-b-2 flex items-center space-x-1 transition-colors ${
              activeTab === 'prompt' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-800'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Prompt Creation ✍️</span>
          </button>
          <button
            onClick={() => setActiveTab('testing')}
            className={`py-3 border-b-2 flex items-center space-x-1 transition-colors ${
              activeTab === 'testing' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-800'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Manual Testing 🧪 ({passedTestsCount}/{manualTests.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('consensus')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'consensus' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-800'
            }`}
          >
            Team Consensus ({consensus.approvedCount}/{consensus.totalMembers})
          </button>
          <button
            onClick={() => setActiveTab('discussion')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'discussion' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-800'
            }`}
          >
            Discussion ({editedIdea.comments.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {/* TAB 1: DETAILS & NATURAL LANGUAGE PRD */}
          {activeTab === 'details' && (
            <div className="space-y-5 max-w-2xl">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
                  <span>1. The Problem & User Pain Point</span>
                  <span className="text-[10px] text-slate-400 font-normal">What hurts today?</span>
                </label>
                <textarea
                  rows={3}
                  value={editedIdea.painPoint}
                  onChange={(e) => setEditedIdea({ ...editedIdea, painPoint: e.target.value })}
                  placeholder="Describe the exact friction or frustration the customer faces..."
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
                  <span>2. Target Persona & Customer Segment</span>
                  <span className="text-[10px] text-slate-400 font-normal">Who is this for?</span>
                </label>
                <input
                  type="text"
                  value={editedIdea.targetAudience}
                  onChange={(e) => setEditedIdea({ ...editedIdea, targetAudience: e.target.value })}
                  placeholder="e.g. Remote engineering leads, Enterprise sales reps..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
                  <span>3. Proposed Solution & User Narrative</span>
                  <span className="text-[10px] text-slate-400 font-normal">In natural language</span>
                </label>
                <textarea
                  rows={4}
                  value={editedIdea.proposedSolution}
                  onChange={(e) => setEditedIdea({ ...editedIdea, proposedSolution: e.target.value })}
                  placeholder="Walk through how the user will experience this feature from start to finish..."
                  className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
                  <span>4. Value Proposition ("Why Now?")</span>
                  <span className="text-[10px] text-slate-400 font-normal">Business impact</span>
                </label>
                <input
                  type="text"
                  value={editedIdea.valueProposition}
                  onChange={(e) => setEditedIdea({ ...editedIdea, valueProposition: e.target.value })}
                  placeholder="e.g. Saves 3 hours weekly, boosts retention by 20%..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  5. Success Criteria / Definition of Done
                </label>
                <div className="space-y-1.5">
                  {editedIdea.successCriteria.map((crit, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span className="flex-1 text-slate-800">{crit}</span>
                      <button
                        onClick={() => handleRemoveCriterion(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCriterionInput}
                      onChange={(e) => setNewCriterionInput(e.target.value)}
                      placeholder="Add acceptance criterion..."
                      className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCriterion())}
                    />
                    <button
                      onClick={handleAddCriterion}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Priority Tier
                  </label>
                  <select
                    value={editedIdea.priority}
                    onChange={(e) => setEditedIdea({ ...editedIdea, priority: e.target.value as Priority })}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 capitalize"
                  >
                    <option value="critical">Critical (P0 - Drop everything)</option>
                    <option value="high">High (P1 - Core value)</option>
                    <option value="medium">Medium (P2 - Standard)</option>
                    <option value="low">Low (P3 - Nice to have)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {editedIdea.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <span>#{t}</span>
                        <button onClick={() => handleRemoveTag(t)} className="text-slate-500 hover:text-red-600">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Add tag..."
                      className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <button
                      onClick={handleAddTag}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-2 rounded-lg text-xs font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FOUNDER SCORING */}
          {activeTab === 'scoring' && (
            <div className="space-y-6 max-w-2xl">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Calculated Startup Value Score
                  </h4>
                  <p className="text-xs text-slate-500">
                    Weighted algorithm combining User Impact, Urgency, Simplicity, and Strategic Fit.
                  </p>
                </div>
                <div className="text-center bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl">
                  <div className="text-2xl font-black font-mono text-indigo-700">{score}%</div>
                  <div className="text-[10px] font-bold text-indigo-900 uppercase">
                    {score >= 80 ? '🚀 Top Priority' : score >= 60 ? '⭐ Strong Bet' : '⏳ Moderate'}
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-5 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>User Problem Impact:</span>
                    <span className="font-mono text-blue-600 font-bold">{editedIdea.founderScore.userImpact}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={editedIdea.founderScore.userImpact}
                    onChange={(e) =>
                      setEditedIdea({
                        ...editedIdea,
                        founderScore: { ...editedIdea.founderScore, userImpact: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Market Urgency:</span>
                    <span className="font-mono text-blue-600 font-bold">{editedIdea.founderScore.marketUrgency}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={editedIdea.founderScore.marketUrgency}
                    onChange={(e) =>
                      setEditedIdea({
                        ...editedIdea,
                        founderScore: { ...editedIdea.founderScore, marketUrgency: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Implementation Simplicity (Ease for AI):</span>
                    <span className="font-mono text-blue-600 font-bold">{editedIdea.founderScore.implementationSimplicity}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={editedIdea.founderScore.implementationSimplicity}
                    onChange={(e) =>
                      setEditedIdea({
                        ...editedIdea,
                        founderScore: { ...editedIdea.founderScore, implementationSimplicity: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Strategic Fit:</span>
                    <span className="font-mono text-blue-600 font-bold">{editedIdea.founderScore.strategicFit}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={editedIdea.founderScore.strategicFit}
                    onChange={(e) =>
                      setEditedIdea({
                        ...editedIdea,
                        founderScore: { ...editedIdea.founderScore, strategicFit: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROMPT CREATION STUDIO (NEW STEP) */}
          {activeTab === 'prompt' && (
            <div className="space-y-5 max-w-2xl">
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl text-xs space-y-1 text-sky-950">
                <div className="font-bold flex items-center space-x-1.5 text-sky-900">
                  <PenTool className="w-4 h-4 text-sky-600" />
                  <span>Step: Prompt Creation & AI Developer Brief</span>
                </div>
                <p className="text-sky-800">
                  Fine-tune the instructions, constraints, and architecture guidance that will be passed into your AI coding tool (Google Antigravity, Claude Code, or Openwork).
                </p>
              </div>

              {/* Target Tool Selection */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Target AI Coding Tool
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'antigravity', label: 'Google Antigravity', icon: Sparkles },
                    { id: 'claude', label: 'Claude Code', icon: Bot },
                    { id: 'openwork', label: 'Openwork / General', icon: PenTool },
                  ].map((tool) => {
                    const Icon = tool.icon;
                    const isSelected = (editedIdea.targetAiTool || 'antigravity') === tool.id;
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() =>
                          setEditedIdea({
                            ...editedIdea,
                            targetAiTool: tool.id as 'antigravity' | 'claude' | 'openwork',
                          })
                        }
                        className={`p-2.5 rounded-lg border text-left flex flex-col space-y-1 transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                        <span className="text-xs">{tool.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Prompt Notes */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex justify-between">
                  <span>Custom Engineering Directives / Constraints</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional guidelines</span>
                </label>
                <textarea
                  rows={3}
                  value={editedIdea.customPromptNotes || ''}
                  onChange={(e) => setEditedIdea({ ...editedIdea, customPromptNotes: e.target.value })}
                  placeholder="e.g. Use Tailwind for responsive UI, write Vitest tests, enforce WCAG 2.2 accessibility..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              {/* Live Prompt Preview & Copy */}
              <div className="bg-slate-950 rounded-xl p-4 text-slate-200 font-mono text-xs space-y-2 border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span>Generated AI Brief Output</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPrompt);
                      setPromptCopied(true);
                      setTimeout(() => setPromptCopied(false), 2000);
                    }}
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-[11px] font-sans font-semibold"
                  >
                    {promptCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{promptCopied ? 'Copied!' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <pre className="whitespace-pre-wrap max-h-48 overflow-y-auto text-[11px] leading-relaxed text-slate-300">
                  {generatedPrompt}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: MANUAL TESTING & QA (NEW STEP) */}
          {activeTab === 'testing' && (
            <div className="space-y-5 max-w-2xl">
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs space-y-1 text-rose-950">
                <div className="font-bold flex items-center space-x-1.5 text-rose-900">
                  <FlaskConical className="w-4 h-4 text-rose-600" />
                  <span>Step: Manual Testing & Acceptance QA</span>
                </div>
                <p className="text-rose-800">
                  Perform hands-on user acceptance tests before shipping. All test scenarios must be verified and marked <strong>Passed</strong> before this card can be moved to <em>Shipped 🚀</em>.
                </p>
              </div>

              {/* Test Scenarios Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wide">
                  <span>Manual Test Scenarios ({passedTestsCount}/{manualTests.length} Passed)</span>
                </div>

                <div className="space-y-2">
                  {manualTests.map((test) => (
                    <div
                      key={test.id}
                      className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 transition-colors ${
                        test.passed
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3 flex-1">
                        <button
                          type="button"
                          onClick={() => toggleManualTest(editedIdea.id, test.id)}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                            test.passed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-transparent'
                          }`}
                        >
                          ✓
                        </button>
                        <div className="space-y-1">
                          <div className={`font-semibold ${test.passed ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                            {test.scenario}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            <strong>Expected:</strong> {test.expectedResult}
                          </div>
                          {test.testedBy && (
                            <div className="text-[10px] text-emerald-700 font-medium">
                              Verified by: {test.testedBy}
                            </div>
                          )}
                          {test.notes && (
                            <div className="text-[10px] text-amber-700 italic">
                              Note: {test.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleManualTest(editedIdea.id, test.id)}
                        className={`text-xs px-2.5 py-1 rounded font-semibold shrink-0 ${
                          test.passed
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {test.passed ? 'Passed ✓' : 'Mark Passed'}
                      </button>
                    </div>
                  ))}

                  {manualTests.length === 0 && (
                    <p className="text-xs text-slate-400 py-4 text-center bg-white rounded-lg border border-dashed border-slate-200">
                      No manual test scenarios defined yet. Add one below!
                    </p>
                  )}
                </div>
              </div>

              {/* Add New Test Scenario Form */}
              <form onSubmit={handleAddNewTest} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  + Add Manual Test Scenario
                </h5>
                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    required
                    value={newScenarioInput}
                    onChange={(e) => setNewScenarioInput(e.target.value)}
                    placeholder="Test action / user flow (e.g. Click Export button with empty project)..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={newExpectedInput}
                    onChange={(e) => setNewExpectedInput(e.target.value)}
                    placeholder="Expected outcome (e.g. Toast alert appears with guidance)..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Add Test Case to QA Checklist
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: TEAM CONSENSUS */}
          {activeTab === 'consensus' && (
            <div className="space-y-6 max-w-2xl">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs space-y-1 text-blue-900">
                <div className="font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Unanimous Startup Consensus Gate</span>
                </div>
                <p className="text-blue-800">
                  Every active team member must vote <strong>Approved</strong> before this idea can be moved to <em>Prompt Creation / In AI Production</em>.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{activeUser.avatar}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Cast Your Vote as {activeUser.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">{activeUser.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-700 capitalize">
                    Current: {myVote?.status?.replace('_', ' ') || 'Pending'}
                  </span>
                </div>

                <input
                  type="text"
                  value={voteComment}
                  onChange={(e) => setVoteComment(e.target.value)}
                  placeholder="Optional deliberation feedback or caveat..."
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />

                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={() => handleVote('approved')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve (Agree)</span>
                  </button>
                  <button
                    onClick={() => handleVote('needs_discussion')}
                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Request Discussion</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
                <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                  Team Members Status ({consensus.approvedCount}/{consensus.totalMembers})
                </div>
                <div className="divide-y divide-slate-100">
                  {teamMembers.map((member) => {
                    const vote = editedIdea.votes[member.id];
                    const isApproved = vote?.status === 'approved';
                    const isDiscussion = vote?.status === 'needs_discussion';

                    return (
                      <div key={member.id} className="p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center space-x-2.5">
                          <span className="text-base">{member.avatar}</span>
                          <div>
                            <div className="font-semibold text-slate-800">{member.name}</div>
                            <div className="text-[10px] text-slate-400">{member.role}</div>
                            {vote?.comment && (
                              <p className="text-[11px] text-slate-600 italic mt-0.5">
                                "{vote.comment}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          {isApproved ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approved</span>
                            </span>
                          ) : isDiscussion ? (
                            <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-bold border border-amber-200">
                              <AlertCircle className="w-3 h-3" />
                              <span>Needs Discussion</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              <Clock className="w-3 h-3" />
                              <span>Pending</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DISCUSSION */}
          {activeTab === 'discussion' && (
            <div className="space-y-4 max-w-2xl">
              <div className="space-y-3">
                {editedIdea.comments.map((c) => {
                  const author = teamMembers.find((m) => m.id === c.memberId);
                  return (
                    <div key={c.id} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                          <span>{author?.avatar || '👤'}</span>
                          <span>{author?.name || 'Teammate'}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({author?.role})</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-700 pl-6 leading-relaxed">{c.text}</p>
                    </div>
                  );
                })}

                {editedIdea.comments.length === 0 && (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    No comments yet. Start the debate below!
                  </p>
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex space-x-2 pt-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder={`Comment as ${activeUser.name}...`}
                  className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              const res = deleteIdea(editedIdea.id);
              if (!res.success) {
                setFeedbackNotice(res.message || 'Only Co-Founders (Zogo & Achiri) can delete ideas.');
                setTimeout(() => setFeedbackNotice(null), 3500);
              }
            }}
            className="text-red-500 hover:text-red-700 text-xs flex items-center space-x-1 p-1 font-medium"
            title="Only Co-Founders (Zogo & Achiri) can delete items"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Idea</span>
          </button>

          {feedbackNotice && (
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 animate-in fade-in">
              {feedbackNotice}
            </span>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveIdea(null)}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
