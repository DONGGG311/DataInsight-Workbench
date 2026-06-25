# DataInsight Workbench Banner 与展示图设计说明

> 对应品牌: Insight Prism | 文件位置: `assets/banners/`

---

## 产出清单

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `readme-banner.html` | 1200 × 500 | GitHub README 头图 |
| `feature-upload.html` | 800 × 500 | 功能展示：数据上传与示例集 |
| `feature-explore.html` | 800 × 500 | 功能展示：交互式图表探索 |
| `feature-dashboard.html` | 800 × 500 | 功能展示：仪表板报告 |

---

## 设计理念

### 主 Banner — 暗色科技风

- **背景**: 深靛蓝渐变（Indigo 900 → Indigo 600 → Slate 900），营造深度、专业的科技感
- **装饰**: 细微网格线 + 三处光晕（Indigo / Cyan / Amber），呼应"棱镜分解数据之光"的品牌概念
- **标题**: 白色大号 Inter Bold，"Insight" 用 Cyan 高亮，形成品牌记忆点
- **副标题**: 半透明白色，中文说明 + 核心工作流
- **标签行**: 毛玻璃效果胶囊标签，展示技术关键词，关键标签用 Amber 高亮

### 功能展示图 — 浅色应用模拟

三张展示图统一采用**浅色背景 + 白色内容卡片 + 应用 UI 模拟**风格：
- 模拟真实产品操作界面
- 左侧/顶部面板展示操作步骤
- 右侧/中部展示分析结果

| 图 | 模拟内容 |
|-----|---------|
| Upload | 拖拽上传区 + 3 个示例数据集卡片 |
| Explore | 图表类型选择面板 + 散点图模拟画布 |
| Dashboard | 网格卡片布局 + 统计/柱状/热力卡片 |

---

## 导出方式

HTML 文件可直接在浏览器打开后截图，或使用 Playwright/Puppeteer 自动化导出：

```bash
# 使用 Chrome Headless 导出 (示例)
npx playwright screenshot --viewport-size=1200,500 \
  assets/banners/readme-banner.html \
  assets/banners/readme-banner.png
```

---

## GitHub README 使用建议

```markdown
<!-- README.md -->
<p align="center">
  <img src="assets/banners/readme-banner.png" alt="DataInsight Workbench" width="100%">
</p>

## ✨ 功能预览

| 数据上传 | 交互探索 | 仪表板报告 |
|:---:|:---:|:---:|
| ![](assets/banners/feature-upload.png) | ![](assets/banners/feature-explore.png) | ![](assets/banners/feature-dashboard.png) |
| 拖拽上传 CSV/Excel<br>内置示例数据集 | 7 种图表类型<br>自由配置 X/Y 轴 | 拖拽排列卡片<br>一键导出报告 |
```
