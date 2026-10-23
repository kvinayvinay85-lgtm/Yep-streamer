import { MediaItem, AuditLog, UploadJob, ProcessingJob, AnimeSimulcastItem, PlaybackPreferences } from '../types';
import { INITIAL_MEDIA, INITIAL_AUDIT_LOGS } from '../data/mockData';
import { INITIAL_ANIME_SIMULCAST } from '../data/animeCalendarData';

const MEDIA_STORAGE_KEY = 'yep_streamer_media_v1';
const AUDIT_STORAGE_KEY = 'yep_streamer_audit_v1';
const UPLOADS_STORAGE_KEY = 'yep_streamer_uploads_v1';
const PROCESSING_STORAGE_KEY = 'yep_streamer_processing_v1';
const WATCHLIST_STORAGE_KEY = 'yep_streamer_watchlist_v1';

export const StorageService = {
  getMedia(): MediaItem[] {
    try {
      const data = localStorage.getItem(MEDIA_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(INITIAL_MEDIA));
        return INITIAL_MEDIA;
      }
      const parsed: MediaItem[] = JSON.parse(data);
      let updated = false;
      INITIAL_MEDIA.forEach(seed => {
        const found = parsed.find(p => p.id === seed.id);
        if (!found) {
          parsed.push(seed);
          updated = true;
        } else if (found.watchProgress === undefined && seed.watchProgress !== undefined) {
          found.watchProgress = seed.watchProgress;
          found.lastWatchedAt = seed.lastWatchedAt;
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return INITIAL_MEDIA;
    }
  },

  updateWatchProgress(id: string, progress: number): MediaItem[] {
    const items = this.getMedia();
    const updated = items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          watchProgress: Math.min(100, Math.max(0, Math.round(progress))),
          lastWatchedAt: Date.now()
        };
      }
      return item;
    });
    this.saveMedia(updated);
    return updated;
  },

  saveMedia(items: MediaItem[]): void {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
  },

  addMedia(item: MediaItem): MediaItem[] {
    const items = this.getMedia();
    const updated = [item, ...items];
    this.saveMedia(updated);
    this.addAuditLog({
      id: 'log-' + Date.now(),
      action: 'MEDIA_CREATED',
      user: item.uploader || 'admin@yepstreamer.com',
      details: `Created media record "${item.title}" (${item.category})`,
      timestamp: Date.now(),
      level: 'info'
    });
    return updated;
  },

  updateMedia(id: string, updates: Partial<MediaItem>): MediaItem[] {
    const items = this.getMedia();
    const updated = items.map(item => item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item);
    this.saveMedia(updated);
    this.addAuditLog({
      id: 'log-' + Date.now(),
      action: 'MEDIA_UPDATED',
      user: 'admin@yepstreamer.com',
      details: `Updated media ID ${id}`,
      timestamp: Date.now(),
      level: 'info'
    });
    return updated;
  },

  deleteMedia(id: string): MediaItem[] {
    const items = this.getMedia();
    const target = items.find(i => i.id === id);
    const updated = items.filter(item => item.id !== id);
    this.saveMedia(updated);
    this.addAuditLog({
      id: 'log-' + Date.now(),
      action: 'MEDIA_DELETED',
      user: 'admin@yepstreamer.com',
      details: `Deleted media "${target?.title || id}"`,
      timestamp: Date.now(),
      level: 'warn'
    });
    return updated;
  },

  getAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
        return INITIAL_AUDIT_LOGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  addAuditLog(log: AuditLog): void {
    const logs = this.getAuditLogs();
    const updated = [log, ...logs].slice(0, 100); // keep last 100
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  },

  getWatchlist(): string[] {
    try {
      const data = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleWatchlist(mediaId: string): string[] {
    const list = this.getWatchlist();
    let updated: string[];
    if (list.includes(mediaId)) {
      updated = list.filter(id => id !== mediaId);
    } else {
      updated = [...list, mediaId];
    }
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  getUploadJobs(): UploadJob[] {
    try {
      const data = localStorage.getItem(UPLOADS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUploadJobs(jobs: UploadJob[]): void {
    localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(jobs));
  },

  getProcessingJobs(): ProcessingJob[] {
    try {
      const data = localStorage.getItem(PROCESSING_STORAGE_KEY);
      return data ? JSON.parse(data) : [
        {
          id: 'proc-1',
          mediaId: 'media-1',
          title: 'Cyberpunk Chronicles: Neon Rebellion',
          type: 'transcode_hls',
          progress: 100,
          status: 'completed',
          startedAt: Date.now() - 3600000,
          completedAt: Date.now() - 3500000
        }
      ];
    } catch {
      return [];
    }
  },

  saveProcessingJobs(jobs: ProcessingJob[]): void {
    localStorage.setItem(PROCESSING_STORAGE_KEY, JSON.stringify(jobs));
  },

  getSimulcastSchedule(): AnimeSimulcastItem[] {
    try {
      const data = localStorage.getItem('yep_streamer_simulcast_v1');
      if (!data) {
        localStorage.setItem('yep_streamer_simulcast_v1', JSON.stringify(INITIAL_ANIME_SIMULCAST));
        return INITIAL_ANIME_SIMULCAST;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ANIME_SIMULCAST;
    }
  },

  saveSimulcastSchedule(items: AnimeSimulcastItem[]): void {
    localStorage.setItem('yep_streamer_simulcast_v1', JSON.stringify(items));
  },

  addSimulcastItem(item: AnimeSimulcastItem): AnimeSimulcastItem[] {
    const items = this.getSimulcastSchedule();
    const updated = [item, ...items];
    this.saveSimulcastSchedule(updated);
    this.addAuditLog({
      id: 'log-' + Date.now(),
      action: 'SIMULCAST_SCHEDULED',
      user: 'admin@yepstreamer.com',
      details: `Scheduled simulcast for ${item.seriesTitle} Ep ${item.episodeNumber}`,
      timestamp: Date.now(),
      level: 'info'
    });
    return updated;
  },

  updateSimulcastItem(id: string, updates: Partial<AnimeSimulcastItem>): AnimeSimulcastItem[] {
    const items = this.getSimulcastSchedule();
    const updated = items.map(it => it.id === id ? { ...it, ...updates } : it);
    this.saveSimulcastSchedule(updated);
    return updated;
  },

  deleteSimulcastItem(id: string): AnimeSimulcastItem[] {
    const items = this.getSimulcastSchedule();
    const updated = items.filter(it => it.id !== id);
    this.saveSimulcastSchedule(updated);
    return updated;
  },

  getReminders(): string[] {
    try {
      const data = localStorage.getItem('yep_streamer_reminders_v1');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleReminder(id: string): string[] {
    const list = this.getReminders();
    let updated: string[];
    if (list.includes(id)) {
      updated = list.filter(item => item !== id);
    } else {
      updated = [...list, id];
    }
    localStorage.setItem('yep_streamer_reminders_v1', JSON.stringify(updated));
    return updated;
  },

  getPlaybackPreferences(): PlaybackPreferences {
    try {
      const data = localStorage.getItem('yep_streamer_playback_prefs_v1');
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return {
      speed: 1,
      quality: 'Auto (Adaptive)',
      audioTrack: 'Japanese (Original)',
      subtitleTrack: 'English [CC]',
      subtitleSize: 'md',
      subtitleColor: '#FFFFFF',
      subtitleBg: 'rgba(0,0,0,0.7)',
      nightMode: false,
      lowLatencyMode: false,
      audioProfile: 'Stereo 2.0 AAC'
    };
  },

  savePlaybackPreferences(prefs: Partial<PlaybackPreferences>): PlaybackPreferences {
    const current = this.getPlaybackPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem('yep_streamer_playback_prefs_v1', JSON.stringify(updated));
    return updated;
  },

  getRecentSearches(): string[] {
    try {
      const data = localStorage.getItem('yep_streamer_recent_searches_v1');
      return data ? JSON.parse(data) : ['Cyberpunk', 'Demon Slayer', 'Solo Leveling', 'Echoes of Seoul'];
    } catch {
      return ['Cyberpunk', 'Demon Slayer', 'Solo Leveling', 'Echoes of Seoul'];
    }
  },

  addRecentSearch(query: string): string[] {
    if (!query || !query.trim()) return this.getRecentSearches();
    const clean = query.trim();
    const current = this.getRecentSearches().filter(q => q.toLowerCase() !== clean.toLowerCase());
    const updated = [clean, ...current].slice(0, 6);
    localStorage.setItem('yep_streamer_recent_searches_v1', JSON.stringify(updated));
    return updated;
  },

  removeRecentSearch(query: string): string[] {
    const current = this.getRecentSearches().filter(q => q.toLowerCase() !== query.toLowerCase());
    localStorage.setItem('yep_streamer_recent_searches_v1', JSON.stringify(current));
    return current;
  },

  clearRecentSearches(): void {
    localStorage.removeItem('yep_streamer_recent_searches_v1');
  }
};
