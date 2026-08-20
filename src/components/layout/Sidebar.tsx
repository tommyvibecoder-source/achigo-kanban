import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutGrid,
  ListTodo,
  FileText,
  Target,
  Users,
  FolderPlus,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ActiveView } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    projects,
    activeProject,
    setActiveProjectId,
    setIsProjectModalOpen,
    teamMembers,
    setIsTeamModalOpen,
    filteredIdeas,
    ideas,
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: { id: ActiveView; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    {
      id: 'kanban',
      label: 'Kanban Board',
      icon: LayoutGrid,
      badge: filteredIdeas.length,
    },
    {
      id: 'backlog',
      label: 'Backlog Planning',
      icon: ListTodo,
      badge: filteredIdeas.filter((i) => i.stage === 'backlog' || i.stage === 'refinement').length,
    },
    {
      id: 'prd_list',
      label: 'Confluence PRDs',
      icon: FileText,
      badge: filteredIdeas.length,
    },
    {
      id: 'matrix',
      label: 'Impact vs Simplicity',
      icon: Target,
    },
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-200 flex flex-col justify-between select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Part: Navigation Links */}
      <div className="p-3 space-y-6">
        {/* Project Header Info */}
        {!isCollapsed ? (
          <div className="px-2 py-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Project Space
            </div>
            <div className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: activeProject?.color || '#0052CC' }}
              />
              <span className="font-semibold text-white text-sm truncate">
                {activeProject?.name}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
              {activeProject?.description}
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: activeProject?.color || '#0052CC' }}
              title={activeProject?.name}
            />
          </div>
        )}

        {/* View Switchers */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Views
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center py-2.5 px-0' : 'justify-between px-3 py-2'
                } rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {!isCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                      isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Multi-Project Spaces List */}
        {!isCollapsed && (
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                All Projects ({projects.length})
              </span>
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="text-slate-400 hover:text-blue-400 text-xs p-0.5"
                title="Create Project"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-0.5 max-h-40 overflow-y-auto">
              {projects.map((p) => {
                const count = ideas.filter((i) => i.projectId === p.id).length;
                const isSelected = p.id === activeProject?.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveProjectId(p.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="truncate">{p.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Team Roster Snapshot */}
        {!isCollapsed && (
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Team Consensus ({teamMembers.length})
              </span>
              <button
                onClick={() => setIsTeamModalOpen(true)}
                className="text-slate-400 hover:text-blue-400 text-xs p-0.5"
                title="Manage Team"
              >
                <Users className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              {teamMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between px-2 py-1 rounded text-xs text-slate-300 bg-slate-800/40"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-xs">{m.avatar}</span>
                    <span className="truncate text-[11px] font-medium">{m.name}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 truncate max-w-[80px]">
                    {m.role.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Collapse Button */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="text-[10px] text-slate-500 font-medium flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Unanimous Gate Active</span>
          </div>
        ) : null}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors mx-auto"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
