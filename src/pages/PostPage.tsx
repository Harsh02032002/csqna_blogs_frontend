import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Eye, Tag, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PostCardSmall } from '../components/PostCard';
import api from '../utils/api';
import { formatDate } from '../utils/helpers';
import { Category, Post } from '../types';

export const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const API = (import.meta.env.VITE_API_URL as string)?.replace('/api', '') || 'http://localhost:5001';

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/posts/${slug}`),
      api.get('/categories'),
    ]).then(([postRes, catRes]) => {
      setPost(postRes.data.post);
      setCategories(catRes.data.categories || []);
      
      const categoryId = postRes.data.post?.category?._id;
      if (categoryId) {
        return api.get(`/posts?category=${categoryId}&limit=5`);
      }
      return null;
    }).then((relRes: any) => {
      if (relRes) {
        setRelated(relRes.data.posts?.filter((p: Post) => p.slug !== slug) || []);
      }
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
        <span className="text-sm font-semibold text-slate-400">Loading article...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <div>
          <Navbar categories={categories} />
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <h1 className="text-3xl font-bold font-sans text-white mb-4">Article Not Found</h1>
            <Link to="/" className="text-blue-500 hover:text-blue-450 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
        <Footer categories={categories} />
      </div>
    );
  }

  const coverUrl = post.coverImage
    ? (post.coverImage.startsWith('http') ? post.coverImage : `${API}${post.coverImage}`)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar categories={categories} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Article */}
            <article className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-500 hover:text-blue-400 transition-colors mb-6">
                <ArrowLeft size={14} /> Back to Home
              </Link>

              {/* Category badge */}
              {post.category && (
                <div className="mb-4">
                  <Link to={`/category/${post.category.slug}`}>
                    <span
                      className="inline-block text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.icon} {post.category.name}
                    </span>
                  </Link>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-sans font-black text-white leading-tight mb-6">
                {post.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 mb-8 pb-6 border-b border-slate-850">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <span className="text-blue-400 font-bold text-sm">{post.author?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 text-sm leading-tight">{post.author?.name}</div>
                    <div className="text-[10px] text-slate-500">{post.author?.bio?.slice(0, 50)}</div>
                  </div>
                </div>
                <div className="h-4 w-px bg-slate-800 hidden sm:block" />
                <span className="flex items-center gap-1.5"><Clock size={13} /> {formatDate(post.publishedAt || post.createdAt)}</span>
                <span className="flex items-center gap-1.5"><Eye size={13} /> {post.views?.toLocaleString()} views</span>
                <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime} min read</span>

                {/* Share buttons */}
                <div className="ml-auto flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                  <button
                    onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
                    className="flex items-center gap-1 text-[11px] font-bold uppercase bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg hover:border-blue-500/35 hover:text-white transition-all"
                  >
                    <Share2 size={12} /> Share
                  </button>
                  <button className="flex items-center gap-1 text-[11px] font-bold uppercase bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg hover:border-slate-700 hover:text-white transition-all">
                    <Bookmark size={12} /> Save
                  </button>
                </div>
              </div>

              {/* Cover image */}
              {coverUrl && (
                <div className="mb-8 rounded-xl overflow-hidden border border-slate-850 shadow-lg">
                  <img src={coverUrl} alt={post.title} className="w-full h-80 object-cover" />
                </div>
              )}

              {/* Content body */}
              <div
                className="article-content text-slate-300 text-[15px] leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="mt-10 pt-6 border-t border-slate-850">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1.5 text-[11px] bg-slate-900 border border-slate-850 text-slate-400 px-3.5 py-1.5 rounded-full">
                        <Tag size={11} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {related.length > 0 && (
                <div className="bg-slate-900/40 rounded-xl p-5 border border-slate-850">
                  <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wider mb-4">Related Articles</h3>
                  <div className="divide-y divide-slate-850">
                    {related.slice(0, 4).map(p => (
                      <div key={p._id} className="py-2.5 first:pt-0 last:pb-0">
                        <PostCardSmall post={p} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-slate-900/40 rounded-xl p-5 border border-slate-850">
                <h3 className="font-sans font-bold text-white text-sm uppercase tracking-wider mb-4">Browse Categories</h3>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <Link
                      key={cat._id}
                      to={`/category/${cat.slug}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-850/60 transition-colors text-sm text-slate-400 hover:text-white"
                    >
                      <span>{cat.icon} {cat.name}</span>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <Footer categories={categories} />
    </div>
  );
};

export default PostPage;
