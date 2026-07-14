import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../utils/api';
import { formatDateShort, getStatusColor } from '../../utils/helpers';
import { Post } from '../../types';

export const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (statusFilter) params.append('status', statusFilter);
    if (searchQuery) params.append('search', searchQuery);
    
    api.get(`/posts/admin?${params}`)
      .then((res) => {
        setPosts(res.data.posts || []);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-sans font-black text-white uppercase tracking-tight">Posts</h1>
          <p className="text-slate-400 text-xs mt-1">{total} total articles found</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-500/10 self-start sm:self-auto"
        >
          <Plus size={15} /> New Post
        </Link>
      </div>

      {/* Filters bar */}
      <div className="bg-slate-900/40 rounded-xl border border-slate-850 p-4 flex flex-wrap gap-4 items-center">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search posts by title..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </form>
        
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={14} className="text-slate-500 mr-1" />
          {['', 'published', 'draft', 'archived'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                statusFilter === s
                  ? 'bg-blue-650 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {s === '' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table card */}
      <div className="bg-slate-900/40 rounded-xl border border-slate-850 overflow-hidden shadow-md">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-semibold text-slate-450 text-sm">No articles found matching filters.</p>
            <Link to="/admin/posts/new" className="text-xs font-bold uppercase tracking-wider text-blue-500 hover:underline mt-2 inline-block">
              Create your first post →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-850 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-4 py-4 hidden md:table-cell">Author</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Category</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Date</th>
                  <th className="px-4 py-4 hidden md:table-cell">Views</th>
                  <th className="px-6 py-4 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2.5">
                        {post.featured && (
                          <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" title="Featured" />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-200 line-clamp-1">{post.title}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell text-xs font-semibold text-slate-400">{post.author?.name}</td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {post.category && (
                        <span
                          className="text-[10px] px-2.5 py-0.5 rounded-full font-bold text-white uppercase tracking-wider"
                          style={{ backgroundColor: post.category.color }}
                        >
                          {post.category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-xs text-slate-500 font-semibold">{formatDateShort(post.createdAt)}</td>
                    <td className="px-4 py-4 hidden md:table-cell text-xs font-bold text-slate-400">{post.views?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {post.status === 'published' && (
                          <a
                            href={`/post/${post.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Eye size={15} />
                          </a>
                        )}
                        <Link
                          to={`/admin/posts/edit/${post._id}`}
                          className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4.5 border-t border-slate-850 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-semibold">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-lg text-slate-400 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-lg text-slate-400 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPosts;
