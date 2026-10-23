import React, { useState, useEffect } from 'react';
import { AnimeSimulcastItem } from '../../types';
import { StorageService } from '../../services/storageService';
import { Calendar, Plus, Trash2, Clock, CheckCircle, Sparkles, AlertCircle, Edit, Globe } from 'lucide-react';

export const AnimeSchedulerView: React.FC = () => {
  const [schedule, setSchedule] = useState<AnimeSimulcastItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [seriesTitle, setSeriesTitle] = useState('Blade of the Eternal Dragon');
  const [episodeNumber, setEpisodeNumber] = useState(4);
  const [seasonNumber, setSeasonNumber] = useState(2);
  const [episodeTitle, setEpisodeTitle] = useState('Shadow of the Demon Shrine');
  const [dayOfWeek, setDayOfWeek] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Friday');
  const [audioType, setAudioType] = useState<'sub' | 'dub' | 'both'>('both');
  const [status, setStatus] = useState<'upcoming' | 'available' | 'delayed'>('upcoming');
  const [hoursFromNow, setHoursFromNow] = useState(6);
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop');

  useEffect(() => {
    setSchedule(StorageService.getSimulcastSchedule());
  }, []);

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const scheduledTime = Date.now() + hoursFromNow * 3600000;
    const newItem: AnimeSimulcastItem = {
      id: 'sim-' + Date.now(),
      seriesId: 'media-' + Date.now(),
      seriesTitle,
      episodeNumber: Number(episodeNumber),
      seasonNumber: Number(seasonNumber),
      episodeTitle,
      scheduledReleaseTime: scheduledTime,
      timezone: 'JST (UTC+9)',
      audioType,
      status,
      posterUrl,
      bannerUrl: posterUrl,
      synopsis: 'Scheduled episode broadcast directly from Tokyo studios.',
      genres: ['Action', 'Fantasy'],
      dayOfWeek
    };

    const updated = StorageService.addSimulcastItem(newItem);
    setSchedule([...updated]);
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this scheduled release?')) {
      const updated = StorageService.deleteSimulcastItem(id);
      setSchedule([...updated]);
    }
  };

  const handleToggleStatus = (id: string, current: string) => {
    const nextStatus = current === 'upcoming' ? 'available' : 'upcoming';
    const updated = StorageService.updateSimulcastItem(id, { status: nextStatus as any });
    setSchedule([...updated]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-amber-500" />
            Anime Simulcast & Broadcast Scheduler
          </h1>
          <p className="text-sm text-slate-400">
            Configure Crunchyroll-style Tokyo broadcast times, weekly releases, and sub/dub availability
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Episode</span>
        </button>
      </div>

      {/* Scheduler Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Anime Series & Episode</th>
                <th className="py-3.5 px-4">Broadcast Day</th>
                <th className="py-3.5 px-4">Audio Type</th>
                <th className="py-3.5 px-4">Release Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {schedule.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={item.posterUrl} alt={item.seriesTitle} className="w-10 h-10 object-cover rounded-xl" />
                    <div>
                      <div className="text-white font-bold">{item.seriesTitle}</div>
                      <div className="text-xs text-slate-400">
                        S{item.seasonNumber} E{item.episodeNumber}: {item.episodeTitle}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-xs text-amber-400">
                    {item.dayOfWeek}
                  </td>
                  <td className="py-4 px-4 text-xs font-bold uppercase">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.audioType}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-300">
                    <div>{new Date(item.scheduledReleaseTime).toLocaleString()}</div>
                    <div className="text-slate-500">{item.timezone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'available'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span className="capitalize">{item.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    >
                      {item.status === 'available' ? 'Set Upcoming' : 'Mark Available'}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="text-xl font-extrabold text-white">Schedule New Anime Episode</h2>
            
            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Anime Series Title</label>
                <input
                  type="text"
                  required
                  value={seriesTitle}
                  onChange={(e) => setSeriesTitle(e.target.value)}
                  className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Season Number</label>
                  <input
                    type="number"
                    value={seasonNumber}
                    onChange={(e) => setSeasonNumber(Number(e.target.value))}
                    className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Episode Number</label>
                  <input
                    type="number"
                    value={episodeNumber}
                    onChange={(e) => setEpisodeNumber(Number(e.target.value))}
                    className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Episode Title</label>
                <input
                  type="text"
                  required
                  value={episodeTitle}
                  onChange={(e) => setEpisodeTitle(e.target.value)}
                  className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Day of Airing</label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value as any)}
                    className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Audio Format</label>
                  <select
                    value={audioType}
                    onChange={(e) => setAudioType(e.target.value as any)}
                    className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="both">Sub & Dub</option>
                    <option value="sub">Subtitled Only</option>
                    <option value="dub">Dubbed Only</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Release Offset (Hours from now)</label>
                <input
                  type="number"
                  value={hoursFromNow}
                  onChange={(e) => setHoursFromNow(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
