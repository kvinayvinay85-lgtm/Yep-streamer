import React, { useEffect, useState } from 'react';
import { Film, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface StartupIntroProps {
  onComplete: () => void;
}

export const StartupIntro: React.FC<StartupIntroProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-radial from-rose-900/30 via-slate-950 to-slate-950 animate-pulse pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md">
        
        {/* Animated Brand Logo Icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-rose-600/40 animate-bounce">
            <Film className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-lg animate-pulse">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Yep<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-400 to-indigo-400">Streamer</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-400 max-w-sm tracking-wide">
            Next-Generation Universal Video Streaming & Enterprise Publishing Infrastructure
          </p>
        </div>

        {/* Countdown Progress & Skip Button */}
        <div className="w-full space-y-4 pt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2">
            <span>Redirecting to Google Login</span>
            <span className="text-rose-400 font-mono font-extrabold">{timeLeft}s</span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 transition-all duration-1000 ease-linear"
              style={{ width: `${((4 - timeLeft) / 4) * 100}%` }}
            />
          </div>

          <button
            onClick={onComplete}
            className="mt-2 text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 mx-auto transition-colors"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium pt-6">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Google OAuth 2.0 Encrypted Login</span>
        </div>

      </div>
    </div>
  );
};
