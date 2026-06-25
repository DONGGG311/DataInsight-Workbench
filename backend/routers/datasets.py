from fastapi import APIRouter, UploadFile, File, HTTPException
from database import get_db
from services.parser import parse_file
from config import settings
import os, uuid, aiofiles

router = APIRouter(prefix="/api/datasets", tags=["datasets"])

@router.post("")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(400, detail="仅支持 CSV / Excel 文件")

    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE:
        raise HTTPException(400, detail="文件过大，最大支持 100MB")

    file_id = uuid.uuid4().hex[:12]
    ext = os.path.splitext(file.filename)[1]
    save_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}{ext}")

    async with aiofiles.open(save_path, 'wb') as f:
        await f.write(contents)

    try:
        result = parse_file(save_path, file.filename)
    except Exception as e:
        if os.path.exists(save_path):
            os.remove(save_path)
        raise HTTPException(500, detail=f"文件解析失败: {str(e)}")

    db = get_db()
    db.execute(
        "INSERT INTO datasets (id, filename, original_size, row_count, col_count) VALUES (?,?,?,?,?)",
        [file_id, file.filename, len(contents), result["row_count"], result["col_count"]]
    )
    for i, col in enumerate(result["columns"]):
        db.execute(
            "INSERT INTO columns (dataset_id, name, dtype, missing_count, order_index) VALUES (?,?,?,?,?)",
            [file_id, col["name"], col["dtype"], col["missing_count"], i]
        )
    db.commit()
    db.close()

    return {
        "id": file_id,
        "filename": file.filename,
        "row_count": result["row_count"],
        "col_count": result["col_count"],
        "columns": result["columns"],
        "created_at": ""
    }
