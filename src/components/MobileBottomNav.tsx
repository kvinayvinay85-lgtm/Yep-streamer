import React, { useState } from 'react';
import { 
  Home, Clapperboard, Tv, Bookmark, ShieldCheck, 
  Grid, X, Flame, Smile, Rocket, Sparkles, Video, Calendar
} from 'lucide-react';
import { CategoryType } from '../types';

interface MobileBottomNavProps {
  currentCategory: CategoryType | 'all' | 'watchlist';
  onSelectCategory: (cat: CategoryType | 'all' | 'watchlist') => void;
  watchlistCount: number;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentCategory,
  onSelectCategory,
  watchlistCount,
  onOpenAdmin,
  isAdminLoggedIn
}) => {
  const [genresSheetOpen, setGenresSheetOpen] = useState(false);

  const isGenreActive = ['action', 'comedy', 'scifi', 'drama', 'reels'].includes(currentCategory);

  const genresList = [
    { id: 'action', label: 'Action', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-500/20' },
    { id: 'comedy', label: 'Comedy', icon: Smile, color: 'text-amber-500', bg: 'bg-amber-500/20' },
    { id: 'scifi', label: 'Sci-Fi', icon: Rocket, color: 'text-cyan-500', bg: 'bg-cyan-500/20' },
    { id: 'drama', label: 'Drama', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { id: 'reels', label: 'Reels 9:16', icon: Video, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { id: 'calendar', label: 'Simulcast Schedule', icon: Calendar, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
  ];

  return (
    <>
      {/* Slide-up Genres & More Bottom Sheet */}
      {genresSheetOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={() => setGenresSheetOpen(false)}
        >
          <div 
            className="absolute bottom-16 inset-x-0 bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[75vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">All Categories & Genres</h3>
                  <p className="text-[11px] text-slate-400">మొబైల్ కేటగిరీలు & జానర్లు</p>
                </div>
              </div>
              <button 
                onClick={() => setGenresSheetOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {genresList.map((genre) => {
                const Icon = genre.icon;
                const isSelected = currentCategory === genre.id;
                return (
                  <button
                    key={genre.id}
                    onClick={() => {
                      onSelectCategory(genre.id as any);
                      setGenresSheetOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-rose-600/25 border-rose-500 text-white shadow-lg'
                        : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl ${genre.bg} ${genre.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{genre.label}</div>
                      <div className="text-[10px] text-slate-500">Explore titles</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Admin Access in Mobile Sheet */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setGenresSheetOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>{isAdminLoggedIn ? 'Enter Admin Dashboard' : 'Admin Login & Management (అడ్మిన్)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Dock / Navigation Bar for Mobile Screens */}
      <nav 
        aria-label="Mobile Navigation" 
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 shadow-[0_-10px_25px_rgba(0,0,0,0.8)] pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1.5"
      >
        <div className="max-w-md mx-auto grid grid-cols-6 items-center px-2">
          
          {/* 1. Home */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              currentCategory === 'all' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${currentCategory === 'all' ? 'bg-rose-500/20' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          </button>

          {/* 2. Cinema */}
          <button
            onClick={() => onSelectCategory('cinema')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              currentCategory === 'cinema' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${currentCategory === 'cinema' ? 'bg-rose-500/20' : ''}`}>
              <Clapperboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Cinema</span>
          </button>

          {/* 3. Anime & Series */}
          <button
            onClick={() => onSelectCategory('anime')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              currentCategory === 'anime' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${currentCategory === 'anime' ? 'bg-purple-500/20' : ''}`}>
              <Tv className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Anime</span>
          </button>

          {/* 4. Watchlist */}
          <button
            onClick={() => onSelectCategory('watchlist')}
            className={`relative flex flex-col items-center justify-center py-1 transition-all ${
              currentCategory === 'watchlist' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${currentCategory === 'watchlist' ? 'bg-rose-500/20' : ''}`}>
              <Bookmark className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Saved</span>
            {watchlistCount > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* 5. More Genres Sheet */}
          <button
            onClick={() => setGenresSheetOpen(!genresSheetOpen)}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              isGenreActive || genresSheetOpen ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${isGenreActive || genresSheetOpen ? 'bg-amber-500/20' : ''}`}>
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Genres</span>
          </button>

          {/* 6. Admin Portal */}
          <button
            onClick={onOpenAdmin}
            className={`flex flex-col items-center justify-center py-1 transition-all group ${
              isAdminLoggedIn ? 'text-emerald-400 font-bold' : 'text-purple-400 hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl bg-gradient-to-tr from-rose-600/30 to-purple-600/30 border border-purple-500/40 shadow-sm group-active:scale-95 transition-transform`}>
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-[10px] mt-0.5 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-300">
              Admin
            </span>
          </button>

        </div>
      </nav>
    </>
  );
};
