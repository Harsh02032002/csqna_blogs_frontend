import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PostCard, PostCardSmall, LoadingCard } from '../components/PostCard';
import api from '../utils/api';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [categories, setCategories] = useState([]);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar categories={categories} />

      {/* Breaking News Ticker */}
      <div className="bg-red-600 text-white py-1.5 overflow-hidden">
        <div className="flex items-center gap-3 px-4">
          <span className="font-bold text-xs bg-white text-red-600 px-2 py-0.5 rounded flex-shrink-0">BREAKING</span>
          <div className="overflow-hidden flex-1">
            <div className="ticker-text text-sm">
              {featuredPosts.map(p => `⚡ ${p.title}`).join('  •  ') || '⚡ Welcome to CSQNA — Your Cybersecurity Blog Hub!'}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={20} className="text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">Featured Stories</h2>
              <div className="flex-1 h-px bg-gray-200 ml-2" />
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {featuredPosts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setActiveCategory('all'); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:border-blue-300'}`}
          >
            All Stories
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => { setActiveCategory(cat._id); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat._id ? 'text-white' : 'bg-white text-gray-600 border hover:border-blue-300'}`}
              style={activeCategory === cat._id ? { backgroundColor: cat.color } : {}}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
            </div>

            {loading ? (
              <div className="grid gap-5">
                {[1,2,3,4].map(i => <LoadingCard key={i} />)}
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-xl p-16 text-center text-gray-400">
                <AlertTriangle size={40} className="mx-auto mb-3 opacity-30" />
                <p>No posts found in this category yet.</p>
              </div>
            ) : (
              <div className="grid gap-5">
                {posts.map(post => <PostCard key={post._id} post={post} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border rounded-lg text-sm font-medium disabled:opacity-40 hover:border-blue-400 transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-blue-600 text-white' : 'bg-white border hover:border-blue-400'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border rounded-lg text-sm font-medium disabled:opacity-40 hover:border-blue-400 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="sidebar-sticky space-y-6">
            {/* Categories widget */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={16} className="text-blue-600" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat.slug}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="flex items-center gap-2 text-sm text-gray-700 group-hover:text-blue-600">
                      <span>{cat.icon}</span>
                      {cat.name}
                    </span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending widget */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-red-500" />
                Trending Now
              </h3>
              <div>
                {featuredPosts.map((post, i) => (
                  <div key={post._id} className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
                    <span className="text-2xl font-black text-gray-100 leading-none flex-shrink-0 w-8">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <PostCardSmall post={post} />
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 text-white">
              <h3 className="font-bold text-lg mb-2">Stay Informed</h3>
              <p className="text-blue-200 text-sm mb-4">Get the latest cybersecurity news delivered to your inbox.</p>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-white/20 text-white placeholder-blue-300 text-sm px-3 py-2 rounded-lg border border-white/30 focus:outline-none focus:border-white mb-2"
              />
              <button className="w-full bg-white text-blue-700 font-semibold text-sm py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Subscribe
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer categories={categories} />
    </div>
  );
}
