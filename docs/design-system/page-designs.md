# DataInsight Workbench 页面 UI 样式方案 v1.0

> 对应 Token: `assets/tokens/design-tokens.css`
> 对应组件: `docs/design-system/component-specs.md`
> 品牌: Insight Prism | 主色 #4F46E5

---

## 全局布局壳

```
┌──────────────────────────────────────────────────┐
│  Navbar (h=64px, 固定顶部, z-50)                   │
│  ◆ DataInsight    数据集  探索  仪表板              │
├──────────────────────────────────────────────────┤
│                                                    │
│  <main> — 页面内容区                               │
│    max-w-7xl mx-auto px-4 sm:px-6 lg:px-8          │
│    pt-24 pb-16  (留出固定 Navbar 空间)              │
│                                                    │
└──────────────────────────────────────────────────┘
```

### Tailwind 壳实现
```tsx
// App.tsx
<div className="min-h-screen bg-slate-50">
  <Navbar />
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
    <Outlet />
  </main>
  <Toaster /> {/* Toast 容器 */}
</div>
```

---

## 页面 1: 首页 `/`

### 目标
3 秒内让用户理解产品价值，并引导进入上传流程。

### 布局 (上下滚动)

```
┌────────────────────────────────────────────────────┐
│                                                    │
│  Section 1: Hero                                   │
│  ┌──────────────────────────────────────────────┐  │
│  │       ◆  ◆  ◆   数据洞察工作台                │  │
│  │       DataInsight Workbench                  │  │
│  │                                              │  │
│  │  上传数据 → 自动分析 → 交互探索 → 仪表板报告    │  │
│  │  无需编程，像聊天一样分析数据                   │  │
│  │                                              │  │
│  │  [🚀 开始分析]  [📦 试用示例数据]              │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  Section 2: Feature Cards (3 列网格)               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │ 📤 数据接入 │ │ 📊 自动分析 │ │ 📋 仪表板    │   │
│  │ CSV/Excel  │ │ 一键数据画像│ │ 拖拽排列    │   │
│  │ 拖拽上传   │ │ 7种图表    │ │ 自由导出    │   │
│  └────────────┘ └────────────┘ └────────────┘   │
│                                                    │
│  Section 3: Steps 引导 (3 步)                      │
│  ┌───────┐    ┌───────┐    ┌───────┐             │
│  │ ①上传  │ → │ ②分析  │ → │ ③报告  │             │
│  │ CSV    │    │ 一键   │    │ 导出   │             │
│  └───────┘    └───────┘    └───────┘             │
│                                                    │
│  Footer: GitHub 链接 + 技术栈标签                    │
└────────────────────────────────────────────────────┘
```

### Hero Section Tailwind

```tsx
<section className="text-center py-20 space-y-8">
  {/* Logo Mark */}
  <div className="flex justify-center gap-1 text-4xl">
    <span className="text-indigo-600">◆</span>
    <span className="text-cyan-500">◆</span>
    <span className="text-amber-500">◆</span>
  </div>

  {/* Title */}
  <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">
    数据洞察工作台
  </h1>
  <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
    上传数据 → 自动分析 → 交互探索 → 仪表板报告
  </p>
  <p className="text-base text-slate-400 max-w-xl mx-auto">
    无需编程基础。像聊天一样简单，像专业工具一样强大。
  </p>

  {/* CTA Buttons */}
  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
    <button className="btn-accent btn-lg text-lg px-10 py-3.5 rounded-lg font-semibold
                       bg-amber-500 hover:bg-amber-600 text-slate-800
                       shadow-md hover:shadow-lg transition-all
                       focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
      🚀 开始分析
    </button>
    <button className="btn-secondary btn-lg text-lg px-8 py-3.5 rounded-lg font-medium
                       bg-white border border-slate-200 text-slate-700
                       hover:bg-slate-50 hover:border-slate-300
                       transition-all focus-visible:ring-2 focus-visible:ring-indigo-600">
      📦 试用示例数据
    </button>
  </div>
</section>
```

### Feature Cards Section

```tsx
<section className="py-16">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Card 1: 数据接入 */}
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8
                    hover:shadow-md transition-shadow text-center">
      <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-5">
        <span className="text-2xl">📤</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">数据接入</h3>
      <p className="text-slate-500 text-sm leading-relaxed">
        支持 CSV / Excel 文件拖拽上传，内置经典示例数据集，零门槛开始分析
      </p>
    </div>

    {/* Card 2: 自动分析 */}
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8
                    hover:shadow-md transition-shadow text-center">
      <div className="w-14 h-14 bg-cyan-50 rounded-xl flex items-center justify-center mx-auto mb-5">
        <span className="text-2xl">📊</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">自动分析</h3>
      <p className="text-slate-500 text-sm leading-relaxed">
        一键生成完整数据画像。7 种图表类型，从柱状图到热力图，全方位洞察
      </p>
    </div>

    {/* Card 3: 仪表板 */}
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8
                    hover:shadow-md transition-shadow text-center">
      <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-5">
        <span className="text-2xl">📋</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">仪表板报告</h3>
      <p className="text-slate-500 text-sm leading-relaxed">
        自由拖拽图表卡片排列报告布局，一键导出数据和高清图表
      </p>
    </div>
  </div>
</section>
```

### Steps Section

```tsx
<section className="py-16 bg-white rounded-2xl border border-slate-200 shadow-sm px-8">
  <h2 className="text-2xl font-bold text-slate-800 text-center mb-12">
    三步开始分析
  </h2>
  <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
    <StepBadge number="①" label="上传" desc="拖拽 CSV 或 Excel 文件" />
    <Arrow />
    <StepBadge number="②" label="分析" desc="一键生成数据画像 + 探索图表" />
    <Arrow />
    <StepBadge number="③" label="报告" desc="仪表板自由排列，导出分享" />
  </div>
</section>
```

---

## 页面 2: 数据上传页 `/upload`

### 布局

```
┌──────────────────────────────────────────────────┐
│  Navbar (active: "数据集")                        │
├──────────────────────────────────────────────────┤
│                                                  │
│  标题区                                          │
│  <h1>导入数据集</h1>                              │
│  <p>上传 CSV 或 Excel 文件开始分析                 │
│                                                  │
│  ┌─ Drop Zone (占主体宽度) ──────────────────────┐│
│  │                                               ││
│  │        📂 拖拽文件到此处，或点击选择            ││
│  │        .csv / .xlsx / .xls                    ││
│  │        最大 50MB                               ││
│  │                                               ││
│  └───────────────────────────────────────────────┘│
│                                                  │
│  ── 或者 ──                                      │
│                                                  │
│  示例数据集                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ 📊 超市   │ │ 🌍 全球   │ │ 📈 股票   │        │
│  │ 销售数据  │ │ 气温数据  │ │ 收益数据  │        │
│  │          │ │          │ │          │        │
│  │ [试用]   │ │ [试用]   │ │ [试用]   │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Drop Zone 实现

```tsx
<div className="max-w-2xl mx-auto">
  {/* 拖拽上传区 */}
  <div
    className={`
      border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
      transition-all duration-200
      ${isDragging
        ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
        : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
      }
    `}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    onClick={openFileDialog}
  >
    <div className="space-y-4">
      <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
        <svg className="w-10 h-10 text-indigo-600">{uploadIcon}</svg>
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-700">
          拖拽文件到此处，或<span className="text-indigo-600">点击选择</span>
        </p>
        <p className="text-sm text-slate-400 mt-2">
          支持 .csv / .xlsx / .xls · 最大 50MB
        </p>
      </div>
    </div>
  </div>

  {/* 分隔线 */}
  <div className="relative my-12">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-slate-200"></div>
    </div>
    <div className="relative flex justify-center">
      <span className="px-4 bg-slate-50 text-sm text-slate-400">或者使用示例数据</span>
    </div>
  </div>

  {/* 示例数据集卡片 */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {SAMPLE_DATASETS.map(ds => (
      <button
        key={ds.id}
        className="bg-white border border-slate-200 rounded-xl p-6
                   hover:border-indigo-300 hover:shadow-md hover:bg-indigo-50/30
                   transition-all text-left group"
        onClick={() => loadSample(ds.id)}
      >
        <span className="text-2xl">{ds.emoji}</span>
        <h3 className="font-semibold text-slate-800 mt-3 group-hover:text-indigo-700">
          {ds.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{ds.rows} 行 · {ds.cols} 列</p>
        <span className="inline-block mt-3 text-xs font-medium text-indigo-600
                         bg-indigo-50 px-3 py-1 rounded-full">
          试用 →
        </span>
      </button>
    ))}
  </div>
</div>
```

### 上传状态覆盖

```tsx
{/* 上传中进度覆盖 */}
{uploading && (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 w-96 text-center">
      <Spinner className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
      <p className="font-semibold text-slate-800 mt-4">正在解析数据...</p>
      <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
        <div className="bg-indigo-600 h-2 rounded-full transition-all"
             style={{width: `${progress}%`}} />
      </div>
      <p className="text-xs text-slate-400 mt-2">{progress}%</p>
    </div>
  </div>
)}
```

---

## 页面 3: 数据预览与清洗页 `/preview/:datasetId`

### 布局

```
┌──────────────────────────────────────────────────┐
│  Navbar                                           │
├──────────────────────────────────────────────────┤
│  ┌─ 顶部工具栏 (sticky, z-10) ──────────────────┐ │
│  │ [< 返回]  数据集: sales_2024.csv  1,500行×8列 │ │
│  │                                 [前往探索→]   │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
│  ┌─ 清洗操作栏 ─────────────────────────────────┐ │
│  │ [填充缺失值▼] [去重] [类型转换▼] [删除列]     │ │
│  │ [撤销] [重做]                  [重置数据]     │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
│  ┌─── 上面：列统计速览面板 (5列网格) ──────────────┐ │
│  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │ │
│  │ │销售额 │ │区域  │ │日期  │ │数量  │ │利润  │ │ │ │
│  │ │数字  │ │分类  │ │日期  │ │数字  │ │数字  │ │ │ │
│  │ │12缺失│ │0缺失 │ │3缺失 │ │0缺失 │ │5缺失 │ │ │ │
│  │ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
│  ┌─── 下面：数据表格 (主内容区) ──────────────────┐ │
│  │ ┌─────────────────────────────────────────────┐│ │
│  │ │ # │ 销售额  │ 区域 │ 日期      │ ...        ││ │
│  │ ├─────────────────────────────────────────────┤│ │
│  │ │ 1 │ 4,520  │ 华东 │ 2024-01-01│            ││ │
│  │ │ 2 │ 3,100  │ 华北 │ 2024-01-02│            ││ │
│  │ │ 3 │ — 缺失— │ 华南 │ 2024-01-03│ ← 琥珀色高亮││ │
│  │ │ 4 │ 5,200  │ 华东 │ — 缺失 — │ ← 琥珀色高亮││ │
│  │ │...│        │      │           │            ││ │
│  │ └─────────────────────────────────────────────┘│ │
│  │                分页: < 1 2 3 ... 30 >          │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### 顶部工具栏

```tsx
<div className="sticky top-16 z-10 bg-slate-50 pb-4">
  <div className="flex items-center justify-between bg-white rounded-xl
                  border border-slate-200 shadow-sm px-6 py-4">
    <div className="flex items-center gap-4">
      <button className="btn-ghost btn-icon-md text-slate-500">
        ← 返回
      </button>
      <div>
        <h1 className="text-lg font-semibold text-slate-800">
          {dataset.filename}
        </h1>
        <p className="text-sm text-slate-400">
          {dataset.rowCount.toLocaleString()} 行 × {dataset.colCount} 列
        </p>
      </div>
    </div>
    <button className="btn-primary px-6 py-2.5 rounded-lg font-medium
                       bg-indigo-600 hover:bg-indigo-700 text-white
                       transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600">
      前往探索 →
    </button>
  </div>
</div>
```

### 清洗操作栏

```tsx
<div className="flex items-center gap-3 flex-wrap bg-white rounded-xl
                border border-slate-200 px-5 py-3 mb-6">
  <button className="btn-ghost btn-sm text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md">
    填充缺失值 ▾
  </button>
  <button className="btn-ghost btn-sm text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md">
    去重
  </button>
  <button className="btn-ghost btn-sm text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md">
    类型转换 ▾
  </button>
  <button className="btn-ghost btn-sm text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md">
    删除所选列
  </button>
  <div className="w-px h-5 bg-slate-200 mx-1" />
  <button className="btn-ghost btn-sm text-slate-400 px-2 py-1.5 rounded-md" disabled>
    ↩ 撤销
  </button>
  <button className="btn-ghost btn-sm text-slate-400 px-2 py-1.5 rounded-md" disabled>
    ↪ 重做
  </button>
  <div className="flex-1" />
  <button className="btn-ghost btn-sm text-slate-500 hover:text-red-500 px-3 py-1.5 rounded-md">
    重置数据
  </button>
</div>
```

### 列统计速览

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
  {columns.map(col => (
    <div key={col.name}
      className="bg-white rounded-xl border border-slate-200 p-4
                 hover:shadow-sm transition-shadow cursor-pointer
                 hover:border-indigo-300"
      onClick={() => selectColumn(col.name)}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold text-slate-800 truncate">
          {col.name}
        </span>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full
          ${col.dtype === 'numeric' ? 'bg-indigo-50 text-indigo-600' :
            col.dtype === 'categorical' ? 'bg-cyan-50 text-cyan-600' :
            'bg-amber-50 text-amber-600'}`}>
          {col.dtype}
        </span>
      </div>
      {col.missing > 0 && (
        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
          ⚠ {col.missing} 个缺失值
        </p>
      )}
      {col.missing === 0 && (
        <p className="text-xs text-emerald-600 mt-2">✓ 数据完整</p>
      )}
    </div>
  ))}
</div>
```

### 数据表格

```tsx
<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 w-12">#</th>
          {columns.map(col => (
            <th key={col.name}
              className="px-4 py-3 text-left text-xs font-semibold text-slate-500
                         hover:bg-slate-100 cursor-pointer select-none"
              onClick={() => sort(col.name)}
            >
              {col.name}
              <span className="ml-1 text-slate-300">{sortIcon}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}
            className={`
              border-b border-slate-100
              ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
              hover:bg-indigo-50/30 transition-colors
            `}
          >
            <td className="px-4 py-3 text-sm text-slate-400">{i + 1}</td>
            {row.map((cell, j) => (
              <td key={j}
                className={`
                  px-4 py-3 text-sm
                  ${cell === null
                    ? 'bg-amber-50 text-amber-700 italic'  // 缺失值高亮
                    : 'text-slate-700'}
                `}
                onDoubleClick={() => startEdit(i, j)}
              >
                {cell === null ? '— 缺失 —' : String(cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* 分页 */}
  <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50/50">
    <span className="text-sm text-slate-500">
      共 {totalRows.toLocaleString()} 行
    </span>
    <div className="flex items-center gap-2">
      <button className="btn-ghost btn-sm disabled:opacity-30" disabled>上一页</button>
      <span className="text-sm font-medium text-slate-700">1 / 30</span>
      <button className="btn-ghost btn-sm">下一页</button>
    </div>
  </div>
</div>
```

---

## 页面 4: 交互式图表探索页 `/explore/:datasetId`

### 布局 (左右分栏)

```
┌──────────────────────────────────────────────────────┐
│  Navbar                                              │
├──────────────────────────────────────────────────────┤
│ ┌─ 工具栏 ───────────────────────────────────────────┐│
│ │ [< 数据集]  探索图表    [导出PNG] [添加至仪表板]    ││
│ └────────────────────────────────────────────────────┘│
│                                                      │
│ ┌── 左面板 (w-[340px], 固定高度) ──┐ ┌─ 右面板 ─────┐ │
│ │                                  │ │              │ │
│ │  📊 图表配置                     │ │  ECharts     │ │
│ │  ┌────────────────────────────┐  │ │  画布区域    │ │
│ │  │ 图表类型                    │  │ │              │ │
│ │  │ [柱] [折] [散] [饼]        │  │ │  (flex-1)    │ │
│ │  │ [直方] [箱线] [热力]       │  │ │              │ │
│ │  └────────────────────────────┘  │ │  min-h-[500px]│
│ │                                  │ │              │ │
│ │  X 轴                            │ │              │ │
│ │  [字段下拉: 广告投入     ▼]      │ │              │ │
│ │                                  │ │              │ │
│ │  Y 轴                            │ │              │ │
│ │  [字段下拉: 销售额       ▼]      │ │              │ │
│ │                                  │ │              │ │
│ │  分组 (可选)                     │ │              │ │
│ │  [字段下拉: 区域         ▼]      │ │              │ │
│ │                                  │ │              │ │
│ │  筛选条件 (可选)                 │ │              │ │
│ │  [区域 = "华东"]  [+ 添加]       │ │              │ │
│ │                                  │ │              │ │
│ │  ─────────────────────           │ │              │ │
│ │  [🎨 图表样式] (颜色/主题)       │ │              │ │
│ │  [🔄 重置配置]                   │ │              │ │
│ └──────────────────────────────────┘ └──────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 左面板实现

```tsx
<div className="flex gap-6 h-full">
  {/* 左侧配置面板 */}
  <aside className="w-[340px] shrink-0">
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5
                    space-y-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">

      {/* 图表类型选择 */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 block">
          图表类型
        </label>
        <div className="grid grid-cols-4 gap-2">
          {CHART_TYPES.map(chart => (
            <button
              key={chart.type}
              className={`
                flex flex-col items-center gap-1 p-2.5 rounded-lg text-xs font-medium
                transition-all
                ${selected === chart.type
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                  : 'bg-slate-50 text-slate-500 border border-transparent hover:bg-slate-100'}
              `}
              onClick={() => setChartType(chart.type)}
            >
              <span className="text-lg">{chart.icon}</span>
              {chart.label}
            </button>
          ))}
        </div>
      </div>

      {/* 字段选择 */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
          X 轴
        </label>
        <select className="w-full h-10 px-3 rounded-lg border border-slate-200
                           bg-white text-sm text-slate-700
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/20
                           outline-none transition-colors">
          <option value="">选择字段...</option>
          {numericColumns.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
          Y 轴
        </label>
        <select className="w-full h-10 px-3 rounded-lg border border-slate-200
                           bg-white text-sm text-slate-700
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/20
                           outline-none transition-colors">
          {numericColumns.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
          分组 (可选)
        </label>
        <select className="w-full h-10 px-3 rounded-lg border border-slate-200
                           bg-white text-sm text-slate-400
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/20
                           outline-none transition-colors">
          <option value="">无分组</option>
          {categoricalColumns.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* 筛选 */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
          筛选条件
        </label>
        <div className="space-y-2">
          {filters.map((f, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select className="flex-1 h-9 px-2 rounded-md border border-slate-200
                                 text-xs bg-white focus:border-indigo-500 outline-none">
                <option>{f.field}</option>
              </select>
              <select className="w-16 h-9 px-2 rounded-md border border-slate-200
                                 text-xs bg-white outline-none">
                <option>=</option>
              </select>
              <input className="flex-1 h-9 px-2 rounded-md border border-slate-200
                                 text-xs bg-white outline-none focus:border-indigo-500" />
              <button className="text-slate-400 hover:text-red-500">×</button>
            </div>
          ))}
        </div>
        <button className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 font-medium">
          + 添加条件
        </button>
      </div>

      <hr className="border-slate-200" />

      <div className="flex gap-2">
        <button className="flex-1 btn-ghost btn-sm text-slate-500 justify-center
                           py-2 rounded-lg hover:bg-slate-100">
          🎨 样式
        </button>
        <button className="flex-1 btn-ghost btn-sm text-slate-500 justify-center
                           py-2 rounded-lg hover:bg-slate-100">
          🔄 重置
        </button>
      </div>
    </div>
  </aside>

  {/* 右侧图表画布 */}
  <main className="flex-1 min-w-0">
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm
                    p-4 min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-slate-700">
          {chartTitle}
        </h3>
        <div className="flex gap-1">
          <button className="btn-ghost btn-icon-sm text-slate-400 hover:text-slate-600"
                  title="导出 PNG">
            ⬇
          </button>
          <button className="btn-ghost btn-icon-sm text-slate-400 hover:text-slate-600"
                  title="添加到仪表板">
            ＋
          </button>
        </div>
      </div>
      <div className="flex-1" ref={chartContainerRef}>
        {/* ECharts 渲染在此 */}
      </div>
    </div>
  </main>
</div>
```

---

## 页面 5: 仪表板报告页 `/dashboard/:datasetId`

### 布局

```
┌──────────────────────────────────────────────────────┐
│  Navbar                                              │
├──────────────────────────────────────────────────────┤
│ ┌─ 工具栏 ───────────────────────────────────────────┐│
│ │ [< 数据集]  仪表板报告    [导出CSV] [导出PNG全部]   ││
│ │                               [添加卡片+] [重置]   ││
│ └────────────────────────────────────────────────────┘│
│                                                      │
│ ┌── Grid Container (react-grid-layout) ──────────────┐│
│ │                                                    ││
│ │  ┌────────────┐ ┌──────────────┐ ┌──────────────┐  ││
│ │  │ 📊 概览统计 │ │ 📈 销售额分布 │ │ 🔥 相关性热力 │  ││
│ │  │            │ │   [直方图]   │ │   [热力图]   │  ││
│ │  │ 1,500 行   │ │              │ │              │  ││
│ │  │ 8 列      │ │              │ │              │  ││
│ │  │ 37 缺失   │ │              │ │              │  ││
│ │  └────────────┘ └──────────────┘ └──────────────┘  ││
│ │                                                    ││
│ │  ┌──────────────┐ ┌──────────────┐                 ││
│ │  │ 📋 区域销售   │ │ 📦 箱线图     │                ││
│ │  │   [柱状图]   │ │   [箱线图]   │                 ││
│ │  │              │ │              │                 ││
│ │  └──────────────┘ └──────────────┘                 ││
│ │                                                    ││
│ └────────────────────────────────────────────────────┘│
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Grid 实现

```tsx
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

// 初始布局由 L1 画像结果自动生成
const defaultLayout = profileData.cards.map((card, i) => ({
  i: card.id,
  x: (i % 3) * 4,  // 每行 3 卡，每卡占 4 列
  y: Math.floor(i / 3) * 3,
  w: 4,
  h: 3,
  minW: 3,
  minH: 2,
}));

<div className="space-y-6">
  {/* 工具栏 */}
  <div className="flex items-center justify-between bg-white rounded-xl
                  border border-slate-200 shadow-sm px-6 py-4">
    <div>
      <h1 className="text-lg font-semibold text-slate-800">仪表板报告</h1>
      <p className="text-sm text-slate-400">
        拖拽卡片调整布局 · 右下角拉伸调整大小
      </p>
    </div>
    <div className="flex gap-2">
      <button className="btn-secondary btn-sm rounded-lg">导出 CSV</button>
      <button className="btn-secondary btn-sm rounded-lg">导出全部 PNG</button>
      <button className="btn-primary btn-sm rounded-lg">+ 添加卡片</button>
      <button className="btn-ghost btn-sm rounded-lg">重置布局</button>
    </div>
  </div>

  {/* Grid 区域 */}
  <GridLayout
    className="layout"
    layout={layout}
    cols={12}
    rowHeight={80}
    width={containerWidth}
    onLayoutChange={saveLayout}
    draggableHandle=".drag-handle"
    margin={[16, 16]}
  >
    {cards.map(card => (
      <div key={card.id}
        className="bg-white rounded-xl border border-slate-200 shadow-sm
                   overflow-hidden transition-shadow hover:shadow-md
                   flex flex-col"
      >
        {/* 卡片头部 — 拖拽手柄 */}
        <div className="drag-handle flex items-center justify-between
                        px-4 py-3 border-b border-slate-100
                        cursor-grab active:cursor-grabbing
                        hover:bg-slate-50 transition-colors select-none">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">⋮⋮</span>
            <h4 className="text-sm font-semibold text-slate-700">
              {card.title}
            </h4>
          </div>
          <button className="text-slate-400 hover:text-red-500 text-sm
                             opacity-0 group-hover:opacity-100 transition-opacity">
            ×
          </button>
        </div>

        {/* 卡片内容 — 图表 */}
        <div className="flex-1 p-3">
          {card.type === 'stat' ? (
            <StatCardContent card={card} />
          ) : (
            <ChartCardContent card={card} />
          )}
        </div>
      </div>
    ))}
  </GridLayout>

  {/* 空状态 */}
  {cards.length === 0 && (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
        <span className="text-3xl text-slate-300">📊</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-600 mt-4">暂无卡片</h3>
      <p className="text-sm text-slate-400 mt-1">
        点击"+ 添加卡片"或返回探索页添加图表
      </p>
    </div>
  )}
</div>
```

### 卡片类型实现

```tsx
// StatCard — 概览统计
function StatCardContent({ card }: { card: StatCard }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <span className="text-3xl font-bold text-indigo-600 font-mono">
        {card.value.toLocaleString()}
      </span>
      <span className="text-sm text-slate-400 mt-2">{card.label}</span>
    </div>
  )
}

// ChartCard — ECharts 图表
function ChartCardContent({ card }: { card: ChartCard }) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return
    const chart = echarts.init(chartRef.current)
    chart.setOption(card.option)
    return () => chart.dispose()
  }, [card.option])

  return <div ref={chartRef} className="w-full h-full min-h-[200px]" />
}
```

---

## 全局样式复用模式

### 一致的间距节奏

```
页面级 section 间距: pt-16 pb-16 / py-20
区块间间距:         mb-12 / mb-8
组件间间距:         gap-6 / gap-4
卡片内间距:         p-6 / p-5
表单元素间距:       gap-3 / space-y-2
```

### 一致的圆角节奏

```
页面级容器: rounded-2xl  (16px)
卡片/面板:   rounded-xl   (12px)
按钮/输入框: rounded-lg   (8px)
小标签:      rounded-full (9999px)
```

### 一致的阴影层级

```
静态卡片:  shadow-sm   (页面内容)
hover 卡片: shadow-md   (鼠标悬停)
拖拽中:    shadow-xl   (仪表板拖拽)
Modal:    shadow-2xl  (模态框)
```

### 一致的过渡

```css
/* 所有交互元素通用 */
transition-all duration-150 ease-in-out

/* 仅颜色变化（按钮、链接） */
transition-colors duration-150 ease-in-out

/* 仅阴影变化（卡片） */
transition-shadow duration-200 ease-out
```
