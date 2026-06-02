'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('solarrelease');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple, reliable admin credentials for testing convenience
    if (username === 'admin' && password === 'solarrelease') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('src_admin_logged_in', 'true');
      }
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 500);
    } else {
      setError('Invalid username or password. Use credentials: admin / solarrelease');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-center items-center px-4 font-sans">
      <div className="w-full max-w-md bg-navy-900/40 border border-navy-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-gold-500 via-amber-500 to-gold-400"></div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
            </div>
            <h2 className="text-2xl font-black text-white">Admin Console Access</h2>
            <p className="text-slate-400 text-xs mt-1">Authorized staff portal for Solar Release Co. case reviews</p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/30 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2 mb-6 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-navy-950 border border-navy-700/80 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-navy-950 border border-navy-700/80 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold text-navy-950 bg-gold-400 hover:bg-gold-300 disabled:bg-navy-800 disabled:text-slate-600 transition-colors shadow-lg shadow-gold-500/5 mt-2 cursor-pointer font-extrabold"
            >
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>

          {/* Prompt banner to help developer/reviewer */}
          <div className="mt-8 pt-6 border-t border-navy-850/80 text-center">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">Developer Quick Access:</span>
            <code className="text-xs text-gold-400/80 bg-navy-950/80 px-2.5 py-1.5 rounded-lg border border-navy-800">admin / solarrelease</code>
          </div>

        </div>
      </div>
    </div>
  );
}
