"""
SatQuery AI - Modular Specialist Model Registry
Implements standard Model interface and dynamic tool discovery.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional


class BaseModel(ABC):
    """Abstract Base Class for all Remote-Sensing Specialist Models."""

    def __init__(
        self,
        name: str,
        version: str,
        task: str,
        modalities: List[str],
        input_requirements: str,
        parameters: Optional[Dict[str, Any]] = None,
    ):
        self.name = name
        self.version = version
        self.task = task
        self.modalities = modalities
        self.input_requirements = input_requirements
        self.parameters = parameters or {}
        self.status = "Ready"

    @abstractmethod
    def predict(self, inputs: Dict[str, Any], query: str) -> Dict[str, Any]:
        """Execute inference using specialist architecture."""
        pass

    @abstractmethod
    def confidence(self, output: Dict[str, Any]) -> float:
        """Estimate calibrated or heuristic prediction confidence (0-100%)."""
        pass

    def get_metadata(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "version": self.version,
            "task": self.task,
            "modalities": self.modalities,
            "input_requirements": self.input_requirements,
            "parameters": self.parameters,
            "status": self.status,
        }


class ModelRegistry:
    """Central registry maintaining specialist remote sensing models."""

    def __init__(self):
        self._registry: Dict[str, BaseModel] = {}

    def register(self, model_id: str, model: BaseModel) -> None:
        self._registry[model_id] = model

    def get(self, model_id: str) -> Optional[BaseModel]:
        return self._registry.get(model_id)

    def list_models(self) -> List[Dict[str, Any]]:
        return [
            {"id": model_id, **model.get_metadata()}
            for model_id, model in self._registry.items()
        ]

    def find_for_task(self, task: str, modality: Optional[str] = None) -> List[BaseModel]:
        results = []
        for model in self._registry.values():
            if model.task == task:
                if modality is None or modality in model.modalities:
                    results.append(model)
        return results


# Global singleton instance
registry = ModelRegistry()
