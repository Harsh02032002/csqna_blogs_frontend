import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, Eye, Edit3, TrendingUp, Plus, Clock } from 'lucide-react';
import api from '../../utils/api';
import { formatDateShort, getStatusColor } from '../../utils/helpers';
import { Post, DashboardStats } from '../../types';

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: React.ComponentType<{ size: number }>;
  color: string;
  sub?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-3xl font-black text-white">{(value ?? 0).toLocaleString()}</p>
    {sub && <p className="text-[10px] text-slate-500 font-semibold mt-1.5">{sub}</p>}
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts/stats')
      .then((res) => {
        setStats(res.data.stats);
        setRecent(res.data.recent || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 shimmer rounded-xl" />)}
        </div>
        <div className="h-64 shimmer rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-sans font-black text-white uppercase tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-xs mt-1">Welcome back, <span className="font-semibold text-slate-200">{user?.name}</span>! 👋</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-500/10 self-start sm:self-auto"
        >
          <Plus size={15} />
          New Post
        </Link>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Posts" value={stats?.total} icon={FileText} color="bg-blue-500/10 text-blue-400" />
        <StatCard label="Published" value={stats?.published} icon={TrendingUp} color="bg-emerald-500/10 text-emerald-400" />
        <StatCard label="Drafts" value={stats?.draft} icon={Edit3} color="bg-amber-500/10 text-amber-400" />
        <StatCard label="Total Views" value={stats?.totalViews} icon={Eye} color="bg-indigo-500/10 text-indigo-400" sub="All-time view count" />
      </div>

      {/* Recent Posts Area */}
      <div className="bg-slate-900/40 rounded-xl shadow-md border border-slate-850 overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-850 flex items-center justify-between">
          <h2 className="font-sans font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
            <Clock size={15} className="text-slate-500" />
            Recent Posts
          </h2>
          <Link to="/admin/posts" className="text-xs text-blue-450 hover:text-blue-400 hover:underline font-bold uppercase tracking-wider">
            View All →
          </Link>
        </div>
        
        <div className="divide-y divide-slate-850">
          {recent.length === 0 ? (
            <div className="p-16 text-center">
              <FileText size={36} className="mx-auto mb-3 text-slate-700 opacity-60" />
              <p className="text-slate-450 font-semibold text-sm">No posts created yet.</p>
              <Link to="/admin/posts/new" className="text-xs font-bold uppercase tracking-wider text-blue-500 hover:underline mt-2 inline-block">
                Create your first article →
              </Link>
            </div>
          ) : (
            recent.map((post) => (
              <div key={post._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4.5 hover:bg-slate-900/10 transition-colors">
                <div className="flex-1 min-w-0">
                  <Link to={`/admin/posts/edit/${post._id}`} className="text-sm font-semibold text-slate-200 hover:text-blue-400 transition-colors truncate block">
                    {post.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-3.5 mt-1 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                    <span className="text-slate-400">{post.author?.name}</span>
                    <span className="text-slate-600">•</span>
                    <span>{post.category?.name || 'Uncategorized'}</span>
                    <span className="text-slate-600">•</span>
                    <span>{formatDateShort(post.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 min-w-[50px] justify-end">
                    <Eye size={12} />
                    {post.views}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
