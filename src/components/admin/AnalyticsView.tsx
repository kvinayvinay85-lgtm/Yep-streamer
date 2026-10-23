import React from 'react';
import { BarChart3, TrendingUp, Users, Film } from 'lucide-react';
import { StorageService } from '../../services/storageService';

export const AnalyticsView: React.FC = () => {
  const mediaList = StorageService.getMedia();
  const totalViews = mediaList.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Platform Analytics</h1>
        <p className="text-sm text-slate-400">Aggregated streaming metrics, viewer engagement, and bandwidth reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-slate-400 text-xs font-semibold uppercase">Total Views</div>
          <div className="text-3xl font-extrabold text-white">{totalViews.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-slate-400 text-xs font-semibold uppercase">Active Subscribers</div>
          <div className="text-3xl font-extrabold text-white">48,290</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> +1,240 today
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-slate-400 text-xs font-semibold uppercase">Published Titles</div>
          <div className="text-3xl font-extrabold text-white">{mediaList.length}</div>
          <div className="text-xs text-rose-400 font-medium flex items-center gap-1">
            <Film className="w-3.5 h-3.5" /> 100% Cloud Synced
          </div>
        </div>
      </div>
    </div>
  );
};
