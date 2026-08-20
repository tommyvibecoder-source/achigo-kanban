import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, X, ShieldCheck, Copy, Check, Trash2 } from 'lucide-react';
import { RoleType } from '../../types';

export const TeamModal: React.FC = () => {
  const {
    isTeamModalOpen,
    setIsTeamModalOpen,
    teamMembers,
    addTeamMember,
    deleteTeamMember,
    activeUser,
    setActiveUserId,
    isFounder,
  } = useApp();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [roleType, setRoleType] = useState<RoleType>('member');
  const [passcode, setPasscode] = useState('');
  const [avatar, setAvatar] = useState('👩‍💻');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isTeamModalOpen) return null;

  const avatars = ['👨‍💼', '👩‍💻', '🧑‍🔬', '🎨', '🚀', '📈', '🛡️', '⚡', '🧠'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    const cleanUser = (username.trim() || name.trim().toLowerCase().replace(/\s+/g, ''));
    const cleanPass = passcode.trim() || (cleanUser + '123');

    addTeamMember({
      name: name.trim(),
      username: cleanUser,
      role: role.trim(),
      roleType,
      avatar,
      color: '#0052CC',
      passcode: cleanPass,
      email: `${cleanUser}@achigo.tech`,
    });

    setName('');
    setUsername('');
    setRole('');
    setPasscode('');
  };

  const handleShareInvite = (member: (typeof teamMembers)[0]) => {
    const inviteText = `🚀 Welcome to AchiGO (Achieve • Grow • Outscale) Workspace!

Here are your team login credentials:
• Workspace App: ${window.location.origin}
• Username: ${member.username || member.name}
• Role: ${member.role} (${member.roleType.toUpperCase()})
• Temporary Passcode PIN: ${member.passcode}

👉 Note: You will be asked to set your own private passcode upon your first login.

Log in to start collaborating, scoping, and voting on the product Kanban!`;

    navigator.clipboard.writeText(inviteText);
    setCopiedId(member.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Team Accounts & Access Control</h3>
              <p className="text-xs text-slate-500">
                Manage roles, passcodes, and share login credentials at $0 cost
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTeamModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Deletion & Permission Rules */}
          <div className="bg-blue-50/80 border border-blue-200 p-3.5 rounded-xl text-xs text-blue-950 space-y-1">
            <div className="font-bold flex items-center space-x-1.5 text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Permission & Deletion Governance</span>
            </div>
            <div className="text-blue-900 leading-relaxed space-y-0.5">
              <div>• <strong>Co-Founders (Zogo & Achiri):</strong> Full Admin access, manage team accounts, can delete cards and projects.</div>
              <div>• <strong>Leads & Members:</strong> Can scope ideas, edit PRDs, cast consensus votes, create AI prompts, run manual QA tests, but <strong>cannot delete cards</strong>.</div>
            </div>
          </div>

          {/* Roster & Passcodes List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Team Member Accounts ({teamMembers.length})
            </h4>
            <div className="space-y-2">
              {teamMembers.map((m) => {
                const isActive = m.id === activeUser.id;
                const isItemFounder = m.roleType === 'founder';

                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-3 ${
                      isActive ? 'bg-blue-50/70 border-blue-300' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{m.avatar}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{m.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono font-semibold">
                            @{m.username || m.name.toLowerCase()}
                          </span>
                          {isItemFounder && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-900 font-bold rounded">
                              👑 Founder / Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{m.role}</div>
                        {isFounder && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Passcode PIN: <span className="font-bold text-slate-700 bg-slate-100 px-1 rounded">{m.passcode}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {/* Copy Invite / Login details */}
                      <button
                        type="button"
                        onClick={() => handleShareInvite(m)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1"
                        title="Copy login invite message to clipboard"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Invite Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Share Login</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveUserId(m.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isActive ? 'Current' : 'Switch'}
                      </button>

                      {isFounder && !isItemFounder && teamMembers.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove account for ${m.name}?`)) {
                              deleteTeamMember(m.id);
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Remove user"
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

          {/* Add New Teammate Form (Founders Only) */}
          {isFounder ? (
            <form onSubmit={handleAdd} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                + Create New Team Member Account
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!username) {
                        setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''));
                      }
                    }}
                    placeholder="e.g. Samuel Ade"
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Username *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="samuel"
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Role / Job Title *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Backend Lead"
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Role Permission Tier</label>
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value as RoleType)}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="member">Member (Vote, Scope, QA Test)</option>
                    <option value="lead">Lead (Vote, Scope, QA Test)</option>
                    <option value="founder">Co-Founder / Admin (Full Deletion Rights)</option>
                    <option value="viewer">Viewer (Read-Only)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 flex justify-between">
                  <span>Custom Passcode / PIN</span>
                  <span className="text-[10px] text-slate-400 font-normal">Defaults to username123</span>
                </label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="e.g. samuel2026"
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Avatar Selector */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Avatar Icon</label>
                <div className="flex space-x-2">
                  {avatars.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`text-lg p-1 rounded-md transition-transform ${
                        avatar === av ? 'bg-blue-100 ring-2 ring-blue-500 scale-110' : 'hover:bg-slate-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Create Account & Generate Login Credentials
              </button>
            </form>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 text-center">
              🔒 Account creation and role management is restricted to Co-Founders (Zogo & Achiri).
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
