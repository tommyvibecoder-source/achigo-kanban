import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateTotalScore } from '../../services/aiPromptGenerator';
import { Target } from 'lucide-react';
import { IdeaCard } from '../../types';

export const PriorityMatrixView: React.FC = () => {
  const { filteredIdeas, setActiveIdea, checkConsensus } = useApp();

  // Quadrants:
  // Quick Wins: Impact >= 4, Simplicity >= 4
  // Strategic Bets: Impact >= 4, Simplicity < 4
  // Low Hanging Fruit: Impact < 4, Simplicity >= 4
  // Deprioritize: Impact < 4, Simplicity < 4

  const quickWins = filteredIdeas.filter(
    (i) => i.founderScore.userImpact >= 4 && i.founderScore.implementationSimplicity >= 4
  );
  const strategicBets = filteredIdeas.filter(
    (i) => i.founderScore.userImpact >= 4 && i.founderScore.implementationSimplicity < 4
  );
  const easyWins = filteredIdeas.filter(
    (i) => i.founderScore.userImpact < 4 && i.founderScore.implementationSimplicity >= 4
  );
  const lowPriority = filteredIdeas.filter(
    (i) => i.founderScore.userImpact < 4 && i.founderScore.implementationSimplicity < 4
  );

  const renderCardBadge = (idea: IdeaCard) => {
    const score = calculateTotalScore(idea.founderScore);
    const consensus = checkConsensus(idea);

    return (
      <div
        key={idea.id}
        onClick={() => setActiveIdea(idea)}
        className="p-3 bg-white hover:bg-slate-50 rounded-lg border border-slate-200/90 shadow-2xs hover:shadow-md cursor-pointer transition-all space-y-1.5"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
            {idea.issueKey}
          </span>
          <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
            {score}%
          </span>
        </div>
        <h5 className="font-semibold text-xs text-slate-900 line-clamp-2">
          {idea.title}
        </h5>
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
          <span className="capitalize">{idea.stage.replace('_', ' ')}</span>
          {consensus.allowed && (
            <span className="text-emerald-600 font-medium">✓ Consensus</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span>Founder Scoring Matrix (Impact vs Simplicity)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualize your startup ideas across Value/Impact and Implementation Simplicity to decide what to build first.
            </p>
          </div>
        </div>

        {/* 2x2 Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top-Right Quadrant: Quick Wins */}
          <div className="bg-emerald-50/50 rounded-xl border-2 border-emerald-300/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🚀</span>
                <div>
                  <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Quick Wins (Highest ROI)
                  </h3>
                  <p className="text-[10px] text-emerald-800">
                    High Impact + High Simplicity → Code Immediately!
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                {quickWins.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 min-h-[160px]">
              {quickWins.map(renderCardBadge)}
              {quickWins.length === 0 && (
                <p className="text-xs text-slate-400 py-8 text-center">
                  No quick wins scored yet.
                </p>
              )}
            </div>
          </div>

          {/* Top-Left Quadrant: Strategic Bets */}
          <div className="bg-blue-50/50 rounded-xl border-2 border-blue-300/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⭐</span>
                <div>
                  <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                    Strategic Bets (Big Swings)
                  </h3>
                  <p className="text-[10px] text-blue-800">
                    High Impact + Complex → Scope carefully in Antigravity
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-blue-800 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                {strategicBets.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 min-h-[160px]">
              {strategicBets.map(renderCardBadge)}
              {strategicBets.length === 0 && (
                <p className="text-xs text-slate-400 py-8 text-center">
                  No strategic bets currently in this project.
                </p>
              )}
            </div>
          </div>

          {/* Bottom-Right Quadrant: Low Hanging Fruit */}
          <div className="bg-amber-50/50 rounded-xl border-2 border-amber-300/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚡</span>
                <div>
                  <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Low Hanging Fruit
                  </h3>
                  <p className="text-[10px] text-amber-800">
                    Moderate Impact + Very Simple → Great for sprint fill-ins
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                {easyWins.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 min-h-[160px]">
              {easyWins.map(renderCardBadge)}
              {easyWins.length === 0 && (
                <p className="text-xs text-slate-400 py-8 text-center">
                  No low hanging fruit items.
                </p>
              )}
            </div>
          </div>

          {/* Bottom-Left Quadrant: Deprioritize */}
          <div className="bg-slate-100/70 rounded-xl border-2 border-slate-300/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⏳</span>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Deprioritize / Re-evaluate
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Low Impact + High Complexity → Keep in backlog
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                {lowPriority.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 min-h-[160px]">
              {lowPriority.map(renderCardBadge)}
              {lowPriority.length === 0 && (
                <p className="text-xs text-slate-400 py-8 text-center">
                  No deprioritized items.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
