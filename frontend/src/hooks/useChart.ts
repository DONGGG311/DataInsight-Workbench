import { useState, useCallback } from 'react';
import api from '../api/client';

interface ChartConfig {
  chartType: string;
  xField: string;
  yField: string;
  groupBy: string;
  filters: Array<{ column: string; op: string; value: string }>;
}

interface ChartResult {
  data: any;
  loading: boolean;
  error: string | null;
}

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
