import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import FieldPanel from '../components/explore/FieldPanel';
import EChartsView from '../components/explore/EChartsView';
import Button from '../components/ui/Button';
import { useChart } from '../hooks/useChart';
import api from '../api/client';

interface ColumnInfo { name: string; dtype: string; }

export default function ExplorePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error, fetchChart } = useChart(id!);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [config, setConfig] = useState({
    chartType: 'bar', xField: '', yField: '', groupBy: '',
    filters: [] as Array<{ column: string; op: string; value: string }>,
  });

  useEffect(() => {
    if (!id) return;
    api.get(`/datasets/${id}`).then(r => setColumns(r.data.columns || [])).catch(() => {});
  }, [id]);

  const handleChange = (key: string, value: any) => setConfig(prev => ({ ...prev, [key]: value }));
  const handleRefresh = () => fetchChart(config);

  return (
    <PageShell title="交互式图表探索" subtitle="选择字段和图表类型，自由探索数据关系"
      actions={<Button variant="secondary" size="sm" onClick={() => navigate(`/preview/${id}`)}>← 返回数据</Button>}>
      <div className="flex gap-6">
        <FieldPanel columns={columns} config={config} onChange={handleChange}
          onAddFilter={() => setConfig(prev => ({ ...prev, filters: [...prev.filters, { column: '', op: '=', value: '' }] }))}
          onRemoveFilter={(i: number) => setConfig(prev => ({ ...prev, filters: prev.filters.filter((_, j) => j !== i) }))}
          onRefresh={handleRefresh} />
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-slate-700">
                {config.xField && config.yField ? `${config.yField} vs ${config.xField}` : '图表预览'}
              </h3>
            </div>
            <div className="flex-1">
              <EChartsView data={data} loading={loading} error={error} />
            </div>
          </div>
        </main>
      </div>
    </PageShell>
  );
}
