# DataInsight Workbench — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack web data analysis platform (CSV upload → auto-profiling → interactive charts → dashboard report)

**Architecture:** React 18 SPA frontend (Vite + Tailwind + ECharts) communicating via REST JSON with a Python FastAPI backend (pandas/scipy analysis engine + SQLite storage). Frontend and backend are independently deployable with Docker Compose for local dev.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + ECharts + react-grid-layout (frontend) / Python 3.11+ FastAPI + pandas + numpy + scipy + SQLite (backend) / Docker Compose (deployment)

## Global Constraints

- Python >= 3.11, Node >= 18
- All API responses use JSON: success as data field, error as `{ error: string, detail?: string }`
- Frontend file upload limit: 50MB client-side check, 100MB server-side hard limit
- All interactive elements meet WCAG 2.1 AA contrast minimums
- Use brand colors from `assets/tokens/design-tokens.css` via Tailwind config
- Frontend routes: `/` `/upload` `/preview/:id` `/explore/:id` `/dashboard/:id`
- Backend API base: `/api`
- All ECharts instances must listen to container resize events
- SQLite file at `backend/data/datainsight.db`

---

## File Structure

```
datainsight-workbench/
├── docker-compose.yml
├── Dockerfile.frontend
├── Dockerfile.backend
├── README.md
├── .gitignore
├── LICENSE
├── assets/
│   ├── banners/                    # README banner HTML files (existing)
│   ├── tokens/
│   │   └── design-tokens.css       # CSS variables (existing)
│   └── samples/                    # Sample CSV datasets
│       ├── supermarket_sales.csv
│       └── global_temps.csv
├── docs/                           # Design docs (existing)
│   ├── superpowers/
│   │   ├── specs/                  # Design spec
│   │   └── plans/                  # This plan
│   ├── brand/
│   └── design-system/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css               # Tailwind directives + design tokens
│       ├── api/
│       │   └── client.ts           # Axios instance + error interceptor
│       ├── context/
│       │   └── DatasetContext.tsx   # dataset state + dispatch
│       ├── hooks/
│       │   ├── useDataset.ts
│       │   ├── useChart.ts
│       │   └── useDashboard.ts
│       ├── components/
│       │   ├── ui/                 # Shared UI primitives
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Select.tsx
│       │   │   ├── Toast.tsx
│       │   │   ├── Spinner.tsx
│       │   │   ├── EmptyState.tsx
│       │   │   └── ErrorBoundary.tsx
│       │   ├── layout/
│       │   │   ├── Navbar.tsx
│       │   │   └── PageShell.tsx
│       │   ├── upload/
│       │   │   ├── DropZone.tsx
│       │   │   ├── UploadProgress.tsx
│       │   │   └── SampleDatasetPicker.tsx
│       │   ├── preview/
│       │   │   ├── DataTable.tsx
│       │   │   ├── ColumnStatsPanel.tsx
│       │   │   └── CleanToolbar.tsx
│       │   ├── explore/
│       │   │   ├── FieldPanel.tsx
│       │   │   ├── ChartTypeSelector.tsx
│       │   │   └── EChartsView.tsx
│       │   └── dashboard/
│       │       ├── DashboardGrid.tsx
│       │       ├── StatCard.tsx
│       │       └── ChartCard.tsx
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── UploadPage.tsx
│       │   ├── PreviewPage.tsx
│       │   ├── ExplorePage.tsx
│       │   └── DashboardPage.tsx
│       └── utils/
│           ├── echarts-theme.ts    # ECharts brand color theme
│           ├── formatters.ts       # Number/date formatting
│           └── export.ts           # PNG export helper
└── backend/
    ├── requirements.txt
    ├── main.py                     # FastAPI app entry + CORS
    ├── config.py                   # Settings (DB path, limits)
    ├── database.py                 # SQLite init + connection
    ├── models/
    │   ├── schemas.py              # Pydantic request/response models
    │   └── db_models.py            # DB table definitions
    ├── routers/
    │   ├── datasets.py             # Upload + metadata endpoints
    │   ├── data.py                 # Paginated data + export
    │   ├── clean.py                # Data cleaning operations
    │   ├── profile.py              # L1 auto-profiling
    │   └── chart.py                # L2 chart data generation
    ├── services/
    │   ├── parser.py               # CSV/Excel parsing + type inference
    │   ├── cleaner.py              # Fill missing, dedup, type convert
    │   ├── profiler.py             # Descriptive stats + histogram bins + correlation
    │   └── chart_builder.py        # Build chart-specific data from user config
    ├── data/                       # SQLite DB + uploaded file storage
    │   └── .gitkeep
    └── tests/
        ├── conftest.py
        ├── test_parser.py
        ├── test_cleaner.py
        ├── test_profiler.py
        └── test_chart_builder.py
```

---

## Milestones

| Milestone | Scope | Deliverable |
|-----------|-------|-------------|
| **M1** | Project scaffold + data upload pipeline | File upload works end-to-end, data preview page renders table |
| **M2** | Analysis engine + interactive visualization | L1 profiling + L2 chart exploration fully functional |
| **M3** | Dashboard report + polish + deploy | Dashboard grid with drag-drop, export, Docker Compose, README |

---

# M1: Project Scaffold & Data Upload Pipeline

## M1 Checkpoints
- [ ] `docker-compose up` starts both frontend (port 5173) and backend (port 8000)
- [ ] POST `/api/datasets` accepts CSV/Excel, stores to SQLite, returns dataset metadata
- [ ] GET `/api/datasets/:id/data?page=1&size=50` returns paginated rows
- [ ] Upload page: drag-drop zone accepts .csv/.xlsx, shows progress, navigates to preview
- [ ] Preview page: renders data table with column type badges and missing value highlights
- [ ] All M1 backend tests pass

---

### Task M1.1: Project Scaffold — Backend

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/main.py`
- Create: `backend/config.py`
- Create: `backend/database.py`
- Create: `backend/models/schemas.py`
- Create: `backend/models/db_models.py`
- Create: `backend/data/.gitkeep`

**Interfaces:**
- Produces: FastAPI app instance at `main:app`, SQLite connection via `database.get_db()`, config via `config.Settings`, Pydantic models in `schemas.py`, DB table definitions in `db_models.py`

- [ ] **Step 1: Create requirements.txt**

```
fastapi==0.115.6
uvicorn[standard]==0.34.0
python-multipart==0.0.19
pandas==2.2.3
numpy==2.2.1
scipy==1.14.1
openpyxl==3.1.5
aiofiles==24.1.0
```

- [ ] **Step 2: Create config.py**

```python
import os

class Settings:
    DB_PATH: str = os.getenv("DB_PATH", "backend/data/datainsight.db")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "backend/data/uploads")
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

settings = Settings()
```

- [ ] **Step 3: Create database.py**

```python
import sqlite3
import os
from config import settings

def get_db() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(settings.DB_PATH), exist_ok=True)
    conn = sqlite3.connect(settings.DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS datasets (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            original_size INTEGER,
            row_count INTEGER,
            col_count INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS columns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dataset_id TEXT REFERENCES datasets(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            dtype TEXT,
            missing_count INTEGER DEFAULT 0,
            order_index INTEGER
        );
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dataset_id TEXT REFERENCES datasets(id) ON DELETE CASCADE,
            result_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS dashboards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dataset_id TEXT REFERENCES datasets(id) ON DELETE CASCADE,
            layout_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    conn.close()
```

- [ ] **Step 4: Create models/schemas.py**

```python
from pydantic import BaseModel
from typing import Optional, Any

class ColumnMeta(BaseModel):
    name: str
    dtype: str  # "numeric" | "categorical" | "datetime"
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
    operations: list[dict]  # [{"type": "fill_missing", "column": "x", "strategy": "mean"}, ...]

class ChartRequest(BaseModel):
    chart_type: str  # "bar"|"line"|"scatter"|"pie"|"histogram"|"boxplot"|"heatmap"
    x_field: Optional[str] = None
    y_field: Optional[str] = None
    group_by: Optional[str] = None
    filters: Optional[list[dict]] = None

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
```

- [ ] **Step 5: Create models/db_models.py**

```python
# DB table definitions are created via SQL in database.init_db().
# This file exists for future ORM migration if needed.
# For MVP we use raw SQL via sqlite3.Row for simplicity.
```

- [ ] **Step 6: Create main.py**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import init_db
import os

app = FastAPI(title="DataInsight Workbench API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    init_db()

@app.get("/api/health")
def health():
    return {"status": "ok"}
```

- [ ] **Step 7: Run backend to verify**

```bash
cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
```

Expected: `curl http://localhost:8000/api/health` returns `{"status":"ok"}`

- [ ] **Step 8: Commit**

```bash
git add backend/
git commit -m "feat(m1): backend scaffold - FastAPI + SQLite + config"
```

---

### Task M1.2: Project Scaffold — Frontend

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/postcss.config.js`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/index.css`
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/context/DatasetContext.tsx`

**Interfaces:**
- Produces: Vite dev server on port 5173, React app shell with routing, Axios API client with error interceptor, DatasetContext for global state

- [ ] **Step 1: Scaffold with Vite**

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
```

- [ ] **Step 2: Install additional dependencies**

```bash
npm install react-router-dom axios echarts echarts-for-react react-grid-layout
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:8000' }
  }
})
```

- [ ] **Step 4: Configure Tailwind — replace src/index.css**

```css
@import "tailwindcss";

@theme {
  --color-primary: #4F46E5;
  --color-primary-light: #818CF8;
  --color-primary-dark: #3730A3;
  --color-secondary: #06B6D4;
  --color-accent: #F59E0B;
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-text: #1E293B;
  --color-text-muted: #64748B;
  --color-border: #E2E8F0;
  --color-success: #10B981;
  --color-error: #EF4444;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Consolas', monospace;
}
```

- [ ] **Step 5: Create api/client.ts**

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || '请求失败';
    // Toast will be triggered by consumer
    return Promise.reject({ message, detail: err.response?.data?.detail });
  }
);

export default api;
```

- [ ] **Step 6: Create context/DatasetContext.tsx**

```typescript
import { createContext, useContext, useReducer, ReactNode } from 'react';

interface DatasetState {
  currentId: string | null;
  columns: Array<{ name: string; dtype: string; missing_count: number }>;
  rowCount: number;
  colCount: number;
  filename: string;
  loading: boolean;
}

type Action =
  | { type: 'SET_DATASET'; payload: Omit<DatasetState, 'loading'> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR' };

const initialState: DatasetState = {
  currentId: null, columns: [], rowCount: 0, colCount: 0, filename: '', loading: false
};

function reducer(state: DatasetState, action: Action): DatasetState {
  switch (action.type) {
    case 'SET_DATASET': return { ...state, ...action.payload, loading: false };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'CLEAR': return initialState;
    default: return state;
  }
}

const DatasetContext = createContext<{
  state: DatasetState; dispatch: React.Dispatch<Action>;
} | null>(null);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <DatasetContext.Provider value={{ state, dispatch }}>{children}</DatasetContext.Provider>;
}

export function useDatasetContext() {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error('useDatasetContext must be inside DatasetProvider');
  return ctx;
}
```

- [ ] **Step 7: Create App.tsx with router shell**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DatasetProvider } from './context/DatasetContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import PreviewPage from './pages/PreviewPage';
import ExplorePage from './pages/ExplorePage';
import DashboardPage from './pages/DashboardPage';
import ErrorBoundary from './components/ui/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <DatasetProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[var(--color-bg)]">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/preview/:id" element={<PreviewPage />} />
                <Route path="/explore/:id" element={<ExplorePage />} />
                <Route path="/dashboard/:id" element={<DashboardPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </DatasetProvider>
    </ErrorBoundary>
  );
}
```

- [ ] **Step 8: Verify frontend starts**

```bash
cd frontend && npm run dev
```

Expected: opens at `http://localhost:5173`, shows empty app with navbar placeholder

- [ ] **Step 9: Commit**

```bash
git add frontend/
git commit -m "feat(m1): frontend scaffold - Vite + React + Tailwind + routing"
```

---

### Task M1.3: Backend — File Upload & Parse Endpoint

**Files:**
- Create: `backend/services/parser.py`
- Create: `backend/routers/datasets.py`
- Create: `backend/tests/conftest.py`
- Create: `backend/tests/test_parser.py`
- Modify: `backend/main.py` (register router)

**Interfaces:**
- Consumes: `config.settings`, `database.get_db`, `models.schemas.DatasetResponse`
- Produces: `POST /api/datasets` endpoint, `parser.parse_file(filepath, filename) -> dict`

- [ ] **Step 1: Write failing test — backend/tests/conftest.py**

```python
import pytest
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from database import init_db, get_db
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
```

- [ ] **Step 2: Write failing test — backend/tests/test_parser.py**

```python
from services.parser import parse_file

def test_parse_csv(sample_csv):
    result = parse_file(sample_csv, "test.csv")
    assert result["row_count"] == 5
    assert result["col_count"] == 3
    assert len(result["columns"]) == 3
    assert result["columns"][0]["name"] == "销售额"
    assert result["columns"][0]["dtype"] == "numeric"
    assert result["columns"][0]["missing_count"] == 1
    assert result["columns"][1]["dtype"] == "categorical"

def test_parse_nonexistent_file():
    try:
        parse_file("/nonexistent/file.csv", "x.csv")
        assert False, "Expected exception"
    except FileNotFoundError:
        pass
```

- [ ] **Step 3: Implement services/parser.py**

```python
import pandas as pd
import numpy as np
import uuid

def parse_file(filepath: str, filename: str) -> dict:
    if filename.endswith('.csv'):
        df = pd.read_csv(filepath)
    elif filename.endswith(('.xlsx', '.xls')):
        df = pd.read_excel(filepath)
    else:
        raise ValueError(f"Unsupported file format: {filename}")

    df = df.replace({np.nan: None})

    columns = []
    for i, col_name in enumerate(df.columns):
        series = df[col_name].dropna()
        if pd.api.types.is_numeric_dtype(df[col_name]):
            dtype = "numeric"
        elif pd.api.types.is_datetime64_any_dtype(df[col_name]):
            dtype = "datetime"
        else:
            dtype = "categorical"

        missing_count = int(df[col_name].isna().sum())
        columns.append({
            "name": str(col_name),
            "dtype": dtype,
            "missing_count": missing_count
        })

    return {
        "id": uuid.uuid4().hex[:12],
        "filename": filename,
        "row_count": len(df),
        "col_count": len(df.columns),
        "columns": columns,
        "rows": [[_safe_value(v) for v in row] for _, row in df.iterrows()]
    }

def _safe_value(v):
    if v is None: return None
    if isinstance(v, (np.integer,)): return int(v)
    if isinstance(v, (np.floating,)): return float(v)
    if isinstance(v, (np.bool_,)): return bool(v)
    if isinstance(v, pd.Timestamp): return str(v)
    return v
```

- [ ] **Step 4: Run tests — verify pass**

```bash
cd backend && python -m pytest tests/test_parser.py -v
```

- [ ] **Step 5: Create routers/datasets.py**

```python
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
```

- [ ] **Step 6: Register router in main.py — add after CORS middleware**

```python
from routers import datasets
app.include_router(datasets.router)
```

- [ ] **Step 7: Verify upload endpoint**

```bash
curl -X POST http://localhost:8000/api/datasets -F "file=@test.csv"
```

Expected: JSON with id, filename, row_count, col_count, columns array

- [ ] **Step 8: Commit**

```bash
git add backend/
git commit -m "feat(m1): file upload & parse endpoint - POST /api/datasets"
```

---

### Task M1.4: Backend — Data Read Endpoint

**Files:**
- Create: `backend/routers/data.py`
- Modify: `backend/main.py` (register router)

**Interfaces:**
- Consumes: `database.get_db`, `config.settings`
- Produces: `GET /api/datasets/:id` (metadata), `GET /api/datasets/:id/data?page=1&size=50` (paginated rows)

- [ ] **Step 1: Create routers/data.py**

```python
from fastapi import APIRouter, HTTPException
from database import get_db
from services.parser import _safe_value
from config import settings
import pandas as pd, os, json

router = APIRouter(prefix="/api/datasets", tags=["data"])

def _get_file_path(dataset_id: str) -> str:
    db = get_db()
    row = db.execute("SELECT id FROM datasets WHERE id=?", [dataset_id]).fetchone()
    db.close()
    if not row:
        raise HTTPException(404, detail="数据集不存在")
    for ext in ['.csv', '.xlsx', '.xls']:
        p = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}{ext}")
        if os.path.exists(p): return p
    raise HTTPException(404, detail="数据文件不存在")

@router.get("/{dataset_id}")
def get_dataset_meta(dataset_id: str):
    db = get_db()
    ds = db.execute("SELECT * FROM datasets WHERE id=?", [dataset_id]).fetchone()
    if not ds:
        db.close()
        raise HTTPException(404, detail="数据集不存在")
    cols = db.execute("SELECT name, dtype, missing_count FROM columns WHERE dataset_id=? ORDER BY order_index", [dataset_id]).fetchall()
    db.close()
    return {
        "id": ds["id"], "filename": ds["filename"],
        "row_count": ds["row_count"], "col_count": ds["col_count"],
        "columns": [dict(c) for c in cols], "created_at": str(ds["created_at"])
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
        "rows": rows, "total_rows": total,
        "page": page, "page_size": size,
        "columns": list(df.columns)
    }
```

- [ ] **Step 2: Register in main.py**

```python
from routers import data
app.include_router(data.router)
```

- [ ] **Step 3: Verify endpoints**

```bash
curl http://localhost:8000/api/datasets/<id>
curl http://localhost:8000/api/datasets/<id>/data?page=1&size=10
```

- [ ] **Step 4: Commit**

```bash
git add backend/
git commit -m "feat(m1): data read endpoints - GET metadata + paginated rows"
```

---

### Task M1.5: Frontend — UI Primitives (Button, Card, Input, Toast, Spinner, EmptyState, ErrorBoundary, Navbar)

**Files:**
- Create: `frontend/src/components/ui/Button.tsx`
- Create: `frontend/src/components/ui/Card.tsx`
- Create: `frontend/src/components/ui/Input.tsx`
- Create: `frontend/src/components/ui/Select.tsx`
- Create: `frontend/src/components/ui/Toast.tsx`
- Create: `frontend/src/components/ui/Spinner.tsx`
- Create: `frontend/src/components/ui/EmptyState.tsx`
- Create: `frontend/src/components/ui/ErrorBoundary.tsx`
- Create: `frontend/src/components/layout/Navbar.tsx`
- Create: `frontend/src/components/layout/PageShell.tsx`

**Interfaces:**
- Produces: Reusable UI component library matching `docs/design-system/component-specs.md`

- [ ] **Step 1: Create Button.tsx**

```tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant; size?: ButtonSize;
  loading?: boolean; children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800',
  secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200',
  accent: 'bg-amber-500 text-slate-800 hover:bg-amber-600 active:bg-amber-700',
  destructive: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base', icon: 'h-10 w-10 p-0'
};

export default function Button({
  variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium
        transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-indigo-600 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading} {...props}
    >
      {loading ? <Spinner className="w-4 h-4 mr-2" /> : null}
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Create Card.tsx, Input.tsx, Select.tsx, Spinner.tsx, EmptyState.tsx, ErrorBoundary.tsx**

(See component-specs.md for exact styles. Each follows Tailwind classes matching our design tokens.)

Card.tsx:
```tsx
import { ReactNode } from 'react';
export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 pt-6 pb-0 ${className}`}>{children}</div>;
}
export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 pb-6 pt-0 ${className}`}>{children}</div>;
}
```

Spinner.tsx:
```tsx
export default function Spinner({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={`animate-spin text-current ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
```

EmptyState.tsx:
```tsx
export default function EmptyState({ icon = '📊', title, description }: { icon?: string; title: string; description: string }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-600">{title}</h3>
      <p className="text-sm text-slate-400 mt-1">{description}</p>
    </div>
  );
}
```

ErrorBoundary.tsx:
```tsx
import { Component, ReactNode } from 'react';
interface State { hasError: boolean; error: Error | null }
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-slate-800 mb-2">出错了</h1>
            <p className="text-slate-500 mb-4">{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">刷新页面</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

- [ ] **Step 3: Create Navbar.tsx**

```tsx
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: '首页' },
  { path: '/upload', label: '数据集' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex gap-0.5">
            <span className="w-2 h-2 rounded-sm bg-indigo-600" />
            <span className="w-2 h-2 rounded-sm bg-cyan-500" />
            <span className="w-2 h-2 rounded-sm bg-amber-500" />
          </span>
          <span className="font-bold text-slate-800 text-lg">DataInsight</span>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${pathname === item.path ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Create Toast.tsx — simple context-based toast system**

```tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast { id: number; type: 'success' | 'error' | 'info'; message: string; }
const ToastContext = createContext<{ toast: (type: Toast['type'], message: string) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    if (type !== 'error') setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id}
            className={`px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-slide-in
              ${t.type === 'success' ? 'bg-emerald-500' : t.type === 'error' ? 'bg-red-500' : 'bg-indigo-600'}`}>
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'} {t.message}
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="ml-3">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
```

- [ ] **Step 5: Create PageShell.tsx**

```tsx
import { ReactNode } from 'react';
interface Props { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode; }
export default function PageShell({ title, subtitle, actions, children }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 6: Update App.tsx to wrap with ToastProvider**

Add `<ToastProvider>` wrapper around `<DatasetProvider>` in App.tsx.

- [ ] **Step 7: Verify components compile**

```bash
cd frontend && npx tsc --noEmit
```

- [ ] **Step 8: Commit**

```bash
git add frontend/src/components/
git commit -m "feat(m1): UI primitives - Button/Card/Input/Toast/Navbar/ErrorBoundary"
```

---

### Task M1.6: Frontend — Upload Page + Preview Page

**Files:**
- Create: `frontend/src/pages/HomePage.tsx`
- Create: `frontend/src/pages/UploadPage.tsx`
- Create: `frontend/src/components/upload/DropZone.tsx`
- Create: `frontend/src/components/upload/UploadProgress.tsx`
- Create: `frontend/src/components/upload/SampleDatasetPicker.tsx`
- Create: `frontend/src/pages/PreviewPage.tsx`
- Create: `frontend/src/components/preview/DataTable.tsx`
- Create: `frontend/src/components/preview/ColumnStatsPanel.tsx`
- Create: `frontend/src/components/preview/CleanToolbar.tsx`

**Interfaces:**
- Consumes: `api/client.ts`, `context/DatasetContext`, UI primitives
- Produces: Functional Upload and Preview pages matching page-designs.md

- [ ] **Step 1: Create HomePage.tsx**

```tsx
import { Link } from 'react-router-dom';
import Card, { CardContent } from '../components/ui/Card';

const FEATURES = [
  { icon: '📤', title: '数据接入', desc: 'CSV/Excel 拖拽上传，内置经典示例数据集', color: 'bg-indigo-50' },
  { icon: '📊', title: '自动分析', desc: '一键生成完整数据画像，7 种图表全方位洞察', color: 'bg-cyan-50' },
  { icon: '📋', title: '仪表板报告', desc: '自由拖拽排列图表卡片，一键导出数据报告', color: 'bg-amber-50' },
];

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="text-center py-16 space-y-8">
        <div className="flex justify-center gap-1 text-4xl">
          <span className="text-indigo-600">◆</span><span className="text-cyan-500">◆</span><span className="text-amber-500">◆</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">数据洞察工作台</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">上传 → 分析 → 探索 → 报告，无需编程</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link to="/upload" className="inline-flex items-center justify-center h-12 px-10 rounded-lg font-semibold text-slate-800 bg-amber-500 hover:bg-amber-600 transition-colors shadow-md">🚀 开始分析</Link>
          <Link to="/upload?sample=1" className="inline-flex items-center justify-center h-12 px-8 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">📦 试用示例数据</Link>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(f => (
            <Card key={f.title} className="hover:shadow-md transition-shadow text-center p-8">
              <div className={`w-14 h-14 ${f.color} rounded-xl flex items-center justify-center mx-auto mb-5 text-2xl`}>{f.icon}</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-12">三步开始分析</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          {[{ n:'①', l:'上传', d:'拖拽 CSV 或 Excel' },{ n:'②', l:'分析', d:'一键生成数据画像' },{ n:'③', l:'报告', d:'仪表板自由排列导出' }].map(s => (
            <div key={s.n} className="text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold mx-auto mb-3">{s.n}</div>
              <div className="font-semibold text-slate-800">{s.l}</div>
              <div className="text-sm text-slate-400">{s.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Steps 2-6: Create UploadPage, DropZone, UploadProgress, SampleDatasetPicker, PreviewPage, DataTable, ColumnStatsPanel, CleanToolbar**

Each component implements the Tailwind layout from `docs/design-system/page-designs.md` sections "页面 2" and "页面 3". Key patterns:

DropZone uses `react-dropzone` or native HTML5 drag-drop with state management. Shows dashed border that turns indigo on dragover.

DataTable renders paginated rows from `GET /api/datasets/:id/data?page=N`. Missing values (`null`) render as `<td className="bg-amber-50 text-amber-700 italic">— 缺失 —</td>`.

UploadPage flow: drop file → POST /api/datasets → on success navigate to `/preview/:id`.

PreviewPage: fetches metadata on mount via `GET /api/datasets/:id`, renders ColumnStatsPanel (grid of column cards with type badges and missing counts) and DataTable with pagination.

- [ ] **Step 7: Verify end-to-end upload flow**

```bash
# Start backend + frontend
# Upload a CSV file via the UI
# Verify redirect to /preview/:id with rendered table
```

- [ ] **Step 8: Commit**

```bash
git add frontend/src/pages/ frontend/src/components/upload/ frontend/src/components/preview/
git commit -m "feat(m1): upload + preview pages with data table"
```

---

# M2: Analysis Engine & Interactive Visualization

## M2 Checkpoints
- [ ] GET `/api/datasets/:id/profile` returns full L1 data profile (stats + histograms + correlation)
- [ ] POST `/api/datasets/:id/chart` returns chart-ready data for any of 7 chart types
- [ ] Explore page: left panel configures chart, right panel renders ECharts
- [ ] All 7 chart types render correctly with brand color theme
- [ ] Export CSV and PNG work
- [ ] All M2 backend tests pass

---

### Task M2.1: Backend — L1 Auto-Profiling Endpoint

**Files:**
- Create: `backend/services/profiler.py`
- Create: `backend/routers/profile.py`
- Create: `backend/tests/test_profiler.py`
- Modify: `backend/main.py`

- [ ] **Step 1: Write tests for profiler**

```python
from services.profiler import compute_profile
import pandas as pd, numpy as np, os

def test_compute_profile_numeric(tmp_path):
    path = str(tmp_path / "num.csv")
    pd.DataFrame({"x": [1,2,3,4,5], "y": [2,4,6,8,10]}).to_csv(path, index=False)
    result = compute_profile(path)
    assert result["row_count"] == 5
    assert result["col_count"] == 2
    x = result["columns"][0]
    assert x["name"] == "x"
    assert x["stats"]["mean"] == 3.0
    assert x["stats"]["median"] == 3.0
    assert x["stats"]["min"] == 1.0
    assert x["stats"]["max"] == 5.0
    assert "histogram" in x["stats"]
    assert result["correlation_matrix"] is not None

def test_compute_profile_categorical(tmp_path):
    path = str(tmp_path / "cat.csv")
    pd.DataFrame({"region": ["A","A","B","B","C"]}).to_csv(path, index=False)
    result = compute_profile(path)
    c = result["columns"][0]
    assert c["dtype"] == "categorical"
    assert "value_counts" in c["stats"]
```

- [ ] **Step 2: Implement services/profiler.py**

```python
import pandas as pd, numpy as np
from scipy import stats as sp_stats
import json

def compute_profile(filepath: str) -> dict:
    df = pd.read_csv(filepath) if filepath.endswith('.csv') else pd.read_excel(filepath)
    df = df.replace({np.nan: None})
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    columns = []
    for col_name in df.columns:
        series = df[col_name]
        if pd.api.types.is_numeric_dtype(series):
            clean = series.dropna()
            hist, bins = np.histogram(clean.values, bins='auto')
            columns.append({
                "name": str(col_name), "type": "numeric",
                "missing": int(series.isna().sum()),
                "stats": {
                    "mean": round(float(clean.mean()), 2),
                    "median": round(float(clean.median()), 2),
                    "std": round(float(clean.std()), 2),
                    "min": round(float(clean.min()), 2),
                    "max": round(float(clean.max()), 2),
                    "histogram": {"bins": [round(float(b), 2) for b in bins], "counts": [int(c) for c in hist]}
                }
            })
        else:
            vc = series.dropna().value_counts().head(10).to_dict()
            columns.append({
                "name": str(col_name), "type": "categorical",
                "missing": int(series.isna().sum()),
                "stats": {"value_counts": {str(k): int(v) for k, v in vc.items()}}
            })

    corr_matrix = None
    if len(numeric_cols) >= 2:
        corr = df[numeric_cols].corr().values.tolist()
        corr_matrix = [[round(float(v), 3) if not (isinstance(v, float) and np.isnan(v)) else 0 for v in row] for row in corr]

    return {
        "row_count": len(df), "col_count": len(df.columns),
        "numeric_cols": numeric_cols,
        "columns": columns,
        "correlation_matrix": corr_matrix
    }
```

- [ ] **Step 3: Create routers/profile.py**

```python
from fastapi import APIRouter, HTTPException
from database import get_db
from services.profiler import compute_profile
import os, json
from config import settings

router = APIRouter(prefix="/api/datasets", tags=["profile"])

@router.get("/{dataset_id}/profile")
def get_profile(dataset_id: str):
    db = get_db()
    ds = db.execute("SELECT id FROM datasets WHERE id=?", [dataset_id]).fetchone()
    db.close()
    if not ds: raise HTTPException(404, detail="数据集不存在")

    for ext in ['.csv', '.xlsx', '.xls']:
        path = os.path.join(settings.UPLOAD_DIR, f"{dataset_id}{ext}")
        if os.path.exists(path):
            profile = compute_profile(path)
            # Cache to DB
            db2 = get_db()
            db2.execute("DELETE FROM profiles WHERE dataset_id=?", [dataset_id])
            db2.execute("INSERT INTO profiles (dataset_id, result_json) VALUES (?,?)",
                        [dataset_id, json.dumps(profile, ensure_ascii=False)])
            db2.commit(); db2.close()
            return profile
    raise HTTPException(404, detail="数据文件不存在")
```

- [ ] **Step 4: Register router in main.py**

```python
from routers import profile
app.include_router(profile.router)
```

- [ ] **Step 5: Run profiler tests**

```bash
cd backend && python -m pytest tests/test_profiler.py -v
```

- [ ] **Step 6: Commit**

---

### Task M2.2: Backend — L2 Chart Data Endpoint

**Files:**
- Create: `backend/services/chart_builder.py`
- Create: `backend/routers/chart.py`
- Create: `backend/tests/test_chart_builder.py`
- Modify: `backend/main.py`

- [ ] **Step 1: Implement services/chart_builder.py**

```python
import pandas as pd, numpy as np
from typing import Optional, Any

def build_chart_data(filepath: str, chart_type: str, x_field: Optional[str],
                     y_field: Optional[str], group_by: Optional[str],
                     filters: Optional[list[dict]] = None) -> dict:
    df = pd.read_csv(filepath) if filepath.endswith('.csv') else pd.read_excel(filepath)

    # Apply filters
    if filters:
        for f in filters:
            col, op, val = f.get("column"), f.get("op", "="), f.get("value")
            if col and col in df.columns:
                if op == "=": df = df[df[col] == val]
                elif op == "!=": df = df[df[col] != val]

    if chart_type == "bar":
        return _build_bar(df, x_field, y_field, group_by)
    elif chart_type == "line":
        return _build_line(df, x_field, y_field, group_by)
    elif chart_type == "scatter":
        return _build_scatter(df, x_field, y_field, group_by)
    elif chart_type == "pie":
        return _build_pie(df, x_field, y_field)
    elif chart_type == "histogram":
        return _build_histogram(df, x_field)
    elif chart_type == "boxplot":
        return _build_boxplot(df, x_field, group_by)
    elif chart_type == "heatmap":
        return _build_heatmap_corr(df)
    else:
        raise ValueError(f"Unsupported chart type: {chart_type}")

def _build_bar(df, x, y, group):
    if group and group in df.columns:
        series = df.groupby(group)[y].mean() if y else df.groupby(group).size()
        return {"labels": list(series.index.astype(str)), "values": [float(v) for v in series.values],
                "type": "bar", "x_label": group, "y_label": y or "count"}
    if x and x in df.columns:
        series = df.groupby(x)[y].mean() if y else df.groupby(x).size()
        return {"labels": list(series.index.astype(str)), "values": [float(v) for v in series.values],
                "type": "bar", "x_label": x, "y_label": y or "count"}
    raise ValueError("bar chart requires x_field or group_by")

def _build_scatter(df, x, y, group):
    if not x or not y: raise ValueError("scatter requires x_field and y_field")
    if group and group in df.columns:
        datasets = []
        for g_name, g_df in df.groupby(group):
            datasets.append({"label": str(g_name),
                             "data": [[float(row[x]), float(row[y])] for _, row in g_df.iterrows() if pd.notna(row[x]) and pd.notna(row[y])]})
        return {"type": "scatter", "datasets": datasets, "x_label": x, "y_label": y}
    data = [[float(row[x]), float(row[y])] for _, row in df.iterrows() if pd.notna(row[x]) and pd.notna(row[y])]
    return {"type": "scatter", "datasets": [{"label": "", "data": data}], "x_label": x, "y_label": y}

def _build_histogram(df, x):
    if not x: raise ValueError("histogram requires x_field")
    clean = df[x].dropna()
    hist, bins = np.histogram(clean, bins='auto')
    return {"type": "histogram", "labels": [f"{bins[i]:.1f}-{bins[i+1]:.1f}" for i in range(len(bins)-1)],
            "values": [int(v) for v in hist], "x_label": x, "y_label": "频数"}

def _build_pie(df, x, y):
    if not x: raise ValueError("pie requires x_field")
    series = df.groupby(x)[y].sum() if y else df.groupby(x).size()
    return {"type": "pie", "labels": list(series.index.astype(str)), "values": [float(v) for v in series.values]}

def _build_line(df, x, y, group):
    if not x or not y: raise ValueError("line requires x_field and y_field")
    if group and group in df.columns:
        datasets = []
        for g_name, g_df in df.groupby(group):
            sorted_df = g_df.sort_values(x)
            datasets.append({"label": str(g_name), "labels": list(sorted_df[x].astype(str)),
                             "values": [float(v) for v in sorted_df[y]]})
        return {"type": "line", "datasets": datasets, "x_label": x, "y_label": y}
    sorted_df = df.sort_values(x)
    return {"type": "line", "datasets": [{"label": "", "labels": list(sorted_df[x].astype(str)),
             "values": [float(v) for v in sorted_df[y]]}], "x_label": x, "y_label": y}

def _build_boxplot(df, x, group):
    if not x: raise ValueError("boxplot requires x_field")
    if group and group in df.columns:
        series = [{"label": str(k), "values": [float(v) for v in g[x].dropna()]}
                  for k, g in df.groupby(group)]
        return {"type": "boxplot", "series": series, "x_label": group, "y_label": x}
    return {"type": "boxplot", "series": [{"label": x, "values": [float(v) for v in df[x].dropna()]}],
            "x_label": "", "y_label": x}

def _build_heatmap_corr(df):
    nums = df.select_dtypes(include=[np.number])
    if len(nums.columns) < 2: raise ValueError("heatmap requires >= 2 numeric columns")
    corr = nums.corr()
    return {"type": "heatmap", "labels": list(corr.columns), "values": corr.values.tolist()}
```

- [ ] **Step 2: Create routers/chart.py**

```python
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
                return build_chart_data(path, req.chart_type, req.x_field, req.y_field, req.group_by, req.filters)
            except Exception as e:
                raise HTTPException(400, detail=str(e))
    raise HTTPException(404, detail="数据集不存在")
```

- [ ] **Step 3: Register in main.py + run tests**

- [ ] **Step 4: Commit**

---

### Task M2.3: Frontend — Explore Page (Interactive Chart)

**Files:**
- Create: `frontend/src/pages/ExplorePage.tsx`
- Create: `frontend/src/components/explore/FieldPanel.tsx`
- Create: `frontend/src/components/explore/ChartTypeSelector.tsx`
- Create: `frontend/src/components/explore/EChartsView.tsx`
- Create: `frontend/src/utils/echarts-theme.ts`
- Create: `frontend/src/hooks/useChart.ts`

- [ ] **Step 1: Create echarts-theme.ts — brand color constants for ECharts**

```typescript
export const BRAND_COLORS = ['#4F46E5', '#06B6D4', '#F59E0B', '#94A3B8', '#10B981', '#EF4444', '#8B5CF6'];
export const CHART_TEXT_COLOR = '#64748B';
export const CHART_GRID_COLOR = '#E2E8F0';
```

- [ ] **Step 2: Create hooks/useChart.ts**

```typescript
import { useState, useCallback } from 'react';
import api from '../api/client';

interface ChartConfig { chartType: string; xField: string; yField: string; groupBy: string; filters: any[]; }
interface ChartResult { data: any; loading: boolean; error: string | null; }

export function useChart(datasetId: string) {
  const [state, setState] = useState<ChartResult>({ data: null, loading: false, error: null });
  const fetchChart = useCallback(async (config: ChartConfig) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await api.post(`/datasets/${datasetId}/chart`, {
        chart_type: config.chartType,
        x_field: config.xField || null,
        y_field: config.yField || null,
        group_by: config.groupBy || null,
        filters: config.filters || [],
      });
      setState({ data: res.data, loading: false, error: null });
    } catch (e: any) {
      setState({ data: null, loading: false, error: e.message || '获取图表数据失败' });
    }
  }, [datasetId]);
  return { ...state, fetchChart };
}
```

- [ ] **Steps 3-5: Build FieldPanel (chart type grid + axis selectors + filter), EChartsView (renders all 7 chart types from useChart data), ExplorePage (left panel + right canvas layout)**

Layout exactly as specified in `docs/design-system/page-designs.md` Page 4. EChartsView maps chart builder output types to ECharts options using `echarts-for-react`.

- [ ] **Step 6: Verify explore flow**

```bash
# Upload a CSV → click "前往探索" → configure scatter chart → see rendered ECharts
```

- [ ] **Step 7: Commit**

---

### Task M2.4: Backend — Export Endpoints

**Files:**
- Create: (add to) `backend/routers/data.py`

Add to routers/data.py:

```python
from fastapi.responses import StreamingResponse
import io

@router.get("/{dataset_id}/export/csv")
def export_csv(dataset_id: str):
    filepath = _get_file_path(dataset_id)
    df = pd.read_csv(filepath) if filepath.endswith('.csv') else pd.read_excel(filepath)
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    return StreamingResponse(iter([stream.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": f"attachment; filename={dataset_id}.csv"})
```

---

# M3: Dashboard Report & Deployment

## M3 Checkpoints
- [ ] Dashboard page: renders grid of cards from L1 profile data
- [ ] Cards are draggable and resizable via react-grid-layout
- [ ] Layout saved to and restored from backend
- [ ] Export all charts as PNG from dashboard
- [ ] Docker Compose works end-to-end
- [ ] README.md complete with banner, screenshots, setup guide
- [ ] Sample datasets included

---

### Task M3.1: Frontend — Dashboard Page

**Files:**
- Create: `frontend/src/pages/DashboardPage.tsx`
- Create: `frontend/src/components/dashboard/DashboardGrid.tsx`
- Create: `frontend/src/components/dashboard/StatCard.tsx`
- Create: `frontend/src/components/dashboard/ChartCard.tsx`
- Create: `frontend/src/hooks/useDashboard.ts`

Builds grid layout with react-grid-layout. Cards populated from GET /api/datasets/:id/profile response. Layout saved via POST to backend. Stat cards show key metrics. Chart cards render ECharts (histograms, boxplots, heatmap).

---

### Task M3.2: Docker Compose & Sample Data

**Files:**
- Create: `docker-compose.yml`
- Create: `Dockerfile.backend`
- Create: `Dockerfile.frontend`
- Create: `assets/samples/supermarket_sales.csv`
- Create: `assets/samples/global_temps.csv`

---

### Task M3.3: README & GitHub Preparation

**Files:**
- Create: `README.md`
- Create: `.gitignore`
- Create: `LICENSE`

---

## Execution Order & Dependencies

```
M1.1 (backend scaffold) ──┐
                          ├──> M1.3 (upload API) ──> M1.4 (data API)
M1.2 (frontend scaffold) ──┘                                    │
                          ┌──<─────────────────────────────────┘
M1.5 (UI primitives) ────┤
                          └──> M1.6 (upload + preview pages)
                                                              │
M2.1 (profiler API) ──────┐                                   │
                           ├──> M2.3 (explore page) ──────────┘
M2.2 (chart API) ─────────┘
                           │
M2.4 (export API) ────────┘

M3.1 (dashboard page) ──> M3.2 (docker/samples) ──> M3.3 (README)
```

**Parallel execution opportunities:**
- M1.1 + M1.2 can run in parallel (backend and frontend scaffolds)
- M1.5 can start once M1.2 is done, in parallel with M1.3
- M2.1 + M2.2 can run in parallel (profiler and chart builder are independent services)
- M3.2 + M3.3 can run in parallel once M3.1 is done
