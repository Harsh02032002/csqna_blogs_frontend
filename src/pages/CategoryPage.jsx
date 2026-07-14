import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PostCard, LoadingCard } from '../components/PostCard';
import api from '../utils/api';

export default function CategoryPage() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
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
    }).catch(console.error);
  }, [slug]);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    api.get(`/posts?category=${category._id}&page=${page}&limit=9`)
      .then(res => {
        setPosts(res.data.posts || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar categories={categories} />

      {/* Category header */}
      {category && (
        <div className="text-white py-10 px-4" style={{ backgroundColor: category.color }}>
          <div className="max-w-7xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{category.icon}</span>
              <div>
                <h1 className="text-3xl font-black">{category.name}</h1>
                <p className="text-white/80 mt-1">{category.description || `Latest ${category.name} news and analysis`}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => <LoadingCard key={i} />)}
          </div>
        ) : (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">No articles found in this category yet.</p>
                <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">Browse all stories →</Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map(post => <PostCard key={post._id} post={post} />)}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white border rounded-lg text-sm disabled:opacity-40">← Prev</button>
                <span className="px-4 py-2 bg-white border rounded-lg text-sm">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-white border rounded-lg text-sm disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer categories={categories} />
    </div>
  );
}
