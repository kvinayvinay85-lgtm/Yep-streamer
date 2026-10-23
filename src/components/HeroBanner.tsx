import React from 'react';
import { Play, Info, Star, Bookmark } from 'lucide-react';
import { MediaItem } from '../types';

interface HeroBannerProps {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  onMoreInfo: (item: MediaItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ item, onPlay, onMoreInfo }) => {
  if (!item) return null;

  const posterImg = item.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop';
  const backdropImg = item.backdropUrl || posterImg;

  return (
    <div className="relative w-full overflow-hidden bg-slate-950">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={backdropImg}
          alt={item.title}
          className="w-full h-full object-cover object-center scale-105 filter blur-xs sm:blur-none opacity-40 sm:opacity-100 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 sm:via-slate-950/60 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 sm:via-slate-950/80 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16 z-10">
        
        {/* Mobile View: Vertical Poster Card Layout */}
        <div className="sm:hidden flex flex-col items-center text-center space-y-4 pt-2">
          {/* Featured Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
              Featured {item.category}
            </span>
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full text-amber-400 text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{item.score}</span>
            </div>
          </div>

          {/* Vertical 2:3 Poster Image Card */}
          <div className="relative w-44 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700/80 shadow-2xl shadow-rose-950/50 group">
            <img
              src={posterImg}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {typeof item.watchProgress === 'number' && item.watchProgress > 0 && (
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-950">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500" 
                  style={{ width: `${item.watchProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Mobile Title & Meta */}
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
              {item.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-300 font-semibold">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                {item.rating || 'PG-13'}
              </span>
              <span>{item.releaseYear}</span>
              {item.duration && <span>• {item.duration}</span>}
              <span className="text-rose-400 font-extrabold uppercase">• {item.mediaType}</span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed px-2">
              {item.description}
            </p>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center gap-2.5 w-full pt-1">
            <button
              onClick={() => onPlay(item)}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Now</span>
            </button>
            <button
              onClick={() => onMoreInfo(item)}
              className="py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700/80 backdrop-blur-md"
            >
              <Info className="w-4 h-4 text-slate-300" />
              <span>Details</span>
            </button>
          </div>
        </div>

        {/* Desktop / Tablet View: Wide Cinematic Layout */}
        <div className="hidden sm:flex items-end gap-8 pt-12 min-h-[460px]">
          {/* Optional Vertical Poster on Desktop */}
          <div className="relative w-48 lg:w-56 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-800 shadow-2xl shrink-0 hidden md:block">
            <img
              src={posterImg}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Desktop Content Metadata */}
          <div className="max-w-2xl space-y-4 pb-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow">
                Featured {item.category}
              </span>
              <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-lg text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.score}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                {item.rating}
              </span>
              <span className="text-slate-300 text-xs font-semibold">{item.releaseYear}</span>
              {item.duration && <span className="text-slate-300 text-xs font-semibold">• {item.duration}</span>}
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {item.title}
            </h1>

            <p className="text-slate-300 text-sm lg:text-base line-clamp-3 leading-relaxed drop-shadow">
              {item.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onPlay(item)}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-rose-600/30 transition-transform active:scale-95 border border-white/10"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Watch Now</span>
              </button>
              <button
                onClick={() => onMoreInfo(item)}
                className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center gap-2.5 backdrop-blur-md border border-slate-700/80 transition-all"
              >
                <Info className="w-5 h-5 text-slate-300" />
                <span>Overview & Episodes</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
