import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-200/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/50 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-1 bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 mb-4 transition-transform hover:scale-105 duration-300">
            <img src="/csqnalogo.png" alt="CSQNA" className="h-12 w-auto object-contain block px-3 py-1" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">CSQNA ADMIN</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage your blog</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-[0_20px_50px_rgba(124,58,237,0.06)] backdrop-blur-md">
          {error && (
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all duration-200"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-750 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-violet-500/15"
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
