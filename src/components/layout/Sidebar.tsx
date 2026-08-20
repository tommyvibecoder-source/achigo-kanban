import React from 'react';
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
  LogOut,
  Settings,
  Plus,
  X
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
    activeUser,
    logout,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    setIsNewIdeaModalOpen,
  } = useApp();

  const handleNavClick = (viewId: ActiveView) => {
    setActiveView(viewId);
    // Auto-close drawer on mobile screens after selecting view
    if (window.innerWidth < 768) {
      setIsSidebarCollapsed(true);
    }
  };

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
    <>
      {/* Mobile Backdrop Overlay (only on mobile when drawer is open) */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={`bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-200 flex flex-col h-full select-none shrink-0 ${
          isSidebarCollapsed
            ? 'hidden md:flex md:w-16'
            : 'fixed md:relative inset-y-0 left-0 z-50 w-72 md:w-64 shadow-2xl md:shadow-none'
        }`}
      >
        {/* Mobile Drawer Top Bar with Close Button */}
        <div className="md:hidden flex items-center justify-between p-3.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold tracking-tight text-white text-sm">AchiGO Menu</span>
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(true)}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Middle Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Project Header Info */}
          {!isSidebarCollapsed ? (
            <div className="px-2 py-1 bg-slate-800/60 rounded-lg p-2.5 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                <span>Active Project Space</span>
                <button
                  onClick={() => {
                    setIsProjectModalOpen(true);
                    if (window.innerWidth < 768) setIsSidebarCollapsed(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 flex items-center space-x-0.5"
                  title="Manage / Delete Projects"
                >
                  <Settings className="w-3 h-3" />
                  <span className="capitalize text-[10px]">Manage</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: activeProject?.color || '#0052CC' }}
                />
                <span className="font-bold text-white text-xs truncate">
                  {activeProject?.name}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                {activeProject?.description}
              </div>
              <button
                onClick={() => {
                  setIsNewIdeaModalOpen(true);
                  if (window.innerWidth < 768) setIsSidebarCollapsed(true);
                }}
                className="mt-2 w-full py-2 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add to Backlog</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 py-1">
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
                title={`Active Project: ${activeProject?.name}`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-xs"
                  style={{ backgroundColor: activeProject?.color || '#0052CC' }}
                />
              </button>
              <button
                onClick={() => setIsNewIdeaModalOpen(true)}
                className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-colors shadow-xs"
                title="Add Idea to Backlog"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* View Switchers */}
          <div className="space-y-1">
            {!isSidebarCollapsed && (
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
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center ${
                    isSidebarCollapsed ? 'justify-center py-2.5 px-0' : 'justify-between px-3 py-2.5'
                  } rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isSidebarCollapsed && item.badge !== undefined && (
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
          {!isSidebarCollapsed && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  All Projects ({projects.length})
                </span>
                <button
                  onClick={() => {
                    setIsProjectModalOpen(true);
                    if (window.innerWidth < 768) setIsSidebarCollapsed(true);
                  }}
                  className="text-slate-400 hover:text-blue-400 text-[11px] font-semibold flex items-center space-x-1"
                  title="Create or delete projects"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>+ New</span>
                </button>
              </div>
              <div className="space-y-0.5 max-h-36 overflow-y-auto scrollbar-thin">
                {projects.map((p) => {
                  const count = ideas.filter((i) => i.projectId === p.id).length;
                  const isSelected = p.id === activeProject?.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveProjectId(p.id);
                        if (window.innerWidth < 768) setIsSidebarCollapsed(true);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded text-xs flex items-center justify-between transition-colors ${
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
          {!isSidebarCollapsed && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Team Roster ({teamMembers.length})
                </span>
                <button
                  onClick={() => {
                    setIsTeamModalOpen(true);
                    if (window.innerWidth < 768) setIsSidebarCollapsed(true);
                  }}
                  className="text-slate-400 hover:text-blue-400 text-[11px] font-semibold flex items-center space-x-1"
                  title="Manage Team & Passcodes"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Manage</span>
                </button>
              </div>
              <div className="space-y-1">
                {teamMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between px-2 py-1.5 rounded text-xs text-slate-300 bg-slate-800/40"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="text-xs">{m.avatar}</span>
                      <span className="truncate text-[11px] font-medium">{m.name}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 truncate max-w-[80px]">
                      {m.roleType === 'founder' ? '👑 Founder' : m.role.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FIXED BOTTOM FOOTER (Always 100% visible) */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 shrink-0 space-y-2">
          {/* User Status & Log Out Button */}
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="flex items-center space-x-2 truncate">
                <span className="text-sm">{activeUser.avatar}</span>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{activeUser.name}</div>
                  <div className="text-[10px] text-slate-400 capitalize truncate">
                    {activeUser.roleType === 'founder' ? '👑 Founder' : activeUser.role}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                title="Log out of AchiGO workspace"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
              title={`Log out (${activeUser.name})`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Collapse Toggle Button (Desktop only) */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full py-1.5 px-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors hidden md:flex items-center justify-center space-x-1.5"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[11px] font-medium">Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
