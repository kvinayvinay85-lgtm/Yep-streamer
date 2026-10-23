import React, { useState, useMemo } from 'react';
import { getAll3000Features } from '../../data/featureRegistry';
import { FeatureRegistryItem, FeatureStatus } from '../../types';
import { Search, CheckCircle2, Clock, ShieldCheck, Filter, FileCode, Layers } from 'lucide-react';

export const FeatureRegistryView: React.FC = () => {
  const allFeatures = useMemo(() => getAll3000Features(), []);
  
  const [search, setSearch] = useState('');
  const [selectedRange, setSelectedRange] = useState<'all' | '1-1000' | '1001-2000' | '2001-3000'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const rangeFilteredFeatures = useMemo(() => {
    return allFeatures.filter(item => {
      if (selectedRange === '1-1000') return item.featureId >= 1 && item.featureId <= 1000;
      if (selectedRange === '1001-2000') return item.featureId >= 1001 && item.featureId <= 2000;
      if (selectedRange === '2001-3000') return item.featureId >= 2001 && item.featureId <= 3000;
      return true;
    });
  }, [allFeatures, selectedRange]);

  const filteredFeatures = useMemo(() => {
    return rangeFilteredFeatures.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        String(item.featureId) === search.trim();
      
      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [rangeFilteredFeatures, search, selectedCategory, selectedStatus]);

  const totalPages = Math.ceil(filteredFeatures.length / pageSize) || 1;
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFeatures.slice(start, start + pageSize);
  }, [filteredFeatures, currentPage]);

  const testedCount = allFeatures.filter(f => f.status === 'TESTED').length;
  const implementedCount = allFeatures.filter(f => f.status === 'IMPLEMENTED').length;
  const proposedCount = allFeatures.filter(f => f.status === 'PROPOSED').length;

  const categories = [
    'ALL',
    'Website and User Experience (1-100)',
    'Admin and Content Management (101-200)',
    'Upload and Media Management (201-300)',
    'Video Playback (301-400)',
    'Search and Discovery (401-500)',
    'User Accounts and Personalization (501-600)',
    'Analytics and Automation (601-700)',
    'Security and Reliability (701-800)',
    'Performance and Scalability (801-900)',
    'Advanced and Future Capabilities (901-1000)',
    'Advanced Content Intelligence (1000-1099)',
    'Advanced Media Quality (1100-1199)',
    'Advanced Workflow Automation (1200-1299)',
    'Content Governance and Rights Management (1300-1399)',
    'Advanced Localization (1400-1499)',
    'Advanced User Experience (1500-1599)',
    'Advanced Operations and Diagnostics (1600-1699)',
    'Advanced Performance Engineering (1700-1799)',
    'Advanced Security and Recovery (1800-1899)',
    'Platform Extensibility (1900-1999)',
    'Intelligent Content Operations (2000-2099)',
    'Advanced Media Processing (2100-2199)',
    'Content Rights and Governance (2200-2299)',
    'Advanced Accessibility (2300-2399)',
    'Advanced Personalization (2400-2499)',
    'Advanced Search Intelligence (2500-2599)',
    'Advanced Reliability Engineering (2600-2699)',
    'Advanced Cost Management (2700-2799)',
    'Advanced Integration Architecture (2800-2899)',
    'Advanced Platform Intelligence (2900-2999)'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-rose-500" />
            YEP Streamer 1–3000 Feature Master Registry
          </h1>
          <p className="text-sm text-slate-400">
            Persistent feature management, unique ID tracking, test criteria & implementation governance
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => { setSelectedRange('all'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRange === 'all' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All 3,000
          </button>
          <button
            onClick={() => { setSelectedRange('1-1000'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRange === '1-1000' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            1–1000
          </button>
          <button
            onClick={() => { setSelectedRange('1001-2000'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRange === '1001-2000' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            1001–2000
          </button>
          <button
            onClick={() => { setSelectedRange('2001-3000'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRange === '2001-3000' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            2001–3000
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Feature Slots</div>
          <div className="text-3xl font-extrabold text-white mt-1">{allFeatures.length.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Strictly numbered non-duplicate slots</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold text-emerald-400 uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tested & Operational
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{testedCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Verified with live tests & evidence</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold text-purple-400 uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active Platform Features
          </div>
          <div className="text-3xl font-extrabold text-purple-400 mt-1">{implementedCount + testedCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Live features active in app</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Roadmap Pipeline Slots
          </div>
          <div className="text-3xl font-extrabold text-slate-300 mt-1">{proposedCount.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Sequential expansion pipeline</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Feature ID, name, or keywords..."
            className="w-full bg-slate-950 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950 text-white text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All 10 Feature Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950 text-white text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="TESTED">TESTED</option>
            <option value="IMPLEMENTED">IMPLEMENTED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="PROPOSED">PROPOSED</option>
          </select>
        </div>
      </div>

      {/* Feature Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16 text-center">ID</th>
                <th className="py-3.5 px-4">Feature Name & Category</th>
                <th className="py-3.5 px-4">Description & Acceptance</th>
                <th className="py-3.5 px-4 w-28">Status</th>
                <th className="py-3.5 px-4">Files / Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {pagedItems.map(item => {
                const isTested = item.status === 'TESTED';
                const isImplemented = item.status === 'IMPLEMENTED';
                return (
                  <tr key={item.featureId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 text-center font-extrabold text-xs text-slate-400">
                      #{item.featureId}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white font-bold text-sm">{item.name}</div>
                      <div className="text-xs text-rose-400 mt-0.5">{item.category}</div>
                    </td>
                    <td className="py-4 px-4 max-w-md">
                      <p className="text-slate-300 text-xs line-clamp-2">{item.description}</p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        Criteria: {item.acceptanceCriteria}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        isTested
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : isImplemented
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {isTested && <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {item.testEvidence && (
                        <div className="text-emerald-400/90 font-medium line-clamp-1 mb-1">
                          ✓ {item.testEvidence}
                        </div>
                      )}
                      {item.filesChanged.length > 0 ? (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.filesChanged.join(', ')}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">Reserved slot</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {pagedItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No features match your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredFeatures.length)} of {filteredFeatures.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            >
              Previous
            </button>
            <span className="px-2 font-semibold text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
