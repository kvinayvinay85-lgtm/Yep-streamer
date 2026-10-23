export type CategoryType = 'cinema' | 'anime' | 'drama' | 'reels' | 'action' | 'comedy' | 'scifi' | 'calendar';

export type MediaStatus = 'draft' | 'uploading' | 'uploaded' | 'processing' | 'ready' | 'published' | 'failed';

export type SimulcastAudioType = 'sub' | 'dub' | 'both';
export type SimulcastStatus = 'upcoming' | 'available' | 'delayed';

export interface AnimeSimulcastItem {
  id: string;
  seriesId: string;
  seriesTitle: string;
  episodeNumber: number;
  seasonNumber: number;
  episodeTitle: string;
  scheduledReleaseTime: number; // Unix timestamp in ms
  timezone: string;
  audioType: SimulcastAudioType;
  status: SimulcastStatus;
  posterUrl: string;
  bannerUrl: string;
  synopsis?: string;
  genres: string[];
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
}

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
  description?: string;
  introStart?: number; // in seconds
  introEnd?: number; // in seconds
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  mediaType: 'movie' | 'series' | 'reel';
  releaseYear: number;
  language: string;
  genres: string[];
  duration?: string;
  rating: string; // e.g. "PG-13", "TV-MA", "R"
  score: number; // e.g. 9.4
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  status: MediaStatus;
  featured?: boolean;
  trending?: boolean;
  seasonsCount?: number;
  episodes?: Episode[];
  createdAt: number;
  updatedAt: number;
  uploader?: string;
  viewsCount: number;
  fileSize?: number;
  fileName?: string;
  watchProgress?: number; // 0-100 percentage partially watched
  lastWatchedAt?: number;
  introStart?: number;
  introEnd?: number;
  availableAudio?: string[];
  availableSubtitles?: string[];
}

export type FeatureStatus = 'EXISTING' | 'PROPOSED' | 'IN_PROGRESS' | 'IMPLEMENTED' | 'TESTED' | 'BLOCKED' | 'REJECTED_DUPLICATE';

export interface FeatureRegistryItem {
  featureId: number;
  name: string;
  category: string;
  description: string;
  duplicateCheck: string;
  dependencies: number[];
  status: FeatureStatus;
  acceptanceCriteria: string;
  testEvidence: string;
  filesChanged: string[];
  updatedAt: string;
}

export interface UploadJob {
  id: string;
  fileName: string;
  fileSize: number;
  progress: number;
  status: 'pending' | 'uploading' | 'paused' | 'success' | 'error';
  stage: 'source' | 'transfer' | 'metadata' | 'artwork' | 'publish';
  error?: string;
  downloadUrl?: string;
  createdAt: number;
}

export interface ProcessingJob {
  id: string;
  mediaId: string;
  title: string;
  type: 'transcode_hls' | 'thumbnail_gen' | 'validation';
  progress: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  startedAt: number;
  completedAt?: number;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error';
}

export interface MediaChapter {
  id: string;
  title: string;
  startTime: number; // in seconds
  endTime: number;
}

export interface PlaybackPreferences {
  speed: number;
  quality: string;
  audioTrack: string;
  subtitleTrack: string;
  subtitleSize: 'sm' | 'md' | 'lg';
  subtitleColor: string;
  subtitleBg: string;
  nightMode: boolean;
  lowLatencyMode: boolean;
  audioProfile: string;
}

