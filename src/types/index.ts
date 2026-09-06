export type Modality = 'optical' | 'sar' | 'multispectral';

export interface SatelliteImage {
  id: string;
  filename: string;
  format: 'GeoTIFF' | 'TIFF' | 'PNG' | 'JPEG';
  dimensions: {
    width: number;
    height: number;
  };
  bands: number;
  crs?: string;
  bounds?: [number, number, number, number]; // [minX, minY, maxX, maxY]
  pixelResolution?: [number, number]; // e.g. [10, 10] in meters
  modality: Modality;
  acquisitionDate?: string;
  validationStatus: 'valid' | 'warning' | 'invalid';
  validationErrors?: string[];
  previewUrl: string;
  fileSize?: number;
  sensor?: string;
  metadata?: Record<string, string | number | boolean>;
}

export type AnalysisTask =
  | 'vqa'
  | 'captioning'
  | 'grounding'
  | 'change_detection'
  | 'change_vqa'
  | 'optical_sar';

export interface ExecutionStep {
  stepNumber: number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  detail: string;
  timestamp: string;
}

export interface BoundingBox {
  id?: string;
  label: string;
  x: number; // percentage 0-100 or pixel coordinate
  y: number;
  width: number;
  height: number;
  confidence: number;
  color?: string;
}

export interface VisualEvidence {
  id: string;
  type: 'bounding_box' | 'segmentation_mask' | 'change_heatmap' | 'difference_map' | 'dual_band_composite' | 'sar_speckle_map';
  title: string;
  description: string;
  imageUrl: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  sarImageUrl?: string;
  opticalImageUrl?: string;
  boundingBoxes?: BoundingBox[];
  metrics?: {
    label: string;
    value: string | number;
    changeRate?: string;
  }[];
}

export interface ExecutionSummary {
  taskDetected: string;
  taskType: AnalysisTask;
  inputSummary: string;
  selectedTools: string[];
  selectedModels: string[];
  parameters: Record<string, string | number | boolean>;
  steps: ExecutionStep[];
  status: 'completed' | 'failed' | 'warning';
  executionTimeMs: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  query: string;
  task: AnalysisTask;
  answer: string;
  confidence: number; // 0 to 100
  confidenceLabel: string; // "Model confidence / estimated confidence"
  visualEvidences: VisualEvidence[];
  executionSummary: ExecutionSummary;
  images: SatelliteImage[];
  geospatialContext?: {
    crs?: string;
    bounds?: [number, number, number, number];
    areaKm2?: number;
    centerCoordinates?: [number, number];
  };
  remoteSensingAdaptation: {
    enabled: boolean;
    dataset: string;
    model: string;
    status: string;
  };
  isDemoMode: boolean;
  warnings?: string[];
}

export interface SpecialistModelInfo {
  id: string;
  name: string;
  version: string;
  task: AnalysisTask | 'general';
  taskLabel: string;
  modalities: Modality[];
  inputRequirements: string;
  parameters: Record<string, string>;
  status: 'Ready' | 'Loading' | 'Demo' | 'Offline';
  architecture: string;
  backbone: string;
  adaptationDataset: string;
  benchmarkScore?: string;
  description: string;
}

export interface DatasetInfo {
  id: string;
  name: string;
  category: 'training' | 'evaluation' | 'demonstration';
  purpose: string;
  modalities: string[];
  samplesCount: string;
  spatialResolution: string;
  description: string;
  referenceUrl?: string;
  tasksSupported: string[];
}

export interface DemoScenario {
  id: string;
  demoNumber: number;
  title: string;
  description: string;
  task: AnalysisTask;
  query: string;
  inputMode: 'single' | 'optical_sar' | 'bitemporal';
  images: SatelliteImage[];
  expectedHighlight: string;
}
