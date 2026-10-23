import React, { useState, useEffect } from 'react';
import { AnimeSimulcastItem, MediaItem } from '../types';
import { StorageService } from '../services/storageService';
import { Calendar as CalendarIcon, Clock, Bell, BellRing, Play, Sparkles, Filter, ChevronRight, Globe, Tv } from 'lucide-react';

interface AnimeCalendarViewProps {
  onPlayMedia: (item: MediaItem) => void;
  mediaList: MediaItem[];
}

export const AnimeCalendarView: React.FC<AnimeCalendarViewProps> = ({ onPlayMedia, mediaList }) => {
  const [schedule, setSchedule] = useState<AnimeSimulcastItem[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [audioFilter, setAudioFilter] = useState<'all' | 'sub' | 'dub' | 'both'>('all');
  const [nowTime, setNowTime] = useState(Date.now());

  useEffect(() => {
    setSchedule(StorageService.getSimulcastSchedule());
    setReminders(StorageService.getReminders());

    const interval = setInterval(() => {
      setNowTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleReminder = (id: string) => {
    const updated = StorageService.toggleReminder(id);
    setReminders([...updated]);
  };

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredSchedule = schedule.filter(item => {
    const matchesDay = selectedDay === 'All' || item.dayOfWeek === selectedDay;
    const matchesAudio = audioFilter === 'all' || item.audioType === audioFilter || item.audioType === 'both';
    return matchesDay && matchesAudio;
  });

  const formatCountdown = (targetTime: number) => {
    const diff = targetTime - nowTime;
    if (diff <= 0) return 'AVAILABLE NOW';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `in ${days}d ${hours % 24}h`;
    }
    return `in ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleWatch = (item: AnimeSimulcastItem) => {
    const media = mediaList.find(m => m.id === item.seriesId) || mediaList.find(m => m.category === 'anime');
    if (media) {
      onPlayMedia(media);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-r from-amber-600/20 via-purple-900/30 to-slate-900 border border-amber-500/30 shadow-2xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Crunchyroll-Inspired Simulcast Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Anime Simulcast & Release Calendar
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Direct from Tokyo broadcast studios. Watch brand new subbed & dubbed episodes within hours of Japanese TV premiere with live release countdowns.
          </p>
        </div>
      </div>

      {/* Day Selector & Filters */}
      <div className="space-y-4">
        {/* Day Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedDay === day
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Audio Type Filter Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Audio Version:</span>
            <div className="flex items-center gap-1.5 ml-2">
              {(['all', 'sub', 'dub', 'both'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setAudioFilter(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    audioFilter === type
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {type === 'both' ? 'Sub & Dub' : type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>Timezone: Tokyo / JST (UTC+9)</span>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchedule.map(item => {
          const isAvailable = item.status === 'available' || (item.scheduledReleaseTime <= nowTime);
          const hasReminder = reminders.includes(item.id);

          return (
            <div
              key={item.id}
              className="group relative bg-slate-900 rounded-2xl border border-slate-800/80 hover:border-amber-500/50 overflow-hidden shadow-xl hover:shadow-amber-500/10 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Banner & Poster Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.bannerUrl || item.posterUrl}
                    alt={item.seriesTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow">
                      {item.dayOfWeek}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold uppercase border border-slate-700">
                      {item.audioType === 'both' ? 'SUB & DUB' : `${item.audioType.toUpperCase()} ONLY`}
                    </span>
                  </div>

                  {/* Reminder Bell Button */}
                  <button
                    onClick={() => handleToggleReminder(item.id)}
                    className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all ${
                      hasReminder
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                        : 'bg-slate-950/70 text-slate-300 border-slate-700/50 hover:text-white hover:bg-slate-800'
                    }`}
                    title={hasReminder ? 'Remove Episode Reminder' : 'Set Release Reminder'}
                  >
                    {hasReminder ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </button>

                  {/* Countdown / Available Indicator */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg ${
                      isAvailable
                        ? 'bg-emerald-500/90 text-slate-950'
                        : 'bg-slate-950/90 text-amber-400 border border-amber-500/40'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isAvailable ? 'AVAILABLE TO STREAM' : formatCountdown(item.scheduledReleaseTime)}</span>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 sm:p-5 space-y-2">
                  <div className="text-xs text-amber-400 font-bold tracking-wide">
                    Season {item.seasonNumber} • Episode {item.episodeNumber}
                  </div>
                  <h3 className="text-white font-extrabold text-base line-clamp-1 group-hover:text-amber-400 transition-colors">
                    {item.seriesTitle}
                  </h3>
                  <div className="text-slate-300 text-xs font-semibold">
                    "{item.episodeTitle}"
                  </div>
                  {item.synopsis && (
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed pt-1">
                      {item.synopsis}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-4 sm:p-5 pt-0">
                {isAvailable ? (
                  <button
                    onClick={() => handleWatch(item)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Episode Now</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleReminder(item.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      hasReminder
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    {hasReminder ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                    <span>{hasReminder ? 'Reminder Scheduled' : 'Notify Me at Airing'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSchedule.length === 0 && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-white font-bold text-base">No simulcast releases found</h3>
          <p className="text-xs text-slate-400">Try switching the day filter or selecting all audio types.</p>
        </div>
      )}

    </div>
  );
};
