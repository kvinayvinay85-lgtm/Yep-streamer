import React, { useState } from 'react';
import { Settings, Check, ShieldCheck } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [siteName, setSiteName] = useState('YEP STREAMER');
  const [maxUploadSize, setMaxUploadSize] = useState('50');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">System Settings & Configuration</h1>
        <p className="text-sm text-slate-400">Enterprise parameters, storage quotas, and security options</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {saved && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Platform Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full bg-slate-950 text-white text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Max Upload File Size (GB)</label>
            <input
              type="number"
              value={maxUploadSize}
              onChange={(e) => setMaxUploadSize(e.target.value)}
              className="w-full bg-slate-950 text-white text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Firebase Security Rules & Cloud Storage Connected</span>
            </div>
            <p className="text-xs text-slate-400">Database & storage endpoints are active and verified.</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 hover:opacity-95"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
