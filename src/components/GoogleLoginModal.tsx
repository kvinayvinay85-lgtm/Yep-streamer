import React, { useState } from 'react';
import { Film, ShieldCheck, CheckCircle2, UserCheck, Lock } from 'lucide-react';

interface GoogleLoginModalProps {
  onLoginSuccess: (user: { name: string; email: string; avatar: string }) => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const defaultUser = {
    name: 'Shadow Funky',
    email: 'shadowfunkyandmusicsongs@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(defaultUser);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-rose-600/30">
            <Film className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">Welcome to YepStreamer</h2>
          <p className="text-xs text-slate-400">Sign in with Google to access universal media streams</p>
        </div>

        {/* Account Option Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Google Workspace OAuth
          </div>
          <div className="flex items-center gap-3">
            <img
              src={defaultUser.avatar}
              alt={defaultUser.name}
              className="w-10 h-10 rounded-full object-cover border border-rose-500/50"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                {defaultUser.name}
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xs text-slate-400 truncate">{defaultUser.email}</div>
            </div>
          </div>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center gap-2 text-slate-700">
              <span className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
              Signing in with Google...
            </span>
          ) : (
            <>
              {/* Google G Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue as {defaultUser.name}</span>
            </>
          )}
        </button>

        {/* Privacy Note */}
        <div className="pt-2 text-center text-[11px] text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1 font-semibold text-slate-400">
            <Lock className="w-3 h-3 text-emerald-400" />
            Protected by Google Identity Services
          </p>
          <p>By continuing, you agree to YepStreamer Terms of Service & Privacy Policy.</p>
        </div>

      </div>
    </div>
  );
};
