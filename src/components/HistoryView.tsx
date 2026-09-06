import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  Calendar,
  Layers,
  Cpu,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { downloadAnalysisReport } from '../utils/pdfExport';

interface HistoryViewProps {
  analyses: AnalysisResult[];
  onSelectAnalysis: (analysis: AnalysisResult) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  analyses,
  onSelectAnalysis,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [taskFilter, setTaskFilter] = useState('all');

  const filtered = analyses.filter((a) => {
    const matchesSearch =
      a.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTask = taskFilter === 'all' || a.task === taskFilter;
    return matchesSearch && matchesTask;
  });

  const exportAllJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analyses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SatQuery_History_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Analysis Mission History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Auditable archive of all remote-sensing questions, selected models, confidence scores, and visual evidence.
          </p>
        </div>

        {analyses.length > 0 && (
          <button
            onClick={exportAllJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Export History (.JSON)
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search query or response keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Remote-Sensing Tasks</option>
            <option value="vqa">Visual Question Answering</option>
            <option value="captioning">Scene Captioning</option>
            <option value="grounding">Region Grounding</option>
            <option value="change_detection">Change Detection</option>
            <option value="change_vqa">Change VQA</option>
            <option value="optical_sar">Optical + SAR Fusion</option>
          </select>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-slate-800 text-slate-400 text-xs space-y-2">
          <History className="w-8 h-8 mx-auto text-slate-400 mb-1" />
          <p className="font-semibold text-slate-300">No matching analyses found</p>
          <p className="text-slate-400">Run an analysis in the workspace to log an auditable record.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 transition space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
                    {item.task.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {item.confidence.toFixed(1)}% Conf.
                  </span>
                  <button
                    onClick={() => downloadAnalysisReport(item)}
                    className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700"
                    title="Download PDF Report"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSelectAnalysis(item)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800 rounded transition"
                  >
                    Load in Workspace
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-slate-200">"{item.query}"</h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                  {item.answer}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    {item.executionSummary?.selectedModels.join(', ') || 'RS Specialist Model'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-indigo-400" />
                    {item.images.length} Image Input(s)
                  </span>
                </div>
                <span className="text-slate-400">ID: {item.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
