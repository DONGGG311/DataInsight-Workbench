from fastapi import APIRouter, HTTPException
from database import get_db
from services.parser import _safe_value
from config import settings
import pandas as pd, os

router = APIRouter(prefix="/api/datasets", tags=["data"])

def _get_file_path(dataset_id: str) -> str:
    db = get_db()
    row = db.execute("SELECT id FROM datasets WHERE id=?", [dataset_id]).fetchone()
    db.close()
    if not row:
        raise HTTPException(404, detail="数据集不存在")
    for ext in ['.csv', '.xlsx', '.xls']:
        p = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}{ext}")
        if os.path.exists(p):
            return p
    raise HTTPException(404, detail="数据文件不存在")

@router.get("/{dataset_id}")
def get_dataset_meta(dataset_id: str):
    db = get_db()
    ds = db.execute("SELECT * FROM datasets WHERE id=?", [dataset_id]).fetchone()
    if not ds:
        db.close()
        raise HTTPException(404, detail="数据集不存在")
    cols = db.execute(
        "SELECT name, dtype, missing_count FROM columns WHERE dataset_id=? ORDER BY order_index",
        [dataset_id]
    ).fetchall()
    db.close()
    return {
        "id": ds["id"], "filename": ds["filename"],
        "row_count": ds["row_count"], "col_count": ds["col_count"],
        "columns": [dict(c) for c in cols],
        "created_at": str(ds["created_at"])
    }

@router.get("/{dataset_id}/data")
def get_dataset_data(dataset_id: str, page: int = 1, size: int = 50):
    filepath = _get_file_path(dataset_id)
    df = pd.read_csv(filepath) if filepath.endswith('.csv') else pd.read_excel(filepath)
    df = df.where(pd.notnull(df), None)
    total = len(df)
    start = (page - 1) * size
    end = start + size
    rows = [[_safe_value(v) for v in row] for _, row in df.iloc[start:end].iterrows()]
    return {
        "rows": rows,
        "total_rows": total,
        "page": page,
        "page_size": size,
        "columns": list(df.columns)
    }
