import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import api from '../../utils/api';
import { Category } from '../../types';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#dc2626'];
const ICONS = ['📰', '⚔️', '🔓', '🐛', '🦠', '🔒', '💰', '🎯', '🤖', '🌐', '💻', '🔍', '⚡', '🛡️', '🔐'];

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
}

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>({
    name: '',
    slug: '',
    description: '',
    color: '#3b82f6',
    icon: '📰',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories/all')
      .then((res) => setCategories(res.data.categories || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (cat: Category | null = null) => {
    setEditItem(cat);
    setForm(
      cat
        ? {
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            color: cat.color || '#3b82f6',
            icon: cat.icon || '📰',
            isActive: cat.isActive,
          }
        : {
            name: '',
            slug: '',
            description: '',
            color: '#3b82f6',
            icon: '📰',
            isActive: true,
          }
    );
    setError('');
    setShowModal(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setForm((f) => ({ ...f, name, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editItem) {
        await api.put(`/categories/${editItem._id}`, form);
      } else {
        await api.post('/categories', form);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Categories Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-sans font-black text-white uppercase tracking-tight">Categories</h1>
          <p className="text-slate-400 text-xs mt-1">{categories.length} categories defined</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-500/10"
        >
          <Plus size={15} /> New Category
        </button>
      </div>

      {/* Table grid */}
      <div className="bg-slate-900/40 rounded-xl border border-slate-850 overflow-hidden shadow-md">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-850 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Category</th>
                  <th className="px-5 py-4">Slug</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-6 py-4 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-xl border border-slate-850"
                          style={{ backgroundColor: (cat.color || '#3b82f6') + '15' }}
                        >
                          {cat.icon || '📰'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-200">{cat.name}</p>
                          <div className="w-3.5 h-1 rounded-full mt-1.5" style={{ backgroundColor: cat.color || '#3b82f6' }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4.5 text-xs text-slate-400 font-mono">{cat.slug}</td>
                    <td className="px-5 py-4.5 text-xs text-slate-400 max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="px-5 py-4.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          cat.isActive
                            ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20'
                            : 'bg-slate-950 text-slate-500 border border-slate-850'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openModal(cat)}
                          className="p-1.5 text-slate-550 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-1.5 text-slate-550 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="font-sans font-black text-white uppercase text-sm tracking-wider">
                {editItem ? 'Edit Category' : 'New Category'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <p className="text-xs font-semibold text-red-400 bg-red-950/20 border border-red-800/30 px-3.5 py-2.5 rounded-lg">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleNameChange}
                    required
                    className="w-full bg-slate-950 border border-slate-850 text-slate-200 placeholder-slate-650 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-855 text-slate-350 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Color Picker</label>
                  <div className="flex flex-wrap gap-1.5">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, color: c }))}
                        className="w-6.5 h-6.5 rounded-full border-2 transition-all hover:scale-110"
                        style={{
                          backgroundColor: c,
                          borderColor: form.color === c ? '#3b82f6' : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Icon</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 rounded-lg border border-slate-855">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, icon }))}
                      className={`text-xl p-1 rounded-md transition-colors ${
                        form.icon === icon
                          ? 'bg-blue-600/30 ring-1 ring-blue-500'
                          : 'hover:bg-slate-900'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-300 placeholder-slate-655 rounded-lg px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600"
                />
                <span className="text-xs font-semibold text-slate-300">Active status (visible to visitors)</span>
              </label>

              <div className="flex gap-3 pt-2 border-t border-slate-850">
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
                  className="flex-1 py-2.5 bg-blue-650 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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

export default AdminCategories;
