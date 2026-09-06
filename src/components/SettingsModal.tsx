import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, CheckCircle2, ShieldCheck, Database, Server, RefreshCw, BarChart2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [analysesInput, setAnalysesInput] = useState<string>('8420');
  const [geotiffsInput, setGeotiffsInput] = useState<string>('1280');

  useEffect(() => {
    if (isOpen) {
      const savedAnalyses = localStorage.getItem('satquery_analyses_base') || '8420';
      const savedGeo = localStorage.getItem('satquery_geotiffs_count') || '1280';
      setAnalysesInput(savedAnalyses);
      setGeotiffsInput(savedGeo);
    }
  }, [isOpen]);

  const handleSave = () => {
    const aNum = parseInt(analysesInput.replace(/,/g, ''), 10);
    if (!isNaN(aNum) && aNum >= 0) {
      localStorage.setItem('satquery_analyses_base', aNum.toString());
    }
    const gNum = parseInt(geotiffsInput.replace(/,/g, ''), 10);
    if (!isNaN(gNum) && gNum >= 0) {
      localStorage.setItem('satquery_geotiffs_count', gNum.toString());
    }
    window.dispatchEvent(new Event('satquery_metrics_updated'));
    onClose();
  };

  const handleResetDefaults = () => {
    setAnalysesInput('8420');
    setGeotiffsInput('1280');
    localStorage.setItem('satquery_analyses_base', '8420');
    localStorage.setItem('satquery_geotiffs_count', '1280');
    window.dispatchEvent(new Event('satquery_metrics_updated'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="rounded-xl bg-slate-900 border border-slate-700 p-6 max-w-md w-full space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            SatQuery AI System Configuration
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                System Metric Counters
              </label>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                title="Reset to default counts"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Reset
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Analyses Run (Base)</span>
                <input
                  type="number"
                  value={analysesInput}
                  onChange={(e) => setAnalysesInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                  placeholder="8420"
                />
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">GeoTIFFs Indexed</span>
                <input
                  type="number"
                  value={geotiffsInput}
                  onChange={(e) => setGeotiffsInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                  placeholder="1280"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200">Execution Mode</label>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High-Fidelity Demonstration Pipeline
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Includes full model registry, raster verification, and SVG visual evidence synthesis.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200">Remote-Sensing Adaptation</label>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-medium text-slate-200">BigEarthNet Sentinel-1 & 2</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pre-trained multi-modal weights mapped to Corine 43 land cover classes.
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                ENABLED
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200">Radiometric Calibration</label>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Optical Index</span>
                <span className="font-mono font-semibold text-cyan-300">BOA Reflectance (L2A)</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">SAR Filtering</span>
                <span className="font-mono font-semibold text-indigo-300">Enhanced Lee (3x3)</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-200">Backend API Gateway</label>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
              <span>http://localhost:3000/api</span>
              <span className="text-emerald-400">Connected</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={handleSave}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
