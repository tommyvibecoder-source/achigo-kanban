import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderKanban,
  Plus,
  Search,
  Users,
  ChevronDown,
  Download,
  Upload,
  RotateCcw,
  FolderPlus,
  CheckCircle2,
  Lock,
  LogOut
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    projects,
    activeProject,
    setActiveProjectId,
    setIsProjectModalOpen,
    teamMembers,
    activeUser,
    setActiveUserId,
    setIsTeamModalOpen,
    setIsNewIdeaModalOpen,
    searchQuery,
    setSearchQuery,
    exportData,
    importData,
    resetAllData,
    logout,
  } = useApp();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importData(content);
      if (ok) {
        setImportNotice('Data imported successfully!');
      } else {
        setImportNotice('Failed to parse JSON file.');
      }
      setTimeout(() => setImportNotice(null), 3000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 sticky top-0 shadow-sm select-none">
      {/* Left: Brand & Project Switcher */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 text-white px-3 py-1.5 rounded-lg shadow-sm">
          <FolderKanban className="w-5 h-5 text-sky-300" />
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-sm leading-none">AchiGO</span>
            <span className="text-[8px] tracking-wider uppercase font-semibold text-blue-200 leading-tight hidden md:inline">
              Achieve • Grow • Outscale
            </span>
          </div>
        </div>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 transition-colors"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeProject?.color || '#0052CC' }}
            />
            <span className="max-w-[140px] md:max-w-[200px] truncate">
              {activeProject?.name || 'Select Project'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-mono font-bold">
              {activeProject?.keyPrefix}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {isProjectDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProjectDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Startup Projects
                </div>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProjectId(p.id);
                      setIsProjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      p.id === activeProject?.id ? 'bg-blue-50/80 font-semibold text-blue-900' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <div className="truncate">
                        <div className="truncate font-medium">{p.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{p.description}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-mono shrink-0 ml-2">
                      {p.keyPrefix}
                    </span>
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1 px-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsProjectDropdownOpen(false);
                      setIsProjectModalOpen(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded flex items-center space-x-2 font-medium"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>+ New Project Space</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProjectDropdownOpen(false);
                      setIsProjectModalOpen(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 rounded flex items-center space-x-2 font-medium"
                  >
                    <FolderKanban className="w-4 h-4 text-slate-400" />
                    <span>Manage / Delete Projects</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="hidden md:flex items-center max-w-xs w-full mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ideas, keys, tags, pain points..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-100 focus:bg-white text-xs border border-transparent focus:border-blue-400 rounded-md outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right Actions: Team Switcher, New Idea, Data settings */}
      <div className="flex items-center space-x-2">
        {/* Active Teammate Persona Switcher (For testing consensus) */}
        <div className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-md text-xs border border-slate-200 transition-colors"
            title="Switch active user to test team consensus voting"
          >
            <span className="text-sm">{activeUser.avatar}</span>
            <div className="text-left hidden lg:block">
              <div className="font-semibold text-xs leading-none text-slate-800">{activeUser.name}</div>
              <div className="text-[10px] text-slate-400 leading-tight">{activeUser.role}</div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {isUserDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Test As Team Member
                </div>
                <div className="px-3 py-1 text-[10px] text-slate-500 bg-amber-50 border-y border-amber-100 my-1">
                  💡 Switch user to test team deliberation & unanimous approval votes!
                </div>
                {teamMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveUserId(m.id);
                      setIsUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2.5 hover:bg-slate-50 transition-colors ${
                      m.id === activeUser.id ? 'bg-blue-50/80 font-semibold text-blue-900' : 'text-slate-700'
                    }`}
                  >
                    <span className="text-base">{m.avatar}</span>
                    <div className="truncate">
                      <div className="font-medium text-slate-900">{m.name}</div>
                      <div className="text-[10px] text-slate-500">{m.role}</div>
                    </div>
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1 px-1 space-y-1">
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      setIsTeamModalOpen(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded flex items-center space-x-2 font-medium"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Manage Team & Access</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded flex items-center space-x-2 font-medium"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Lock / Switch Account</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 1-Click Direct Logout Button */}
        <button
          onClick={logout}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md border border-slate-200 transition-colors"
          title={`Log out of workspace (${activeUser.name})`}
        >
          <LogOut className="w-4 h-4" />
        </button>

        {/* Data / Import / Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
            title="Backup, Export, Import, or Reset data"
          >
            <Download className="w-4 h-4" />
          </button>

          {isSettingsDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsSettingsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    exportData();
                    setIsSettingsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Export JSON Backup</span>
                </button>
                <label className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Import JSON Backup</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      handleFileUpload(e);
                      setIsSettingsDropdownOpen(false);
                    }}
                  />
                </label>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => {
                    if (confirm('Reset all ideas and projects back to initial demo state?')) {
                      resetAllData();
                    }
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Primary Action: + New Idea */}
        <button
          onClick={() => setIsNewIdeaModalOpen(true)}
          className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Scope New Idea</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Toast notice for imports */}
      {importNotice && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{importNotice}</span>
        </div>
      )}
    </header>
  );
};
