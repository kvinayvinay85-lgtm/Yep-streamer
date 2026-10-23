import React, { useState, useRef, useEffect } from 'react';
import { Film, Search, Bookmark, ShieldCheck, Menu, X, Tv, Video, Clapperboard, Sparkles, Calendar, Play, History, Trash2, Clock } from 'lucide-react';
import { CategoryType, MediaItem } from '../types';
import { StorageService } from '../services/storageService';

import { UserProfile } from '../services/authService';

interface NavbarProps {
  currentCategory: CategoryType | 'all' | 'watchlist';
  onSelectCategory: (cat: CategoryType | 'all' | 'watchlist') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  watchlistCount: number;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  mediaList?: MediaItem[];
  onSelectMedia?: (item: MediaItem) => void;
  googleUser?: UserProfile | null;
  onLogoutGoogle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  watchlistCount,
  onOpenAdmin,
  isAdminLoggedIn,
  mediaList = [],
  onSelectMedia,
  googleUser,
  onLogoutGoogle
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(StorageService.getRecentSearches());
  }, []);

  // Real-time prefix-matching algorithm
  const cleanQ = searchQuery.trim().toLowerCase();
  const suggestions: MediaItem[] = cleanQ
    ? (() => {
        // 1. Direct title prefix matches
        const directPrefix = mediaList.filter(item =>
          item.title.toLowerCase().startsWith(cleanQ)
        );
        // 2. Word prefix matches (e.g. searching "odd" matches "Intergalactic Oddballs")
        const wordPrefix = mediaList.filter(item => {
          if (directPrefix.some(d => d.id === item.id)) return false;
          const words = item.title.toLowerCase().split(/[\s-_:.,!]+/);
          return words.some(w => w.startsWith(cleanQ));
        });
        return [...directPrefix, ...wordPrefix].slice(0, 6);
      })()
    : [];

  // Reset keyboard selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Click outside listener to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedDesktop = desktopSearchRef.current?.contains(target);
      const clickedMobile = mobileSearchRef.current?.contains(target);
      if (!clickedDesktop && !clickedMobile) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (item: MediaItem) => {
    if (searchQuery.trim()) {
      const updated = StorageService.addRecentSearch(searchQuery.trim());
      setRecentSearches(updated);
    }
    if (onSelectMedia) {
      onSelectMedia(item);
    }
    setIsSearchFocused(false);
    setSearchOpen(false);
  };

  const handleSelectRecentQuery = (query: string) => {
    onSearchChange(query);
    const updated = StorageService.addRecentSearch(query);
    setRecentSearches(updated);
    setIsSearchFocused(true);
  };

  const handleRemoveRecentQuery = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    const updated = StorageService.removeRecentSearch(query);
    setRecentSearches(updated);
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.clearRecentSearches();
    setRecentSearches([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else if (searchQuery.trim()) {
        const updated = StorageService.addRecentSearch(searchQuery.trim());
        setRecentSearches(updated);
        setIsSearchFocused(false);
      } else {
        setIsSearchFocused(false);
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  const renderHighlighted = (title: string, query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return title;
    const idx = title.toLowerCase().indexOf(q);
    if (idx === -1) return title;
    const before = title.slice(0, idx);
    const match = title.slice(idx, idx + q.length);
    const after = title.slice(idx + q.length);
    return (
      <span>
        {before}
        <span className="text-amber-400 font-extrabold underline decoration-amber-400/60 bg-amber-400/10 px-0.5 rounded">
          {match}
        </span>
        {after}
      </span>
    );
  };

  const renderSuggestionsDropdown = (isMobile: boolean = false) => {
    if (!isSearchFocused) return null;

    // Render Recent Searches dropdown when search input is empty
    if (!cleanQ) {
      if (recentSearches.length === 0) return null;
      return (
        <div 
          className={`absolute top-full mt-2 bg-slate-900/98 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 ${
            isMobile ? 'left-0 right-0 max-w-full' : 'w-80 md:w-96 left-0 sm:-left-12'
          }`}
        >
          <div className="px-3.5 py-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5 text-rose-400 uppercase tracking-wider">
              <History className="w-3.5 h-3.5" />
              Recent Searches
            </span>
            <button
              onClick={handleClearAllRecent}
              className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Clear All
            </button>
          </div>

          <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {recentSearches.map((term, idx) => (
              <div
                key={idx}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectRecentQuery(term);
                }}
                className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Clock className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 transition-colors" />
                  <span className="truncate">{term}</span>
                </div>
                <button
                  onClick={(e) => handleRemoveRecentQuery(e, term)}
                  className="p-1 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-rose-400 transition-colors opacity-80 group-hover:opacity-100"
                  title="Remove query"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Render Predictive Suggestions with Thumbnail AND Short Description Preview
    return (
      <div 
        className={`absolute top-full mt-2 bg-slate-900/98 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 ${
          isMobile ? 'left-0 right-0 max-w-full' : 'w-80 md:w-96 left-0 sm:-left-12'
        }`}
      >
        <div className="px-3.5 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Predictive Suggestions ({suggestions.length})
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
            Prefix Match
          </span>
        </div>

        {suggestions.length > 0 ? (
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {suggestions.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(item);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 flex items-start gap-3 cursor-pointer transition-all ${
                    isSelected ? 'bg-rose-600/25 text-white' : 'hover:bg-slate-800/70 text-slate-200'
                  }`}
                >
                  {/* Thumbnail Poster */}
                  <div className="relative w-12 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-slate-700/80 shadow">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {typeof item.watchProgress === 'number' && item.watchProgress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-500 to-amber-500" 
                          style={{ width: `${item.watchProgress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Title, Metadata & Short Description */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="text-sm font-extrabold text-white truncate flex items-center justify-between gap-1.5">
                      <span className="truncate">{renderHighlighted(item.title, searchQuery)}</span>
                      <span className="text-[10px] text-amber-400 font-bold shrink-0">
                        ★ {item.score}
                      </span>
                    </div>

                    {/* Short Description Preview */}
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                      {item.description || 'Enterprise high-definition streaming media title.'}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                      <span className={`px-1.5 py-0.5 rounded font-extrabold uppercase ${
                        item.category === 'anime' ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50' :
                        item.category === 'cinema' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50' :
                        item.category === 'drama' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50' :
                        'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50'
                      }`}>
                        {item.category}
                      </span>
                      <span>{item.releaseYear}</span>
                      {item.duration && <span>• {item.duration}</span>}
                    </div>
                  </div>

                  {/* Play Action */}
                  <div className={`p-2 rounded-xl shrink-0 self-center ${isSelected ? 'bg-rose-600 text-white' : 'bg-slate-800/80 text-slate-400 hover:text-white'}`}>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center space-y-1">
            <p className="text-xs text-slate-300 font-medium">No title begins with "{searchQuery}"</p>
            <p className="text-[11px] text-slate-500">Press Enter to search entire library</p>
          </div>
        )}

        {/* Shortcut Tips */}
        <div className="px-3 py-1.5 bg-slate-950 text-[10px] text-slate-400 border-t border-slate-800 flex items-center justify-between">
          <span>↑↓ Navigate</span>
          <span>Enter to Play & Save</span>
          <span>ESC to Dismiss</span>
        </div>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onSelectCategory('all')} 
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-600/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                YEP <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-400">STREAMER</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase block -mt-1">
                Enterprise 2M+ Media
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentCategory === 'all'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onSelectCategory('cinema')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentCategory === 'cinema'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Clapperboard className="w-4 h-4 text-rose-500" />
              Cinema
            </button>
            <button
              onClick={() => onSelectCategory('anime')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentCategory === 'anime'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Tv className="w-4 h-4 text-purple-400" />
              Anime & Series
            </button>
            <button
              onClick={() => onSelectCategory('calendar')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors relative ${
                currentCategory === 'calendar'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Simulcast</span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 ml-0.5">
                New
              </span>
            </button>
            <button
              onClick={() => onSelectCategory('drama')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentCategory === 'drama'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Drama
            </button>
            <button
              onClick={() => onSelectCategory('reels')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentCategory === 'reels'
                  ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Video className="w-4 h-4 text-cyan-400" />
              Reels 9:16
            </button>
            <span className="h-4 w-[1px] bg-slate-800 mx-1 hidden xl:inline-block" />
            <button
              onClick={() => onSelectCategory('action')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold hidden xl:inline-flex items-center gap-1 transition-colors ${
                currentCategory === 'action'
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Action
            </button>
            <button
              onClick={() => onSelectCategory('comedy')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold hidden xl:inline-flex items-center gap-1 transition-colors ${
                currentCategory === 'comedy'
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Comedy
            </button>
            <button
              onClick={() => onSelectCategory('scifi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold hidden xl:inline-flex items-center gap-1 transition-colors ${
                currentCategory === 'scifi'
                  ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Sci-Fi
            </button>
          </nav>
        </div>

        {/* Search, Watchlist & Admin Portal */}
        <div className="flex items-center gap-3">
          {/* Predictive Search bar Desktop */}
          <div ref={desktopSearchRef} className="relative hidden sm:block w-64 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search movies, anime, dramas..."
              className="w-full bg-slate-900/90 text-sm text-white placeholder-slate-400 pl-9 pr-8 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setIsSearchFocused(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {renderSuggestionsDropdown(false)}
          </div>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="sm:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Watchlist */}
          <button
            onClick={() => onSelectCategory('watchlist')}
            className={`relative p-2.5 rounded-xl border transition-all flex items-center gap-2 ${
              currentCategory === 'watchlist'
                ? 'bg-rose-600/20 border-rose-500 text-rose-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="My Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden md:inline text-sm font-medium">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* User Account Profile Badge & Logout */}
          {googleUser && (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
                title={googleUser.displayName}
              >
                <img
                  src={googleUser.photoURL}
                  alt={googleUser.displayName}
                  className="w-7 h-7 rounded-lg object-cover ring-2 ring-rose-500/50"
                />
                <span className="hidden md:inline text-xs font-bold text-slate-200 max-w-[100px] truncate">
                  {googleUser.displayName}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 p-3 space-y-2">
                  <div className="flex items-center gap-2.5 border-b border-slate-800 pb-2.5">
                    <img
                      src={googleUser.photoURL}
                      alt={googleUser.displayName}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-rose-500"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{googleUser.displayName}</div>
                      <div className="text-[10px] text-slate-400 truncate">{googleUser.email}</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                    <span>Google Account Signed In</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  {onLogoutGoogle && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogoutGoogle();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-rose-500/30"
                    >
                      <span>Sign Out Google</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all shadow-lg shrink-0 border ${
              isAdminLoggedIn
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400/40 text-white shadow-emerald-900/40 hover:opacity-95 ring-2 ring-emerald-500/30'
                : 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 border-rose-400/40 text-white shadow-rose-900/50 hover:opacity-95 hover:scale-105 active:scale-95 ring-2 ring-rose-500/30'
            }`}
            title="Administrator Dashboard & Management"
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
            <span className="font-extrabold tracking-wide">{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input Row with Predictive Suggestions */}
      {searchOpen && (
        <div ref={mobileSearchRef} className="sm:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search movies, anime, dramas..."
              className="w-full bg-slate-900 text-sm text-white placeholder-slate-400 pl-9 pr-8 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setIsSearchFocused(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {renderSuggestionsDropdown(true)}
          </div>
        </div>
      )}

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-2">
          {/* Top Mobile Admin Button */}
          <div className="pb-2 border-b border-slate-800/80">
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg border transition-all ${
                isAdminLoggedIn
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400/40 text-white shadow-emerald-900/40'
                  : 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 border-rose-400/40 text-white shadow-rose-900/50'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-amber-300" />
              <span>{isAdminLoggedIn ? 'Enter Admin Panel' : 'Admin Login / Panel (అడ్మిన్)'}</span>
            </button>
          </div>

          <button
            onClick={() => { onSelectCategory('all'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${currentCategory === 'all' ? 'bg-rose-600/20 text-rose-400' : 'text-slate-300'}`}
          >
            Home
          </button>
          <button
            onClick={() => { onSelectCategory('cinema'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${currentCategory === 'cinema' ? 'bg-rose-600/20 text-rose-400' : 'text-slate-300'}`}
          >
            <Clapperboard className="w-4 h-4 text-rose-500" /> Cinema Movies
          </button>
          <button
            onClick={() => { onSelectCategory('anime'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${currentCategory === 'anime' ? 'bg-rose-600/20 text-rose-400' : 'text-slate-300'}`}
          >
            <Tv className="w-4 h-4 text-purple-400" /> Anime & Series
          </button>
          <button
            onClick={() => { onSelectCategory('calendar'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${currentCategory === 'calendar' ? 'bg-rose-600/20 text-rose-400' : 'text-slate-300'}`}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Anime Calendar
            </span>
            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Simulcast
            </span>
          </button>
          <button
            onClick={() => { onSelectCategory('drama'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${currentCategory === 'drama' ? 'bg-rose-600/20 text-rose-400' : 'text-slate-300'}`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Drama
          </button>
          <button
            onClick={() => { onSelectCategory('reels'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${currentCategory === 'reels' ? 'bg-rose-600/20 text-rose-400' : 'text-slate-300'}`}
          >
            <Video className="w-4 h-4 text-cyan-400" /> Reels 9:16
          </button>
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 px-1">
            <button
              onClick={() => { onSelectCategory('action'); setMobileMenuOpen(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${currentCategory === 'action' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400'}`}
            >
              Action
            </button>
            <button
              onClick={() => { onSelectCategory('comedy'); setMobileMenuOpen(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${currentCategory === 'comedy' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400'}`}
            >
              Comedy
            </button>
            <button
              onClick={() => { onSelectCategory('scifi'); setMobileMenuOpen(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${currentCategory === 'scifi' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'}`}
            >
              Sci-Fi
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
