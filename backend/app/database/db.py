"""
SatQuery AI - Database & Storage Module
Implements SQLite storage for persistent analysis history and metadata.
"""

import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.environ.get("DATABASE_PATH", "data/satquery.db")


def init_db():
    os.makedirs(os.path.dirname(DB_PATH) if os.path.dirname(DB_PATH) else ".", exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            query TEXT NOT NULL,
            task TEXT NOT NULL,
            input_summary TEXT,
            models_used TEXT,
            confidence REAL,
            status TEXT,
            answer TEXT,
            data_json TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS uploaded_images (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            format TEXT,
            width INTEGER,
            height INTEGER,
            bands INTEGER,
            crs TEXT,
            modality TEXT,
            metadata_json TEXT
        )
    """)

    conn.commit()
    conn.close()


def save_analysis(analysis_record: Dict[str, Any]) -> None:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT OR REPLACE INTO analyses 
        (id, query, task, input_summary, models_used, confidence, status, answer, data_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        analysis_record["id"],
        analysis_record["query"],
        analysis_record["task"],
        analysis_record.get("input_summary", ""),
        json.dumps(analysis_record.get("models_used", [])),
        analysis_record.get("confidence", 0.0),
        analysis_record.get("status", "completed"),
        analysis_record.get("answer", ""),
        json.dumps(analysis_record)
    ))

    conn.commit()
    conn.close()


def get_analyses(limit: int = 50) -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT data_json FROM analyses ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [json.loads(row[0]) for row in rows]


def get_analysis_by_id(analysis_id: str) -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT data_json FROM analyses WHERE id = ?", (analysis_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row[0])
    return None
