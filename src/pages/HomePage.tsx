import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, AlertTriangle, Newspaper } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PostCard, PostCardSmall, LoadingCard } from '../components/PostCard';
import api from '../utils/api';
import { Category, Post } from '../types';

export const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/posts?featured=true&limit=3'),
    ]).then(([catRes, featRes]) => {
      setCategories(catRes.data.categories || []);
      setFeaturedPosts(featRes.data.posts || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const catParam = activeCategory !== 'all' ? `&category=${activeCategory}` : '';
    api.get(`/posts?page=${page}&limit=9${catParam}`)
      .then(res => {
        setPosts(res.data.posts || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar categories={categories} />

        {/* Breaking News Ticker */}
        <div className="bg-blue-600/90 border-y border-blue-500/20 text-white py-2 overflow-hidden shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
            <span className="font-sans font-black text-[10px] tracking-widest bg-white text-blue-700 px-2.5 py-1 rounded-full flex-shrink-0 shadow-sm">
              ALERT
            </span>
            <div className="overflow-hidden flex-1 relative h-5">
              <div className="ticker-text text-sm font-semibold absolute top-0 flex gap-12">
                {featuredPosts.length > 0
                  ? featuredPosts.map((p) => `⚡ ${p.title}`).join('     •     ')
                  : '⚡ Welcome to CSQNA — Your Cybersecurity Blog Hub!'}
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Featured Stories */}
          {featuredPosts.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center gap-2.5 mb-6">
                <TrendingUp size={20} className="text-blue-500" />
                <h2 className="text-xl font-bold font-sans tracking-tight text-white uppercase">Featured Stories</h2>
                <div className="flex-1 h-px bg-slate-800 ml-2" />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredPosts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2.5 mb-8 border-b border-slate-850 pb-6">
            <button
              onClick={() => { setActiveCategory('all'); setPage(1); }}
              className={`px-4.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => { setActiveCategory(cat._id); setPage(1); }}
                className={`px-4.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all border ${
                  activeCategory === cat._id
                    ? 'text-white border-transparent'
                    : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
                style={activeCategory === cat._id ? { backgroundColor: cat.color || '#3b82f6' } : {}}
              >
                <span className="mr-1">{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-sans tracking-tight text-white uppercase flex items-center gap-2">
                  <Newspaper size={18} className="text-blue-500" />
                  Latest Articles
                </h2>
              </div>

              {loading ? (
                <div className="grid gap-6">
                  {[1, 2, 3].map(i => <LoadingCard key={i} />)}
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-slate-900/40 rounded-xl p-16 text-center border border-slate-850">
                  <AlertTriangle size={42} className="mx-auto mb-4 text-slate-600 opacity-60" />
                  <p className="text-slate-400 font-semibold">No posts found in this category yet.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {posts.map(post => <PostCard key={post._id} post={post} />)}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2.5 pt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-lg text-xs font-bold tracking-wider uppercase text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                        page === p
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-lg text-xs font-bold tracking-wider uppercase text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Categories Widget */}
              <div className="bg-slate-900/40 rounded-xl p-5 border border-slate-850">
                <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield size={15} className="text-blue-500" />
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/category/${cat.slug}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-850/60 transition-colors group"
                    >
                      <span className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-white">
                        <span>{cat.icon || '📰'}</span>
                        {cat.name}
                      </span>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || '#3b82f6' }} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trending Widget */}
              <div className="bg-slate-900/40 rounded-xl p-5 border border-slate-850">
                <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp size={15} className="text-blue-550" />
                  Trending Articles
                </h3>
                <div className="divide-y divide-slate-850">
                  {featuredPosts.map((post, i) => (
                    <div key={post._id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                      <span className="text-xl font-sans font-black text-slate-800 leading-none flex-shrink-0 w-6">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <PostCardSmall post={post} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-6 border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
                <h3 className="font-sans font-bold text-white mb-2">CSQNA Updates</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">Get high-fidelity vulnerability updates &amp; compliance guides delivered direct.</p>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  className="w-full bg-slate-950/80 text-slate-200 placeholder-slate-650 text-xs px-3 py-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 mb-2.5 transition-all"
                />
                <button className="w-full bg-blue-600 text-white font-bold text-xs py-2.5 rounded-lg hover:bg-blue-500 transition-colors uppercase tracking-wider">
                  Subscribe
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <Footer categories={categories} />
    </div>
  );
};

export default HomePage;
