import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, FolderKanban, Trash2 } from 'lucide-react';

export const ProjectModal: React.FC = () => {
  const {
    isProjectModalOpen,
    setIsProjectModalOpen,
    projects,
    createProject,
    deleteProject,
    activeProject,
    setActiveProjectId,
  } = useApp();

  const [name, setName] = useState('');
  const [keyPrefix, setKeyPrefix] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0052CC');

  if (!isProjectModalOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !keyPrefix.trim()) return;

    createProject({
      name: name.trim(),
      keyPrefix: keyPrefix.trim().toUpperCase(),
      description: description.trim() || `${name.trim()} workspace`,
      color,
      icon: 'FolderKanban',
    });

    setName('');
    setKeyPrefix('');
    setDescription('');
    setIsProjectModalOpen(false);
  };

  const colors = ['#0052CC', '#00875A', '#6554C0', '#FF5630', '#FFAB00', '#36B37E', '#172B4D'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderKanban className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Manage Project Spaces</h3>
          </div>
          <button
            onClick={() => setIsProjectModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Create New Project Form */}
          <form onSubmit={handleCreate} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Create New Project
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!keyPrefix) {
                      setKeyPrefix(e.target.value.slice(0, 3).toUpperCase());
                    }
                  }}
                  placeholder="e.g. Nexus Security"
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Key Prefix *</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={keyPrefix}
                  onChange={(e) => setKeyPrefix(e.target.value.toUpperCase())}
                  placeholder="NEX"
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none font-mono uppercase focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief vision statement..."
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* Color Palette */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Color Badge</label>
              <div className="flex space-x-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      color === c ? 'ring-2 ring-offset-2 ring-slate-700 scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
            >
              + Create Project Space
            </button>
          </form>

          {/* Existing Projects List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Existing Projects ({projects.length})
            </h4>
            <div className="space-y-2">
              {projects.map((p) => {
                const isActive = p.id === activeProject?.id;
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                      isActive ? 'bg-blue-50/70 border-blue-200' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 flex items-center space-x-1.5">
                          <span>{p.name}</span>
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                            {p.keyPrefix}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{p.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {!isActive && (
                        <button
                          onClick={() => setActiveProjectId(p.id)}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Switch
                        </button>
                      )}
                      {projects.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete project "${p.name}" and all its ideas?`)) {
                              deleteProject(p.id);
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
