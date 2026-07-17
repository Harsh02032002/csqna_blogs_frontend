import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar({ categories = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md shadow-slate-200/80' : 'shadow-sm shadow-slate-100'
      } border-b border-slate-100`}
    >
      {/* Top accent stripe */}
      <div className="h-0.5 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-15 items-center justify-between gap-6 py-2.5">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group flex items-center gap-2">
            <img
              src="/csqnalogo.png"
              alt="CSQNA"
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Vertical Divider */}
          <div className="hidden md:block h-6 w-px bg-slate-200/80 flex-shrink-0" />

          {/* Desktop Category Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-none">
            {categories.slice(0, 7).map((cat) => {
              const isActive = location.pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-slate-600 hover:text-violet-700 hover:bg-violet-50/70'
                  }`}
                >
                  <span className="mr-1 text-xs">{cat.icon}</span>
                  {cat.name}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Blogs or News..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-56 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:border-violet-400 focus:bg-white focus:w-64 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>
          </form>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pb-5 pt-3 space-y-3 shadow-lg">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500/10"
            />
          </form>
          <div className="space-y-0.5">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-violet-50 hover:text-violet-700 rounded-xl transition-all"
              >
                <span>{cat.icon || '📰'}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
