import { fromBlob } from 'geotiff';

export interface DecodedTiffResult {
  dataUrl: string;
  width: number;
  height: number;
  bands: number;
}

export async function decodeTiffFile(file: File): Promise<DecodedTiffResult> {
  const tiff = await fromBlob(file);
  const image = await tiff.getImage();
  const width = image.getWidth();
  const height = image.getHeight();
  const bands = image.getSamplesPerPixel() || 1;

  const rasters = await image.readRasters();

  // Downsample to max dimension for preview rendering
  const maxDim = 1024;
  let targetW = width;
  let targetH = height;
  if (targetW > maxDim || targetH > maxDim) {
    if (targetW > targetH) {
      targetH = Math.max(1, Math.round((targetH * maxDim) / targetW));
      targetW = maxDim;
    } else {
      targetW = Math.max(1, Math.round((targetW * maxDim) / targetH));
      targetH = maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to acquire canvas 2d context for TIFF rasterization');
  }

  const imgData = ctx.createImageData(targetW, targetH);
  const data = imgData.data;

  const rBand = rasters[0] as any;
  const gBand = (rasters[1] || rasters[0]) as any;
  const bBand = (rasters[2] || (rasters[1] || rasters[0])) as any;

  // Approximate min/max for normalization
  let min = Infinity;
  let max = -Infinity;
  const step = Math.max(1, Math.floor(rBand.length / 4000));
  for (let i = 0; i < rBand.length; i += step) {
    const val = rBand[i];
    if (val < min) min = val;
    if (val > max) max = val;
  }
  const range = max - min || 1;

  for (let y = 0; y < targetH; y++) {
    const srcY = Math.floor((y * height) / targetH);
    for (let x = 0; x < targetW; x++) {
      const srcX = Math.floor((x * width) / targetW);
      const srcIdx = srcY * width + srcX;
      const dstIdx = (y * targetW + x) * 4;

      const rVal = ((rBand[srcIdx] - min) / range) * 255;
      const gVal = bands >= 2 ? ((gBand[srcIdx] - min) / range) * 255 : rVal;
      const bVal = bands >= 3 ? ((bBand[srcIdx] - min) / range) * 255 : rVal;

      data[dstIdx] = Math.min(255, Math.max(0, rVal));
      data[dstIdx + 1] = Math.min(255, Math.max(0, gVal));
      data[dstIdx + 2] = Math.min(255, Math.max(0, bVal));
      data[dstIdx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return {
    dataUrl: canvas.toDataURL('image/png'),
    width,
    height,
    bands,
  };
}
