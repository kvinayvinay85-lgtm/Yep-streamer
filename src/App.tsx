import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { MediaItem, CategoryType } from './types';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { PublicHome } from './components/PublicHome';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UploadWizard } from './components/admin/UploadWizard';
import { MediaLibrary } from './components/admin/MediaLibrary';
import { ArtworkPublish } from './components/admin/ArtworkPublish';
import { UploadActivityView } from './components/admin/UploadActivityView';
import { ProcessingJobsView } from './components/admin/ProcessingJobsView';
import { AnalyticsView } from './components/admin/AnalyticsView';
import { AuditLogsView } from './components/admin/AuditLogsView';
import { AdminSettings } from './components/admin/AdminSettings';
import { FeatureRegistryView } from './components/admin/FeatureRegistryView';
import { AnimeCalendarView } from './components/AnimeCalendarView';
import { AnimeSchedulerView } from './components/admin/AnimeSchedulerView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { StartupIntro } from './components/StartupIntro';
import { GoogleLoginModal } from './components/GoogleLoginModal';

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('yep_intro_seen');
  });
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string; avatar: string } | null>(() => {
    try {
      const stored = localStorage.getItem('yep_streamer_google_user_v1');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryType | 'all' | 'watchlist'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [playingItem, setPlayingItem] = useState<MediaItem | null>(null);
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin');
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [currentAdminTab, setCurrentAdminTab] = useState('dashboard');

  useEffect(() => {
    setMediaList(StorageService.getMedia());
    setWatchlist(StorageService.getWatchlist());
  }, []);

  const handleToggleWatchlist = (id: string) => {
    const updated = StorageService.toggleWatchlist(id);
    setWatchlist([...updated]);
  };

  const handleMediaPublished = (newItem: MediaItem) => {
    const updated = StorageService.addMedia(newItem);
    setMediaList([...updated]);
    setCurrentAdminTab('library');
  };

  const handleUpdateStatus = (id: string, status: 'published' | 'draft') => {
    const updated = StorageService.updateMedia(id, { status });
    setMediaList([...updated]);
  };

  const handleDeleteMedia = (id: string) => {
    const updated = StorageService.deleteMedia(id);
    setMediaList([...updated]);
  };

  const handleUpdateWatchProgress = (id: string, progress: number) => {
    const updated = StorageService.updateWatchProgress(id, progress);
    setMediaList([...updated]);
    if (playingItem && playingItem.id === id) {
      setPlayingItem(prev => prev ? { ...prev, watchProgress: Math.round(progress) } : null);
    }
  };

  // 1. Render 4-Second Cinematic Startup Intro
  if (showIntro) {
    return (
      <StartupIntro 
        onComplete={() => {
          sessionStorage.setItem('yep_intro_seen', 'true');
          setShowIntro(false);
        }} 
      />
    );
  }

  // 2. Render Google Authentication Login
  if (!googleUser) {
    return (
      <GoogleLoginModal 
        onLoginSuccess={(user) => {
          localStorage.setItem('yep_streamer_google_user_v1', JSON.stringify(user));
          setGoogleUser(user);
        }} 
      />
    );
  }

  // 3. If Admin Mode is Active
  if (isAdminMode) {
    const isLibraryOrCategory = currentAdminTab === 'library' || 
      currentAdminTab.startsWith('cat-') || 
      currentAdminTab.startsWith('genre-');

    return (
      <AdminLayout
        currentAdminTab={currentAdminTab}
        onSelectTab={setCurrentAdminTab}
        onLogout={() => {
          setIsAdminMode(false);
          StorageService.addAuditLog({
            id: 'log-' + Date.now(),
            action: 'ADMIN_LOGOUT',
            user: adminEmail,
            details: 'Admin session terminated.',
            timestamp: Date.now(),
            level: 'info'
          });
        }}
        onReturnToPublic={() => setIsAdminMode(false)}
        adminEmail={adminEmail}
      >
        {currentAdminTab === 'dashboard' && (
          <AdminDashboard mediaList={mediaList} onNavigateTab={setCurrentAdminTab} />
        )}
        {currentAdminTab === 'upload' && (
          <UploadWizard onMediaPublished={handleMediaPublished} onCancel={() => setCurrentAdminTab('dashboard')} />
        )}
        {isLibraryOrCategory && (
          <MediaLibrary 
            mediaList={mediaList} 
            onUpdateStatus={handleUpdateStatus} 
            onDelete={handleDeleteMedia}
            activeFilter={currentAdminTab}
          />
        )}
        {currentAdminTab === 'features' && <FeatureRegistryView />}
        {currentAdminTab === 'anime-scheduler' && <AnimeSchedulerView />}
        {currentAdminTab === 'artwork' && <ArtworkPublish />}
        {currentAdminTab === 'uploads' && <UploadActivityView />}
        {currentAdminTab === 'processing' && <ProcessingJobsView />}
        {currentAdminTab === 'analytics' && <AnalyticsView />}
        {currentAdminTab === 'audit' && <AuditLogsView />}
        {currentAdminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased selection:bg-rose-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentCategory={currentCategory}
        onSelectCategory={setCurrentCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        watchlistCount={watchlist.length}
        onOpenAdmin={() => setAdminLoginModalOpen(true)}
        isAdminLoggedIn={isAdminMode}
        mediaList={mediaList}
        onSelectMedia={(item) => setPlayingItem(item)}
      />

      {/* Main Public Website Content */}
      <main className="pb-24 lg:pb-0">
        {currentCategory === 'calendar' ? (
          <AnimeCalendarView 
            onPlayMedia={setPlayingItem}
            mediaList={mediaList}
          />
        ) : (
          <PublicHome
            mediaList={mediaList}
            currentCategory={currentCategory}
            searchQuery={searchQuery}
            watchlist={watchlist}
            onPlay={setPlayingItem}
            onSelect={setPlayingItem}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectCategory={setCurrentCategory}
            onOpenAdmin={() => setAdminLoginModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Screen Bottom Navigation Bar (Down lo options anni set chesam) */}
      {!isAdminMode && (
        <MobileBottomNav
          currentCategory={currentCategory}
          onSelectCategory={setCurrentCategory}
          watchlistCount={watchlist.length}
          onOpenAdmin={() => setAdminLoginModalOpen(true)}
          isAdminLoggedIn={isAdminMode}
        />
      )}

      {/* Video Player Modal */}
      {playingItem && (
        <VideoPlayerModal
          item={playingItem}
          onClose={() => setPlayingItem(null)}
          isWatchlisted={watchlist.includes(playingItem.id)}
          onToggleWatchlist={handleToggleWatchlist}
          onUpdateProgress={handleUpdateWatchProgress}
        />
      )}

      {/* Admin Login Modal */}
      {adminLoginModalOpen && (
        <AdminLoginModal
          onClose={() => setAdminLoginModalOpen(false)}
          onLoginSuccess={(email) => {
            setAdminEmail(email);
            setIsAdminMode(true);
            setAdminLoginModalOpen(false);
            StorageService.addAuditLog({
              id: 'log-' + Date.now(),
              action: 'ADMIN_LOGIN',
              user: email,
              details: 'Admin successfully authenticated with passcode 9989032137.',
              timestamp: Date.now(),
              level: 'info'
            });
          }}
        />
      )}

      {/* Desktop Floating Quick Admin Button */}
      {!isAdminMode && (
        <button
          onClick={() => setAdminLoginModalOpen(true)}
          className="hidden lg:flex fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white font-extrabold text-xs sm:text-sm items-center gap-2.5 shadow-2xl shadow-rose-900/60 border border-white/20 hover:scale-105 active:scale-95 transition-all group ring-4 ring-rose-500/20"
          title="Open Admin Panel / Login"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>Admin Portal (అడ్మిన్)</span>
        </button>
      )}
    </div>
  );
}
