import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AnalysisWorkspace } from './components/AnalysisWorkspace';
import { HistoryView } from './components/HistoryView';
import { ModelsView } from './components/ModelsView';
import { DatasetsView } from './components/DatasetsView';
import { SettingsModal } from './components/SettingsModal';
import { AnalysisResult, DemoScenario } from './types';
import { api } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);

  // Fetch session history on mount
  useEffect(() => {
    api
      .getHistory()
      .then((data) => {
        if (data && data.analyses) {
          setAnalyses(data.analyses);
        }
      })
      .catch((err) => console.error('Failed to load history:', err));
  }, []);

  const handleStartAnalysis = (mode: 'single' | 'optical_sar' | 'bitemporal', query?: string) => {
    setActiveScenario(null);
    setCurrentTab('workspace');
  };

  const handleSelectDemo = (demo: DemoScenario) => {
    setActiveScenario(demo);
    setCurrentTab('workspace');
  };

  const handleAnalysisCompleted = (result: AnalysisResult) => {
    setAnalyses((prev) => [result, ...prev.filter((p) => p.id !== result.id)]);
  };

  const handleOpenAnalysis = (analysis: AnalysisResult) => {
    setCurrentTab('workspace');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        activeTab={currentTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main App Layout (Sidebar + Content Workspace) */}
      <div className="flex-1 flex flex-row overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'settings') {
              setIsSettingsOpen(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          historyCount={analyses.length}
        />

        <main className="flex-1 overflow-y-auto bg-[#0A0A0C] min-h-[calc(100vh-56px-32px)]">
          {currentTab === 'dashboard' && (
            <DashboardView
              onStartAnalysis={handleStartAnalysis}
              onSelectDemo={handleSelectDemo}
              recentAnalyses={analyses}
              onOpenAnalysis={handleOpenAnalysis}
            />
          )}

          {currentTab === 'workspace' && (
            <AnalysisWorkspace
              initialScenario={activeScenario}
              onAnalysisCompleted={handleAnalysisCompleted}
            />
          )}

          {currentTab === 'history' && (
            <HistoryView
              analyses={analyses}
              onSelectAnalysis={handleOpenAnalysis}
            />
          )}

          {currentTab === 'models' && <ModelsView />}

          {currentTab === 'datasets' && <DatasetsView />}
        </main>
      </div>

      {/* Bottom Status Bar (Sophisticated Dark Design) */}
      <footer className="h-8 bg-[#070709] border-t border-white/5 px-6 flex items-center justify-between text-[10px] text-slate-500 font-mono shrink-0 select-none">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            API_LATENCY: 42ms
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            MODELS_LOADED: 6/6
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
            RADAR_ENGINE: S1_CSAR_ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">SESSION_TOKEN: 4x99-RS-A1</span>
          <span className="text-blue-500/70 font-semibold">v1.0.4-STABLE</span>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
