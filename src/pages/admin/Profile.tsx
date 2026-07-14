import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, Lock, Check, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

interface ProfileForm {
  name: string;
  bio: string;
  avatar: string;
}

interface MessageState {
  type: 'success' | 'error' | '';
  text: string;
}

export const AdminProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState<MessageState>({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState<MessageState>({ type: '', text: '' });

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await api.put('/auth/me', form);
      updateUser(res.data.user);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      return setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
    }
    if (passwords.newPassword.length < 6) {
      return setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters' });
    }
    setSavingPassword(true);
    setPasswordMsg({ type: '', text: '' });
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Change failed' });
    } finally {
      setSavingPassword(false);
    }
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-400 border border-red-500/20',
    editor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    author: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-sans font-black text-white uppercase tracking-tight">Profile Settings</h1>

      {/* Profile Details Panel */}
      <div className="bg-slate-900/40 rounded-xl border border-slate-850 p-6 shadow-md">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-850">
          <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <span className="text-blue-450 font-sans font-black text-2xl">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">{user?.name}</h2>
            <p className="text-slate-500 text-xs mt-1">{user?.email}</p>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider inline-block mt-2 ${roleColors[user?.role || ''] || ''}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <h3 className="font-sans font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
          <UserIcon size={15} className="text-slate-500" />
          Edit Profile
        </h3>

        {profileMsg.text && (
          <div className={`flex items-center gap-2 text-xs font-semibold px-4 py-3 rounded-lg mb-5 border ${
            profileMsg.type === 'success'
              ? 'bg-emerald-950/20 text-emerald-450 border-emerald-800/30'
              : 'bg-red-950/20 text-red-400 border-red-800/30'
          }`}>
            {profileMsg.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
            {profileMsg.text}
          </div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-850 text-slate-200 placeholder-slate-650 rounded-lg px-3.5 py-2 text-xs focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={3}
              placeholder="Tell readers about yourself..."
              className="w-full bg-slate-950 border border-slate-850 text-slate-200 placeholder-slate-655 rounded-lg px-3.5 py-2 text-xs focus:outline-none resize-none"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Avatar URL</label>
            <input
              type="url"
              value={form.avatar}
              onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-slate-950 border border-slate-850 text-slate-200 placeholder-slate-650 rounded-lg px-3.5 py-2 text-xs focus:outline-none"
            />
          </div>
          
          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-650 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {savingProfile ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check size={14} />
            )}
            Save Profile
          </button>
        </form>
      </div>

      {/* Password panel */}
      <div className="bg-slate-900/40 rounded-xl border border-slate-850 p-6 shadow-md">
        <h3 className="font-sans font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
          <Lock size={15} className="text-slate-500" />
          Change Password
        </h3>

        {passwordMsg.text && (
          <div className={`flex items-center gap-2 text-xs font-semibold px-4 py-3 rounded-lg mb-5 border ${
            passwordMsg.type === 'success'
              ? 'bg-emerald-950/20 text-emerald-450 border-emerald-800/30'
              : 'bg-red-950/20 text-red-400 border-red-800/30'
          }`}>
            {passwordMsg.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {(
            [
              { label: 'Current Password', key: 'currentPassword' },
              { label: 'New Password', key: 'newPassword' },
              { label: 'Confirm New Password', key: 'confirm' },
            ] as const
          ).map(({ label, key }) => (
            <div key={key}>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
              <input
                type="password"
                value={passwords[key]}
                onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                required
                className="w-full bg-slate-950 border border-slate-850 text-slate-200 placeholder-slate-650 rounded-lg px-3.5 py-2 text-xs focus:outline-none"
              />
            </div>
          ))}
          
          <button
            type="submit"
            disabled={savingPassword}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {savingPassword ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Lock size={14} />
            )}
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
