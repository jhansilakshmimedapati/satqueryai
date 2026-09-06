# SatQuery AI: Agentic Vision-Language Assistant for Multimodal Remote-Sensing Image Analysis

SatQuery AI is a specialized, agentic multimodal remote-sensing AI assistant that enables earth observation analysts, researchers, and geospatial engineers to query high-resolution satellite imagery using natural language.

Unlike generic conversational wrappers, SatQuery AI implements an autonomous **agentic routing controller** that inspects multi-spectral and synthetic aperture radar (SAR) raster geometries, classifies geospatial tasks, enforces co-registration and temporal preconditions, selects specialist vision-language models, and synthesizes evidence-grounded answers with verifiable telemetry.

---

## Key Capabilities

1. **Single-Scene Multimodal Analysis**: Optical, multispectral (Sentinel-2, Landsat), and SAR (Sentinel-1) raster interpretation.
2. **Optical + SAR Cross-Modal Fusion**: Synergistic fusion combining optical surface reflectance with polarimetric microwave backscatter.
3. **Bi-Temporal Change Detection & VQA**: Siamese difference analysis isolating structural urban expansion, deforestation, and water body fluctuations between observation epochs T1 and T2.
4. **Natural-Language Region Grounding**: Text-guided object and land cover localization with bounding box coordinates and spatial extent calculations.
5. **Remote-Sensing Visual Question Answering (RS-VQA)**: Questions regarding object presence, surface area, and land use.
6. **Auditable Observable Execution Trace**: Transparent 6-step execution logging (Query interpreted → Inputs validated → Specialist tools selected → Processing completed → Visual evidence generated → Response synthesized).
7. **Official Mission Reporting**: Export auditable PDF reports and structured JSON summaries.
8. **Remote-Sensing Adaptation Pipeline**: Built-in PyTorch training and evaluation suite fine-tuned on the BigEarthNet multi-modal dataset (43 Corine Land Cover classes).

---

## 4-Tier Geospatial System Architecture

```text
               +-------------------------------------------+
               |        Natural Language Query / Prompt    |
               +-------------------------------------------+
                                     |
                                     v
               +-------------------------------------------+
               |        Tier 1: Geospatial Raster Engine   |
               |  (GeoTIFF, Multispectral VNIR, SAR Bands) |
               +-------------------------------------------+
                                     |
                                     v
               +-------------------------------------------+
               |     Tier 2: SatQuery Agent Controller     |
               | (Task Classification & Precondition Check)|
               +-------------------------------------------+
                                     |
                                     v
               +-------------------------------------------+
               |       Tier 3: Modular Model Registry      |
               |  - RS-VQA-SwinTransformer                 |
               |  - GeoRS-Cap-ViT                          |
               |  - RS-Ground-MaskDINO                     |
               |  - Bi-Temporal ChangeStar-Net             |
               |  - Change-VQA-Reasoner                    |
               |  - CrossModal-RS-FusionNet                |
               +-------------------------------------------+
                                     |
                                     v
               +-------------------------------------------+
               |        Tier 4: Synthesis & Telemetry      |
               | (Visual Evidence, Calibrated Conf, PDF)   |
               +-------------------------------------------+
```

---

## Specialist Model Registry

| Model Name | Task | Architecture | Benchmark Score |
| :--- | :--- | :--- | :--- |
| **RS-VQA-SwinTransformer** | Visual Question Answering | Swin-B Hierarchical ViT + BERT | 89.4% Top-1 Acc (RSVQA-HR) |
| **GeoRS-Cap-ViT** | Scene Captioning | ViT-L/14 + GPT-RS Decoder | BLEU-4: 38.6, CIDEr: 1.42 |
| **RS-Ground-MaskDINO** | Region Grounding | Deformable Transformer + RS Query | 68.2% mIoU (VRSBench) |
| **Bi-Temporal ChangeStar-Net** | Change Detection | Siamese Difference Engine + Attention UNet | 91.2% F1 (LEVIR-CD) |
| **Change-VQA-Reasoner** | Change-based VQA | Cross-Attention Bi-Temporal Fusion | 84.7% Acc (CDVQA) |
| **CrossModal-RS-FusionNet** | Optical + SAR Fusion | Dual-Encoder Multispectral + SAR Model | 92.8% OA (BigEarthNet) |

---

## Ready-to-Run Demonstration Scenarios

SatQuery AI includes five built-in scenarios with preloaded satellite imagery:
- **Demo 1 — Single Image VQA**: *"Is there a water body in this image?"*
- **Demo 2 — Scene Captioning**: *"Describe the land-cover and major objects visible in this image."*
- **Demo 3 — Text-Guided Grounding**: *"Highlight the water body referred to in the query."*
- **Demo 4 — Bi-Temporal Change**: *"What changed between these two dates, and where did the change occur?"*
- **Demo 5 — Optical + SAR Fusion**: *"Use the optical and SAR images together to identify built-up and water-covered regions."*

---

## BigEarthNet Training Pipeline

The adaptation scripts in `/training` allow fine-tuning vision-language models on Sentinel-1 SAR and Sentinel-2 multi-spectral data:

```bash
# 1. Check configuration
cat training/config.yaml

# 2. Run remote-sensing adaptation training
python3 -m training.train

# 3. Evaluate across remote-sensing benchmarks
python3 -m training.evaluate
```

---

## REST API Reference

- `GET /api/health` — System status, online models, and adaptation readiness.
- `GET /api/models` — Specialist model registry metadata and runtime parameters.
- `POST /api/analyze` — Primary agent endpoint taking natural-language queries and satellite images.
- `POST /api/validate` — Input verification (dimensions, CRS, and temporal requirements).
- `GET /api/history` — Session database of past remote sensing queries.
- `GET /api/report/:id` — Mission report generation for download.

---

## Development & Production Deployment

```bash
# Install dependencies
npm install

# Run full-stack dev server (Express + Vite on Port 3000)
npm run dev

# Build production bundle (client SPA + compiled Node.js CommonJS server)
npm run build

# Start production server
npm start
```
