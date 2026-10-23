import React from 'react';
import { MediaItem, CategoryType } from '../types';
import { MediaCard } from './MediaCard';
import { 
  Clapperboard, Tv, Sparkles, Video, Bookmark, Search, History, 
  Flame, ShieldCheck, Film, Play, Star, Info, Filter, Layers, Compass
} from 'lucide-react';

interface PublicHomeProps {
  mediaList: MediaItem[];
  currentCategory: CategoryType | 'all' | 'watchlist';
  searchQuery: string;
  watchlist: string[];
  onPlay: (item: MediaItem) => void;
  onSelect: (item: MediaItem) => void;
  onToggleWatchlist: (id: string) => void;
  onSelectCategory: (cat: CategoryType | 'all') => void;
  onOpenAdmin?: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  mediaList,
  currentCategory,
  searchQuery,
  watchlist,
  onPlay,
  onSelect,
  onToggleWatchlist,
  onSelectCategory,
  onOpenAdmin
}) => {
  const publishedMedia = mediaList.filter(m => m.status === 'published');

  // Filter based on search query
  const searchedMedia = publishedMedia.filter(m => {
    if (!searchQuery) return true;
    return m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const featuredItem = publishedMedia.find(m => m.featured) || publishedMedia[0];

  const categoryChips: { id: CategoryType | 'all'; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Catalog', icon: Compass },
    { id: 'cinema', label: 'Cinema Movies', icon: Clapperboard },
    { id: 'anime', label: 'Anime Series', icon: Tv },
    { id: 'drama', label: 'Drama Titles', icon: Sparkles },
    { id: 'reels', label: 'Reels 9:16', icon: Video },
    { id: 'action', label: 'Action', icon: Flame },
    { id: 'comedy', label: 'Comedy', icon: Film },
    { id: 'scifi', label: 'Sci-Fi', icon: Layers },
  ];

  // If viewing watchlist
  if (currentCategory === 'watchlist') {
    const watchlistedItems = publishedMedia.filter(m => watchlist.includes(m.id));
    return (
      <div className="space-y-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Bookmark className="w-6 h-6 text-rose-500" />
            <div>
              <h1 className="text-2xl font-extrabold text-white">My Saved Watchlist</h1>
              <p className="text-xs text-slate-400">{watchlistedItems.length} titles saved for offline & later viewing</p>
            </div>
          </div>

          {watchlistedItems.length === 0 ? (
            <div className="text-center py-20 space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800/80 my-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-slate-500 flex items-center justify-center mx-auto border border-slate-800">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="text-white font-bold text-lg">Your watchlist is empty</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">Click the bookmark icon on any movie or series poster card to save it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 lg:gap-6 mt-6">
              {watchlistedItems.map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onPlay={onPlay}
                  onSelect={onSelect}
                  isWatchlisted={true}
                  onToggleWatchlist={onToggleWatchlist}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // If searching or filtering specific category
  if (searchQuery || currentCategory !== 'all') {
    const filtered = searchedMedia.filter(m => {
      if (currentCategory === 'all') return true;
      if (currentCategory === 'action') return m.genres.some(g => g.toLowerCase().includes('action'));
      if (currentCategory === 'comedy') return m.genres.some(g => g.toLowerCase().includes('comedy'));
      if (currentCategory === 'scifi') return m.genres.some(g => g.toLowerCase().includes('sci-fi'));
      return m.category === currentCategory;
    });

    const categoryTitles: Record<string, string> = {
      cinema: 'Cinema Movies',
      anime: 'Anime Movies & Series',
      drama: 'Drama Titles',
      reels: 'Reels 9:16 Clips',
      action: 'Action Blockbusters',
      comedy: 'Comedy Specials & Movies',
      scifi: 'Sci-Fi & Cyberpunk Collection'
    };

    return (
      <div className="space-y-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          
          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryChips.map(chip => {
              const Icon = chip.icon;
              const isActive = currentCategory === chip.id && !searchQuery;
              return (
                <button
                  key={chip.id}
                  onClick={() => onSelectCategory(chip.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all border ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white border-rose-500 shadow-lg shadow-rose-950/50'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-extrabold text-white capitalize flex items-center gap-2">
              {searchQuery ? <Search className="w-6 h-6 text-rose-500" /> : <Filter className="w-5 h-5 text-purple-400" />}
              {searchQuery ? `Search Results for "${searchQuery}"` : (categoryTitles[currentCategory] || `${currentCategory} Collection`)}
            </h1>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-rose-400">
              {filtered.length} titles available
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 space-y-3 bg-slate-900/40 rounded-3xl border border-slate-800/80">
              <h3 className="text-white font-bold text-lg">No matching titles found</h3>
              <p className="text-slate-400 text-sm">Try searching for a different keyword or browse all catalog categories.</p>
              <button
                onClick={() => onSelectCategory('all')}
                className="mt-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 lg:gap-6">
              {filtered.map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onPlay={onPlay}
                  onSelect={onSelect}
                  isWatchlisted={watchlist.includes(item.id)}
                  onToggleWatchlist={onToggleWatchlist}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default Homepage with Poster Grid Layout & Compact Hero Showcase
  const continueWatchingList = publishedMedia.filter(
    m => typeof m.watchProgress === 'number' && m.watchProgress > 0 && m.watchProgress < 95
  );
  const cinemaMovies = publishedMedia.filter(m => m.category === 'cinema');
  const animeList = publishedMedia.filter(m => m.category === 'anime');
  const dramaList = publishedMedia.filter(m => m.category === 'drama');
  const reelsList = publishedMedia.filter(m => m.category === 'reels');

  return (
    <div className="space-y-10 pb-20 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoryChips.map(chip => {
            const Icon = chip.icon;
            const isActive = currentCategory === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => onSelectCategory(chip.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white border-rose-500 shadow-lg shadow-rose-950/50'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Compact Featured Poster Hero Showcase Card */}
        {featuredItem && (
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 p-5 sm:p-8 shadow-2xl">
            {/* Dark Backdrop Background */}
            <div className="absolute inset-0 z-0">
              <img
                src={featuredItem.backdropUrl || featuredItem.posterUrl}
                alt={featuredItem.title}
                className="w-full h-full object-cover opacity-20 filter blur-md scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
            </div>

            {/* Showcase Content */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Featured 2:3 Vertical Poster Card */}
              <div className="relative w-36 sm:w-44 lg:w-48 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-700/80 shadow-2xl shrink-0 group cursor-pointer" onClick={() => onPlay(featuredItem)}>
                <img
                  src={featuredItem.posterUrl}
                  alt={featuredItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Title, Metadata & Actions */}
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                    Featured {featuredItem.category}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{featuredItem.score}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                    {featuredItem.rating}
                  </span>
                  <span className="text-slate-400 text-xs font-semibold">{featuredItem.releaseYear}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {featuredItem.title}
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed max-w-3xl">
                  {featuredItem.description}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                  <button
                    onClick={() => onPlay(featuredItem)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition-transform"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch Now</span>
                  </button>

                  <button
                    onClick={() => onToggleWatchlist(featuredItem.id)}
                    className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition-colors ${
                      watchlist.includes(featuredItem.id)
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>{watchlist.includes(featuredItem.id) ? 'In Watchlist' : 'Add to Watchlist'}</span>
                  </button>

                  <button
                    onClick={() => onSelect(featuredItem)}
                    className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2 border border-slate-700"
                  >
                    <Info className="w-4 h-4" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Watching Grid Section */}
        {continueWatchingList.length > 0 && (
          <section className="space-y-4 p-5 rounded-3xl bg-gradient-to-r from-rose-950/30 via-purple-950/20 to-slate-900/80 border border-rose-900/30 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-600/30 text-rose-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    Continue Watching
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-600/20 text-rose-400 font-bold border border-rose-500/30">
                      {continueWatchingList.length} In Progress
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">Pick up right where you left off</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 lg:gap-6">
              {continueWatchingList.map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onPlay={onPlay}
                  onSelect={onSelect}
                  isWatchlisted={watchlist.includes(item.id)}
                  onToggleWatchlist={onToggleWatchlist}
                />
              ))}
            </div>
          </section>
        )}

        {/* Cinema Movies Grid */}
        {cinemaMovies.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center">
                  <Clapperboard className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Cinema Movies</h2>
                  <p className="text-xs text-slate-400">Blockbuster theatrical movies & original films</p>
                </div>
              </div>
              <button
                onClick={() => onSelectCategory('cinema')}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:underline px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
              >
                View All ({cinemaMovies.length})
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 lg:gap-6">
              {cinemaMovies.slice(0, 12).map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onPlay={onPlay}
                  onSelect={onSelect}
                  isWatchlisted={watchlist.includes(item.id)}
                  onToggleWatchlist={onToggleWatchlist}
                />
              ))}
            </div>
          </section>
        )}

        {/* Anime Movies & Series Grid */}
        {animeList.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Tv className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Anime Movies & Series</h2>
                  <p className="text-xs text-slate-400">Simulcast anime series, OVAs & feature films</p>
                </div>
              </div>
              <button
                onClick={() => onSelectCategory('anime')}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
              >
                View All ({animeList.length})
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 lg:gap-6">
              {animeList.slice(0, 12).map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onPlay={onPlay}
                  onSelect={onSelect}
                  isWatchlisted={watchlist.includes(item.id)}
                  onToggleWatchlist={onToggleWatchlist}
                />
              ))}
            </div>
          </section>
        )}

        {/* Drama Titles Grid */}
        {dramaList.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Drama Titles</h2>
                  <p className="text-xs text-slate-400">Award-winning drama series & feature stories</p>
                </div>
              </div>
              <button
                onClick={() => onSelectCategory('drama')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
              >
                View All ({dramaList.length})
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 lg:gap-6">
              {dramaList.slice(0, 12).map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onPlay={onPlay}
                  onSelect={onSelect}
                  isWatchlisted={watchlist.includes(item.id)}
                  onToggleWatchlist={onToggleWatchlist}
                />
              ))}
            </div>
          </section>
        )}

        {/* Reels 9:16 Vertical Clips Grid */}
        {reelsList.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white">Reels 9:16 Vertical Clips</h2>
                  <p className="text-xs text-slate-400">Short vertical highlights & viral trailers</p>
                </div>
              </div>
              <button
                onClick={() => onSelectCategory('reels')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
              >
                View All ({reelsList.length})
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 lg:gap-6">
              {reelsList.slice(0, 12).map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onPlay={onPlay}
                  onSelect={onSelect}
                  isWatchlisted={watchlist.includes(item.id)}
                  onToggleWatchlist={onToggleWatchlist}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Website Footer with Admin Entrance */}
      <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center font-extrabold text-white shadow-lg shadow-rose-600/20">
                  <Film className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-extrabold text-white">
                  YEP <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-400">STREAMER</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Next-generation streaming platform with AI Video Understanding, multi-bitrate encoding, simulcast scheduling, and full enterprise admin management.
              </p>
            </div>

            {/* Admin Entrance Card */}
            {onOpenAdmin && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/80 flex items-center gap-4 shadow-xl">
                <div>
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Admin Control Panel (అడ్మిన్ లాగిన్)
                  </h4>
                  <p className="text-[11px] text-slate-400">Manage uploads, 3,000 features, transcoding & genres</p>
                </div>
                <button
                  onClick={onOpenAdmin}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-rose-900/40 shrink-0 border border-white/10"
                >
                  Enter Admin
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => onSelectCategory('all')} className="hover:text-slate-300">Home</button>
              <button onClick={() => onSelectCategory('cinema')} className="hover:text-slate-300">Cinema</button>
              <button onClick={() => onSelectCategory('anime')} className="hover:text-slate-300">Anime</button>
              <button onClick={() => onSelectCategory('drama')} className="hover:text-slate-300">Drama</button>
              <button onClick={() => onSelectCategory('reels')} className="hover:text-slate-300">Reels 9:16</button>
              <button onClick={() => onSelectCategory('action')} className="hover:text-slate-300">Action</button>
              <button onClick={() => onSelectCategory('comedy')} className="hover:text-slate-300">Comedy</button>
              <button onClick={() => onSelectCategory('scifi')} className="hover:text-slate-300">Sci-Fi</button>
            </div>
            <p>© {new Date().getFullYear()} YEP STREAMER Enterprise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
