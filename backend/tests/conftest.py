import pytest
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from database import init_db
from config import settings

@pytest.fixture(autouse=True)
def setup_db(tmp_path):
    settings.DB_PATH = str(tmp_path / "test.db")
    settings.UPLOAD_DIR = str(tmp_path / "uploads")
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    init_db()

@pytest.fixture
def sample_csv(tmp_path):
    import pandas as pd
    path = str(tmp_path / "test.csv")
    df = pd.DataFrame({
        "销售额": [4520, 3100, None, 5200, 3800],
        "区域": ["华东", "华北", "华南", "华东", "华北"],
        "日期": ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05"]
    })
    df.to_csv(path, index=False)
    return path
