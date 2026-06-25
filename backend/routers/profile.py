from fastapi import APIRouter, HTTPException
from database import get_db
from services.profiler import compute_profile
from config import settings
import os, json

router = APIRouter(prefix="/api/datasets", tags=["profile"])

@router.get("/{dataset_id}/profile")
def get_profile(dataset_id: str):
    db = get_db()
    ds = db.execute("SELECT id FROM datasets WHERE id=?", [dataset_id]).fetchone()
    db.close()
    if not ds:
        raise HTTPException(404, detail="数据集不存在")

    for ext in ['.csv', '.xlsx', '.xls']:
        path = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}{ext}")
        if os.path.exists(path):
            try:
                profile = compute_profile(path)
                db2 = get_db()
                db2.execute("DELETE FROM profiles WHERE dataset_id=?", [dataset_id])
                db2.execute("INSERT INTO profiles (dataset_id, result_json) VALUES (?,?)",
                            [dataset_id, json.dumps(profile, ensure_ascii=False)])
                db2.commit()
                db2.close()
                return profile
            except Exception as e:
                raise HTTPException(500, detail=f"分析失败: {str(e)}")
    raise HTTPException(404, detail="数据文件不存在")
