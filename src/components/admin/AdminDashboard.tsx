import React from 'react';
import { Film, Clapperboard, Tv, Sparkles, Video, Upload, CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react';
import { MediaItem } from '../../types';

interface AdminDashboardProps {
  mediaList: MediaItem[];
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ mediaList, onNavigateTab }) => {
  const publishedCount = mediaList.filter(m => m.status === 'published').length;
  const draftCount = mediaList.filter(m => m.status === 'draft').length;
  const cinemaCount = mediaList.filter(m => m.category === 'cinema').length;
  const animeCount = mediaList.filter(m => m.category === 'anime').length;
  const dramaCount = mediaList.filter(m => m.category === 'drama').length;
  const reelsCount = mediaList.filter(m => m.category === 'reels').length;
  const totalViews = mediaList.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Admin Command Center</h1>
          <p className="text-sm text-slate-400">YEP Streamer 2M-Level Enterprise Infrastructure & Media Pipeline</p>
        </div>
        <button
          onClick={() => onNavigateTab('upload')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 hover:opacity-95 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Media</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Published Media</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{publishedCount}</div>
          <p className="text-xs text-slate-400">Active on public platform</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Draft & Pending</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{draftCount}</div>
          <p className="text-xs text-slate-400">Ready for review & publish</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Catalog Streams</span>
            <Activity className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalViews.toLocaleString()}</div>
          <p className="text-xs text-slate-400">Aggregated viewer plays</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Storage Health</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-white">99.98%</div>
          <p className="text-xs text-slate-400">Cloud buckets operational</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => onNavigateTab('library')} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 cursor-pointer flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-500">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Cinema Movies</div>
              <div className="text-xs text-slate-400">{cinemaCount} titles</div>
            </div>
          </div>
        </div>

        <div onClick={() => onNavigateTab('library')} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 cursor-pointer flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Anime & Series</div>
              <div className="text-xs text-slate-400">{animeCount} titles</div>
            </div>
          </div>
        </div>

        <div onClick={() => onNavigateTab('library')} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 cursor-pointer flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Drama Titles</div>
              <div className="text-xs text-slate-400">{dramaCount} titles</div>
            </div>
          </div>
        </div>

        <div onClick={() => onNavigateTab('library')} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-600/20 text-cyan-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Reels 9:16 Clips</div>
              <div className="text-xs text-slate-400">{reelsCount} clips</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-white font-bold text-base">Recently Published Media</h2>
          <button onClick={() => onNavigateTab('library')} className="text-xs font-semibold text-rose-400 hover:underline">
            View All Library
          </button>
        </div>
        <div className="divide-y divide-slate-800">
          {mediaList.slice(0, 5).map(item => (
            <div key={item.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={item.posterUrl} alt={item.title} className="w-12 h-12 object-cover rounded-xl" />
                <div>
                  <div className="text-white font-bold text-sm">{item.title}</div>
                  <div className="text-xs text-slate-400">{item.category} • {item.releaseYear} • {item.duration || 'N/A'}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                Published
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
