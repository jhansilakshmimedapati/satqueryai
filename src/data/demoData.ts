import { SatelliteImage, DemoScenario, SpecialistModelInfo, DatasetInfo } from '../types';

// High-fidelity SVG satellite imagery data URIs
function generateSatelliteSVG(
  type: 'optical_landscape' | 'optical_urban' | 'sar_speckle' | 't1_before' | 't2_after',
  options: { width?: number; height?: number } = {}
): string {
  const w = options.width || 800;
  const h = options.height || 800;

  let content = '';

  if (type === 'optical_landscape') {
    // Rich optical satellite landscape: river, agricultural patchwork, urban cluster, forest
    content = `
      <defs>
        <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f2b48" />
          <stop offset="50%" stop-color="#1b4d75" />
          <stop offset="100%" stop-color="#0c223a" />
        </linearGradient>
        <pattern id="cropGrid" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="#2d5a27" />
          <rect width="28" height="28" fill="#3b6e32" />
          <rect x="32" width="28" height="28" fill="#4a7c3e" />
          <rect y="32" width="28" height="28" fill="#588b48" />
          <rect x="32" y="32" width="28" height="28" fill="#31612a" />
          <line x1="0" y1="30" x2="60" y2="30" stroke="#7a6b47" stroke-width="2" />
          <line x1="30" y1="0" x2="30" y2="60" stroke="#7a6b47" stroke-width="2" />
        </pattern>
        <pattern id="urbanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#60666d" />
          <rect x="3" y="3" width="15" height="15" fill="#a4a9b2" />
          <rect x="22" y="3" width="15" height="15" fill="#8c939d" />
          <rect x="3" y="22" width="15" height="15" fill="#b9bec8" />
          <rect x="22" y="22" width="15" height="15" fill="#7d848f" />
        </pattern>
      </defs>
      <!-- Base terrain -->
      <rect width="${w}" height="${h}" fill="#3f4832" />
      <!-- Forest zone -->
      <path d="M 0,0 L 450,0 Q 380,180 250,220 L 0,260 Z" fill="#1b3d17" />
      <!-- Croplands -->
      <rect x="50" y="260" width="380" height="500" fill="url(#cropGrid)" opacity="0.9" />
      <!-- Urban settlement -->
      <rect x="440" y="40" width="320" height="340" fill="url(#urbanGrid)" rx="6" />
      <!-- Road network -->
      <path d="M 0,140 Q 200,160 440,200 L 800,220" stroke="#d5d0c3" stroke-width="8" fill="none" />
      <path d="M 440,200 L 440,780" stroke="#c0b9a8" stroke-width="7" fill="none" />
      <path d="M 600,0 L 600,800" stroke="#b0a794" stroke-width="6" fill="none" />
      <!-- Water reservoir & meandering river -->
      <path d="M 420,400 Q 560,420 660,510 T 780,720 L 800,800 L 680,800 Q 560,680 480,560 T 360,480 Z" fill="url(#riverGrad)" />
      <circle cx="560" cy="520" r="85" fill="url(#riverGrad)" />
      <!-- Satellite overlay telemetry grid -->
      <g stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.25">
        <line x1="200" y1="0" x2="200" y2="${h}" stroke-dasharray="4 4" />
        <line x1="400" y1="0" x2="400" y2="${h}" stroke-dasharray="4 4" />
        <line x1="600" y1="0" x2="600" y2="${h}" stroke-dasharray="4 4" />
        <line x1="0" y1="200" x2="${w}" y2="200" stroke-dasharray="4 4" />
        <line x1="0" y1="400" x2="${w}" y2="400" stroke-dasharray="4 4" />
        <line x1="0" y1="600" x2="${w}" y2="600" stroke-dasharray="4 4" />
      </g>
    `;
  } else if (type === 'sar_speckle') {
    // SAR C-band microwave backscatter intensity:
    // Built-up shows strong double-bounce (bright white), water shows specular reflection (black), vegetation shows moderate diffuse speckle (grays)
    content = `
      <defs>
        <radialGradient id="sarSpeckle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#4a4d52" />
          <stop offset="100%" stop-color="#242629" />
        </radialGradient>
        <pattern id="sarGrain" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#303336" />
          <circle cx="2" cy="2" r="1" fill="#75797f" />
          <circle cx="6" cy="5" r="1.2" fill="#52555a" />
          <circle cx="4" cy="7" r="0.8" fill="#8d9197" />
        </pattern>
      </defs>
      <!-- Base microwave return -->
      <rect width="${w}" height="${h}" fill="url(#sarGrain)" />
      <!-- SAR Water feature (specular reflection = very low return / dark) -->
      <path d="M 420,400 Q 560,420 660,510 T 780,720 L 800,800 L 680,800 Q 560,680 480,560 T 360,480 Z" fill="#060709" />
      <circle cx="560" cy="520" r="85" fill="#060709" />
      <!-- SAR Built-up double-bounce corner reflectors (high radar cross section = bright white/cyan specks) -->
      <g fill="#ffffff">
        <rect x="450" y="50" width="290" height="320" fill="#2d3035" />
        <!-- Clustered corner reflector signatures -->
        ${Array.from({ length: 45 })
          .map(
            (_, i) =>
              `<circle cx="${460 + (i % 8) * 35 + ((i * 7) % 15)}" cy="${60 + Math.floor(i / 8) * 50 + ((i * 11) % 15)}" r="${2 + (i % 3)}" fill="#f0f6fc" opacity="0.95" />`
          )
          .join('')}
      </g>
      <!-- Radar range / azimuth lines -->
      <line x1="0" y1="0" x2="${w}" y2="0" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.4" />
      <text x="20" y="30" fill="#38bdf8" font-family="monospace" font-size="12" opacity="0.8">SAR C-BAND VV/VH CO-REG | RANGE FLIGHT DIR 012°</text>
    `;
  } else if (type === 't1_before') {
    // Bi-temporal T1 (Before - March 2022): Intact green canopy, small traditional settlement
    content = `
      <defs>
        <linearGradient id="t1Veg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2a5c2b" />
          <stop offset="100%" stop-color="#1f4420" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#335930" />
      <!-- Dense natural forest / vegetation parcel -->
      <rect x="180" y="140" width="460" height="420" fill="url(#t1Veg)" rx="12" />
      <!-- Natural stream -->
      <path d="M 0,280 Q 240,290 400,320 T 800,360" stroke="#1d425c" stroke-width="24" fill="none" />
      <!-- Small hamlet -->
      <rect x="620" y="200" width="80" height="80" fill="#8c7860" />
      <rect x="640" y="220" width="30" height="30" fill="#c4b097" />
      <!-- Overlay Timestamp -->
      <rect x="20" y="20" width="220" height="32" fill="#0f172a" opacity="0.85" rx="4" />
      <text x="32" y="42" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">ACQUISITION: 2022-03-14 (T1)</text>
    `;
  } else if (type === 't2_after') {
    // Bi-temporal T2 (After - March 2024): Significant deforestation and new industrial park construction
    content = `
      <defs>
        <linearGradient id="t2Veg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2a5c2b" />
          <stop offset="100%" stop-color="#1f4420" />
        </linearGradient>
        <pattern id="concretePark" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#94a3b8" />
          <rect x="4" y="4" width="32" height="32" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5" />
        </pattern>
      </defs>
      <rect width="${w}" height="${h}" fill="#335930" />
      <!-- Fragmented forest -->
      <rect x="180" y="140" width="180" height="420" fill="url(#t2Veg)" rx="12" />
      <!-- NEW INDUSTRIAL EXPANSION / BUILT-UP CLEARANCE -->
      <rect x="360" y="140" width="280" height="420" fill="url(#concretePark)" rx="4" />
      <!-- Heavy logistics warehouse buildings -->
      <rect x="380" y="180" width="100" height="140" fill="#f8fafc" stroke="#334155" stroke-width="2" />
      <rect x="510" y="180" width="110" height="140" fill="#e2e8f0" stroke="#334155" stroke-width="2" />
      <rect x="380" y="360" width="240" height="80" fill="#cbd5e1" stroke="#334155" stroke-width="2" />
      <!-- Paved Highway bypass -->
      <path d="M 0,280 Q 240,290 400,320 T 800,360" stroke="#1d425c" stroke-width="24" fill="none" />
      <path d="M 360,100 L 360,600" stroke="#e2e8f0" stroke-width="12" fill="none" />
      <!-- Overlay Timestamp -->
      <rect x="20" y="20" width="220" height="32" fill="#0f172a" opacity="0.85" rx="4" />
      <text x="32" y="42" fill="#ef4444" font-family="monospace" font-size="13" font-weight="bold">ACQUISITION: 2024-03-18 (T2)</text>
    `;
  } else {
    // Optical urban default
    content = `
      <rect width="${w}" height="${h}" fill="#4a5568" />
      <rect x="50" y="50" width="700" height="700" fill="#2d3748" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${content}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Generate change heatmap overlay SVG
export function generateChangeHeatmapSVG(w = 800, h = 800): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <defs>
        <linearGradient id="heatGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#f97316" stop-opacity="0.7" />
        </linearGradient>
      </defs>
      <!-- Detected Changed Zone (Cleared parcel + new structures) -->
      <rect x="360" y="140" width="280" height="420" fill="url(#heatGrad)" stroke="#b91c1c" stroke-width="3" stroke-dasharray="6 3" rx="6" />
      <!-- Change polygon centroid indicator -->
      <circle cx="500" cy="350" r="12" fill="#fee2e2" stroke="#dc2626" stroke-width="3" />
      <!-- Bounding annotations -->
      <rect x="360" y="105" width="230" height="28" fill="#7f1d1d" rx="4" />
      <text x="370" y="124" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold">EXPANSION DETECTED (+1.85 km²)</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Generate region grounding annotated SVG
export function generateGroundingAnnotatedSVG(w = 800, h = 800): string {
  const baseImg = generateSatelliteSVG('optical_landscape', { width: w, height: h });
  // Water region grounding box
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <image href="${baseImg}" width="${w}" height="${h}" />
      <!-- Grounded Bounding Box for Water Reservoir -->
      <rect x="420" y="380" width="360" height="380" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7" stroke-width="3" rx="8" />
      <rect x="420" y="348" width="220" height="28" fill="#0369a1" rx="4" />
      <text x="430" y="367" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">Water Body: 93% Conf.</text>
      <!-- Coords telemetry -->
      <text x="430" y="405" fill="#bae6fd" font-family="monospace" font-size="11">[EPSG:32643] 77.21°E, 28.58°N</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Preloaded Satellite Images
export const SAMPLE_IMAGES: Record<string, SatelliteImage> = {
  optical_sentinel2: {
    id: 'img_opt_001',
    filename: 'S2B_MSIL2A_20230815T052649_T43RER.tif',
    format: 'GeoTIFF',
    dimensions: { width: 1024, height: 1024 },
    bands: 4, // B02, B03, B04, B08 (10m VNIR)
    crs: 'EPSG:32643 (WGS 84 / UTM zone 43N)',
    bounds: [76.845, 28.312, 77.214, 28.675],
    pixelResolution: [10, 10],
    modality: 'optical',
    acquisitionDate: '2023-08-15T05:26:49Z',
    validationStatus: 'valid',
    previewUrl: generateSatelliteSVG('optical_landscape'),
    sensor: 'Sentinel-2B MSI (Multi-Spectral Instrument)',
    fileSize: 4215800,
    metadata: {
      cloudCover: '1.2%',
      sunElevation: '62.4°',
      processingLevel: 'Level-2A Bottom of Atmosphere (BOA)'
    }
  },
  sar_sentinel1: {
    id: 'img_sar_001',
    filename: 'S1A_IW_GRDH_1SDV_20230816T004512_COREG.tif',
    format: 'GeoTIFF',
    dimensions: { width: 1024, height: 1024 },
    bands: 2, // VV, VH polarization
    crs: 'EPSG:32643 (WGS 84 / UTM zone 43N)',
    bounds: [76.845, 28.312, 77.214, 28.675],
    pixelResolution: [10, 10],
    modality: 'sar',
    acquisitionDate: '2023-08-16T00:45:12Z',
    validationStatus: 'valid',
    previewUrl: generateSatelliteSVG('sar_speckle'),
    sensor: 'Sentinel-1A C-SAR (Interferometric Wide Swath)',
    fileSize: 3145728,
    metadata: {
      polarization: 'VV + VH',
      passDirection: 'Ascending',
      orbitNumber: 49821,
      calibration: 'Radiometric Sigma-0 calibrated'
    }
  },
  bitemporal_t1: {
    id: 'img_t1_001',
    filename: 'S2A_MSIL2A_20220314_T43RER_T1.tif',
    format: 'GeoTIFF',
    dimensions: { width: 1024, height: 1024 },
    bands: 4,
    crs: 'EPSG:32643 (WGS 84 / UTM zone 43N)',
    bounds: [76.902, 28.401, 77.150, 28.610],
    pixelResolution: [10, 10],
    modality: 'optical',
    acquisitionDate: '2022-03-14T05:30:00Z',
    validationStatus: 'valid',
    previewUrl: generateSatelliteSVG('t1_before'),
    sensor: 'Sentinel-2A MSI',
    fileSize: 4194304,
    metadata: {
      acquisitionDate: '2022-03-14',
      season: 'Pre-monsoon / Spring'
    }
  },
  bitemporal_t2: {
    id: 'img_t2_001',
    filename: 'S2B_MSIL2A_20240318_T43RER_T2.tif',
    format: 'GeoTIFF',
    dimensions: { width: 1024, height: 1024 },
    bands: 4,
    crs: 'EPSG:32643 (WGS 84 / UTM zone 43N)',
    bounds: [76.902, 28.401, 77.150, 28.610],
    pixelResolution: [10, 10],
    modality: 'optical',
    acquisitionDate: '2024-03-18T05:32:00Z',
    validationStatus: 'valid',
    previewUrl: generateSatelliteSVG('t2_after'),
    sensor: 'Sentinel-2B MSI',
    fileSize: 4194304,
    metadata: {
      acquisitionDate: '2024-03-18',
      season: 'Pre-monsoon / Spring'
    }
  }
};

// Five sample demonstration scenarios (Section 29)
export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo-1',
    demoNumber: 1,
    title: 'Single-Image Visual Question Answering (VQA)',
    description: 'Natural language reasoning on land cover, water identification, and object detection on a single optical satellite scene.',
    task: 'vqa',
    query: 'Is there a water body in this image?',
    inputMode: 'single',
    images: [SAMPLE_IMAGES.optical_sentinel2],
    expectedHighlight: 'Identifies the eastern water reservoir and perennial river with 93% confidence.'
  },
  {
    id: 'demo-2',
    demoNumber: 2,
    title: 'Automated Scene Captioning',
    description: 'Comprehensive scene description outlining land-use distribution, agrarian parcels, road networks, and urban structures.',
    task: 'captioning',
    query: 'Describe the land-cover and major objects visible in this image.',
    inputMode: 'single',
    images: [SAMPLE_IMAGES.optical_sentinel2],
    expectedHighlight: 'Produces a detailed multi-class landscape description.'
  },
  {
    id: 'demo-3',
    demoNumber: 3,
    title: 'Text-Guided Region Grounding',
    description: 'Spatial localization and bounding coordinate extraction for semantic classes mentioned in the prompt.',
    task: 'grounding',
    query: 'Highlight the water body referred to in the query.',
    inputMode: 'single',
    images: [SAMPLE_IMAGES.optical_sentinel2],
    expectedHighlight: 'Draws localized bounding box and segmentation overlay around the reservoir.'
  },
  {
    id: 'demo-4',
    demoNumber: 4,
    title: 'Bi-Temporal Change Analysis & Change VQA',
    description: 'Detects and quantifies morphological and anthropogenic land-cover changes between dates T1 (2022) and T2 (2024).',
    task: 'change_detection',
    query: 'What changed between these two dates, and where did the change occur?',
    inputMode: 'bitemporal',
    images: [SAMPLE_IMAGES.bitemporal_t1, SAMPLE_IMAGES.bitemporal_t2],
    expectedHighlight: 'Generates difference heatmap revealing +1.85 km² industrial expansion and canopy loss.'
  },
  {
    id: 'demo-5',
    demoNumber: 5,
    title: 'Cross-Modal Optical + SAR Synergistic Fusion',
    description: 'Combines optical VNIR spectral bands with Sentinel-1 SAR C-band microwave backscatter for all-weather feature identification.',
    task: 'optical_sar',
    query: 'Use the optical and SAR images together to identify built-up and water-covered regions.',
    inputMode: 'optical_sar',
    images: [SAMPLE_IMAGES.optical_sentinel2, SAMPLE_IMAGES.sar_sentinel1],
    expectedHighlight: 'Fuses optical water absorption and SAR double-bounce building wall returns.'
  }
];

// Specialist Model Registry list (Section 21)
export const SPECIALIST_MODELS: SpecialistModelInfo[] = [
  {
    id: 'mod_vqa',
    name: 'RS-VQA-SwinTransformer',
    version: 'v2.4-rs',
    task: 'vqa',
    taskLabel: 'Visual Question Answering',
    modalities: ['optical', 'sar', 'multispectral'],
    inputRequirements: 'Single satellite scene + natural-language question',
    parameters: {
      temperature: '0.2',
      beam_size: '4',
      max_new_tokens: '128',
      spatial_attention_heads: '8'
    },
    status: 'Ready',
    architecture: 'Swin-B Hierarchical Vision Transformer + BERT Cross-Attention',
    backbone: 'Pretrained on 500k Sentinel/Landsat patches',
    adaptationDataset: 'RSVQA (High & Low Resolution splits)',
    benchmarkScore: '89.4% Top-1 Accuracy on RSVQA-HR',
    description: 'Specialized remote-sensing question answering model capable of interpreting spatial counts, land cover types, and presence/absence queries.'
  },
  {
    id: 'mod_cap',
    name: 'GeoRS-Cap-ViT',
    version: 'v1.8-rs',
    task: 'captioning',
    taskLabel: 'Scene Captioning',
    modalities: ['optical', 'multispectral'],
    inputRequirements: 'Single satellite scene',
    parameters: {
      temperature: '0.35',
      top_p: '0.9',
      repetition_penalty: '1.2'
    },
    status: 'Ready',
    architecture: 'Vision Transformer (ViT-L/14) + GPT-RS Autoregressive Decoder',
    backbone: 'Multi-spectral satellite encoder',
    adaptationDataset: 'VRSBench & UCMerced Caption Dataset',
    benchmarkScore: 'BLEU-4: 38.6 | CIDEr: 1.42',
    description: 'Generates detailed, grammatically fluent remote sensing scene captions cataloging natural terrain, anthropogenic structures, and road arteries.'
  },
  {
    id: 'mod_ground',
    name: 'RS-Ground-MaskDINO',
    version: 'v3.1',
    task: 'grounding',
    taskLabel: 'Region Grounding & Localization',
    modalities: ['optical', 'multispectral'],
    inputRequirements: 'Single satellite image + textual entity reference',
    parameters: {
      iou_threshold: '0.5',
      box_score_threshold: '0.65',
      nms_suppression: 'True'
    },
    status: 'Ready',
    architecture: 'Deformable Transformer + RS Query Cross-Attention',
    backbone: 'ResNet-101 / Swin-L Remote Sensing backbone',
    adaptationDataset: 'VRSBench Visual Grounding Split',
    benchmarkScore: 'mIoU: 68.2% on Geospatial Targets',
    description: 'Localizes mentioned targets (e.g. "water body", "airfield", "solar plant", "bridge") and generates pixel-aligned bounding boxes and masks.'
  },
  {
    id: 'mod_change',
    name: 'Bi-Temporal ChangeStar-Net',
    version: 'v2.0',
    task: 'change_detection',
    taskLabel: 'Bi-Temporal Change Detection',
    modalities: ['optical', 'multispectral'],
    inputRequirements: 'Pair of co-registered images (Time T1 and Time T2)',
    parameters: {
      change_threshold: '0.55',
      spatial_smoothing_kernel: '5x5',
      ndvi_weight: '0.4'
    },
    status: 'Ready',
    architecture: 'Siamese Multi-Scale Feature Difference Engine + Attention UNet',
    backbone: 'Dual-branch Siamese ResNet-50',
    adaptationDataset: 'LEVIR-CD & WHU Building Change Dataset',
    benchmarkScore: 'F1-Score: 91.2% on Urban Expansion',
    description: 'Identifies structural, canopy, and earthwork discrepancies between bi-temporal acquisitions, filtering atmospheric and seasonal noise.'
  },
  {
    id: 'mod_change_vqa',
    name: 'Change-VQA-Reasoner',
    version: 'v1.5',
    task: 'change_vqa',
    taskLabel: 'Change-Based VQA',
    modalities: ['optical', 'multispectral'],
    inputRequirements: 'Pair of bi-temporal images + change question',
    parameters: {
      diff_fusion_method: 'concatenation_with_subtraction',
      reasoning_depth: 'deep'
    },
    status: 'Ready',
    architecture: 'Bi-temporal Cross-Attention Fusion + Text Decoder',
    backbone: 'ChangeStar + LLaMA-RS Adapter',
    adaptationDataset: 'CDVQA (Change Detection VQA)',
    benchmarkScore: 'Accuracy: 84.7% on CDVQA benchmark',
    description: 'Answers complex comparative questions regarding temporal evolution, built-up growth rates, and environmental degradation.'
  },
  {
    id: 'mod_opt_sar',
    name: 'CrossModal-RS-FusionNet',
    version: 'v2.2',
    task: 'optical_sar',
    taskLabel: 'Optical + SAR Fusion Analysis',
    modalities: ['optical', 'sar'],
    inputRequirements: 'Co-registered Optical image + SAR image (same bounding extent)',
    parameters: {
      speckle_filter: 'Lee Enhanced 3x3',
      registration_tolerance: '0.5 px',
      polarization_weights: 'VV:0.6, VH:0.4'
    },
    status: 'Ready',
    architecture: 'Dual-Encoder Hybrid (Multispectral + Radar Dielectric Model)',
    backbone: 'ResNet-50 Optical + Polarimetric SAR ConvNet',
    adaptationDataset: 'BigEarthNet (Sentinel-1 & Sentinel-2 matched pairs)',
    benchmarkScore: 'Overall Accuracy: 92.8% on Multi-modal Land Cover',
    description: 'Fuses optical multispectral reflectance with microwave polarimetric SAR scattering to deliver cloud-penetrating, high-confidence terrain segmentation.'
  }
];

// Supported Datasets List (Section 22)
export const DATASETS_INFO: DatasetInfo[] = [
  {
    id: 'bigearthnet',
    name: 'BigEarthNet',
    category: 'training',
    purpose: 'Remote-sensing adaptation, pretraining, and multi-label land-cover classification.',
    modalities: ['Sentinel-2 MSI (12 Spectral Bands)', 'Sentinel-1 SAR (VV & VH Polarizations)'],
    samplesCount: '590,326 Paired Multi-Spectral & SAR Patches',
    spatialResolution: '10m, 20m, and 60m Ground Sampling Distance',
    description: 'The standard benchmark for training multi-modal remote-sensing models across 10 European countries, featuring Corine Land Cover (CLC) nomenclature annotations.',
    tasksSupported: ['Optical-SAR Fusion', 'Land-Cover Representation Learning', 'Multi-Spectral Feature Extraction']
  },
  {
    id: 'vrsbench',
    name: 'VRSBench',
    category: 'evaluation',
    purpose: 'Visual Reasoning on Satellite Benchmarks for remote sensing captioning and region grounding.',
    modalities: ['High-Resolution Optical Satellite Imagery (0.5m - 2m)'],
    samplesCount: '29,614 Images with Detailed Captions and Bounding Boxes',
    spatialResolution: 'Sub-meter to 2m resolution',
    description: 'A comprehensive benchmark specifically engineered for grounding geospatial concepts and producing multi-sentence scene descriptions with precise coordinate verification.',
    tasksSupported: ['Text-Guided Grounding', 'Scene Captioning', 'Geospatial Object Localization']
  },
  {
    id: 'rsvqa',
    name: 'RSVQA',
    category: 'evaluation',
    purpose: 'Remote-Sensing Visual Question Answering evaluation on both high-resolution and low-resolution satellite feeds.',
    modalities: ['Sentinel-2 (Low-Resolution)', 'Aerial / Orthophoto (High-Resolution)'],
    samplesCount: '772,221 Question-Answer Pairs across 10,659 tiles',
    spatialResolution: '10m (Sentinel-2) and 0.15m (Aerial)',
    description: 'Contains questions testing count, presence, comparison, and rural vs. urban categorization in remote sensing contexts.',
    tasksSupported: ['Single-Image VQA', 'Object Counting', 'Area Comparison']
  },
  {
    id: 'cdvqa',
    name: 'CDVQA',
    category: 'evaluation',
    purpose: 'Change-based Visual Question Answering benchmark on bi-temporal satellite pairs.',
    modalities: ['Bi-Temporal High-Resolution Optical Pairs (T1 & T2)'],
    samplesCount: '10,000+ Bi-Temporal Image Pairs with 80,000+ QA Pairs',
    spatialResolution: '0.5m - 3m resolution',
    description: 'Validates models on questions such as "Has the built-up area increased?", "Where did vegetation decrease?", and "What major changes occurred?"',
    tasksSupported: ['Change VQA', 'Bi-temporal Change Detection', 'Temporal Reasoning']
  }
];
