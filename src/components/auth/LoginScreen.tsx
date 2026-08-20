import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FolderKanban, ShieldCheck, ArrowRight, KeyRound, Check, AlertCircle } from 'lucide-react';
import { TeamMember } from '../../types';

export const LoginScreen: React.FC = () => {
  const { teamMembers, login, completePasscodeReset } = useApp();

  const [usernameInput, setUsernameInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forced Reset State
  const [pendingResetMember, setPendingResetMember] = useState<TeamMember | null>(null);
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(usernameInput, passcodeInput);
    if (!result.success) {
      setErrorMsg(result.message || 'Invalid username or passcode.');
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    if (result.mustReset && result.member) {
      setPendingResetMember(result.member);
    }
  };

  const handleQuickLogin = (user: TeamMember) => {
    const result = login(user.username || user.name, user.passcode);
    if (result.mustReset && result.member) {
      setPendingResetMember(result.member);
    }
  };

  const handlePasscodeResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingResetMember) return;

    if (newPasscode.length < 4) {
      setResetError('Passcode must be at least 4 characters long.');
      return;
    }

    if (newPasscode !== confirmPasscode) {
      setResetError('Passcodes do not match. Please re-enter.');
      return;
    }

    if (newPasscode === pendingResetMember.passcode) {
      setResetError('Your new passcode must be different from your default temporary passcode.');
      return;
    }

    const ok = completePasscodeReset(pendingResetMember.id, newPasscode);
    if (ok) {
      setPendingResetMember(null);
    } else {
      setResetError('Failed to update passcode. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center p-3 sm:p-4 selection:bg-blue-600 selection:text-white">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-5 sm:p-8 space-y-5 sm:space-y-6 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 text-white rounded-xl shadow-md">
            <FolderKanban className="w-7 h-7 sm:w-8 h-8 text-sky-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">AchiGO</h1>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-indigo-600 mt-0.5">
              Achieve • Grow • Outscale
            </p>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 max-w-xs mx-auto">
            Collaborative Tech Production Kanban for AchiGO Projects
          </p>
        </div>

        {/* Standard Login Form */}
        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Username or Email
            </label>
            <input
              type="text"
              required
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="e.g. zogo or achiri"
              className="w-full text-xs p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex justify-between">
              <span>Passcode / PIN</span>
              <span className="text-[10px] text-slate-400 font-normal">Assigned by Founder</span>
            </label>
            <input
              type="password"
              required
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="Enter your access PIN..."
              className="w-full text-xs p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all font-mono"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg animate-in fade-in flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-1.5"
          >
            <span>Enter AchiGO Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick 1-Click Access for Team Roster with Credentials Reference */}
        <div className="pt-3 sm:pt-4 border-t border-slate-100 space-y-2">
          <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            Quick 1-Click Founder & Team Access
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {teamMembers.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleQuickLogin(m)}
                className="p-2.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl text-left text-xs transition-all flex items-center space-x-2"
              >
                <span className="text-lg">{m.avatar}</span>
                <div className="truncate">
                  <div className="font-bold text-slate-900 truncate">{m.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">
                    @{m.username} • {m.roleType === 'founder' ? '👑 Founder' : m.role.split(' ')[0]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Security / Governance Note */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong>First-Time Security Policy:</strong> Default/temporary passcodes are forced to be reset to your own private passcode upon first login.
          </p>
        </div>
      </div>

      {/* FORCED FIRST-TIME PASSCODE RESET MODAL */}
      {pendingResetMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Set Your Private Passcode
                </h3>
                <p className="text-xs text-slate-500">
                  Welcome, <strong>{pendingResetMember.name}</strong> ({pendingResetMember.role})
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-semibold">⚠️ First-Time Login Notice</p>
              <p className="text-amber-800">
                You logged in with a default temporary passcode. For security, please choose a private passcode known only to you.
              </p>
            </div>

            <form onSubmit={handlePasscodeResetSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  New Private Passcode / PIN *
                </label>
                <input
                  type="password"
                  required
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  placeholder="At least 4 characters..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Confirm New Passcode *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPasscode}
                  onChange={(e) => setConfirmPasscode(e.target.value)}
                  placeholder="Re-enter your new passcode..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white font-mono"
                />
              </div>

              {resetError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setPendingResetMember(null)}
                  className="flex-1 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Enter Workspace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
