import React from 'react';
import {
  Satellite,
  Activity,
  Cpu,
  Database,
  SlidersHorizontal,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0E0E12] sticky top-0 z-30 select-none">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white italic shadow-[0_0_15px_rgba(37,99,235,0.4)] shrink-0">
          S
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold tracking-tight leading-none text-white">
            SatQuery <span className="text-blue-500">AI</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
            Remote-Sensing Agentic Platform
          </span>
        </div>
      </div>

      {/* Telemetry & Badges */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* System Ready Pill (from Design HTML) */}
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-mono text-green-400">
            SYSTEM_READY // GPU_ACTIVE
          </span>
        </div>

        {/* Remote-Sensing Adaptation Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-[#16161D] border border-white/10 rounded-lg text-xs">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] text-slate-400">Adaptation Mode</span>
            <span className="text-xs font-semibold text-white">BigEarthNet (S1+S2)</span>
          </div>
        </div>

        {/* Models Active */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#16161D] border border-white/10 rounded-lg text-xs text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <div className="flex flex-col leading-tight">
            <span className="text-slate-400 text-[10px]">Active Models</span>
            <span className="font-semibold text-slate-200">6 Specialized</span>
          </div>
        </div>

        {/* Right Tools / Actions */}
        <div className="flex items-center gap-3 text-slate-400">
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg hover:text-white hover:bg-white/5 transition"
            title="Settings & Configurations"
            aria-label="Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 select-none">
            ADMIN
          </div>
        </div>
      </div>
    </header>
  );
};
