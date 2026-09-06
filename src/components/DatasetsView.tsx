import React from 'react';
import { Layers, Database, ExternalLink, CheckCircle2, Award, BookOpen } from 'lucide-react';
import { DATASETS_INFO } from '../data/demoData';

export const DatasetsView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Database className="w-5 h-5 text-indigo-400" />
          Remote-Sensing Benchmark Datasets & Adaptation Corpus
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Detailed overview of satellite benchmarks utilized for vision-language pre-training, fine-tuning, and cross-modal
          optical-SAR alignment in SatQuery AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {DATASETS_INFO.map((ds, index) => (
          <div
            key={index}
            className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <span>{ds.name}</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {ds.spatialResolution}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{ds.purpose}</p>

              <div className="space-y-2 text-xs font-mono bg-slate-950/70 p-3.5 rounded-lg border border-slate-800/80 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sensor Platforms:</span>
                  <span className="text-cyan-300 text-right">{ds.modalities.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dataset Scale:</span>
                  <span className="text-slate-200">{ds.samplesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Spatial Resolution:</span>
                  <span className="text-slate-200">{ds.spatialResolution}</span>
                </div>
              </div>

              {/* Tasks supported */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Supported Remote-Sensing Tasks:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ds.tasksSupported.map((task, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {task}
                    </span>
                  ))}
                </div>
              </div>

              {/* Adaptation details */}
              <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Description & Adaptation Methodology:
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {ds.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Benchmarked in SatQuery Pipeline
              </span>
              <span className="text-slate-400 text-[10px] font-mono">Open Access Standard</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
