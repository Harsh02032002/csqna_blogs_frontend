import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Shield, Menu, X, Rss } from 'lucide-react';

export default function Navbar({ categories = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-[#1a1d2e] text-white shadow-lg sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 bg-white">
        <div className="flex items-center justify-between h-14 bg-white">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 ">
            <img src="/csqnalogo.png" alt="CSQNA" className='h-10 w-auto' />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {categories.slice(0, 6).map(cat => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="px-3 py-1.5 text-sm text-gray-900 rounded transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 pr-10">
            <div className="relative">
              <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-900" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Blogs or News..."
                className="bg-white/10 text-gray-900 placeholder-gray-900 text-sm pl-8 py-1.5 rounded-lg border border-white/20 focus:outline-none focus:border-blue-500 w-50"
              />
            </div>
          </form>

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1a1d2e] border-t border-white/10 px-4 pb-4">
          <form onSubmit={handleSearch} className="mt-3 mb-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-white/10 text-white placeholder-gray-400 text-sm pl-8 pr-3 py-2 rounded-lg border border-white/20 focus:outline-none"
              />
            </div>
          </form>
          {categories.map(cat => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-gray-300 border-b border-white/10"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
