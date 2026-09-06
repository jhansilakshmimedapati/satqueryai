"""
SatQuery AI - Analysis Report Generator
Generates auditable PDF and JSON summary reports.
"""

from typing import Dict, Any
import json
import time


class ReportGenerator:
    """Generates standardized remote-sensing mission analysis reports."""

    @staticmethod
    def generate_report_dict(analysis: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "title": "SatQuery AI - Remote Sensing Mission Analysis Report",
            "reportId": f"REP-{analysis.get('id', 'UNK')}",
            "generatedAt": time.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "organization": "SatQuery Autonomous Remote Sensing Research Lab",
            "mission": {
                "query": analysis.get("query"),
                "taskDetected": analysis.get("taskDetected"),
                "task": analysis.get("task"),
                "confidence": analysis.get("confidence"),
                "confidenceLabel": analysis.get("confidenceLabel", "Model confidence / estimated confidence"),
                "answer": analysis.get("answer"),
                "isDemoMode": analysis.get("isDemoMode", False),
            },
            "inputs": [
                {
                    "filename": img.get("filename"),
                    "format": img.get("format"),
                    "dimensions": img.get("dimensions"),
                    "bands": img.get("bands"),
                    "crs": img.get("crs"),
                    "modality": img.get("modality"),
                }
                for img in analysis.get("images", [])
            ],
            "executionSummary": analysis.get("executionSummary", {}),
            "remoteSensingAdaptation": analysis.get("remoteSensingAdaptation", {
                "enabled": True,
                "dataset": "BigEarthNet (Sentinel-1 & Sentinel-2)",
                "model": "SatSwin-Transformer",
                "status": "Ready",
            }),
        }
