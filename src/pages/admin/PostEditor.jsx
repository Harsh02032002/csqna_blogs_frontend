import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, ArrowLeft, Eye, Image, Tag, Star, Globe, FileText, Upload } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const [form, setForm] = useState({
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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.categories || [])).catch(console.error);
    if (isEditing) {
      setLoading(true);
      api.get(`/posts/admin/${id}`)
        .then(res => {
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
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(f => ({ ...f, coverImage: res.data.url }));
    } catch (err) {
      setError('Image upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e, statusOverride) => {
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
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/posts" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900">{isEditing ? 'Edit Post' : 'New Post'}</h1>
            <p className="text-xs text-gray-400">Fill in the details and save your post</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSubmit(null, 'draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
          >
            <FileText size={14} /> Save Draft
          </button>
          <button
            onClick={() => handleSubmit(null, 'published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Globe size={14} />}
            {form.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Post title..."
              className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 border-0 outline-none resize-none"
            />
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 flex">
              {[
                { key: 'content', label: 'Content', icon: FileText },
                { key: 'excerpt', label: 'Excerpt', icon: Eye },
                { key: 'seo', label: 'SEO', icon: Globe },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === 'content' && (
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write your article content here... (HTML supported)"
                  rows={20}
                  className="w-full text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-400 resize-vertical font-mono"
                />
              )}
              {activeTab === 'excerpt' && (
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  placeholder="Short summary of the post (shown in cards and search results)..."
                  rows={5}
                  className="w-full text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-400 resize-none"
                />
              )}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={form.metaTitle}
                      onChange={handleChange}
                      placeholder="SEO title (defaults to post title)"
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                    <textarea
                      name="metaDescription"
                      value={form.metaDescription}
                      onChange={handleChange}
                      rows={3}
                      placeholder="SEO description..."
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-5">
          {/* Publish settings */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Globe size={16} /> Publish</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1"><Star size={13} className="text-yellow-500" /> Featured post</span>
              </label>
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Image size={16} /> Cover Image</h3>
            {form.coverImage ? (
              <div className="relative">
                <img
                  src={form.coverImage.startsWith('http') ? form.coverImage : `${API_BASE}${form.coverImage}`}
                  alt="Cover"
                  className="w-full h-36 object-cover rounded-lg mb-2"
                />
                <button onClick={() => setForm(f => ({ ...f, coverImage: '' }))} className="text-xs text-red-500 hover:underline">Remove image</button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                {uploadingImage ? (
                  <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Click to upload image</span>
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
              placeholder="Or paste image URL..."
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mt-2 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Category & Tags */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Tag size={16} /> Category & Tags</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="cyber, security, hacking..."
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
                />
                {form.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                      <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">#{tag}</span>
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
}
