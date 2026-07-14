import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, FolderOpen, Users, User,
  LogOut, Shield, Menu, X, ChevronRight, Bell
} from 'lucide-react';
import { useState } from 'react';

const NavItem = ({ to, icon: Icon, label, end, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
    <div className={`flex flex-col h-full bg-white ${mobile ? '' : 'border-r border-gray-200'}`}>
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div>
            <div className="font-bold text-gray-900"><img src="/csqnalogo.png" alt="CSQNA" className="h-10 w-auto" /></div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Navigation</p>
        {navItems.map(item => (
          <NavItem key={item.to} {...item} onClick={() => mobile && setSidebarOpen(false)} />
        ))}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="font-bold text-blue-700 text-sm">{user?.name?.[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 flex-shrink-0 flex-col fixed left-0 top-0 h-full shadow-sm z-30">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full shadow-xl">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-1 text-sm text-gray-500">
              <span>Admin</span>
              <ChevronRight size={14} />
              <span className="font-medium text-gray-900">Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NavLink
              to="/"
              target="_blank"
              className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              View Site ↗
            </NavLink>
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
