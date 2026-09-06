"""
SatQuery AI - FastAPI API Router
Implements REST endpoints specified in Section 26.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
import time
import json
import os

from app.agent.controller import satquery_agent
from app.models.registry import registry
from app.tools.image_validator import ImageValidatorTool
from app.geospatial.raster_handler import GeospatialRasterHandler
from app.database.db import save_analysis, get_analyses, get_analysis_by_id
from app.reports.pdf_generator import ReportGenerator

api_router = APIRouter()


class AnalyzeRequest(BaseModel):
    query: str
    images: List[Dict[str, Any]]
    task_override: Optional[str] = None


class ValidateRequest(BaseModel):
    images: List[Dict[str, Any]]
    task: Optional[str] = None


@api_router.get("/health")
def get_health():
    return {
        "status": "Healthy",
        "system": "SatQuery AI Remote Sensing Engine",
        "version": "1.0.0",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "gpu_available": False,
        "mode": "Demonstration & Open-source Pipeline Ready",
        "remote_sensing_adaptation": {
            "status": "Ready",
            "dataset": "BigEarthNet (Sentinel-1 & Sentinel-2)",
            "model": "RS-VQA-SwinTransformer & ChangeStar",
        }
    }


@api_router.get("/models")
def get_models():
    return {
        "models": registry.list_models(),
        "count": len(registry.list_models()),
        "status": "All specialist models registered and ready",
    }


@api_router.post("/validate")
def validate_inputs(req: ValidateRequest):
    if not req.images:
        return {"valid": False, "message": "No images provided"}
    
    task = req.task or "vqa"
    is_valid, message, warnings = satquery_agent.validate_inputs_for_task(task, req.images)
    
    pair_check = None
    if len(req.images) >= 2:
        pair_check = ImageValidatorTool.validate_pair_compatibility(req.images[0], req.images[1], task)

    return {
        "valid": is_valid,
        "message": message,
        "warnings": warnings,
        "pairCheck": pair_check,
    }


@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...), modality: str = Form("optical")):
    filename = file.filename or "uploaded.tif"
    is_valid, msg = ImageValidatorTool.validate_file(filename)
    if not is_valid:
        raise HTTPException(status_code=400, detail=msg)

    # Save to uploads dir
    os.makedirs("data/uploads", exist_ok=True)
    file_id = f"img_{uuid.uuid4().hex[:8]}"
    save_path = f"data/uploads/{file_id}_{filename}"
    
    contents = await file.read()
    with open(save_path, "wb") as f:
        f.write(contents)

    metadata = GeospatialRasterHandler.inspect_file(save_path)
    metadata["id"] = file_id
    metadata["modality"] = modality
    metadata["fileSize"] = len(contents)
    metadata["previewUrl"] = f"/data/uploads/{file_id}_{filename}"

    return {
        "success": True,
        "image": metadata,
    }


@api_router.post("/analyze")
def analyze(req: AnalyzeRequest):
    result = satquery_agent.analyze(req.query, req.images)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))

    analysis_id = f"ana_{uuid.uuid4().hex[:8]}"
    record = {
        "id": analysis_id,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "query": req.query,
        "task": result["task"],
        "taskDetected": result["taskDetected"],
        "answer": result["answer"],
        "confidence": result["confidence"],
        "confidenceLabel": result["confidenceLabel"],
        "executionSummary": result["executionSummary"],
        "images": req.images,
        "warnings": result.get("warnings", []),
        "remoteSensingAdaptation": {
            "enabled": True,
            "dataset": "BigEarthNet",
            "model": result["executionSummary"]["selectedModels"][0] if result["executionSummary"]["selectedModels"] else "RS-Specialist",
            "status": "Ready",
        },
        "isDemoMode": True,
    }

    # Persist to SQLite
    try:
        save_analysis(record)
    except Exception as e:
        print(f"Error saving analysis: {e}")

    return record


@api_router.get("/history")
def list_history(limit: int = 50):
    records = get_analyses(limit=limit)
    return {"analyses": records, "count": len(records)}


@api_router.get("/analysis/{analysis_id}")
def get_single_analysis(analysis_id: str):
    rec = get_analysis_by_id(analysis_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Analysis record not found")
    return rec


@api_router.get("/report/{analysis_id}")
def get_report(analysis_id: str):
    rec = get_analysis_by_id(analysis_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Analysis record not found")
    report = ReportGenerator.generate_report_dict(rec)
    return report


# Specialist Direct Endpoints as specified in API design
@api_router.post("/vqa")
def single_vqa(req: AnalyzeRequest):
    return satquery_agent.analyze(req.query, req.images)


@api_router.post("/caption")
def caption(req: AnalyzeRequest):
    req.query = "Describe this satellite image and major objects."
    return satquery_agent.analyze(req.query, req.images)


@api_router.post("/ground")
def ground(req: AnalyzeRequest):
    return satquery_agent.analyze(req.query, req.images)


@api_router.post("/change")
def change_detect(req: AnalyzeRequest):
    req.query = "What changed between these two dates?"
    return satquery_agent.analyze(req.query, req.images)


@api_router.post("/change-vqa")
def change_vqa(req: AnalyzeRequest):
    return satquery_agent.analyze(req.query, req.images)


@api_router.post("/optical-sar")
def optical_sar_fuse(req: AnalyzeRequest):
    return satquery_agent.analyze(req.query, req.images)
