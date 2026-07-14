import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PostCard, LoadingCard } from '../components/PostCard';
import api from '../utils/api';
import { Category, Post } from '../types';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data.categories || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    api.get(`/posts?search=${encodeURIComponent(query)}&limit=12`)
      .then((res) => setPosts(res.data.posts || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar categories={categories} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={13} /> Back to Home
          </Link>
          
          <div className="flex items-center gap-3.5 mb-8 border-b border-slate-850 pb-6">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-blue-500">
              <Search size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-sans font-black text-white">Search Results</h1>
              <p className="text-slate-450 text-xs mt-1">Showing search results matching &ldquo;<strong className="text-slate-200 font-semibold">{query}</strong>&rdquo;</p>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <LoadingCard key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/20 border border-slate-850 rounded-xl p-10">
              <Search size={42} className="mx-auto mb-4 text-slate-700 opacity-60" />
              <p className="text-slate-450 font-semibold text-sm">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">Check the spelling, try broader keywords or select a category widget.</p>
              <Link to="/" className="mt-5 inline-block text-xs font-bold uppercase tracking-wider text-blue-550 hover:text-blue-450">
                Browse all articles →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => <PostCard key={post._id} post={post} />)}
            </div>
          )}
        </main>
      </div>
      
      <Footer categories={categories} />
    </div>
  );
};

export default SearchPage;
