import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, X, Copy, Check, Trash2, KeyRound, AlertCircle, Plus } from 'lucide-react';
import { RoleType, TeamMember } from '../../types';

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
    adminResetMemberPasscode,
    setIsProfileModalOpen,
  } = useApp();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [roleType, setRoleType] = useState<RoleType>('member');
  const [passcode, setPasscode] = useState('');
  const [avatar, setAvatar] = useState('👩‍💻');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Admin Passcode Reset Modal State
  const [resettingMember, setResettingMember] = useState<TeamMember | null>(null);
  const [adminNewPasscode, setAdminNewPasscode] = useState('');
  const [forceResetCheck, setForceResetCheck] = useState(true);
  const [adminNotice, setAdminNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

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
      mustResetPasscode: true,
      email: `${cleanUser}@achigo.tech`,
    });

    setName('');
    setUsername('');
    setRole('');
    setPasscode('');
    setAdminNotice({ type: 'success', text: `Account for ${name} created with temporary passcode "${cleanPass}"!` });
    setTimeout(() => setAdminNotice(null), 3500);
  };

  const handleShareInvite = (member: TeamMember) => {
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

  const handleAdminResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingMember) return;

    const res = adminResetMemberPasscode(resettingMember.id, adminNewPasscode, forceResetCheck);
    if (res.success) {
      setAdminNotice({
        type: 'success',
        text: `Passcode for ${resettingMember.name} has been reset to "${adminNewPasscode}".`,
      });
      setResettingMember(null);
      setAdminNewPasscode('');
      setTimeout(() => setAdminNotice(null), 4000);
    } else {
      setAdminNotice({
        type: 'error',
        text: res.message || 'Failed to reset passcode.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Team Profiles & Access Directory</h3>
              <p className="text-xs text-slate-500">
                View team profiles, manage accounts, and administer passcodes
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

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Notification Banner */}
          {adminNotice && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in ${
                adminNotice.type === 'error'
                  ? 'bg-rose-50 border border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              }`}
            >
              {adminNotice.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{adminNotice.text}</span>
            </div>
          )}

          {/* User Profile Quick Access Card */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{activeUser.avatar}</span>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-sm">{activeUser.name}</h4>
                  <span className="text-[10px] px-1.5 py-0.2 bg-blue-700 text-blue-100 rounded font-semibold uppercase">
                    {activeUser.roleType === 'founder' ? '👑 Founder' : activeUser.roleType}
                  </span>
                </div>
                <p className="text-xs text-blue-200">{activeUser.role} • @{activeUser.username}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsTeamModalOpen(false);
                setIsProfileModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-white text-blue-900 hover:bg-blue-50 rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              Edit My Profile ✏️
            </button>
          </div>

          {/* Team Members Roster Directory */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Team Directory ({teamMembers.length} Members)
              </h4>
              <span className="text-[10px] text-slate-500">
                {isFounder ? '👑 Admin Mode (Passcode reset available)' : '🔒 Passcode resets restricted to Admins'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teamMembers.map((m) => {
                const isCurrent = m.id === activeUser.id;
                const isItemFounder = m.roleType === 'founder';

                return (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between space-y-3 transition-all ${
                      isCurrent
                        ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl p-1 bg-slate-100 rounded-lg">{m.avatar}</span>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-slate-900">{m.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] bg-blue-600 text-white px-1 py-0.2 rounded font-semibold">
                                You
                              </span>
                            )}
                            {isItemFounder && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1 py-0.2 rounded">
                                👑 Founder
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">{m.role}</p>
                          <p className="text-[10px] font-mono text-slate-400">@{m.username || m.name.toLowerCase()}</p>
                        </div>
                      </div>

                      {/* Share invite credentials button */}
                      <button
                        type="button"
                        onClick={() => handleShareInvite(m)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium flex items-center space-x-1"
                        title="Copy login invite"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="text-slate-400">
                        {isFounder && (
                          <span className="font-mono text-[10px] text-slate-500">
                            PIN: <span className="bg-slate-100 px-1 py-0.2 rounded font-bold text-slate-700">{m.passcode}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Admin Reset Passcode Button (Only for Admins) */}
                        {isFounder && (
                          <button
                            type="button"
                            onClick={() => {
                              setResettingMember(m);
                              setAdminNewPasscode(m.username + '2026');
                            }}
                            className="text-blue-600 hover:underline font-semibold flex items-center space-x-1"
                          >
                            <KeyRound className="w-3 h-3" />
                            <span>Reset PIN</span>
                          </button>
                        )}

                        {/* Switch Account */}
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => setActiveUserId(m.id)}
                            className="text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-medium"
                          >
                            Switch
                          </button>
                        )}

                        {/* Remove account (Admin only) */}
                        {isFounder && !isItemFounder && teamMembers.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove account for ${m.name}?`)) {
                                deleteTeamMember(m.id);
                              }
                            }}
                            className="text-slate-400 hover:text-red-600 p-1"
                            title="Remove account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add New Team Member (Admins Only) */}
          {isFounder ? (
            <form onSubmit={handleAdd} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center space-x-1.5">
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Create New Team Member Account (Admin)</span>
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
                  <label className="text-[11px] font-semibold text-slate-700">Permission Tier</label>
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
                  <span>Default Temporary Passcode</span>
                  <span className="text-[10px] text-slate-400 font-normal">Defaults to username123</span>
                </label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="e.g. samuel123"
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
                      className={`text-lg p-1.5 rounded-md transition-transform ${
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

      {/* ADMIN PASSCODE RESET MODAL POPUP */}
      {resettingMember && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Admin Passcode Reset
                </h3>
                <p className="text-xs text-slate-500">
                  Resetting passcode for <strong>{resettingMember.name}</strong> (@{resettingMember.username})
                </p>
              </div>
            </div>

            <form onSubmit={handleAdminResetSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  New Temporary Passcode *
                </label>
                <input
                  type="text"
                  required
                  value={adminNewPasscode}
                  onChange={(e) => setAdminNewPasscode(e.target.value)}
                  placeholder="Min. 4 characters..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-mono font-bold"
                />
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                <input
                  type="checkbox"
                  id="forceReset"
                  checked={forceResetCheck}
                  onChange={(e) => setForceResetCheck(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="forceReset" className="text-slate-700 font-medium">
                  Force user to choose their own private passcode on next login
                </label>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setResettingMember(null)}
                  className="flex-1 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Reset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
