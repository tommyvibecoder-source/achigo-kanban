import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, FolderKanban, Trash2, Plus, AlertCircle, Check } from 'lucide-react';

export const ProjectModal: React.FC = () => {
  const {
    isProjectModalOpen,
    setIsProjectModalOpen,
    projects,
    createProject,
    deleteProject,
    activeProject,
    setActiveProjectId,
    isFounder,
  } = useApp();

  const [name, setName] = useState('');
  const [keyPrefix, setKeyPrefix] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0052CC');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

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
    setFeedbackMsg({ type: 'success', text: `Project "${name}" created successfully!` });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleDelete = (projectId: string, projectName: string) => {
    if (!isFounder) {
      setFeedbackMsg({ type: 'error', text: 'Permission Denied: Only Co-Founders (Zogo & Achiri) can delete projects.' });
      setTimeout(() => setFeedbackMsg(null), 4000);
      return;
    }

    if (projects.length <= 1) {
      setFeedbackMsg({ type: 'error', text: 'Cannot delete the only remaining project space.' });
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    if (confirm(`Are you sure you want to permanently delete "${projectName}" and all associated backlog items?`)) {
      const res = deleteProject(projectId);
      if (!res.success) {
        setFeedbackMsg({ type: 'error', text: res.message || 'Failed to delete project.' });
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        setFeedbackMsg({ type: 'success', text: `Project "${projectName}" deleted.` });
        setTimeout(() => setFeedbackMsg(null), 3000);
      }
    }
  };

  const colors = ['#0052CC', '#00875A', '#6554C0', '#FF5630', '#FFAB00', '#36B37E', '#172B4D'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderKanban className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Project Spaces Management</h3>
              <p className="text-xs text-slate-500">Create new product ventures or delete existing spaces</p>
            </div>
          </div>
          <button
            onClick={() => setIsProjectModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Feedback Banner */}
          {feedbackMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in ${
                feedbackMsg.type === 'error'
                  ? 'bg-rose-50 border border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              }`}
            >
              {feedbackMsg.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Create New Project Form */}
          <form onSubmit={handleCreate} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center space-x-1.5">
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Add New Project Space</span>
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
                  placeholder="e.g. Nexus AI Security"
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
              <label className="text-[11px] font-semibold text-slate-700">Description / Goal</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What pain point is this product solving?..."
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* Color Palette */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Brand Color Tag</label>
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
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project Space</span>
            </button>
          </form>

          {/* Existing Projects List & Deletion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                All Projects ({projects.length})
              </h4>
              <span className="text-[10px] text-slate-400">
                {isFounder ? '👑 Full Deletion Rights' : '🔒 Deletion restricted to Founders'}
              </span>
            </div>

            <div className="space-y-2">
              {projects.map((p) => {
                const isActive = p.id === activeProject?.id;
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                      isActive ? 'bg-blue-50/70 border-blue-300' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate flex-1">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                      <div className="truncate flex-1">
                        <div className="font-bold text-slate-900 flex items-center space-x-2">
                          <span>{p.name}</span>
                          <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            Key: {p.keyPrefix}-101
                          </span>
                          {isActive && (
                            <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {!isActive ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveProjectId(p.id);
                            setIsProjectModalOpen(false);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          Switch
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-semibold text-xs px-2 py-1 bg-emerald-50 rounded">
                          Current
                        </span>
                      )}

                      {/* Delete Project Button */}
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Project (Co-Founders only)"
                        >
                          <Trash2 className="w-4 h-4" />
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
