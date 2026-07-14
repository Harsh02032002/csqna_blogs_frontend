import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, Eye, Edit3, Archive, TrendingUp, Plus, Clock } from 'lucide-react';
import api from '../../utils/api';
import { formatDateShort, getStatusColor } from '../../utils/helpers';

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <p className="text-3xl font-black text-gray-900">{value?.toLocaleString()}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts/stats')
      .then(res => {
        setStats(res.data.stats);
        setRecent(res.data.recent || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="h-28 shimmer rounded-xl" />)}
        </div>
        <div className="h-64 shimmer rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name}! 👋</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Posts" value={stats?.total} icon={FileText} color="bg-blue-50 text-blue-600" />
        <StatCard label="Published" value={stats?.published} icon={TrendingUp} color="bg-green-50 text-green-600" />
        <StatCard label="Drafts" value={stats?.draft} icon={Edit3} color="bg-yellow-50 text-yellow-600" />
        <StatCard label="Total Views" value={stats?.totalViews} icon={Eye} color="bg-purple-50 text-purple-600" sub="Across all posts" />
      </div>

      {/* Recent posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            Recent Posts
          </h2>
          <Link to="/admin/posts" className="text-sm text-blue-600 hover:underline font-medium">
            View All →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recent.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <FileText size={32} className="mx-auto mb-2 opacity-30" />
              <p>No posts yet.</p>
              <Link to="/admin/posts/new" className="text-blue-600 text-sm hover:underline mt-1 inline-block">
                Create your first post →
              </Link>
            </div>
          ) : (
            recent.map(post => (
              <div key={post._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <Link to={`/admin/posts/edit/${post._id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate block">
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{post.author?.name}</span>
                    <span>{post.category?.name}</span>
                    <span>{formatDateShort(post.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${getStatusColor(post.status)}`}>{post.status}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-0.5"><Eye size={11} />{post.views}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
