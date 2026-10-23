import React from 'react';
import { Shield, Clock } from 'lucide-react';
import { StorageService } from '../../services/storageService';

export const AuditLogsView: React.FC = () => {
  const logs = StorageService.getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Administrative Audit Trail</h1>
        <p className="text-sm text-slate-400">Security event logs and administrative operations history</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800 text-sm">
          {logs.map(log => (
            <div key={log.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-600/20 text-rose-500">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm flex items-center gap-2">
                    <span>{log.action}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">{log.user}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{log.details}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
