import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ShieldAlert } from 'lucide-react';
import { Category } from '../types';

interface NavbarProps {
  categories: Category[];
}

const Navbar: React.FC<NavbarProps> = ({ categories = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
                <ShieldAlert className="h-5 w-5 text-white" />
              </div>
              <span className="font-sans font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CSQNA<span className="text-blue-500">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5">
            {categories.slice(0, 7).map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="px-3.5 py-2 text-sm font-semibold text-slate-300 hover:text-white rounded-md hover:bg-slate-900 transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Search bar & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-60 rounded-full border border-slate-800 bg-slate-900/50 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu details */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-slate-950 px-4 py-4 space-y-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500"
            />
            <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-500" />
          </form>
          <div className="space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-md"
              >
                <span className="mr-2">{cat.icon || '📰'}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
