import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../utils/api';
import { formatDateShort, getStatusColor } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchPosts = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 10 });
    if (statusFilter) params.append('status', statusFilter);
    if (searchQuery) params.append('search', searchQuery);
    api.get(`/posts/admin?${params}`)
      .then(res => {
        setPosts(res.data.posts || []);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const statusColors = { published: 'bg-green-100 text-green-700', draft: 'bg-yellow-100 text-yellow-700', archived: 'bg-gray-100 text-gray-600' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Posts</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total posts</p>
        </div>
        <Link to="/admin/posts/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold">
          <Plus size={16} /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearch} className="flex-1 min-w-48">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
            />
          </div>
        </form>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          {['', 'published', 'draft', 'archived'].map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <p className="font-semibold text-lg">No posts found</p>
            <Link to="/admin/posts/new" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Create your first post →</Link>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Title</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Author</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Category</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Views</th>
                  <th className="px-4 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map(post => (
                  <tr key={post._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        {post.featured && <span className="mt-0.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="Featured" />}
                        <div>
                          <p className="text-sm font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell text-sm text-gray-600">{post.author?.name}</td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {post.category && (
                        <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: post.category.color }}>
                          {post.category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge ${statusColors[post.status] || ''}`}>{post.status}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-xs text-gray-400">{formatDateShort(post.createdAt)}</td>
                    <td className="px-4 py-4 hidden md:table-cell text-sm text-gray-500">{post.views?.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {post.status === 'published' && (
                          <a href={`/post/${post.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={15} />
                          </a>
                        )}
                        <Link to={`/admin/posts/edit/${post._id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={15} />
                        </Link>
                        <button onClick={() => handleDelete(post._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border hover:border-blue-400 disabled:opacity-40">
                    <ChevronLeft size={15} />
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border hover:border-blue-400 disabled:opacity-40">
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
