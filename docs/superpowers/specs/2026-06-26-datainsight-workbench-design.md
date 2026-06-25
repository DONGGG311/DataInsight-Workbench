# DataInsight Workbench 设计方案

> 版本：v1.0 | 日期：2026-06-26 | 状态：已确认

---

## 1. 产品定位

### 目标用户
- **主要用户**：数据分析初学者，需要引导式的数据分析体验
- **次要目标**：作为 GitHub 技术作品集，展示全栈开发 + 数据处理能力

### 产品一句话
集数据上传、自动数据画像、交互式图表探索、仪表板报告于一体的 Web 数据分析平台。

### 核心价值
- 初学者：上传即出报告，无需编程，逐步学会分析思维
- 面试官/招聘方：看到完整的工程架构、代码质量和产品设计能力

---

## 2. MVP 功能范围

| 模块 | 功能 | 优先级 |
|------|------|--------|
| 数据接入 | CSV/Excel 文件上传、示例数据集 | MVP |
| 数据预览 | 表格展示、字段类型识别、缺失值标注、基础统计摘要 | MVP |
| 数据清洗 | 缺失值填充、去重、类型转换、列筛选 | MVP |
| 一键数据画像 (L1) | 自动生成描述统计 + 分布直方图 + 箱线图 + 相关性热力图 | MVP |
| 交互式图表探索 (L2) | 字段选择、图表类型切换、X/Y 轴配置、分组条件 | MVP |
| 仪表板报告 | 卡片网格布局，可拖拽排列，图表嵌入 | MVP |
| 数据导出 | 导出清洗后数据 (CSV) + 图表图片 (PNG) | MVP |
| 相关性分析 | L1 画像中自动生成相关系数矩阵 + 热力图 | MVP |
| PDF 报告导出 | 仪表板导出为 PDF | v2 |
| 预测建模 | 简单线性回归 | v2 |
| 数据库连接 | MySQL/PostgreSQL 直连 | v2 |
| 用户系统 | 注册/登录/历史记录 | v3 |
| 分享链接 | 生成报告分享链接 | v3 |

---

## 3. 分析能力设计

### L1：一键自动数据画像
- 上传数据后系统自动计算所有字段的描述性统计
- 每列生成：均值/中位数/标准差/最小值/最大值/缺失数
- 自动生成直方图（数值列）、柱状图（分类列）
- 全表相关性矩阵 + 热力图
- 输出：结构化 JSON，前端渲染为仪表板卡片

### L2：交互式图表探索
- 用户自选字段拖入 X/Y 轴
- 选择图表类型：柱状图、折线图、散点图、饼图、直方图、箱线图、热力图
- 可选分组字段 (groupBy)
- 可选筛选条件

---

## 4. 可视化图表类型

| 图表 | 用途 | ECharts 实现 |
|------|------|-------------|
| 柱状图 | 分类对比 | bar |
| 折线图 | 时间序列/趋势 | line |
| 散点图 | 两变量关系 | scatter |
| 饼图/环形图 | 占比分布 | pie |
| 直方图 | 数值分布 | bar (binned) |
| 箱线图 | 分布+异常值 | boxplot |
| 热力图 | 相关性矩阵 | heatmap |

---

## 5. 报告形态

**交互式仪表板风格 (A)**

- 多卡片网格布局，用户可拖拽排列卡片
- 每张卡片 = 一个图表或统计指标
- 默认布局由 L1 画像自动生成，用户可自由调整
- 卡片类型：概览统计卡、分布直方图卡、箱线图卡、相关性热力图卡
- 前端实现：React Grid Layout (react-grid-layout)

---

## 6. 技术栈

| 层 | 选型 | 理由 |
|----|------|------|
| 前端框架 | React 18 + TypeScript | 用户偏好，生态最丰富 |
| 构建工具 | Vite | 快速、现代、GitHub 主流 |
| 样式方案 | Tailwind CSS | 用户偏好 |
| 图表库 | ECharts (Apache) | 功能全、仪表板场景成熟、中文社区好 |
| 仪表板拖拽 | react-grid-layout | 成熟的卡片拖拽布局方案 |
| 后端框架 | Python FastAPI | 异步支持好、自动 API 文档 |
| 数据处理 | pandas + numpy + scipy | Python 数据分析生态不可替代 |
| 数据库 | SQLite | 轻量、零配置、作品集够用 |
| 本地部署 | Docker Compose | 一键启动，面试演示友好 |
| 在线展示 | Vercel (前端) + Railway (后端) | 免费层够用 |

---

## 7. 系统架构

```
┌────────────────────────────────────────────────┐
│               前端 React SPA                     │
│ 首页 → 上传页 → 预览清洗页 → 探索页 → 仪表板页    │
│ React Context (DatasetContext) 统一状态管理       │
└──────────────────┬─────────────────────────────┘
                   │ REST API (JSON)
┌──────────────────▼─────────────────────────────┐
│               后端 FastAPI                       │
│  /api/datasets  文件解析 + 类型推断               │
│  /api/datasets/:id/clean   数据清洗               │
│  /api/datasets/:id/profile L1 数据画像            │
│  /api/datasets/:id/chart   L2 图表数据生成         │
│  /api/datasets/:id/export  数据/图表导出           │
└──────────────────┬─────────────────────────────┘
                   │
┌──────────────────▼─────────────────────────────┐
│              SQLite                              │
│  datasets / columns / profiles / dashboards      │
└────────────────────────────────────────────────┘
```

---

## 8. 页面路由与组件树

| 路由 | 页面 | 关键组件 |
|------|------|---------|
| `/` | 首页 | HeroBanner, FeatureCards, UploadCTA, SampleDataEntry |
| `/upload` | 上传页 | DropZone, FilePreview, SampleDatasetPicker, UploadProgress |
| `/preview/:id` | 预览清洗页 | DataTable, ColumnStatsPanel, MissingHighlight, CleanToolbar |
| `/explore/:id` | 探索页 | FieldPanel (拖拽), ChartTypeSelector, EChartsCanvas, ExportBtn |
| `/dashboard/:id` | 仪表板页 | DashboardGrid, StatCard, HistogramCard, BoxplotCard, HeatmapCard |

---

## 9. API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/datasets` | 上传文件，返回 datasetId + 字段信息 |
| GET | `/api/datasets/:id` | 获取数据集元信息 |
| GET | `/api/datasets/:id/data` | 分页获取数据行 (?page, ?size) |
| POST | `/api/datasets/:id/clean` | 执行清洗操作 |
| GET | `/api/datasets/:id/profile` | 获取 L1 自动数据画像 |
| POST | `/api/datasets/:id/chart` | 根据配置生成图表数据 |
| GET | `/api/datasets/:id/export/csv` | 导出清洗后 CSV |
| GET | `/api/datasets/:id/export/chart` | 导出图表 PNG |

关键响应示例：

```json
// GET /api/datasets/:id/profile
{
  "rowCount": 1500,
  "colCount": 8,
  "columns": [{
    "name": "销售额",
    "type": "numeric",
    "missing": 12,
    "stats": {
      "mean": 4520.5, "median": 3800, "std": 2100.3,
      "min": 120, "max": 9800,
      "histogram": { "bins": [...], "counts": [...] }
    }
  }],
  "correlationMatrix": [[1.0, 0.72], [0.72, 1.0]]
}
```

```json
// POST /api/datasets/:id/chart (请求)
{
  "chartType": "scatter",
  "xField": "广告投入",
  "yField": "销售额",
  "groupBy": "区域"
}
```

---

## 10. 数据库设计

```sql
CREATE TABLE datasets (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_size INTEGER,
  row_count INTEGER,
  col_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE columns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dataset_id TEXT REFERENCES datasets(id),
  name TEXT NOT NULL,
  dtype TEXT,           -- numeric / categorical / datetime
  missing_count INTEGER DEFAULT 0,
  order_index INTEGER
);

CREATE TABLE profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dataset_id TEXT REFERENCES datasets(id),
  result_json TEXT,     -- L1 画像完整 JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dashboards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dataset_id TEXT REFERENCES datasets(id),
  layout_json TEXT,     -- 用户保存的网格布局
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 11. 错误处理策略

- **前端**：API 错误统一拦截 → Toast 通知 + ErrorBoundary 降级 UI
- **后端**：FastAPI 统一异常中间件，返回 `{ error: string, detail?: string }`
- **文件限制**：前端拦截 > 50MB，后端硬限制 > 100MB
- **空数据/异常数据**：前端展示空状态插画 + 引导提示

---

## 12. 数据流总览

```
用户上传 CSV/Excel
  → 后端解析 + pandas 类型推断
  → 返回预览数据（分页）
  → 用户可选清洗（填充/去重/删列）
  → 后端执行清洗 + 重新解析
  → [L1] 自动计算全套统计 + 生成 proflle JSON
  → 前端渲染仪表板卡片网格
  → [L2] 用户在探索页配置图表
  → 请求 /chart 端点
  → ECharts 渲染交互图表
  → 用户拖拽卡片调整仪表板布局
  → 导出 CSV / PNG
```

---

## 13. 自审清单

- [x] 无 TBD / TODO 占位符
- [x] API 路径与页面路由一致
- [x] 数据库表支持所有页面功能
- [x] MVP 与 v2/v3 边界明确
- [x] 技术栈各层选型有理由
- [x] 错误处理覆盖大文件/空数据/API 异常
- [x] 无歧义：图表类型、分析层级、报告形态均已收敛为一个方案
