import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Tag } from 'lucide-react';
import { Post } from '../types';
import { formatDateShort, truncate } from '../utils/helpers';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => {
  const API = (import.meta.env.VITE_API_URL as string)?.replace('/api', '') || 'http://localhost:5001';

  return (
    <article className={`post-card bg-slate-900/50 rounded-xl overflow-hidden shadow-md border border-slate-800 hover:border-slate-700 transition-all duration-300 ${featured ? 'md:flex md:gap-6' : ''}`}>
      {/* Cover Image */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 ${featured ? 'md:w-2/5 md:flex-shrink-0' : 'h-48'}`}>
        {post.coverImage ? (
          <img
            src={post.coverImage.startsWith('http') ? post.coverImage : `${API}${post.coverImage}`}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className={`flex items-center justify-center bg-slate-950 ${featured ? 'h-52 md:h-full' : 'h-48'}`}>
            <span className="text-4xl opacity-40">{post.category?.icon || '📰'}</span>
          </div>
        )}
        {post.featured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] tracking-wider px-2 py-0.5 rounded-full font-bold">
            FEATURED
          </div>
        )}
        {post.category && (
          <div className="absolute top-3 right-3">
            <span
              className="text-white text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: post.category.color || '#3b82f6' }}
            >
              {post.category.name.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/post/${post.slug}`} className="group">
          <h2 className={`font-sans font-bold text-white group-hover:text-blue-400 transition-colors leading-snug mb-2 ${featured ? 'text-2xl' : 'text-lg'}`}>
            {post.title}
          </h2>
        </Link>

        <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
          {post.excerpt || truncate(post.content, 120)}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-800/60">
          <span className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-400 font-bold text-[10px]">{post.author?.name?.[0]?.toUpperCase()}</span>
            </div>
            <span className="font-medium text-slate-300">{post.author?.name}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatDateShort(post.publishedAt || post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {post.views?.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {post.readTime}m read
          </span>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="flex items-center gap-0.5 text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

interface PostCardSmallProps {
  post: Post;
}

export const PostCardSmall: React.FC<PostCardSmallProps> = ({ post }) => {
  const API = (import.meta.env.VITE_API_URL as string)?.replace('/api', '') || 'http://localhost:5001';

  return (
    <Link to={`/post/${post.slug}`} className="flex gap-3 group py-3.5 border-b border-slate-800 last:border-0 hover:bg-slate-900/20 px-2 rounded-lg transition-colors">
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-950 border border-slate-800">
        {post.coverImage && (
          <img src={post.coverImage.startsWith('http') ? post.coverImage : `${API}${post.coverImage}`} alt={post.title} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-300 group-hover:text-blue-400 transition-colors leading-tight line-clamp-2">
          {post.title}
        </h4>
        <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
          <Clock size={11} />
          {formatDateShort(post.publishedAt || post.createdAt)}
        </div>
      </div>
    </Link>
  );
};

export const LoadingCard: React.FC = () => {
  return (
    <div className="bg-slate-900/50 rounded-xl overflow-hidden shadow-md border border-slate-850">
      <div className="h-48 shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-4 shimmer rounded w-3/4" />
        <div className="h-4 shimmer rounded w-full" />
        <div className="h-4 shimmer rounded w-1/2" />
        <div className="h-3.5 shimmer rounded w-1/3 mt-4" />
      </div>
    </div>
  );
};
