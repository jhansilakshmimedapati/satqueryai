import { SatelliteImage, AnalysisResult, SpecialistModelInfo, AnalysisTask } from '../types';

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getModels(): Promise<{ models: SpecialistModelInfo[]; status: string }> {
    const res = await fetch('/api/models');
    return res.json();
  },

  async validateInputs(images: SatelliteImage[], task?: AnalysisTask) {
    const res = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images, task }),
    });
    return res.json();
  },

  async analyze(query: string, images: SatelliteImage[]): Promise<AnalysisResult> {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, images }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
      throw new Error(err.error || 'Analysis service returned an error.');
    }

    return res.json();
  },

  async getHistory(): Promise<{ analyses: AnalysisResult[]; count: number }> {
    const res = await fetch('/api/history');
    return res.json();
  },

  async getAnalysisById(id: string): Promise<AnalysisResult> {
    const res = await fetch(`/api/analysis/${id}`);
    if (!res.ok) throw new Error('Analysis not found');
    return res.json();
  },

  async getReport(id: string) {
    const res = await fetch(`/api/report/${id}`);
    if (!res.ok) throw new Error('Report not found');
    return res.json();
  },
};
