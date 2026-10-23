import React from 'react';
import { Activity, CheckCircle } from 'lucide-react';
import { StorageService } from '../../services/storageService';

export const ProcessingJobsView: React.FC = () => {
  const jobs = StorageService.getProcessingJobs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Processing & Transcoding Queue</h1>
        <p className="text-sm text-slate-400">Background worker queue for HLS adaptive bitrate generation</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-purple-400 animate-spin" />
              <div>
                <div className="text-white font-bold text-sm">{job.title}</div>
                <div className="text-xs text-slate-400">Type: {job.type} • Progress: {job.progress}%</div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> {job.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
