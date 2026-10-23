import React from 'react';
import { Upload, CheckCircle, Clock } from 'lucide-react';

export const UploadActivityView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Upload Activity & Queue</h1>
        <p className="text-sm text-slate-400">Real-time monitoring of cloud storage transfers and resumable uploads</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-rose-500" />
            <div>
              <div className="text-white font-bold text-sm">cyberpunk_chronicles_1080p.mp4</div>
              <div className="text-xs text-slate-400">2.45 GB • Completed 5 days ago</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Success
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-white font-bold text-sm">blade_eternal_s1.mp4</div>
              <div className="text-xs text-slate-400">1.80 GB • Completed 12 days ago</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Success
          </span>
        </div>
      </div>
    </div>
  );
};
