import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateTotalScore } from '../../services/aiPromptGenerator';
import {
  FileText,
  Bot,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  MessageSquare,
  Edit3,
  Send
} from 'lucide-react';

export const PrdView: React.FC = () => {
  const {
    activeProject,
    filteredIdeas,
    setActiveIdea,
    setAiPromptModalIdea,
    teamMembers,
    checkConsensus,
    addComment,
    activeUser,
  } = useApp();

  const [selectedIdeaId, setSelectedIdeaId] = useState<string>(
    filteredIdeas[0]?.id || ''
  );
  const [commentInput, setCommentInput] = useState('');

  const selectedIdea =
    filteredIdeas.find((i) => i.id === selectedIdeaId) || filteredIdeas[0];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedIdea) return;
    addComment(selectedIdea.id, commentInput);
    setCommentInput('');
  };

  if (!selectedIdea) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 text-center text-slate-400">
        <div>
          <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <h3 className="text-base font-semibold text-slate-700">No PRDs Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Create an idea in the backlog to generate a living Confluence PRD.
          </p>
        </div>
      </div>
    );
  }

  const score = calculateTotalScore(selectedIdea.founderScore);
  const consensus = checkConsensus(selectedIdea);
  const author = teamMembers.find((m) => m.id === selectedIdea.authorId);

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Left PRD Document Tree (Confluence-style navigation) */}
      <div className="w-72 border-r border-slate-200 bg-slate-50/70 p-3 overflow-y-auto shrink-0 flex flex-col space-y-1">
        <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>Living PRD Specs</span>
          <span className="font-mono bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px]">
            {filteredIdeas.length}
          </span>
        </div>

        {filteredIdeas.map((idea) => {
          const isSelected = idea.id === selectedIdea.id;
          const ideaConsensus = checkConsensus(idea);
          return (
            <button
              key={idea.id}
              onClick={() => setSelectedIdeaId(idea.id)}
              className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex flex-col space-y-1 ${
                isSelected
                  ? 'bg-blue-50 border border-blue-200 text-blue-950 font-semibold shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500 font-bold">
                  {idea.issueKey}
                </span>
                {ideaConsensus.allowed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Clock className="w-3 h-3 text-slate-400" />
                )}
              </div>
              <div className="truncate text-xs">{idea.title}</div>
            </button>
          );
        })}
      </div>

      {/* Main Confluence Document Reading & Deliberation Canvas */}
      <div className="flex-1 overflow-y-auto p-8 bg-white">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Breadcrumbs & Actions */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className="font-medium">{activeProject?.name}</span>
              <span>/</span>
              <span>Requirements</span>
              <span>/</span>
              <span className="font-mono font-bold text-slate-800">
                {selectedIdea.issueKey}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAiPromptModalIdea(selectedIdea)}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Export AI Dev Brief</span>
              </button>
              <button
                onClick={() => setActiveIdea(selectedIdea)}
                className="flex items-center space-x-1 border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md text-xs font-medium"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit / Vote</span>
              </button>
            </div>
          </div>

          {/* Document Title & Meta */}
          <div className="space-y-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {selectedIdea.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm">{author?.avatar || '👤'}</span>
                <span>By <strong>{author?.name || 'Product Team'}</strong></span>
              </div>
              <span>•</span>
              <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                Stage: {selectedIdea.stage.replace('_', ' ')}
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-indigo-700 font-mono font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                <Flame className="w-3 h-3 text-orange-500" />
                <span>Score: {score}/100</span>
              </span>
            </div>
          </div>

          {/* Consensus Alert Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
              consensus.allowed
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/80 border-amber-200 text-amber-900'
            }`}
          >
            {consensus.allowed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm">
                {consensus.allowed
                  ? 'Team Consensus Complete (Unanimous)'
                  : 'Deliberation Active — Awaiting Full Sign-off'}
              </div>
              <p className="mt-0.5 opacity-90">
                {consensus.allowed
                  ? 'All team members have reviewed and approved this natural language spec. Ready for AI implementation.'
                  : consensus.reason}
              </p>
            </div>
          </div>

          {/* Structured Document Content */}
          <div className="prose prose-slate max-w-none text-slate-800 text-sm space-y-6 leading-relaxed">
            {/* 1. Problem Statement */}
            <section className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1">
                <span>1. Problem Statement & User Pain Point</span>
              </h3>
              <p className="text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-100 italic">
                "{selectedIdea.painPoint}"
              </p>
            </section>

            {/* 2. Target Persona */}
            <section className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1">
                <span>2. Target Audience</span>
              </h3>
              <p className="text-slate-700">{selectedIdea.targetAudience}</p>
            </section>

            {/* 3. Proposed Solution */}
            <section className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1">
                <span>3. Proposed Solution & User Flow</span>
              </h3>
              <p className="text-slate-700 whitespace-pre-line">
                {selectedIdea.proposedSolution}
              </p>
            </section>

            {/* 4. Value Proposition */}
            <section className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1">
                <span>4. Core Value Proposition ("Why Now?")</span>
              </h3>
              <p className="text-slate-700">{selectedIdea.valueProposition}</p>
            </section>

            {/* 5. Success Criteria */}
            <section className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1">
                <span>5. Definition of Done & Success Criteria</span>
              </h3>
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                {selectedIdea.successCriteria.map((criterion, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700">
                    <span className="w-4 h-4 rounded border border-slate-300 bg-white flex items-center justify-center text-[10px] text-blue-600 font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{criterion}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Team Consensus & Voting Table */}
            <section className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-1">
                <span>6. Team Consensus Sign-off Log</span>
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Team Member</th>
                      <th className="p-2.5">Role</th>
                      <th className="p-2.5">Vote Status</th>
                      <th className="p-2.5">Deliberation Comment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teamMembers.map((member) => {
                      const vote = selectedIdea.votes[member.id];
                      const isApproved = vote?.status === 'approved';
                      const isDiscussion = vote?.status === 'needs_discussion';

                      return (
                        <tr key={member.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-medium flex items-center space-x-2">
                            <span>{member.avatar}</span>
                            <span>{member.name}</span>
                          </td>
                          <td className="p-2.5 text-slate-500">{member.role}</td>
                          <td className="p-2.5">
                            {isApproved ? (
                              <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Approved</span>
                              </span>
                            ) : isDiscussion ? (
                              <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                                <AlertCircle className="w-3 h-3" />
                                <span>Needs Discussion</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                <Clock className="w-3 h-3" />
                                <span>Pending</span>
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-slate-600 italic">
                            {vote?.comment ? `"${vote.comment}"` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Confluence Discussion & Comments Section */}
          <div className="pt-8 border-t border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Discussion Thread ({selectedIdea.comments.length})</span>
            </h3>

            <div className="space-y-3">
              {selectedIdea.comments.map((comment) => {
                const commentAuthor = teamMembers.find((m) => m.id === comment.memberId);
                return (
                  <div
                    key={comment.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-500">
                      <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
                        <span>{commentAuthor?.avatar || '👤'}</span>
                        <span>{commentAuthor?.name || 'Teammate'}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({commentAuthor?.role})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comment.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed pl-5">{comment.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex space-x-2 pt-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={`Comment as ${activeUser.name} (${activeUser.role})...`}
                className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
