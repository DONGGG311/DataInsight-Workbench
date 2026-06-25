import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

interface DashboardCard {
  id: string;
  type: 'stat' | 'chart';
  title: string;
  data: any;
}

export function useDashboard(datasetId: string) {
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<any[]>([]);

  useEffect(() => {
    if (!datasetId) return;
    setLoading(true);
    api.get(`/datasets/${datasetId}/profile`)
      .then(r => {
        const profile = r.data;
        const cards: DashboardCard[] = [];
        // Overview stat card
        cards.push({
          id: 'overview', type: 'stat', title: '概览统计',
          data: { rowCount: profile.row_count, colCount: profile.col_count,
                  missingTotal: profile.columns.reduce((s: number, c: any) => s + c.missing, 0) }
        });
        // Per-column histogram/bar cards
        profile.columns.forEach((col: any) => {
          cards.push({
            id: `col-${col.name}`, type: 'chart', title: `${col.name} 分布`,
            data: { ...col, chartType: col.type === 'numeric' ? 'histogram' : 'bar' }
          });
        });
        // Correlation heatmap
        if (profile.correlation_matrix) {
          cards.push({
            id: 'correlation', type: 'chart', title: '相关性热力图',
            data: { chartType: 'heatmap', labels: profile.numeric_cols, values: profile.correlation_matrix }
          });
        }
        setCards(cards);
        // Default layout: 3 cols, auto rows
        setLayout(cards.map((c, i) => ({
          i: c.id, x: (i % 3) * 4, y: Math.floor(i / 3) * 3,
          w: 4, h: 3, minW: 3, minH: 2
        })));
        setLoading(false);
      })
      .catch(e => { setError(e.message || '加载失败'); setLoading(false); });
  }, [datasetId]);

  return { cards, layout, setLayout, loading, error };
}
