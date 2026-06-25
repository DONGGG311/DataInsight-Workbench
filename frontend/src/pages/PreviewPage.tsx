import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import ColumnStatsPanel from '../components/preview/ColumnStatsPanel';
import CleanToolbar from '../components/preview/CleanToolbar';
import DataTable from '../components/preview/DataTable';
import Button from '../components/ui/Button';
import api from '../api/client';

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meta, setMeta] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/datasets/${id}`).then(r => setMeta(r.data)).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/datasets/${id}/data`, { params: { page, size: 50 } })
      .then(r => { setRows(r.data.rows); setTotalRows(r.data.total_rows); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, page]);

  if (!id) return null;

  return (
    <PageShell
      title={meta?.filename || '数据预览'}
      subtitle={`${meta?.row_count?.toLocaleString() || 0} 行 × ${meta?.col_count || 0} 列`}
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={() => navigate('/upload')}>← 返回</Button>
          <Button size="sm" onClick={() => navigate(`/explore/${id}`)}>前往探索 →</Button>
        </>
      }
    >
      {meta && <ColumnStatsPanel columns={meta.columns} />}
      <CleanToolbar />
      <DataTable
        columns={meta?.columns?.map((c: any) => c.name) || []}
        rows={rows}
        totalRows={totalRows}
        page={page}
        pageSize={50}
        onPageChange={setPage}
        loading={loading}
      />
    </PageShell>
  );
}
