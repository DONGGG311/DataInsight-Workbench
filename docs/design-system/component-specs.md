# DataInsight Workbench 组件设计系统 v1.0

> 对应设计 Token: `assets/tokens/design-tokens.css`
> 技术栈: React 18 + TypeScript + Tailwind CSS + shadcn/ui 体系

---

## 1. 设计 Token 概览

### 三阶层结构
```
Primitive (原始值)
  ↓ --color-indigo-600 / --space-4 / --font-size-sm
Semantic (语义别名)
  ↓ --primary / --spacing-component / --muted-foreground
Component (组件专用)
  ↓ --btn-primary-bg / --card-padding / --table-row-height
```

### 快速参考
| 类别 | Token | 值 |
|------|-------|-----|
| 主色 | `--primary` | Indigo 600 `#4F46E5` |
| 辅色 | `--secondary` | Cyan 500 `#06B6D4` |
| 强调 | `--accent` | Amber 500 `#F59E0B` |
| 页面背景 | `--background` | Slate 50 `#F8FAFC` |
| 正文色 | `--foreground` | Slate 800 `#1E293B` |
| 圆角 | `--radius` | 12px |
| 卡片阴影 | `--shadow-card` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |

---

## 2. Button（按钮）

### Variants

| Variant | CSS 类 | 背景 | 文字色 | 使用场景 |
|---------|--------|------|--------|---------|
| Primary | `btn-primary` | Indigo 600 | White | 主要操作、数据上传入口 |
| Secondary | `btn-secondary` | Slate 100 | Slate 800 | 次要操作、取消 |
| Ghost | `btn-ghost` | Transparent | Slate 800 | 表格行操作、图标按钮 |
| Accent (CTA) | `btn-accent` | Amber 500 | Slate 800 | 导出报告、关键行动号召 |
| Destructive | `btn-destructive` | Red 500 | White | 删除数据集、清除操作 |

### Sizes

| Size | 高度 | Padding X | 字号 | 图标大小 | 使用场景 |
|------|------|-----------|------|---------|---------|
| `sm` | 32px | 12px | 12px | 14px | 表格内操作、工具栏 |
| `md` | 40px | 16px | 14px | 16px | 表单按钮、卡片操作 (默认) |
| `lg` | 48px | 24px | 16px | 20px | 首页 CTA、上传按钮 |
| `icon-sm` | 32px | 0 | - | 16px | 图标按钮（小） |
| `icon-md` | 40px | 0 | - | 18px | 图标按钮（默认） |

### States

| State | 触发条件 | Visual |
|-------|---------|--------|
| **default** | 正常渲染 | 标准颜色 + pointer 光标 |
| **hover** | 鼠标悬停 | 背景色加深 10%（primary→indigo-700） |
| **active** | 鼠标按下 | 背景色加深 15%（primary→indigo-800） |
| **focus** | Tab / 点击 | ring-2 + ring-offset-2，色为 `--ring` |
| **disabled** | disabled 属性 | opacity-50 + not-allowed 光标 + pointer-events-none |
| **loading** | 异步等待中 | 图标替换为 Spinner + pointer-events-none |

### ARIA
```html
<button disabled aria-disabled="true">提交</button>
<button aria-busy="true">
  <Spinner class="animate-spin" />
  <span class="sr-only">加载中...</span>
</button>
```

---

## 3. Input / Form Elements（表单元素）

### 3.1 Text Input

| Property | 值 |
|----------|-----|
| 高度 (默认) | 40px |
| Padding | 8px 12px |
| Border | 1px solid `--border` (Slate 200) |
| Radius | 8px (rounded-lg) |
| 字号 | 14px |

| State | Border | Background | Ring |
|-------|--------|------------|------|
| default | Slate 200 | White | None |
| hover | Slate 400 | White | None |
| focus | Indigo 600 | White | 2px Indigo 600 |
| error | Red 500 | White | 2px Red 500 |
| disabled | Slate 200 | Slate 100 | None |

### 3.2 Select / Dropdown

- 视觉与 TextInput 统一
- 支持搜索 + 多选
- 下拉面板: max-h 250px + overflow-y-auto
- 选中项: Indigo 100 背景

### 3.3 File Upload Drop Zone

```
┌  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                                    │
│         📂 拖拽 CSV/Excel 文件      │
│            或点击选择               │
│                                    │
│      支持 .csv / .xlsx / .xls      │
│          单文件最大 50MB            │
│                                    │
└  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

| State | Border | Background | 提示 |
|-------|--------|------------|------|
| default | Dashed Slate 200 | Slate 50 | 灰色文字 |
| dragover | Dashed Indigo 600 | Indigo 50 | 松开以上传 |
| uploading | Solid Indigo 600 | Indigo 50 | 进度条 + 百分比 |
| success | Solid Emerald | Emerald 50 | ✅ 上传成功 |
| error | Solid Red | Red 50 | ❌ 格式/大小错误 |

### 3.4 图表字段选择器（探索页专用）

```
┌────────────────────┐
│ X 轴: [广告投入  ▼] │
│ Y 轴: [销售额   ▼]  │
│ 分组: (可选) [区域▼] │
│ 图表: [散点图  ▼]   │
└────────────────────┘
```

---

## 4. Card（卡片）

### Variants

| Variant | Shadow | Border | 场景 |
|---------|--------|--------|------|
| `default` | shadow-sm | 1px Slate 200 | 数据卡片、指标卡 |
| `chart-container` | shadow-sm | 1px Slate 200 | 图表容器 (min-h: 320px) |
| `interactive` | shadow-sm → shadow-md | 1px Slate 200 | 可点击卡片（hover: shadow-md） |
| `stat-highlight` | shadow-sm | 左边框 4px Indigo 600 | 关键指标突出 |

### Anatomy

```
┌──────────────────────────────────────┐
│ Card Header (p: 24px 24px 0)         │
│  ├─ Title (font-semibold, 16px)      │
│  └─ Description (muted, 14px)        │
├──────────────────────────────────────┤
│ Card Content (p: 24px)               │
│  └─ 图表/表格/指标值                  │
├──────────────────────────────────────┤
│ Card Footer (p: 0 24px 24px)         │
│  └─ Actions (按钮/链接)               │
└──────────────────────────────────────┘
```

### 指标卡片实例
```
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ 行数            │ │ 列数            │ │ 缺失值总数       │
│ 1,500          │ │ 8              │ │ 37 / 12,000    │
│ 总数据行       │ │ 含2个分类列     │ │ 占比 0.31%      │
└────────────────┘ └────────────────┘ └────────────────┘
```

---

## 5. Navbar（导航栏）

### 顶部导航

```
┌────────────────────────────────────────────────┐
│  ◆ DataInsight   数据集  探索  仪表板    [导出] │  ← h=64px
│                      🔗                  🧑   │
└────────────────────────────────────────────────┘
```

| Property | 值 |
|----------|-----|
| 高度 | 64px (4rem) |
| 背景 | White |
| 底部边框 | 1px Slate 200 |
| Shadow | shadow-sm |
| Logo 区 | 棱镜 mark (24px) + "DataInsight" Inter Bold 18px |
| 导航项 | Inter Medium 14px, Slate 500 → Indigo 600 (active) |
| 活动指示器 | 底部 2px Indigo 600，圆角 |

### 响应式：移动端
- ≤ 768px: 汉堡菜单 → Drawer 侧滑面板
- 导航项变为竖向列表 + 更大点击区域 (48px)

---

## 6. Data Table（数据表格）

### 核心特性
- 虚拟滚动（>1000 行时启用）
- 可编辑单元格（双击进入编辑模式）
- 缺失值高亮（琥珀色背景 `amber-50` + "—" 占位符）
- 列头排序 + 类型图标

### 行状态

| State | Background | 触发 |
|-------|------------|------|
| default | White | 正常行 |
| hover | Slate 50 | 鼠标悬停 |
| selected | Indigo 50 | 选中行 |
| striped | Slate 50 / White 交替 | 斑马纹 |

### 列类型指示

| 类型 | 图标 | 对齐 |
|------|------|------|
| numeric | `#` | Right |
| categorical | `Aa` | Left |
| datetime | `📅` | Left |
| boolean | `✓/✗` | Center |

### 缺失值样式
```html
<td class="bg-amber-50 text-amber-700 italic">— 缺失 —</td>
```

### 单元格对齐
| 内容类型 | 对齐 |
|---------|------|
| 文本 | Left |
| 数值 | Right |
| 状态/徽标 | Center |
| 操作 | Right |

### Spacing
| 元素 | 值 |
|------|-----|
| cell padding | 12px 16px |
| header padding | 12px 16px |
| 默认行高 | 48px |
| 紧凑行高 | 40px |

---

## 7. Dashboard Grid（仪表板网格）

### 实现
- 库: `react-grid-layout`
- 12 列流体网格
- 卡片可拖拽重排 + 调整大小
- 布局自动保存到 localStorage

### Grid 规格

| Property | 值 |
|----------|-----|
| 列数 | 12 |
| 行高 | 60px |
| 卡片间距 | 16px |
| 卡片最小宽度 | 280px (2 cols) |
| 卡片最小高度 | 200px (~3 rows) |
| 默认卡片宽度 | 360px (3 cols) |

### 卡片拖拽状态

| State | 视觉 |
|-------|------|
| default | shadow-sm |
| dragging | shadow-xl + scale-105 + z-50 |
| placeholder | Dashed indigo 边框 + indigo-50 背景 |
| resize handle | 右下角 `⋮` 图标 |

---

## 8. Toast Notification（通知）

### Variants

| Type | 背景 | 图标 | 自动关闭 |
|------|------|------|---------|
| success | Emerald 500 | ✅ | 3s |
| error | Red 500 | ❌ | 手动关闭 |
| info | Indigo 600 | ℹ️ | 5s |
| warning | Amber 500 | ⚠️ | 5s |

### Anatomy
```
┌─────────────────────────────────────────────┐
│ [✅] 分析完成！共生成 8 张图表          [×] │
└─────────────────────────────────────────────┘
```
- Position: 右下角 (bottom-right)
- Z-index: 50
- 入场动画: slide-in-right + fade-in (300ms ease-out)
- 退场动画: slide-out-right + fade-out (200ms ease-in)

---

## 9. Chart Container（图表容器）

### 统一包装

所有 ECharts 图表嵌在 `chart-container` 卡片内：

```tsx
<div className="chart-container bg-white rounded-lg border border-slate-200
                shadow-sm p-4 min-h-[320px]">
  <div className="flex items-center justify-between mb-3">
    <h4 className="font-semibold text-sm">{chartTitle}</h4>
    <div className="flex gap-1">
      <button className="btn-ghost btn-icon-sm">⬇️</button> {/* 导出PNG */}
      <button className="btn-ghost btn-icon-sm">⛶</button> {/* 全屏 */}
    </div>
  </div>
  <div className="w-full" style={{height: 'calc(100% - 40px)'}}>
    {/* ECharts 实例 */}
  </div>
</div>
```

### 响应式 ECharts
- 图表必须监听 `resize` 事件
- 图例: 底部水平排列
- Tooltip: 全局统一 (font: Inter 13px, bg: slate-800, text: white)
- 色板: `['#4F46E5', '#06B6D4', '#F59E0B', '#94A3B8']`

---

## 10. 间距与圆角 Token 速查

### 间距 (4px 基准网格)

| Token | 值 | Tailwind 类 | 场景 |
|-------|-----|-------------|------|
| `space-1` | 4px | `gap-1` / `p-1` | 图标与文字间距 |
| `space-2` | 8px | `gap-2` / `p-2` | 按钮内边距、紧密元素 |
| `space-3` | 12px | `gap-3` / `p-3` | 表单元素间距 |
| `space-4` | 16px | `gap-4` / `p-4` | **默认组件间距** |
| `space-6` | 24px | `gap-6` / `p-6` | 卡片内边距 |
| `space-8` | 32px | `gap-8` / `p-8` | Section 间距 |
| `space-12` | 48px | `gap-12` / `p-12` | 页面级间距 |

### 圆角

| Token | 值 | Tailwind 类 | 场景 |
|-------|-----|-------------|------|
| `radius-sm` | 4px | `rounded` | 小标签、Badge |
| `radius-md` | 8px | `rounded-lg` | **按钮、输入框** |
| `radius-lg` | 12px | `rounded-xl` | **卡片、Modal** |
| `radius-xl` | 16px | `rounded-2xl` | 大型容器 |
| `radius-full` | 9999px | `rounded-full` | 圆形头像、圆形按钮 |

---

## 11. 状态优先级规则

当多种状态同时出现，优先级从高到低：

```
1. disabled     → opacity-0.5, not-allowed
2. loading      → spinner + pointer-events-none
3. active       → 背景最深色
4. focus        → ring
5. hover        → 背景微调
6. default      → 标准状态
```

---

## 12. 组件依赖映射

| 组件 | React 实现方式 | 关键依赖 |
|------|---------------|---------|
| Button | 自定义组件 | Tailwind classes |
| Input/Select | 自定义组件 | Tailwind classes |
| File Drop Zone | react-dropzone | react-dropzone |
| Card | 自定义组件 | Tailwind classes |
| Navbar | 自定义组件 | Tailwind classes |
| Data Table | 自定义组件 + @tanstack/react-table | react-window (虚拟滚动) |
| Dashboard Grid | react-grid-layout | react-grid-layout |
| ECharts Container | 自定义 wrapper | echarts + echarts-for-react |
| Toast | 自定义 context + portal | Tailwind + framer-motion |
| Modal/Dialog | @radix-ui/react-dialog (shadcn/ui) | @radix-ui/react-dialog |
