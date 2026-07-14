import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import api from '../../utils/api';

const COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#06b6d4','#10b981','#dc2626'];
const ICONS = ['📰','⚔️','🔓','🐛','🦠','🔒','💰','🎯','🤖','🌐','💻','🔍','⚡','🛡️','🔐'];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', color: '#3b82f6', icon: '📰', isActive: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = () => {
    setLoading(true);
    api.get('/categories/all').then(res => setCategories(res.data.categories || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openModal = (cat = null) => {
    setEditItem(cat);
    setForm(cat ? {
      name: cat.name, slug: cat.slug, description: cat.description || '',
      color: cat.color || '#3b82f6', icon: cat.icon || '📰', isActive: cat.isActive
    } : { name: '', slug: '', description: '', color: '#3b82f6', icon: '📰', isActive: true });
    setError('');
    setShowModal(true);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setForm(f => ({ ...f, name, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editItem) await api.put(`/categories/${editItem._id}`, form);
      else await api.post('/categories', form);
      setShowModal(false);
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold">
          <Plus size={16} /> New Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Category', 'Slug', 'Description', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map(cat => (
                <tr key={cat._id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: cat.color + '20' }}>
                        {cat.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{cat.name}</p>
                        <div className="w-3 h-3 rounded-full inline-block mt-0.5" style={{ backgroundColor: cat.color }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500 font-mono">{cat.slug}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{cat.description || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openModal(cat)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(cat._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-lg">{editItem ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={form.name} onChange={handleNameChange} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <div className="flex flex-wrap gap-1">
                    {COLORS.map(c => (
                      <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                        className="w-6 h-6 rounded-full border-2 transition-all"
                        style={{ backgroundColor: c, borderColor: form.color === c ? '#1d4ed8' : 'transparent' }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className="flex flex-wrap gap-1">
                  {ICONS.map(icon => (
                    <button key={icon} type="button" onClick={() => setForm(f => ({ ...f, icon }))}
                      className={`text-xl p-1 rounded ${form.icon === icon ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4" />
                <span className="text-sm text-gray-700">Active (visible on site)</span>
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
