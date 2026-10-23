import { AnimeSimulcastItem } from '../types';

const now = Date.now();
const oneHour = 3600000;
const oneDay = 86400000;

export const INITIAL_ANIME_SIMULCAST: AnimeSimulcastItem[] = [
  {
    id: 'sim-1',
    seriesId: 'media-2',
    seriesTitle: 'Blade of the Eternal Dragon',
    episodeNumber: 3,
    seasonNumber: 2,
    episodeTitle: 'The Celestial Gate Opens',
    scheduledReleaseTime: now + oneHour * 3.5, // Releases today in 3.5 hours!
    timezone: 'JST (UTC+9)',
    audioType: 'both',
    status: 'upcoming',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1920&auto=format&fit=crop',
    synopsis: 'As shadow legions assemble around the holy shrine, Master Kenji reveals the secret of the dragon blade.',
    genres: ['Action', 'Fantasy', 'Martial Arts'],
    dayOfWeek: 'Friday'
  },
  {
    id: 'sim-2',
    seriesId: 'media-6',
    seriesTitle: 'Titan Mecha: Zero Protocol',
    episodeNumber: 2,
    seasonNumber: 1,
    episodeTitle: 'Neural Feedback Overdrive',
    scheduledReleaseTime: now + oneHour * 8, // Releases later today
    timezone: 'JST (UTC+9)',
    audioType: 'sub',
    status: 'upcoming',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1920&auto=format&fit=crop',
    synopsis: 'The orbital fleet detects cloaked vanguard ships bypassing Mars defense perimeter.',
    genres: ['Mecha', 'Sci-Fi', 'Action'],
    dayOfWeek: 'Friday'
  },
  {
    id: 'sim-3',
    seriesId: 'media-8',
    seriesTitle: 'Chronicles of the Wind Alchemist',
    episodeNumber: 7,
    seasonNumber: 1,
    episodeTitle: 'Storm over the Silver Valley',
    scheduledReleaseTime: now - oneHour * 4, // Released today earlier!
    timezone: 'JST (UTC+9)',
    audioType: 'both',
    status: 'available',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    synopsis: 'Lina deciphers an ancient elemental glyph while airborne pirates pursue her zeppelin.',
    genres: ['Fantasy', 'Adventure', 'Magic'],
    dayOfWeek: 'Friday'
  },
  {
    id: 'sim-4',
    seriesId: 'media-9',
    seriesTitle: 'Tokyo Spirit Exorcist S3',
    episodeNumber: 11,
    seasonNumber: 3,
    episodeTitle: 'Night of the Thousand Lanterns',
    scheduledReleaseTime: now + oneDay * 1 + oneHour * 2,
    timezone: 'JST (UTC+9)',
    audioType: 'sub',
    status: 'upcoming',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1920&auto=format&fit=crop',
    synopsis: 'The district barrier begins to flicker as restless spirits break through the Shinjuku gateway.',
    genres: ['Supernatural', 'Action', 'Mystery'],
    dayOfWeek: 'Saturday'
  },
  {
    id: 'sim-5',
    seriesId: 'media-10',
    seriesTitle: 'Valkyrie Academy: Aria of Steel',
    episodeNumber: 4,
    seasonNumber: 1,
    episodeTitle: 'Duel in the Starlight Arena',
    scheduledReleaseTime: now + oneDay * 2 + oneHour * 5,
    timezone: 'JST (UTC+9)',
    audioType: 'both',
    status: 'upcoming',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    synopsis: 'Cadets compete in the tournament to determine who earns rank in the High Vanguard.',
    genres: ['Action', 'School', 'Fantasy'],
    dayOfWeek: 'Sunday'
  },
  {
    id: 'sim-6',
    seriesId: 'media-11',
    seriesTitle: 'Demon Lord Reincarnation Cafe',
    episodeNumber: 8,
    seasonNumber: 1,
    episodeTitle: 'A Recipe to Save the Kingdom',
    scheduledReleaseTime: now + oneDay * 3 + oneHour * 6,
    timezone: 'JST (UTC+9)',
    audioType: 'dub',
    status: 'upcoming',
    posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1920&auto=format&fit=crop',
    synopsis: 'Former conqueror Malakor discovers magical pastries pacify warring goblin tribes.',
    genres: ['Comedy', 'Fantasy', 'Slice of Life'],
    dayOfWeek: 'Monday'
  }
];
