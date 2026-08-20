import React, { useState } from 'react';
import { KanbanStage, IdeaCard } from '../../types';
import { KanbanCard } from './KanbanCard';
import { useApp } from '../../context/AppContext';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  stage: KanbanStage;
  title: string;
  subtitle: string;
  color: string;
  ideas: IdeaCard[];
  onDropCard: (ideaId: string, targetStage: KanbanStage) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  title,
  subtitle,
  color,
  ideas,
  onDropCard,
}) => {
  const { setIsNewIdeaModalOpen } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const ideaId = e.dataTransfer.getData('text/plain');
    if (ideaId) {
      onDropCard(ideaId, stage);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-1 min-w-[280px] max-w-[340px] bg-slate-100/80 rounded-xl border transition-all duration-150 ${
        isDragOver
          ? 'border-blue-500 bg-blue-50/50 shadow-inner'
          : 'border-slate-200/80'
      }`}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-slate-200/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h3 className="font-bold text-xs text-slate-800 tracking-tight">
              {title}
            </h3>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
            {ideas.length}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 truncate">{subtitle}</p>
      </div>

      {/* Cards List Area */}
      <div className="p-2 space-y-2 flex-1 overflow-y-auto min-h-[420px] max-h-[calc(100vh-210px)]">
        {ideas.map((idea) => (
          <KanbanCard key={idea.id} idea={idea} />
        ))}

        {ideas.length === 0 && (
          <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-center p-3 text-slate-400">
            <p className="text-[11px] font-medium">No ideas in this stage</p>
            <p className="text-[9px] text-slate-400 mt-0.5">
              Drag an idea here or click + below
            </p>
          </div>
        )}
      </div>

      {/* Column Footer */}
      {stage === 'backlog' && (
        <div className="p-2 pt-0">
          <button
            onClick={() => setIsNewIdeaModalOpen(true)}
            className="w-full py-1.5 px-3 rounded-lg border border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 bg-white/50 hover:bg-white text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Idea to Backlog</span>
          </button>
        </div>
      )}
    </div>
  );
};
