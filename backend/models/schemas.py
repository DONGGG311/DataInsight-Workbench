from pydantic import BaseModel
from typing import Optional, Any

class ColumnMeta(BaseModel):
    name: str
    dtype: str
    missing_count: int

class DatasetResponse(BaseModel):
    id: str
    filename: str
    row_count: int
    col_count: int
    columns: list[ColumnMeta]
    created_at: str

class PaginatedData(BaseModel):
    rows: list[list[Any]]
    total_rows: int
    page: int
    page_size: int
    columns: list[str]

class CleanRequest(BaseModel):
    operations: list[dict]

class ChartRequest(BaseModel):
    chart_type: str
    x_field: Optional[str] = None
    y_field: Optional[str] = None
    group_by: Optional[str] = None
    filters: Optional[list[dict]] = None

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
