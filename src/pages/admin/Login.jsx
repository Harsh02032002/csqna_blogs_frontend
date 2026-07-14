import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@csqna.com');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) navigate('/admin');
    else setError(result.message);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-10  rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/50">
            <img src="../../public/favicon.ico" alt="CSQNA" />
          </div>
          <h1 className="text-2xl font-black text-white">CSQNA ADMIN</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your blog</p>
        </div>

        <div className="bg-[#1a1d2e] rounded-2xl border border-white/10 p-8 shadow-xl">
          {error && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-800/50 px-4 py-3 rounded-lg">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
