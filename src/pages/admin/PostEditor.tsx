import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Image as ImageIcon, Tag, Star, Globe, FileText, Upload } from 'lucide-react';
import api from '../../utils/api';
import { Category } from '../../types';

interface PostForm {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
}

export const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [form, setForm] = useState<PostForm>({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: '',
    status: 'draft',
    featured: false,
    metaTitle: '',
    metaDescription: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'excerpt' | 'seo'>('content');

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data.categories || []))
      .catch(console.error);

    if (isEditing) {
      setLoading(true);
      api.get(`/posts/admin/${id}`)
        .then((res) => {
          const p = res.data.post;
          setForm({
            title: p.title || '',
            excerpt: p.excerpt || '',
            content: p.content || '',
            coverImage: p.coverImage || '',
            category: p.category?._id || '',
            tags: p.tags?.join(', ') || '',
            status: p.status || 'draft',
            featured: p.featured || false,
            metaTitle: p.metaTitle || '',
            metaDescription: p.metaDescription || '',
          });
        })
        .catch(() => setError('Failed to load post'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((f) => ({ ...f, [name]: val }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((f) => ({ ...f, [name]: checked }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm((f) => ({ ...f, coverImage: res.data.url }));
    } catch (err: any) {
      setError('Image upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent | null, statusOverride?: 'draft' | 'published' | 'archived') => {
    e?.preventDefault();
    if (!form.title.trim()) return setError('Title is required');
    if (!form.content.trim()) return setError('Content is required');
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        status: statusOverride || form.status,
      };
      if (isEditing) {
        await api.put(`/posts/${id}`, payload);
        setSuccess('Post updated successfully!');
      } else {
        const res = await api.post('/posts', payload);
        setSuccess('Post created successfully!');
        setTimeout(() => navigate(`/admin/posts/edit/${res.data.post._id}`), 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const API_BASE = (import.meta.env.VITE_API_URL as string)?.replace('/api', '') || 'http://localhost:5001';

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/posts" className="p-2 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-sans font-black text-white uppercase tracking-tight">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h1>
            <p className="text-xs text-slate-400">Configure content attributes and status metadata.</p>
          </div>
        </div>
        
        <div className="flex gap-2.5">
          <button
            onClick={() => handleSubmit(null, 'draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:border-slate-700 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
          >
            <FileText size={14} /> Save Draft
          </button>
          
          <button
            onClick={() => handleSubmit(null, 'published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-650 text-white rounded-lg hover:bg-blue-500 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Globe size={14} />
            )}
            {form.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-800/30 text-red-400 px-4 py-3 rounded-lg text-xs font-semibold">{error}</div>
      )}
      {success && (
        <div className="bg-emerald-950/20 border border-emerald-800/30 text-emerald-450 px-4 py-3 rounded-lg text-xs font-semibold">{success}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Title input */}
          <div className="bg-slate-900/40 rounded-xl border border-slate-850 p-5">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter post title..."
              className="w-full bg-transparent text-xl font-bold text-white placeholder-slate-700 border-0 outline-none focus:ring-0 resize-none font-sans"
            />
          </div>

          {/* Edit tabs */}
          <div className="bg-slate-900/40 rounded-xl border border-slate-850 overflow-hidden">
            <div className="border-b border-slate-850 flex bg-slate-950/30">
              {(
                [
                  { key: 'content', label: 'Content', icon: FileText },
                  { key: 'excerpt', label: 'Excerpt', icon: Eye },
                  { key: 'seo', label: 'SEO Config', icon: Globe },
                ] as const
              ).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-blue-600 text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-5 bg-slate-950/20">
              {activeTab === 'content' && (
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write your article content here... (HTML supported)"
                  rows={20}
                  className="w-full bg-slate-950 text-sm text-slate-300 placeholder-slate-650 border border-slate-850 rounded-lg p-4 outline-none focus:border-slate-700 font-mono"
                />
              )}
              
              {activeTab === 'excerpt' && (
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  placeholder="Provide a short synopsis of the article..."
                  rows={6}
                  className="w-full bg-slate-950 text-sm text-slate-300 placeholder-slate-650 border border-slate-850 rounded-lg p-4 outline-none focus:border-slate-700 resize-none"
                />
              )}
              
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Meta Title</label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={form.metaTitle}
                      onChange={handleChange}
                      placeholder="Custom SEO Title (Optional)"
                      className="w-full bg-slate-950 border border-slate-850 text-slate-300 placeholder-slate-650 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-slate-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Meta Description</label>
                    <textarea
                      name="metaDescription"
                      value={form.metaDescription}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Enter description search engine description..."
                      className="w-full bg-slate-950 border border-slate-850 text-slate-300 placeholder-slate-650 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-slate-700 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar settings columns */}
        <div className="space-y-6">
          {/* Status Panel */}
          <div className="bg-slate-900/40 rounded-xl border border-slate-850 p-5">
            <h3 className="font-sans font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe size={15} className="text-slate-500" />
              Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-slate-750"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer pt-2 select-none">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Star size={13} className="text-yellow-500 fill-current" />
                  Featured post flag
                </span>
              </label>
            </div>
          </div>

          {/* Cover image upload box */}
          <div className="bg-slate-900/40 rounded-xl border border-slate-850 p-5">
            <h3 className="font-sans font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <ImageIcon size={15} className="text-slate-500" />
              Cover Image
            </h3>
            
            {form.coverImage ? (
              <div className="relative">
                <img
                  src={form.coverImage.startsWith('http') ? form.coverImage : `${API_BASE}${form.coverImage}`}
                  alt="Cover Preview"
                  className="w-full h-32 object-cover rounded-lg mb-2 border border-slate-850"
                />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, coverImage: '' }))}
                  className="text-xs text-red-400 hover:text-red-300 font-bold transition-colors"
                >
                  Remove Cover
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/20 rounded-lg cursor-pointer transition-all">
                {uploadingImage ? (
                  <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Upload size={18} className="text-slate-555 mb-1.5" />
                    <span className="text-[11px] text-slate-500 font-semibold">Select image files</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
            
            <input
              type="text"
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="Or paste cover URL..."
              className="w-full bg-slate-950 border border-slate-850 text-slate-300 placeholder-slate-650 rounded-lg px-3 py-2 mt-3 text-xs focus:outline-none"
            />
          </div>

          {/* Categories / Tags panel */}
          <div className="bg-slate-900/40 rounded-xl border border-slate-850 p-5">
            <h3 className="font-sans font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <Tag size={15} className="text-slate-500" />
              Category & Tags
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-350 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-slate-750"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="cyber, audit, DPDP..."
                  className="w-full bg-slate-950 border border-slate-850 text-slate-300 placeholder-slate-655 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-slate-750"
                />
                
                {form.tags && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-950 text-blue-400 border border-slate-850 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
