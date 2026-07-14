import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PostCard, LoadingCard } from '../components/PostCard';
import api from '../utils/api';
import { Category, Post } from '../types';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    Promise.all([
      api.get(`/categories/${slug}`),
      api.get('/categories'),
    ]).then(([catRes, allCatRes]) => {
      setCategory(catRes.data.category);
      setCategories(allCatRes.data.categories || []);
      setPage(1); // Reset page on category change
    }).catch(console.error);
  }, [slug]);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    api.get(`/posts?category=${category._id}&page=${page}&limit=9`)
      .then((res) => {
        setPosts(res.data.posts || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, page]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar categories={categories} />

        {/* Category header */}
        {category && (
          <div className="relative border-b border-slate-800 py-12 px-4 overflow-hidden">
            <div className="absolute inset-0 opacity-15 blur-3xl pointer-events-none" style={{ background: `radial-gradient(circle, ${category.color || '#3b82f6'} 0%, transparent 70%)` }} />
            <div className="max-w-7xl mx-auto relative z-10">
              <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white mb-4 transition-colors">
                <ArrowLeft size={13} /> Back to Home
              </Link>
              <div className="flex items-center gap-5">
                <span className="text-5xl p-3 bg-slate-900 border border-slate-800 rounded-2xl">{category.icon || '📰'}</span>
                <div>
                  <h1 className="text-3xl font-sans font-black text-white">{category.name}</h1>
                  <p className="text-slate-400 mt-2 text-sm max-w-2xl">{category.description || `Latest ${category.name} news, threat disclosures, and analytics.`}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <LoadingCard key={i} />)}
            </div>
          ) : (
            <>
              {posts.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/25 border border-slate-850 rounded-xl p-10">
                  <p className="text-slate-400 font-semibold mb-3">No articles found in this category yet.</p>
                  <Link to="/" className="text-xs font-bold uppercase tracking-wider text-blue-500 hover:text-blue-450 hover:underline">
                    Browse all stories →
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map(post => <PostCard key={post._id} post={post} />)}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-lg text-xs font-bold uppercase text-slate-355 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    ← Prev
                  </button>
                  <span className="px-4 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs font-bold text-slate-400">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-lg text-xs font-bold uppercase text-slate-355 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer categories={categories} />
    </div>
  );
};

export default CategoryPage;
