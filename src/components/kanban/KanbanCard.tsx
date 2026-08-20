import React from 'react';
import { IdeaCard, IssueType } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateTotalScore } from '../../services/aiPromptGenerator';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Flame,
  Bot,
  FlaskConical,
  PenTool,
  Sparkles,
  Bug,
  Zap,
  Search,
  CheckSquare,
  Palette,
  ShieldAlert
} from 'lucide-react';

interface KanbanCardProps {
  idea: IdeaCard;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ idea }) => {
  const {
    setActiveIdea,
    teamMembers,
    checkConsensus,
    setAiPromptModalIdea,
  } = useApp();

  const score = calculateTotalScore(idea.founderScore);
  const consensus = checkConsensus(idea);

  const priorityConfig = {
    critical: { label: 'Critical', bg: 'bg-red-100 text-red-800 border-red-200' },
    high: { label: 'High', bg: 'bg-orange-100 text-orange-800 border-orange-200' },
    medium: { label: 'Medium', bg: 'bg-amber-100 text-amber-800 border-amber-200' },
    low: { label: 'Low', bg: 'bg-slate-100 text-slate-700 border-slate-200' },
  };

  const issueTypeConfig: Record<IssueType, { label: string; icon: React.FC<{ className?: string }>; color: string }> = {
    feature: { label: 'Feature', icon: Sparkles, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    bug: { label: 'Bug', icon: Bug, color: 'text-rose-700 bg-rose-50 border-rose-200' },
    improvement: { label: 'Improvement', icon: Zap, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    research: { label: 'Spike', icon: Search, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    task: { label: 'Task', icon: CheckSquare, color: 'text-slate-700 bg-slate-100 border-slate-300' },
    design: { label: 'Design', icon: Palette, color: 'text-orange-700 bg-orange-50 border-orange-200' },
    security: { label: 'Security', icon: ShieldAlert, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  };

  const typeConfig = issueTypeConfig[idea.issueType || 'feature'];
  const TypeIcon = typeConfig.icon;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', idea.id);
  };

  const totalTests = idea.manualTests?.length || 0;
  const passedTests = idea.manualTests?.filter((t) => t.passed).length || 0;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => setActiveIdea(idea)}
      className="group bg-white rounded-lg border border-slate-200/90 hover:border-blue-400 p-3.5 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer relative flex flex-col justify-between space-y-3"
    >
      {/* Top Header: Issue Key, Issue Type, Priority, & AI Prompt Exporter */}
      <div>
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold font-mono px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
              {idea.issueKey}
            </span>
            {/* Issue Type Chip */}
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border flex items-center space-x-1 ${typeConfig.color}`}
            >
              <TypeIcon className="w-2.5 h-2.5" />
              <span>{typeConfig.label}</span>
            </span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                priorityConfig[idea.priority].bg
              }`}
            >
              {priorityConfig[idea.priority].label}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAiPromptModalIdea(idea);
              }}
              className="opacity-80 group-hover:opacity-100 p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors text-[10px] font-medium flex items-center space-x-1 border border-blue-200/60"
              title="Copy prompt for Antigravity / Claude / Openwork"
            >
              <Bot className="w-3 h-3" />
              <span className="hidden sm:inline">Prompt</span>
            </button>
          </div>
        </div>

        {/* Title & Short Scoping Narrative */}
        <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
          {idea.title}
        </h4>
        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {idea.summary || idea.painPoint}
        </p>
      </div>

      {/* Stage Specific Badges */}
      {idea.stage === 'prompt_creation' && (
        <div className="flex items-center space-x-1 text-[10px] bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200 font-medium">
          <PenTool className="w-3 h-3 text-sky-600" />
          <span>Prompt Spec: {idea.targetAiTool || 'Antigravity'}</span>
        </div>
      )}

      {idea.stage === 'manual_testing' && totalTests > 0 && (
        <div
          className={`flex items-center justify-between text-[10px] px-2 py-0.5 rounded border font-medium ${
            passedTests === totalTests
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center space-x-1">
            <FlaskConical className="w-3 h-3" />
            <span>Manual QA: {passedTests}/{totalTests} Verified</span>
          </div>
          {passedTests === totalTests ? <span>✓ Ready</span> : <span>⚠️ Pending</span>}
        </div>
      )}

      {/* Tags */}
      {idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {idea.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded font-medium border border-slate-100"
            >
              #{tag}
            </span>
          ))}
          {idea.tags.length > 3 && (
            <span className="text-[9px] px-1 py-0.5 bg-slate-50 text-slate-400 rounded">
              +{idea.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Consensus & Team Voting Status Row */}
      <div className="pt-2 border-t border-slate-100 flex flex-col space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          {consensus.allowed ? (
            <span className="flex items-center space-x-1 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Consensus ({consensus.approvedCount}/{consensus.totalMembers})</span>
            </span>
          ) : consensus.objections.length > 0 ? (
            <span className="flex items-center space-x-1 text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span>{consensus.objections.length} Discussion Requested</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-slate-600 font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{consensus.approvedCount}/{consensus.totalMembers} Approved</span>
            </span>
          )}

          <span
            className="flex items-center space-x-0.5 font-bold font-mono text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100"
            title="Founder Value Score"
          >
            <Flame className="w-3 h-3 text-orange-500" />
            <span>{score}%</span>
          </span>
        </div>

        {/* Team Voting Avatar Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center -space-x-1 overflow-hidden">
            {teamMembers.map((m) => {
              const vote = idea.votes[m.id];
              const isApproved = vote?.status === 'approved';
              const isNeedsDiscussion = vote?.status === 'needs_discussion';

              return (
                <div
                  key={m.id}
                  className={`relative w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                    isApproved
                      ? 'border-emerald-500 bg-emerald-50'
                      : isNeedsDiscussion
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-slate-200 bg-slate-100 opacity-60'
                  }`}
                  title={`${m.name} (${m.role}): ${vote?.status || 'pending'}`}
                >
                  <span>{m.avatar}</span>
                  {isApproved && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                  )}
                  {isNeedsDiscussion && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full border border-white" />
                  )}
                </div>
              );
            })}
          </div>

          {idea.comments.length > 0 && (
            <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
              <MessageSquare className="w-3 h-3" />
              <span>{idea.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
