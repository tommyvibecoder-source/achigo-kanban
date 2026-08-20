import React from 'react';
import { useApp } from '../../context/AppContext';
import { IdeaCard } from '../../types';
import { calculateTotalScore } from '../../services/aiPromptGenerator';
import {
  ListTodo,
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  Bot
} from 'lucide-react';

export const BacklogView: React.FC = () => {
  const {
    activeProject,
    filteredIdeas,
    setActiveIdea,
    setIsNewIdeaModalOpen,
    checkConsensus,
    setAiPromptModalIdea,
  } = useApp();

  const backlogIdeas = filteredIdeas.filter(
    (i) => i.stage === 'backlog' || i.stage === 'refinement'
  );
  const activeSprintIdeas = filteredIdeas.filter(
    (i) =>
      i.stage === 'approved' ||
      i.stage === 'prompt_creation' ||
      i.stage === 'in_production' ||
      i.stage === 'manual_testing'
  );
  const shippedIdeas = filteredIdeas.filter((i) => i.stage === 'shipped');

  const renderIdeaRow = (idea: IdeaCard) => {
    const score = calculateTotalScore(idea.founderScore);
    const consensus = checkConsensus(idea);

    return (
      <div
        key={idea.id}
        onClick={() => setActiveIdea(idea)}
        className="group bg-white hover:bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center justify-between gap-4 cursor-pointer transition-all hover:border-blue-400 hover:shadow-sm"
      >
        {/* Left: Issue Key & Title */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <span className="text-xs font-bold font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 shrink-0">
            {idea.issueKey}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                {idea.issueType || 'feature'}
              </span>
              <h4 className="text-xs font-semibold text-slate-900 truncate group-hover:text-blue-600">
                {idea.title}
              </h4>
              <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 py-0.2 bg-slate-100 rounded">
                {idea.priority}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {idea.summary || idea.painPoint}
            </p>
          </div>
        </div>

        {/* Right: Score, Consensus, Stage Action */}
        <div className="flex items-center space-x-4 shrink-0">
          {/* Score */}
          <span
            className="flex items-center space-x-1 text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100"
            title="Founder Value Score"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{score}%</span>
          </span>

          {/* Consensus Pill */}
          {consensus.allowed ? (
            <span className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Consensus (100%)</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{consensus.approvedCount}/{consensus.totalMembers} Votes</span>
            </span>
          )}

          {/* AI Prompt Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAiPromptModalIdea(idea);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 text-xs flex items-center space-x-1"
            title="Copy AI Dev Prompt"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px] font-medium">Prompt</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <ListTodo className="w-5 h-5 text-blue-600" />
              <span>Backlog Planning — {activeProject?.name}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Jira-style prioritized backlog of ideas undergoing natural language scoping and founder discussion.
            </p>
          </div>
          <button
            onClick={() => setIsNewIdeaModalOpen(true)}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Idea to Backlog</span>
          </button>
        </div>

        {/* Section 1: Active Production Sprint */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Active Production & Ready Queue ({activeSprintIdeas.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Consensus approved & in AI development
            </span>
          </div>

          <div className="space-y-2">
            {activeSprintIdeas.map(renderIdeaRow)}
            {activeSprintIdeas.length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">
                No ideas currently in active production.
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Ideas Backlog & Refinement Pool */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Backlog & Deliberation Pool ({backlogIdeas.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Undergoing natural language scoping & team consensus
            </span>
          </div>

          <div className="space-y-2">
            {backlogIdeas.map(renderIdeaRow)}
            {backlogIdeas.length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">
                Backlog is empty. Click "+ Scope New Idea" to capture a customer pain point!
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Shipped Archive */}
        {shippedIdeas.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 opacity-80">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Shipped to Market ({shippedIdeas.length})
                </h3>
              </div>
            </div>
            <div className="space-y-2">{shippedIdeas.map(renderIdeaRow)}</div>
          </div>
        )}
      </div>
    </div>
  );
};
