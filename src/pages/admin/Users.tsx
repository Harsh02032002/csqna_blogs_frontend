import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Check, Shield } from 'lucide-react';
import api from '../../utils/api';
import { formatDateShort } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

interface UserForm {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'editor' | 'author';
  bio: string;
  isActive: boolean;
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>({
    name: '',
    email: '',
    password: '',
    role: 'author',
    bio: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users')
      .then((res) => setUsers(res.data.users || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (u: User | null = null) => {
    setEditItem(u);
    setForm(
      u
        ? {
            name: u.name,
            email: u.email,
            password: '',
            role: u.role,
            bio: u.bio || '',
            isActive: u.isActive,
          }
        : {
            name: '',
            email: '',
            password: '',
            role: 'author',
            bio: '',
            isActive: true,
          }
    );
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      if (editItem && !payload.password) {
        delete payload.password;
      }
      if (editItem) {
        await api.put(`/users/${editItem._id}`, payload);
      } else {
        await api.post('/users', payload);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!currentUser) return;
    if (id === currentUser._id) return alert("You can't delete yourself!");
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-400 border border-red-550/20',
    editor: 'bg-blue-500/10 text-blue-400 border border-blue-550/20',
    author: 'bg-emerald-500/10 text-emerald-400 border border-emerald-550/20',
  };

  return (
    <div className="space-y-6">
      {/* Users Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-sans font-black text-white uppercase tracking-tight">Users</h1>
          <p className="text-slate-400 text-xs mt-1">{users.length} registered authors</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-500/10"
        >
          <Plus size={15} /> New User
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-48 shimmer rounded-xl" />)
        ) : (
          users.map((u) => (
            <div key={u._id} className="bg-slate-900/40 rounded-xl border border-slate-850 p-5 flex flex-col justify-between h-48">
              <div>
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                      <span className="text-blue-450 font-sans font-black text-lg">{u.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-200 truncate">{u.name}</p>
                      <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => openModal(u)}
                      className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={currentUser ? u._id === currentUser._id : false}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg disabled:opacity-30 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3.5 flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center ${roleColors[u.role] || ''}`}>
                    <Shield size={10} className="mr-1" />
                    {u.role}
                  </span>
                  
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      u.isActive
                        ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20'
                        : 'bg-slate-950 text-slate-500 border border-slate-850'
                    }`}
                  >
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div>
                {u.bio && <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">{u.bio}</p>}
                <p className="text-[10px] text-slate-655 font-semibold mt-3">Registered: {formatDateShort(u.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
              <h2 className="font-sans font-black text-white uppercase text-sm tracking-wider">
                {editItem ? 'Edit User Profile' : 'New User'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <p className="text-xs font-semibold text-red-400 bg-red-950/20 border border-red-800/30 px-3.5 py-2.5 rounded-lg">
                  {error}
                </p>
              )}

              {(
                [
                  { label: 'Full Name *', key: 'name', type: 'text', required: true },
                  { label: 'Email Address *', key: 'email', type: 'email', required: true },
                  {
                    label: editItem ? 'Change Password (leave blank to keep)' : 'Password *',
                    key: 'password',
                    type: 'password',
                    required: !editItem,
                  },
                ] as const
              ).map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
                  <input
                    type={type}
                    value={form[key] || ''}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    required={required}
                    className="w-full bg-slate-950 border border-slate-850 text-slate-200 placeholder-slate-650 rounded-lg px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
              ))}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as any }))}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-350 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                >
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-300 placeholder-slate-655 rounded-lg px-3.5 py-2 text-xs focus:outline-none resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600"
                />
                <span className="text-xs font-semibold text-slate-300">Account status is active</span>
              </label>

              <div className="flex gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-blue-655 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  {editItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
