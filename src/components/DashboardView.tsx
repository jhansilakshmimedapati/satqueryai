import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Layers,
  GitCompare,
  MessageSquareCode,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  Clock,
  Compass,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { DemoScenario, AnalysisResult } from '../types';
import { DEMO_SCENARIOS, SPECIALIST_MODELS } from '../data/demoData';

interface DashboardViewProps {
  onStartAnalysis: (mode: 'single' | 'optical_sar' | 'bitemporal', query?: string) => void;
  onSelectDemo: (demo: DemoScenario) => void;
  recentAnalyses: AnalysisResult[];
  onOpenAnalysis: (analysis: AnalysisResult) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartAnalysis,
  onSelectDemo,
  recentAnalyses,
  onOpenAnalysis,
}) => {
  const [baseAnalyses, setBaseAnalyses] = useState<number>(() => {
    const saved = localStorage.getItem('satquery_analyses_base');
    return saved ? parseInt(saved, 10) || 8420 : 8420;
  });
  const [geotiffsCount, setGeotiffsCount] = useState<number>(() => {
    const saved = localStorage.getItem('satquery_geotiffs_count');
    return saved ? parseInt(saved, 10) || 1280 : 1280;
  });

  const [editingAnalyses, setEditingAnalyses] = useState(false);
  const [tempAnalyses, setTempAnalyses] = useState(baseAnalyses.toString());

  const [editingGeotiffs, setEditingGeotiffs] = useState(false);
  const [tempGeotiffs, setTempGeotiffs] = useState(geotiffsCount.toString());

  useEffect(() => {
    const handleSync = () => {
      const savedAnalyses = localStorage.getItem('satquery_analyses_base');
      if (savedAnalyses) setBaseAnalyses(parseInt(savedAnalyses, 10) || 8420);
      const savedGeo = localStorage.getItem('satquery_geotiffs_count');
      if (savedGeo) setGeotiffsCount(parseInt(savedGeo, 10) || 1280);
    };
    window.addEventListener('satquery_metrics_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('satquery_metrics_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const saveAnalyses = () => {
    const num = parseInt(tempAnalyses.replace(/,/g, ''), 10);
    if (!isNaN(num) && num >= 0) {
      setBaseAnalyses(num);
      localStorage.setItem('satquery_analyses_base', num.toString());
      window.dispatchEvent(new Event('satquery_metrics_updated'));
    }
    setEditingAnalyses(false);
  };

  const saveGeotiffs = () => {
    const num = parseInt(tempGeotiffs.replace(/,/g, ''), 10);
    if (!isNaN(num) && num >= 0) {
      setGeotiffsCount(num);
      localStorage.setItem('satquery_geotiffs_count', num.toString());
      window.dispatchEvent(new Event('satquery_metrics_updated'));
    }
    setEditingGeotiffs(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-[#E2E8F0]">
      {/* Top Dashboard Metric Grid (Sophisticated Dark Design) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#16161D] border border-white/10 p-4 rounded-xl flex flex-col justify-between relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Analyses Run</span>
            {!editingAnalyses && (
              <button
                onClick={() => {
                  setTempAnalyses(baseAnalyses.toString());
                  setEditingAnalyses(true);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                title="Change Analyses Run number"
                id="edit-analyses-metric-btn"
              >
                <Pencil className="w-3 h-3" />
              </button>
            )}
          </div>
          {editingAnalyses ? (
            <div className="flex items-center gap-1.5 mt-1">
              <input
                type="number"
                value={tempAnalyses}
                onChange={(e) => setTempAnalyses(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveAnalyses();
                  if (e.key === 'Escape') setEditingAnalyses(false);
                }}
                autoFocus
                className="w-24 bg-black/60 border border-cyan-500/70 rounded px-2 py-0.5 text-base font-bold text-white focus:outline-none font-mono"
              />
              <button
                onClick={saveAnalyses}
                className="p-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white"
                title="Save"
                id="save-analyses-btn"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={() => setEditingAnalyses(false)}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                title="Cancel"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-white">
                {(baseAnalyses + recentAnalyses.length).toLocaleString()}
              </span>
              {recentAnalyses.length > 0 && (
                <span className="text-[11px] text-cyan-400 font-mono">
                  (+{recentAnalyses.length})
                </span>
              )}
            </div>
          )}
        </div>

        <div className="bg-[#16161D] border border-white/10 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Avg. Confidence</span>
          <span className="text-2xl font-bold text-green-400 mt-0.5">92.4%</span>
        </div>

        <div className="bg-[#16161D] border border-white/10 p-4 rounded-xl flex flex-col justify-between relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">GeoTIFFs Indexed</span>
            {!editingGeotiffs && (
              <button
                onClick={() => {
                  setTempGeotiffs(geotiffsCount.toString());
                  setEditingGeotiffs(true);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                title="Change GeoTIFFs Indexed number"
                id="edit-geotiffs-metric-btn"
              >
                <Pencil className="w-3 h-3" />
              </button>
            )}
          </div>
          {editingGeotiffs ? (
            <div className="flex items-center gap-1.5 mt-1">
              <input
                type="number"
                value={tempGeotiffs}
                onChange={(e) => setTempGeotiffs(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveGeotiffs();
                  if (e.key === 'Escape') setEditingGeotiffs(false);
                }}
                autoFocus
                className="w-24 bg-black/60 border border-cyan-500/70 rounded px-2 py-0.5 text-base font-bold text-white focus:outline-none font-mono"
              />
              <button
                onClick={saveGeotiffs}
                className="p-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white"
                title="Save"
                id="save-geotiffs-btn"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={() => setEditingGeotiffs(false)}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                title="Cancel"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-white">
                {geotiffsCount.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Scenes
              </span>
            </div>
          )}
        </div>

        <div className="bg-[#16161D] border border-blue-500/30 bg-blue-500/5 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-xs text-blue-400 font-medium uppercase tracking-wider italic">Adaptation Mode</span>
          <span className="text-base sm:text-lg font-bold text-white leading-tight mt-0.5">
            BigEarthNet fine-tuned
          </span>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#16161D] p-7 border border-white/10 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 animate-spin" />
            Autonomous Geospatial Intelligence
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
            Multimodal Remote-Sensing Vision-Language Assistant
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Query high-resolution satellite imagery using natural language. SatQuery AI features an
            <strong className="text-blue-400"> agentic model routing engine</strong> that parses questions,
            inspects multi-spectral/SAR raster geometries, orchestrates specialist vision models, and generates
            calibrated evidence and auditable execution summaries.
          </p>
        </div>

        {/* Subtle grid background art */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* 1. Four Primary Analysis Cards (Section 4) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <span>Primary Remote-Sensing Workflows</span>
          </h3>
          <span className="text-xs text-slate-500">Select an analysis architecture to launch</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Single Image */}
          <div
            onClick={() => onStartAnalysis('single')}
            className="group cursor-pointer rounded-xl bg-[#16161D] border border-white/10 hover:border-blue-500/50 p-5 transition-all duration-200 hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors">
                  1. Single Image Analysis
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Analyze optical, multispectral, or SAR raster scenes for land cover classification, VQA, scene captioning, and entity grounding.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-blue-400 font-medium">
              <span>Launch Single Scene</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Optical + SAR */}
          <div
            onClick={() => onStartAnalysis('optical_sar')}
            className="group cursor-pointer rounded-xl bg-[#16161D] border border-white/10 hover:border-blue-500/50 p-5 transition-all duration-200 hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors">
                  2. Optical + SAR Cross-Modal
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Fuse Sentinel-2 multispectral reflectance with Sentinel-1 C-band radar backscatter for cloud-penetrating structural insights.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-purple-400 font-medium">
              <span>Launch Cross-Modal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Bi-Temporal Change */}
          <div
            onClick={() => onStartAnalysis('bitemporal')}
            className="group cursor-pointer rounded-xl bg-[#16161D] border border-white/10 hover:border-blue-500/50 p-5 transition-all duration-200 hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white group-hover:text-orange-300 transition-colors">
                  3. Bi-Temporal Change
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Compare co-registered acquisitions at Time T1 and T2 to pinpoint deforestation, urban sprawl, and generate difference heatmaps.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-orange-400 font-medium">
              <span>Launch Temporal Change</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Natural Language Query */}
          <div
            onClick={() => onStartAnalysis('single', 'Describe the land cover in this image.')}
            className="group cursor-pointer rounded-xl bg-[#16161D] border border-white/10 hover:border-blue-500/50 p-5 transition-all duration-200 hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <MessageSquareCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white group-hover:text-emerald-300 transition-colors">
                  4. Natural Language Query
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Autonomous agentic routing: Let the SatQuery Agent automatically detect the task and select models based on your prompt.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>Query Assistant</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Five Sample Demonstration Scenarios (Section 29) */}
      <div className="rounded-2xl bg-[#16161D] border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Ready-to-Run Demonstration Scenarios (5 Evaluated Benchmarks)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any verified remote sensing case to load satellite rasters and execute the agentic workflow instantly.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-blue-400 bg-blue-600/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
            No external setup required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {DEMO_SCENARIOS.map((demo) => (
            <div
              key={demo.id}
              onClick={() => onSelectDemo(demo)}
              className="cursor-pointer group rounded-xl bg-[#0E0E12] border border-white/5 hover:border-blue-500/40 p-3.5 flex flex-col justify-between transition-all hover:bg-white/[0.02]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300 group-hover:bg-blue-600/20 group-hover:text-blue-300 transition-colors">
                    Demo #{demo.demoNumber}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-500">
                    {demo.task.replace('_', ' ')}
                  </span>
                </div>
                <h5 className="font-semibold text-xs text-slate-200 group-hover:text-white line-clamp-2">
                  {demo.title}
                </h5>
                <p className="text-[11px] text-blue-400 font-medium italic line-clamp-2 bg-[#16161D] p-1.5 rounded border border-white/5">
                  "{demo.query}"
                </p>
                <p className="text-[10px] text-slate-400 line-clamp-2">
                  {demo.expectedHighlight}
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-blue-400 font-medium">
                <span>Run Demo</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. System Status, Model Availability & Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Availability Grid */}
        <div className="rounded-2xl bg-[#16161D] border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              Model Availability
            </h4>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> 6 / 6 Online
            </span>
          </div>
          <div className="space-y-2">
            {SPECIALIST_MODELS.map((model) => (
              <div
                key={model.id}
                className="p-2.5 rounded-lg bg-[#0E0E12] border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-medium text-slate-200">{model.name}</div>
                  <div className="text-[10px] text-slate-500">{model.taskLabel}</div>
                </div>
                <div className="text-right">
                  <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                    {model.status}
                  </span>
                  <div className="text-[9px] text-slate-500 mt-0.5 font-mono">{model.version}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="lg:col-span-2 rounded-2xl bg-[#16161D] border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Recent Analyses
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              {recentAnalyses.length} stored in session database
            </span>
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-dashed border-white/10 text-slate-500 text-xs">
              <p>No analyses performed in this session yet.</p>
              <p className="mt-1 text-slate-400">
                Click any of the demo scenarios above or launch a New Analysis to begin.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentAnalyses.slice(0, 5).map((ana) => (
                <div
                  key={ana.id}
                  onClick={() => onOpenAnalysis(ana)}
                  className="cursor-pointer group p-3 rounded-lg bg-[#0E0E12] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 transition flex items-center justify-between text-xs"
                >
                  <div className="space-y-1 max-w-md">
                    <div className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">
                      "{ana.query}"
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 uppercase">
                        {ana.task.replace('_', ' ')}
                      </span>
                      <span>•</span>
                      <span>{new Date(ana.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-blue-400 font-mono">
                      {ana.confidence.toFixed(1)}% Conf.
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium">Completed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
