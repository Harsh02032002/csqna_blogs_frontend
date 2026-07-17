import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, FolderOpen, Users, User,
  LogOut, Menu, X, ChevronRight, Bell
} from 'lucide-react';
import { useState } from 'react';

const NavItem = ({ to, icon: Icon, label, end, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        isActive
          ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`
    }
  >
    <Icon size={18} />
    {label}
  </NavLink>
);

export default function AdminLayout() {
  const { user, logout, isAdmin, isEditor } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/posts', icon: FileText, label: 'Posts', end: false },
    ...(isEditor ? [{ to: '/admin/categories', icon: FolderOpen, label: 'Categories', end: false }] : []),
    ...(isAdmin ? [{ to: '/admin/users', icon: Users, label: 'Users', end: false }] : []),
    { to: '/admin/profile', icon: User, label: 'Profile', end: false },
  ];

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-white ${mobile ? '' : 'border-r border-slate-200/80'}`}>
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group decoration-none">
          <img src="/csqnalogo.png" alt="CSQNA" className="h-8 w-auto object-contain" />
          <span className="font-sans font-extrabold text-base text-slate-800 tracking-tight">PORTAL</span>
        </NavLink>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-700 lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Navigation</p>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={() => mobile && setSidebarOpen(false)} />
        ))}
      </nav>

      {/* User Information Area */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center border border-violet-200">
            <span className="font-bold text-violet-755 text-sm">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs text-red-655 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 font-bold border border-red-200/50 hover:border-red-300"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 flex-shrink-0 flex-col fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full shadow-2xl">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content body */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header bar */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 uppercase tracking-wider font-bold">
              <span>Admin</span>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-slate-700 font-extrabold">Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-slate-50 text-slate-700 border border-slate-200/80 hover:bg-slate-100 px-3.5 py-2.5 rounded-xl transition-all duration-200 font-bold uppercase tracking-wider shadow-sm"
            >
              View Site ↗
            </a>
            <button className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-650 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content viewport */}
        <main className="flex-1 p-6 lg:p-8 bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
