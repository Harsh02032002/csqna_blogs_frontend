import { Link } from 'react-router-dom';
import { Clock, Eye, Tag } from 'lucide-react';
import { formatDateShort, truncate } from '../utils/helpers';

export function PostCard({ post, featured = false }) {
  const API = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <article className={`post-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 ${featured ? 'md:flex' : ''}`}>
      {/* Cover Image */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 ${featured ? 'md:w-2/5 md:flex-shrink-0' : 'h-48'}`}>
        {post.coverImage ? (
          <img
            src={post.coverImage.startsWith('http') ? post.coverImage : `${API}${post.coverImage}`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`flex items-center justify-center ${featured ? 'h-52 md:h-full' : 'h-48'}`}>
            <span className="text-6xl opacity-50">{post.category?.color ? '🔒' : '📰'}</span>
          </div>
        )}
        {post.featured && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded font-semibold">
            FEATURED
          </div>
        )}
        {post.category && (
          <div className="absolute top-2 right-2">
            <span
              className="text-white text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: post.category.color || '#3b82f6' }}
            >
              {post.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/post/${post.slug}`} className="group">
          <h2 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2 ${featured ? 'text-xl' : 'text-base'}`}>
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
          {post.excerpt || truncate(post.content, 120)}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
          <span className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-bold text-xs">{post.author?.name?.[0]}</span>
            </div>
            {post.author?.name}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {formatDateShort(post.publishedAt || post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {post.views?.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.readTime}m read
          </span>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="flex items-center gap-0.5 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                <Tag size={9} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function PostCardSmall({ post }) {
  const API = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <Link to={`/post/${post.slug}`} className="flex gap-3 group py-3 border-b border-gray-100 last:border-0">
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-900 to-blue-600">
        {post.coverImage && (
          <img src={post.coverImage.startsWith('http') ? post.coverImage : `${API}${post.coverImage}`} alt={post.title} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
          {post.title}
        </h4>
        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <Clock size={10} />
          {formatDateShort(post.publishedAt || post.createdAt)}
        </div>
      </div>
    </Link>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <div className="h-48 shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-4 shimmer rounded w-3/4" />
        <div className="h-4 shimmer rounded w-full" />
        <div className="h-4 shimmer rounded w-1/2" />
        <div className="h-3 shimmer rounded w-1/3 mt-4" />
      </div>
    </div>
  );
}
