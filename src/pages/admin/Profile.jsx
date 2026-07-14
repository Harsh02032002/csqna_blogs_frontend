import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Check, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await api.put('/auth/me', form);
      updateUser(res.data.user);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
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
      await api.put('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Change failed' });
    } finally {
      setSavingPassword(false);
    }
  };

  const roleColors = { admin: 'bg-red-100 text-red-700', editor: 'bg-blue-100 text-blue-700', author: 'bg-green-100 text-green-700' };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Profile Settings</h1>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 font-black text-2xl">{user?.name?.[0]}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className={`badge mt-1 ${roleColors[user?.role] || ''}`}>{user?.role}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><User size={16} /> Edit Profile</h3>

        {profileMsg.text && (
          <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg mb-4 ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {profileMsg.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
            {profileMsg.text}
          </div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={3}
              placeholder="Tell readers about yourself..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <input
              type="url"
              value={form.avatar}
              onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {savingProfile ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
            Save Profile
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Lock size={16} /> Change Password</h3>

        {passwordMsg.text && (
          <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg mb-4 ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {passwordMsg.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            { label: 'Current Password', key: 'currentPassword' },
            { label: 'New Password', key: 'newPassword' },
            { label: 'Confirm New Password', key: 'confirm' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="password"
                value={passwords[key]}
                onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-60"
          >
            {savingPassword ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock size={14} />}
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
