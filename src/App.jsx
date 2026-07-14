import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';

// Admin pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPosts from './pages/admin/Posts';
import AdminPostEditor from './pages/admin/PostEditor';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';
import AdminProfile from './pages/admin/Profile';
import AdminLayout from './components/admin/AdminLayout';

const ProtectedRoute = ({ children, roles }) => {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/admin/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/admin" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="posts/new" element={<AdminPostEditor />} />
            <Route path="posts/edit/:id" element={<AdminPostEditor />} />
            <Route path="categories" element={
              <ProtectedRoute roles={['admin', 'editor']}>
                <AdminCategories />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute roles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
