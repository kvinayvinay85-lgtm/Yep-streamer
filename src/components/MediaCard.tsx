import React from 'react';
import { Play, Star, Bookmark, Check } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaCardProps {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  onSelect: (item: MediaItem) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (id: string) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onPlay,
  onSelect,
  isWatchlisted,
  onToggleWatchlist
}) => {
  const isReel = item.category === 'reels';

  return (
    <div className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-rose-500/50 transition-all duration-300 shadow-lg hover:shadow-rose-600/10 flex flex-col">
      {/* Poster Thumbnail - Consistent 2:3 Vertical Ratio */}
      <div className={`relative ${isReel ? 'aspect-[9/16]' : 'aspect-[2/3]'} w-full overflow-hidden bg-slate-950`}>
        <img
          src={item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[70%]">
          <span className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-slate-700/50">
            {item.category}
          </span>
          {item.score && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/90 text-slate-950 text-[10px] font-extrabold flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-slate-950" />
              {item.score}
            </span>
          )}
          {typeof item.watchProgress === 'number' && item.watchProgress > 0 && item.watchProgress < 95 && (
            <span className="px-1.5 py-0.5 rounded bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold shadow-md shadow-rose-600/30">
              {Math.round(item.watchProgress)}%
            </span>
          )}
        </div>

        {/* Watchlist Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(item.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all ${
            isWatchlisted
              ? 'bg-rose-600 text-white border-rose-500'
              : 'bg-slate-950/70 text-slate-300 border-slate-700/50 hover:text-white hover:bg-slate-900'
          }`}
          title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          {isWatchlisted ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>

        {/* Quick Play Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-[2px]">
          <button
            onClick={() => onPlay(item)}
            className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transform scale-75 group-hover:scale-100 transition-transform"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
        </div>

        {/* Bottom Metadata Preview */}
        <div className="absolute bottom-0 inset-x-0 p-3.5 pb-4">
          <h3 
            onClick={() => onSelect(item)}
            className="text-white font-bold text-sm sm:text-base line-clamp-1 cursor-pointer hover:text-rose-400 transition-colors"
          >
            {item.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-medium">
            <span>{item.releaseYear}</span>
            <span>•</span>
            <span>{item.rating}</span>
            <span>•</span>
            <span className="line-clamp-1">{item.genres.join(', ')}</span>
            {typeof item.watchProgress === 'number' && item.watchProgress > 0 && (
              <span className="text-[10px] text-rose-400 font-semibold shrink-0">
                • {Math.round(item.watchProgress)}% watched
              </span>
            )}
          </div>
        </div>

        {/* Visual 'Continue Watching' Progress Bar */}
        {typeof item.watchProgress === 'number' && item.watchProgress > 0 && (
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-950/80 z-20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 shadow-sm shadow-rose-500 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, item.watchProgress))}%` }}
              title={`Progress: ${Math.round(item.watchProgress)}%`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
