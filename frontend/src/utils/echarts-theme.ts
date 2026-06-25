export const BRAND_COLORS = ['#4F46E5', '#06B6D4', '#F59E0B', '#94A3B8', '#10B981', '#EF4444', '#8B5CF6'];
export const CHART_TEXT_COLOR = '#64748B';
export const CHART_GRID_COLOR = '#E2E8F0';

import type { EChartsOption } from 'echarts';

export function getBaseChartOptions(): Partial<EChartsOption> {
  return {
    color: BRAND_COLORS,
    textStyle: { color: CHART_TEXT_COLOR, fontFamily: 'Inter, system-ui, sans-serif' },
    grid: { borderColor: CHART_GRID_COLOR },
    tooltip: { backgroundColor: '#1E293B', borderColor: '#1E293B',
               textStyle: { color: '#FFFFFF', fontSize: 13 } },
  };
}
