import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  History,
  Cpu,
  Layers,
  Settings,
  Radio,
  ExternalLink,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'workspace'
  | 'history'
  | 'models'
  | 'datasets'
  | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  historyCount,
}) => {
  const navItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workspace' as TabType, label: 'New Analysis', icon: ScanLine, highlight: true },
    { id: 'history' as TabType, label: 'Analysis History', icon: History, badge: historyCount > 0 ? historyCount : undefined },
    { id: 'models' as TabType, label: 'Models & Tools', icon: Cpu },
    { id: 'datasets' as TabType, label: 'Datasets', icon: Layers },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const modelAssets = [
    { name: 'VQA-Core', version: 'v2.4', color: 'bg-blue-400' },
    { name: 'SAR-Fusion', version: 'v1.1', color: 'bg-purple-400' },
    { name: 'Change-Det', version: 'v3.0', color: 'bg-orange-400' },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0E0E12] flex flex-col justify-between shrink-0 select-none min-h-[calc(100vh-56px-32px)] p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#16161D] text-slate-300 border border-white/10">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Model Assets Section (from Design HTML) */}
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Model Assets
          </div>
          {modelAssets.map((asset, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-400"
            >
              <span className="flex items-center gap-2.5">
                <div className={`w-1.5 h-1.5 ${asset.color} rounded-full`} />
                <span>{asset.name}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">{asset.version}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage & Telemetry Box (from Design HTML) */}
      <div className="mt-6 p-3.5 border border-white/5 bg-white/5 rounded-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-200">Local GeoCache</div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 animate-pulse" /> SYNCED
          </span>
        </div>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-500 w-3/4 h-full rounded-full" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 uppercase font-mono">
          <span>1.2 GB used</span>
          <span>2 GB Limit</span>
        </div>
        <div className="pt-2 border-t border-white/5 text-[10px] text-slate-400 flex items-center justify-between">
          <span>BigEarthNet Trained</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
