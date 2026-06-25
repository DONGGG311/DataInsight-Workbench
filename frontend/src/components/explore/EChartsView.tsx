import ReactECharts from 'echarts-for-react';
import { BRAND_COLORS, CHART_TEXT_COLOR, getBaseChartOptions } from '../../utils/echarts-theme';
import type { EChartsOption } from 'echarts';
import Spinner from '../ui/Spinner';

interface Props { data: any; loading: boolean; error: string | null; }

function buildOption(data: any): EChartsOption {
  const base = getBaseChartOptions();
  const t = data.type;

  if (t === 'bar' || t === 'histogram') {
    return { ...base,
      xAxis: { type: 'category', data: data.labels, axisLabel: { color: CHART_TEXT_COLOR } },
      yAxis: { type: 'value', axisLabel: { color: CHART_TEXT_COLOR } },
      series: [{ type: 'bar', data: data.values, itemStyle: { color: BRAND_COLORS[0], borderRadius: [4,4,0,0] } }],
      tooltip: { ...base.tooltip, trigger: 'axis' },
    };
  }

  if (t === 'line') {
    return { ...base,
      xAxis: { type: 'category', data: data.datasets[0]?.labels || [], axisLabel: { color: CHART_TEXT_COLOR } },
      yAxis: { type: 'value', axisLabel: { color: CHART_TEXT_COLOR } },
      series: data.datasets.map((d: any, i: number) => ({
        type: 'line', name: d.label, data: d.values, smooth: true,
        itemStyle: { color: BRAND_COLORS[i % BRAND_COLORS.length] },
      })),
      tooltip: { ...base.tooltip, trigger: 'axis' },
    };
  }

  if (t === 'scatter') {
    return { ...base,
      xAxis: { type: 'value', name: data.x_label, axisLabel: { color: CHART_TEXT_COLOR } },
      yAxis: { type: 'value', name: data.y_label, axisLabel: { color: CHART_TEXT_COLOR } },
      series: data.datasets.map((d: any, i: number) => ({
        type: 'scatter', name: d.label, data: d.data,
        itemStyle: { color: BRAND_COLORS[i % BRAND_COLORS.length] },
      })),
      tooltip: { ...base.tooltip, trigger: 'item' },
    };
  }

  if (t === 'pie') {
    return { ...base,
      series: [{
        type: 'pie', data: data.labels.map((l: string, i: number) => ({ name: l, value: data.values[i] })),
        radius: ['40%', '70%'], label: { color: CHART_TEXT_COLOR },
      }],
      tooltip: { ...base.tooltip, trigger: 'item' },
    };
  }

  if (t === 'boxplot') {
    // Transform value arrays into boxplot stats [min, Q1, median, Q3, max]
    const boxData = data.series.map((s: any) => {
      const vals = s.values.sort((a: number, b: number) => a - b);
      const n = vals.length;
      return [vals[0], vals[Math.floor(n*0.25)], vals[Math.floor(n*0.5)], vals[Math.floor(n*0.75)], vals[n-1]];
    });
    return { ...base,
      xAxis: { type: 'category', data: data.series.map((s: any) => s.label), axisLabel: { color: CHART_TEXT_COLOR } },
      yAxis: { type: 'value', name: data.y_label, axisLabel: { color: CHART_TEXT_COLOR } },
      series: [{ type: 'boxplot', data: boxData, itemStyle: { color: BRAND_COLORS[0] } }],
    };
  }

  if (t === 'heatmap') {
    return { ...base,
      xAxis: { type: 'category', data: data.labels, axisLabel: { color: CHART_TEXT_COLOR, rotate: 45 } },
      yAxis: { type: 'category', data: data.labels, axisLabel: { color: CHART_TEXT_COLOR } },
      visualMap: { min: -1, max: 1, inRange: { color: ['#EEF2FF', '#C7D2FE', '#818CF8', '#4F46E5', '#3730A3'] } },
      series: [{
        type: 'heatmap', data: data.labels.flatMap((l: string, i: number) =>
          data.labels.map((_: string, j: number) => [i, j, data.values[i][j]])),
        label: { show: true, color: '#1E293B', fontSize: 10 },
      }],
    };
  }

  return {};
}

export default function EChartsView({ data, loading, error }: Props) {
  if (loading) return <div className="flex items-center justify-center h-[500px]"><Spinner className="w-8 h-8 text-indigo-600" /></div>;
  if (error) return <div className="flex items-center justify-center h-[500px] text-slate-400">{error}</div>;
  if (!data) return <div className="flex items-center justify-center h-[500px] text-slate-400">请配置图表参数后点击"刷新图表"</div>;

  const option = buildOption(data);
  return (
    <ReactECharts option={option} style={{ height: '500px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      onEvents={{ resize: () => {} }}
    />
  );
}
