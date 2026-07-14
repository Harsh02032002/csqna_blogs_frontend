import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Info */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/25 mb-4">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black font-sans tracking-tight text-white uppercase">CSQNA ADMIN</h1>
          <p className="text-slate-400 text-xs mt-1">Authenticate to access the management portal.</p>
        </div>

        <div className="bg-[#0f121d] rounded-2xl border border-slate-800 p-8 shadow-2xl">
          {error && (
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-950/20 border border-red-800/30 px-4 py-3 rounded-lg">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="admin@csqna.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-650 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 disabled:cursor-not-allowed text-white font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-blue-500/10"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
