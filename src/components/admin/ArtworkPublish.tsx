import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Check, Sparkles } from 'lucide-react';

export const ArtworkPublish: React.FC = () => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop');
  const [success, setSuccess] = useState(false);

  const handlePublishArtwork = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setTitle('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Artwork Direct Publish</h1>
        <p className="text-sm text-slate-400">Upload and instantly publish posters, banners, and promotional assets</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Artwork successfully uploaded and published to Cloud Storage!</span>
          </div>
        )}

        <form onSubmit={handlePublishArtwork} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Artwork Title / Identifier</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cyberpunk Season 2 Banner"
              className="w-full bg-slate-950 text-white text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Image URL or File Upload</label>
            <input
              type="text"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-950 text-white text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 hover:opacity-95"
          >
            Publish Artwork Asset
          </button>
        </form>
      </div>
    </div>
  );
};
