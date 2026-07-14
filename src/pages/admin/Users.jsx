import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Check, Shield } from 'lucide-react';
import api from '../../utils/api';
import { formatDateShort } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'author', bio: '', isActive: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users').then(res => setUsers(res.data.users || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openModal = (u = null) => {
    setEditItem(u);
    setForm(u
      ? { name: u.name, email: u.email, password: '', role: u.role, bio: u.bio || '', isActive: u.isActive }
      : { name: '', email: '', password: '', role: 'author', bio: '', isActive: true }
    );
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      if (editItem && !payload.password) delete payload.password;
      if (editItem) await api.put(`/users/${editItem._id}`, payload);
      else await api.post('/users', payload);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser._id) return alert("You can't delete yourself!");
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const roleColors = { admin: 'bg-red-100 text-red-700', editor: 'bg-blue-100 text-blue-700', author: 'bg-green-100 text-green-700' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm">{users.length} registered users</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold">
          <Plus size={16} /> New User
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-48 shimmer rounded-xl" />)
        ) : users.map(u => (
          <div key={u._id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-black text-lg">{u.name?.[0]}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(u)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(u._id)} disabled={u._id === currentUser._id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`badge ${roleColors[u.role] || 'bg-gray-100 text-gray-600'}`}>
                <Shield size={10} className="mr-1" />
                {u.role}
              </span>
              <span className={`badge ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {u.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {u.bio && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{u.bio}</p>}
            <p className="text-xs text-gray-300 mt-3">Joined {formatDateShort(u.createdAt)}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="font-bold text-lg">{editItem ? 'Edit User' : 'New User'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              
              {[
                { label: 'Full Name *', key: 'name', type: 'text', required: true },
                { label: 'Email *', key: 'email', type: 'email', required: true },
                { label: editItem ? 'New Password (leave blank to keep)' : 'Password *', key: 'password', type: 'password', required: !editItem },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required={required}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4" />
                <span className="text-sm text-gray-700">Account is active</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={14} />}
                  {editItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
