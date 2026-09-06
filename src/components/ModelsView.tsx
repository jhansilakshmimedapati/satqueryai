import React from 'react';
import { Cpu, CheckCircle2, ShieldAlert, Award, Layers, Sliders, Database } from 'lucide-react';
import { SPECIALIST_MODELS } from '../data/demoData';

export const ModelsView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-cyan-400" />
          Specialist Model Registry & Orchestration Architecture
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          SatQuery AI does not rely on a generic single-model prompt. It hosts a modular registry of 6 task-specialized
          remote-sensing vision-language models, selected dynamically by the agentic controller.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SPECIALIST_MODELS.map((model) => (
          <div
            key={model.id}
            className="rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">{model.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {model.version}
                  </span>
                </div>
                <div className="text-xs text-cyan-400 font-medium mt-0.5">{model.taskLabel}</div>
              </div>

              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {model.status}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Task Code:</span>
                <span className="text-slate-200">{model.task}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Modalities:</span>
                <span className="text-cyan-300 uppercase">{model.modalities.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Input Specification:</span>
                <span className="text-slate-200 text-right">{model.inputRequirements}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Architecture:</span>
                <span className="text-indigo-300 text-right">{model.architecture}</span>
              </div>
            </div>

            {/* Benchmark & Adaptation */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Database className="w-3 h-3 text-indigo-400" /> Adaptation Dataset:
                </span>
                <span className="font-semibold text-slate-200">{model.adaptationDataset}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" /> Benchmark Metric:
                </span>
                <span className="font-semibold text-emerald-400 font-mono">{model.benchmarkScore}</span>
              </div>
            </div>

            {/* Parameters */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mb-1.5">
                <Sliders className="w-3 h-3" /> Runtime Parameters:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(model.parameters).map(([key, val]) => (
                  <span
                    key={key}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {key}: <strong className="text-cyan-400">{String(val)}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
