import React from 'react';
import { 
  LayoutDashboard, Upload, Film, Clapperboard, Tv, Sparkles, Video, 
  Image as ImageIcon, Activity, Cpu, BarChart3, Shield, Settings, LogOut, X, Menu,
  Flame, Smile, Rocket, Layers, Calendar
} from 'lucide-react';

interface AdminLayoutProps {
  currentAdminTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onReturnToPublic: () => void;
  adminEmail: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentAdminTab,
  onSelectTab,
  onLogout,
  onReturnToPublic,
  adminEmail,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Media', icon: Upload },
    { id: 'library', label: 'All Media Library', icon: Film },
    { id: 'features', label: 'Feature 1–3000 Registry', icon: Layers, badge: '3,000' },
  ];

  const categoryNav = [
    { id: 'cat-cinema', label: 'Cinema Movies', icon: Clapperboard },
    { id: 'cat-anime', label: 'Anime & Series', icon: Tv },
    { id: 'cat-drama', label: 'Drama Titles', icon: Sparkles },
    { id: 'cat-reels', label: 'Reels 9:16 Clips', icon: Video },
    { id: 'anime-scheduler', label: 'Anime Simulcast Scheduler', icon: Calendar, color: 'text-amber-400' },
    { id: 'genre-action', label: 'Action Sub-Category', icon: Flame, color: 'text-rose-400' },
    { id: 'genre-comedy', label: 'Comedy Sub-Category', icon: Smile, color: 'text-amber-400' },
    { id: 'genre-scifi', label: 'Sci-Fi Sub-Category', icon: Rocket, color: 'text-cyan-400' },
  ];

  const platformNav = [
    { id: 'artwork', label: 'Artwork Direct Publish', icon: ImageIcon },
    { id: 'uploads', label: 'Upload Activity', icon: Activity },
    { id: 'processing', label: 'Processing Jobs', icon: Cpu },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Logs', icon: Shield },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center font-extrabold text-white">
              Y
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight">YEP ADMIN</span>
              <span className="text-[10px] text-slate-400 block -mt-1 uppercase tracking-wider">Enterprise 2M</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Main Core */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Core Navigation
            </div>
            {mainNav.map(item => {
              const Icon = item.icon;
              const isActive = currentAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-rose-400 font-bold border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub-Categories & Genres */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Categories & Genre Sub-Categories
            </div>
            {categoryNav.map(item => {
              const Icon = item.icon;
              const isActive = currentAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${item.color || ''}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Platform Services */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Platform & Cloud Services
            </div>
            {platformNav.map(item => {
              const Icon = item.icon;
              const isActive = currentAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer / Exit */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onReturnToPublic}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Exit to Public Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Admin Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm font-extrabold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Admin Control Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Secure Session Active</span>
          </div>
        </header>

        {/* View Container */}
        <main className="flex-1 p-4 sm:p-8 pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Admin Bottom Navigation Bar */}
        <nav 
          aria-label="Admin Mobile Navigation" 
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 shadow-[0_-10px_25px_rgba(0,0,0,0.8)] pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1.5"
        >
          <div className="max-w-md mx-auto grid grid-cols-5 items-center px-2">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                currentAdminTab === 'dashboard' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${currentAdminTab === 'dashboard' ? 'bg-rose-500/20' : ''}`}>
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Dashboard</span>
            </button>

            <button
              onClick={() => onSelectTab('upload')}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                currentAdminTab === 'upload' ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${currentAdminTab === 'upload' ? 'bg-rose-500/20' : ''}`}>
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Upload</span>
            </button>

            <button
              onClick={() => onSelectTab('library')}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                currentAdminTab === 'library' || currentAdminTab.startsWith('cat-') || currentAdminTab.startsWith('genre-')
                  ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${currentAdminTab === 'library' ? 'bg-rose-500/20' : ''}`}>
                <Film className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Library</span>
            </button>

            <button
              onClick={() => onSelectTab('features')}
              className={`flex flex-col items-center justify-center py-1 transition-all ${
                currentAdminTab === 'features' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${currentAdminTab === 'features' ? 'bg-purple-500/20' : ''}`}>
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">3,000 Feat</span>
            </button>

            <button
              onClick={() => setSidebarOpen(true)}
              className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-200 transition-all"
            >
              <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <Menu className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">More (మెనూ)</span>
            </button>
          </div>
        </nav>
      </div>

    </div>
  );
};
