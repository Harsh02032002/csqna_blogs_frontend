import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PostCard, LoadingCard } from '../components/PostCard';
import api from '../utils/api';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.categories || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    api.get(`/posts?search=${encodeURIComponent(query)}&limit=12`)
      .then(res => setPosts(res.data.posts || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar categories={categories} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-5">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <Search size={24} className="text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
            <p className="text-gray-500 text-sm">Showing results for "<strong>{query}</strong>"</p>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => <LoadingCard key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No results found for "{query}"</p>
            <p className="text-sm mt-2">Try different keywords or browse categories</p>
            <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">Browse all articles →</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        )}
      </main>
      <Footer categories={categories} />
    </div>
  );
}
