import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserCheck, KeyRound, Check, AlertCircle } from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    activeUser,
    updateProfile,
  } = useApp();

  const [name, setName] = useState(activeUser.name);
  const [role, setRole] = useState(activeUser.role);
  const [email, setEmail] = useState(activeUser.email || '');
  const [avatar, setAvatar] = useState(activeUser.avatar);

  // Passcode change
  const [isChangingPasscode, setIsChangingPasscode] = useState(false);
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isProfileModalOpen) return null;

  const avatars = ['👨‍💼', '👩‍💻', '🧑‍🔬', '🎨', '🚀', '📈', '🛡️', '⚡', '🧠', '💼', '🎯', '👑'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setNotice({ type: 'error', text: 'Name and Role cannot be empty.' });
      return;
    }

    if (isChangingPasscode) {
      if (currentPasscode !== activeUser.passcode) {
        setNotice({ type: 'error', text: 'Current passcode is incorrect.' });
        return;
      }
      if (newPasscode.length < 4) {
        setNotice({ type: 'error', text: 'New passcode must be at least 4 characters long.' });
        return;
      }
      if (newPasscode !== confirmPasscode) {
        setNotice({ type: 'error', text: 'New passcodes do not match.' });
        return;
      }

      updateProfile({
        name: name.trim(),
        role: role.trim(),
        email: email.trim(),
        avatar,
        passcode: newPasscode.trim(),
        mustResetPasscode: false,
      });
    } else {
      updateProfile({
        name: name.trim(),
        role: role.trim(),
        email: email.trim(),
        avatar,
      });
    }

    setNotice({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => {
      setNotice(null);
      setIsProfileModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Edit My Profile</h3>
              <p className="text-xs text-slate-500">Update your details, avatar, and personal passcode</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Notification Banner */}
          {notice && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in ${
                notice.type === 'error'
                  ? 'bg-rose-50 border border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              }`}
            >
              {notice.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{notice.text}</span>
            </div>
          )}

          {/* Account Role Badge */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Account Username: </span>
              <span className="font-mono font-bold text-slate-800">@{activeUser.username || activeUser.name.toLowerCase()}</span>
            </div>
            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 text-blue-900 capitalize">
              {activeUser.roleType === 'founder' ? '👑 Founder & Admin' : activeUser.roleType}
            </span>
          </div>

          {/* Avatar Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Choose Avatar
            </label>
            <div className="flex flex-wrap gap-2">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`text-xl p-2 rounded-xl border transition-all ${
                    avatar === av
                      ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500 scale-110 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Display Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Role / Job Title *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@achigo.tech"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Change Passcode Accordion */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
                <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                <span>Change Private Passcode</span>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingPasscode(!isChangingPasscode)}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                {isChangingPasscode ? 'Cancel Passcode Change' : 'Update Passcode'}
              </button>
            </div>

            {isChangingPasscode && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Current Passcode *</label>
                  <input
                    type="password"
                    required
                    value={currentPasscode}
                    onChange={(e) => setCurrentPasscode(e.target.value)}
                    placeholder="Enter existing passcode..."
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">New Passcode *</label>
                    <input
                      type="password"
                      required
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      placeholder="Min. 4 characters..."
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Confirm New *</label>
                    <input
                      type="password"
                      required
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      placeholder="Re-enter new..."
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Save */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
