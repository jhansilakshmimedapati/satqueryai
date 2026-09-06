"""
SatQuery AI - Remote Sensing Preprocessing & Data Augmentation
Standardizes multi-spectral top-of-atmosphere/bottom-of-atmosphere reflectance
and SAR backscatter sigma-0 dB normalization.
"""

import numpy as np


class RemoteSensingPreprocessor:
    """Preprocesses optical and SAR satellite imagery."""

    # Standard Sentinel-2 L2A mean and standard deviations per band (scaled 0-10000 DN)
    S2_BAND_MEANS = np.array([
        1353.7, 1117.2, 1041.8, 946.5, 1199.1, 2003.0, 2374.0, 2301.2, 2500.0, 732.1, 1820.5, 1118.2
    ], dtype=np.float32)

    S2_BAND_STDS = np.array([
        654.2, 705.4, 622.3, 678.9, 630.1, 780.2, 890.3, 850.1, 910.4, 412.0, 750.3, 620.1
    ], dtype=np.float32)

    # Sentinel-1 Sigma-0 dB min/max clipping boundaries
    SAR_VV_CLIP = (-25.0, 0.0)
    SAR_VH_CLIP = (-32.0, -5.0)

    @classmethod
    def normalize_optical(cls, tensor_bands: np.ndarray) -> np.ndarray:
        """Normalizes 12-band Sentinel-2 reflectance using global stats."""
        # Shape: (12, H, W)
        norm = np.zeros_like(tensor_bands, dtype=np.float32)
        for b in range(min(12, tensor_bands.shape[0])):
            norm[b] = (tensor_bands[b] - cls.S2_BAND_MEANS[b]) / (cls.S2_BAND_STDS[b] + 1e-6)
        return norm

    @classmethod
    def normalize_sar(cls, sar_bands: np.ndarray) -> np.ndarray:
        """Normalizes dual-pol SAR backscatter (VV, VH) to range [0, 1]."""
        # Shape: (2, H, W)
        norm = np.zeros_like(sar_bands, dtype=np.float32)
        # VV
        norm[0] = np.clip(
            (sar_bands[0] - cls.SAR_VV_CLIP[0]) / (cls.SAR_VV_CLIP[1] - cls.SAR_VV_CLIP[0]),
            0.0, 1.0
        )
        # VH
        if sar_bands.shape[0] > 1:
            norm[1] = np.clip(
                (sar_bands[1] - cls.SAR_VH_CLIP[0]) / (cls.SAR_VH_CLIP[1] - cls.SAR_VH_CLIP[0]),
                0.0, 1.0
            )
        return norm

    @classmethod
    def compute_ndvi(cls, red_band: np.ndarray, nir_band: np.ndarray) -> np.ndarray:
        """Computes Normalized Difference Vegetation Index (NDVI)."""
        denominator = nir_band + red_band + 1e-7
        return (nir_band - red_band) / denominator

    @classmethod
    def compute_ndwi(cls, green_band: np.ndarray, nir_band: np.ndarray) -> np.ndarray:
        """Computes Normalized Difference Water Index (NDWI) for surface hydrology."""
        denominator = green_band + nir_band + 1e-7
        return (green_band - nir_band) / denominator
