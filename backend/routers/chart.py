from fastapi import APIRouter, HTTPException
from services.chart_builder import build_chart_data
from models.schemas import ChartRequest
from config import settings
import os

router = APIRouter(prefix="/api/datasets", tags=["chart"])


@router.post("/{dataset_id}/chart")
def get_chart_data(dataset_id: str, req: ChartRequest):
    for ext in ['.csv', '.xlsx', '.xls']:
        path = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}{ext}")
        if os.path.exists(path):
            try:
                return build_chart_data(path, req.chart_type,
                                        req.x_field, req.y_field,
                                        req.group_by, req.filters)
            except ValueError as e:
                raise HTTPException(400, detail=str(e))
            except Exception as e:
                raise HTTPException(500, detail=f"图表生成失败: {str(e)}")
    raise HTTPException(404, detail="数据集不存在")
