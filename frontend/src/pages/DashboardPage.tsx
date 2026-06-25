import { useParams, useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import DashboardGrid from '../components/dashboard/DashboardGrid';
import Button from '../components/ui/Button';
import { useDashboard } from '../hooks/useDashboard';

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cards, layout, setLayout, loading, error } = useDashboard(id!);

  return (
    <PageShell title="仪表板报告" subtitle="拖拽卡片调整布局 · 右下角拉伸调整大小"
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={() => navigate(`/explore/${id}`)}>← 返回探索</Button>
          <Button variant="secondary" size="sm" onClick={() => window.open(`/api/datasets/${id}/export/csv`)}>导出 CSV</Button>
        </>
      }>
      <DashboardGrid cards={cards} layout={layout} onLayoutChange={setLayout} loading={loading} error={error} />
    </PageShell>
  );
}
