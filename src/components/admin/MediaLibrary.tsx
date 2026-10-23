import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit, Eye, CheckCircle, Clock, Clapperboard, Tv, Sparkles, Video, Flame, Smile, Rocket } from 'lucide-react';
import { MediaItem, CategoryType } from '../../types';

interface MediaLibraryProps {
  mediaList: MediaItem[];
  onUpdateStatus: (id: string, status: 'published' | 'draft') => void;
  onDelete: (id: string) => void;
  activeFilter?: string;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ 
  mediaList, 
  onUpdateStatus, 
  onDelete,
  activeFilter = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(activeFilter);

  useEffect(() => {
    if (activeFilter) {
      setSelectedCategory(activeFilter);
    }
  }, [activeFilter]);

  const filtered = mediaList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesCat = true;
    if (selectedCategory === 'all') {
      matchesCat = true;
    } else if (selectedCategory === 'cat-cinema' || selectedCategory === 'cinema') {
      matchesCat = item.category === 'cinema';
    } else if (selectedCategory === 'cat-anime' || selectedCategory === 'anime') {
      matchesCat = item.category === 'anime';
    } else if (selectedCategory === 'cat-drama' || selectedCategory === 'drama') {
      matchesCat = item.category === 'drama';
    } else if (selectedCategory === 'cat-reels' || selectedCategory === 'reels') {
      matchesCat = item.category === 'reels';
    } else if (selectedCategory === 'genre-action' || selectedCategory === 'action') {
      matchesCat = item.genres.some(g => g.toLowerCase().includes('action')) || item.category === 'action';
    } else if (selectedCategory === 'genre-comedy' || selectedCategory === 'comedy') {
      matchesCat = item.genres.some(g => g.toLowerCase().includes('comedy')) || item.category === 'comedy';
    } else if (selectedCategory === 'genre-scifi' || selectedCategory === 'scifi') {
      matchesCat = item.genres.some(g => g.toLowerCase().includes('sci-fi')) || item.category === 'scifi';
    } else {
      matchesCat = item.category === selectedCategory;
    }

    return matchesSearch && matchesCat;
  });

  const getHeaderTitle = () => {
    if (selectedCategory.includes('action')) return 'Action Genre Sub-Category Management';
    if (selectedCategory.includes('comedy')) return 'Comedy Genre Sub-Category Management';
    if (selectedCategory.includes('scifi')) return 'Sci-Fi Genre Sub-Category Management';
    if (selectedCategory.includes('cinema')) return 'Cinema Movies Catalog';
    if (selectedCategory.includes('anime')) return 'Anime & Series Catalog';
    if (selectedCategory.includes('drama')) return 'Drama Titles Catalog';
    if (selectedCategory.includes('reels')) return 'Reels 9:16 Clips Catalog';
    return 'Media Library Management';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">{getHeaderTitle()}</h1>
          <p className="text-sm text-slate-400">
            Manage published titles, sub-categories, watch progress, and stream assets ({filtered.length} items)
          </p>
        </div>
        
        {/* Search & Category Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-full bg-slate-900 text-sm text-white placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 text-sm text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
          >
            <option value="all">All Media</option>
            <optgroup label="Main Categories">
              <option value="cat-cinema">Cinema Movies</option>
              <option value="cat-anime">Anime & Series</option>
              <option value="cat-drama">Drama Titles</option>
              <option value="cat-reels">Reels 9:16 Clips</option>
            </optgroup>
            <optgroup label="Genre Sub-Categories">
              <option value="genre-action">Action Sub-Category</option>
              <option value="genre-comedy">Comedy Sub-Category</option>
              <option value="genre-scifi">Sci-Fi Sub-Category</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Media Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Title</th>
                <th className="py-3.5 px-4">Category & Genres</th>
                <th className="py-3.5 px-4">Year & Rating</th>
                <th className="py-3.5 px-4">Watch Progress</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={item.posterUrl} alt={item.title} className="w-10 h-10 object-cover rounded-xl" />
                    <div>
                      <div className="text-white font-bold">{item.title}</div>
                      <div className="text-xs text-slate-400">{item.mediaType.toUpperCase()}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-xs">
                    <span className="text-rose-400 uppercase font-bold">{item.category}</span>
                    <div className="text-slate-400 mt-0.5">{item.genres.join(', ')}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-300 text-xs">
                    <div>{item.releaseYear}</div>
                    <div className="text-slate-500">{item.rating}</div>
                  </td>
                  <td className="py-4 px-4">
                    {typeof item.watchProgress === 'number' && item.watchProgress > 0 ? (
                      <div className="w-32 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold">
                          <span className="text-rose-400">{item.watchProgress}%</span>
                          <span className="text-slate-500">Watched</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
                            style={{ width: `${item.watchProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Unwatched</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {item.status === 'published' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      <span className="capitalize">{item.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => onUpdateStatus(item.id, item.status === 'published' ? 'draft' : 'published')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    >
                      {item.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
                          onDelete(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 transition-colors"
                      title="Delete Media"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No media items found matching this category/genre filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
