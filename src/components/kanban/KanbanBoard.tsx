import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KanbanColumn } from './KanbanColumn';
import { KanbanStage, Priority, IssueType } from '../../types';
import { Filter, ShieldCheck, AlertTriangle } from 'lucide-react';

export const KanbanBoard: React.FC = () => {
  const {
    activeProject,
    filteredIdeas,
    moveIdeaStage,
    selectedPriority,
    setSelectedPriority,
    selectedTag,
    setSelectedTag,
    ideas,
  } = useApp();

  const [toastMessage, setToastMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [selectedIssueType, setSelectedIssueType] = useState<IssueType | 'all'>('all');

  const projectIdeas = ideas.filter((i) => i.projectId === activeProject?.id);
  const availableTags = Array.from(new Set(projectIdeas.flatMap((i) => i.tags)));

  const columns: { stage: KanbanStage; title: string; subtitle: string; color: string }[] = [
    {
      stage: 'backlog',
      title: 'Backlog / Ideation',
      subtitle: 'Features, bugs, improvements & spikes',
      color: '#6B778C',
    },
    {
      stage: 'refinement',
      title: 'Under Refinement',
      subtitle: 'Natural language scoping & debate',
      color: '#0052CC',
    },
    {
      stage: 'approved',
      title: 'Consensus Reached 🤝',
      subtitle: '100% Team approval confirmed',
      color: '#00875A',
    },
    {
      stage: 'prompt_creation',
      title: 'Prompt Creation ✍️',
      subtitle: 'Crafting developer specs',
      color: '#0284C7',
    },
    {
      stage: 'in_production',
      title: 'In Production ⚡',
      subtitle: 'Active development loop',
      color: '#6554C0',
    },
    {
      stage: 'manual_testing',
      title: 'Manual Testing & QA 🧪',
      subtitle: 'Hands-on team verification',
      color: '#E11D48',
    },
    {
      stage: 'shipped',
      title: 'Shipped to Market 🚀',
      subtitle: 'Live in production & verified',
      color: '#16A34A',
    },
  ];

  const handleDropCard = (ideaId: string, targetStage: KanbanStage) => {
    const result = moveIdeaStage(ideaId, targetStage);
    if (!result.success) {
      setToastMessage({
        type: 'error',
        text: result.message || 'Action blocked: Team consensus required!',
      });
      setTimeout(() => setToastMessage(null), 5000);
    } else {
      setToastMessage({
        type: 'success',
        text: `Item moved to ${targetStage.replace('_', ' ')}!`,
      });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const displayedIdeas = filteredIdeas.filter((idea) => {
    if (selectedIssueType !== 'all' && (idea.issueType || 'feature') !== selectedIssueType) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
      {/* Top Filter Bar (Scrollable on Mobile) */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 flex items-center justify-between gap-3 shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1 text-slate-400 text-xs">
            <Filter className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold text-slate-600 hidden sm:inline">Filters:</span>
          </div>

          {/* Issue Type Filter Pills */}
          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs shrink-0">
            {(['all', 'feature', 'bug', 'improvement', 'task'] as (IssueType | 'all')[]).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedIssueType(t)}
                className={`px-2 py-1 rounded text-[11px] font-medium capitalize transition-colors ${
                  selectedIssueType === t
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'all' ? 'All Types' : t}
              </button>
            ))}
          </div>

          {/* Priority filter pills */}
          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs shrink-0">
            {(['all', 'critical', 'high', 'medium', 'low'] as (Priority | 'all')[]).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-2 py-1 rounded text-[11px] font-medium capitalize transition-colors ${
                  selectedPriority === p
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Tag filter selector */}
          {availableTags.length > 0 && (
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="text-xs bg-slate-100 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 outline-none focus:border-blue-400 shrink-0"
            >
              <option value="all">All Tags ({availableTags.length})</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          )}

          {(selectedPriority !== 'all' || selectedTag !== 'all' || selectedIssueType !== 'all') && (
            <button
              onClick={() => {
                setSelectedPriority('all');
                setSelectedTag('all');
                setSelectedIssueType('all');
              }}
              className="text-xs text-blue-600 hover:underline font-medium ml-1 shrink-0"
            >
              Clear
            </button>
          )}
        </div>

        {/* Board Stats & Slogan */}
        <div className="flex items-center space-x-3 text-xs text-slate-500 shrink-0">
          <div className="hidden lg:flex items-center space-x-1.5 bg-blue-50/80 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-medium">
              AchiGO Kanban for {activeProject?.name}
            </span>
          </div>
          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full text-[11px]">
            {displayedIdeas.length} card{displayedIdeas.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Kanban Columns Canvas (Optimized for Mobile Touch Horizontal Scroll) */}
      <div className="flex-1 p-2.5 sm:p-4 md:p-6 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory">
        <div className="flex space-x-3 sm:space-x-4 h-full min-w-max pb-2">
          {columns.map((col) => {
            const columnIdeas = displayedIdeas.filter((i) => i.stage === col.stage);
            return (
              <KanbanColumn
                key={col.stage}
                stage={col.stage}
                title={col.title}
                subtitle={col.subtitle}
                color={col.color}
                ideas={columnIdeas}
                onDropCard={handleDropCard}
              />
            );
          })}
        </div>
      </div>

      {/* Toast feedback alerts */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 max-w-sm z-50 p-4 rounded-xl shadow-2xl border text-xs flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toastMessage.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-emerald-900 text-white border-emerald-700'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-300 shrink-0" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
          )}
          <span className="leading-snug">{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
};
