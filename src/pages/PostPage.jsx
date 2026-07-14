import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Eye, Tag, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PostCardSmall } from '../components/PostCard';
import api from '../utils/api';
import { formatDate } from '../utils/helpers';

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/posts/${slug}`),
      api.get('/categories'),
    ]).then(([postRes, catRes]) => {
      setPost(postRes.data.post);
      setCategories(catRes.data.categories || []);
      // Load related
      if (postRes.data.post?.category?._id) {
        return api.get(`/posts?category=${postRes.data.post.category._id}&limit=5`);
      }
    }).then(relRes => {
      if (relRes) setRelated(relRes.data.posts?.filter(p => p.slug !== slug) || []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-1 bg-blue-600 animate-pulse" />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          Loading article...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar categories={categories} />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-700 mb-3">Article Not Found</h1>
          <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
        <Footer categories={categories} />
      </div>
    );
  }

  const coverUrl = post.coverImage
    ? (post.coverImage.startsWith('http') ? post.coverImage : `${API}${post.coverImage}`)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar categories={categories} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Article */}
          <article className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-5">
              <ArrowLeft size={14} /> Back to Home
            </Link>

            {/* Category badge */}
            {post.category && (
              <div className="mb-3">
                <Link to={`/category/${post.category.slug}`}>
                  <span
                    className="inline-block text-white text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ backgroundColor: post.category.color }}
                  >
                    {post.category.icon} {post.category.name}
                  </span>
                </Link>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-bold">{post.author?.name?.[0]}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-700">{post.author?.name}</div>
                  <div className="text-xs text-gray-400">{post.author?.bio?.slice(0, 50)}</div>
                </div>
              </div>
              <span className="flex items-center gap-1"><Clock size={13} /> {formatDate(post.publishedAt || post.createdAt)}</span>
              <span className="flex items-center gap-1"><Eye size={13} /> {post.views?.toLocaleString()} views</span>
              <span className="flex items-center gap-1"><Clock size={13} /> {post.readTime} min read</span>

              {/* Share buttons */}
              <div className="ml-auto flex gap-2">
                <button onClick={() => navigator.share?.({ title: post.title, url: window.location.href })} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  <Share2 size={12} /> Share
                </button>
                <button className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                  <Bookmark size={12} /> Save
                </button>
              </div>
            </div>

            {/* Cover image */}
            {coverUrl && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <img src={coverUrl} alt={post.title} className="w-full h-72 object-cover" />
              </div>
            )}

            {/* Content */}
            <div
              className="article-content text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      <Tag size={11} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="sidebar-sticky space-y-6">
            {related.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Related Articles</h3>
                {related.slice(0, 4).map(p => <PostCardSmall key={p._id} post={p} />)}
              </div>
            )}

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Browse Categories</h3>
              {categories.map(cat => (
                <Link key={cat._id} to={`/category/${cat.slug}`} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:text-blue-600 transition-colors text-sm">
                  <span>{cat.icon} {cat.name}</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <Footer categories={categories} />
    </div>
  );
}
