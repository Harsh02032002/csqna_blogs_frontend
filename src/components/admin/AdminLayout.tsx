import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, FolderOpen, Users, User,
  LogOut, Menu, X, ChevronRight, Bell, ShieldAlert
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ size: number }>;
  label: string;
  end?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, end, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
        isActive
          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
          : 'text-slate-400 hover:bg-slate-900 hover:text-white'
      }`
    }
  >
    <Icon size={18} />
    {label}
  </NavLink>
);

export const AdminLayout: React.FC = () => {
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

  interface SidebarComponentProps {
    mobile?: boolean;
  }

  const Sidebar: React.FC<SidebarComponentProps> = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-slate-950 ${mobile ? '' : 'border-r border-slate-900'}`}>
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-900 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md">
            <ShieldAlert className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-sans font-bold text-lg text-white">CSQNA ADMIN</span>
        </NavLink>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Navigation</p>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={() => mobile && setSidebarOpen(false)} />
        ))}
      </nav>

      {/* User Information Area */}
      <div className="p-4 border-t border-slate-900 bg-slate-950">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <span className="font-bold text-blue-400 text-sm">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-950/20 rounded-lg transition-colors font-semibold border border-red-500/10 hover:border-red-500/30"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 flex-shrink-0 flex-col fixed left-0 top-0 h-full shadow-lg z-35">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full shadow-2xl">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content body */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header bar */}
        <header className="bg-slate-950 border-b border-slate-900 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-wider font-semibold">
              <span>Admin</span>
              <ChevronRight size={12} className="text-slate-650" />
              <span className="text-slate-300 font-bold">Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-slate-900 text-blue-400 border border-slate-800 hover:border-blue-500/30 px-3.5 py-2 rounded-lg transition-colors font-bold uppercase tracking-wider"
            >
              View Site ↗
            </a>
            <button className="relative p-2 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content viewport */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
