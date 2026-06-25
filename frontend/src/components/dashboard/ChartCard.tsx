import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { BRAND_COLORS, CHART_TEXT_COLOR } from '../../utils/echarts-theme';

interface Props { title: string; data: any; }

function buildProfileChartOption(data: any): EChartsOption {
  const ct = data.chartType;
  if (ct === 'histogram' && data.type === 'numeric' && data.stats?.histogram) {
    return {
      xAxis: { type: 'category', data: data.stats.histogram.bins.map((_: any, i: number, a: any[]) =>
        `${a[i]?.toFixed(1)}-${a[i+1]?.toFixed(1)}`).slice(0, -1), axisLabel: { fontSize: 9, color: CHART_TEXT_COLOR } },
      yAxis: { type: 'value', axisLabel: { fontSize: 9, color: CHART_TEXT_COLOR } },
      series: [{ type: 'bar', data: data.stats.histogram.counts, itemStyle: { color: BRAND_COLORS[0], borderRadius: [2,2,0,0] } }],
      grid: { top: 10, right: 10, bottom: 25, left: 35 },
    };
  }
  if ((ct === 'bar' || !ct) && data.type === 'categorical' && data.stats?.value_counts) {
    const entries = Object.entries(data.stats.value_counts);
    return {
      xAxis: { type: 'category', data: entries.map(([k]) => k), axisLabel: { fontSize: 9, color: CHART_TEXT_COLOR, rotate: 45 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 9, color: CHART_TEXT_COLOR } },
      series: [{ type: 'bar', data: entries.map(([, v]) => v), itemStyle: { color: BRAND_COLORS[1], borderRadius: [2,2,0,0] } }],
      grid: { top: 10, right: 10, bottom: 30, left: 35 },
    };
  }
  if (ct === 'heatmap') {
    return {
      xAxis: { type: 'category', data: data.labels, axisLabel: { fontSize: 8, color: CHART_TEXT_COLOR, rotate: 45 } },
      yAxis: { type: 'category', data: data.labels, axisLabel: { fontSize: 8, color: CHART_TEXT_COLOR } },
      visualMap: { min: -1, max: 1, inRange: { color: ['#EEF2FF', '#C7D2FE', '#818CF8', '#4F46E5', '#3730A3'] } },
      series: [{
        type: 'heatmap', data: data.labels.flatMap((l: string, i: number) =>
          data.labels.map((_: string, j: number) => [i, j, data.values[i][j]])),
        label: { show: true, fontSize: 8 },
      }],
      grid: { top: 5, right: 5, bottom: 35, left: 45 },
    };
  }
  return {};
}

export default function ChartCard({ data }: Props) {
  const option = buildProfileChartOption(data);
  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'canvas' }} />;
}
