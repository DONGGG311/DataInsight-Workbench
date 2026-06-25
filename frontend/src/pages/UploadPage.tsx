import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatasetContext } from '../context/DatasetContext';
import { useToast } from '../components/ui/Toast';
import PageShell from '../components/layout/PageShell';
import DropZone from '../components/upload/DropZone';
import UploadProgress from '../components/upload/UploadProgress';
import SampleDatasetPicker from '../components/upload/SampleDatasetPicker';
import api from '../api/client';

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { dispatch } = useDatasetContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFile = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast('error', '文件过大，最大支持 50MB');
      return;
    }
    setUploading(true);
    setProgress(20);
    try {
      const form = new FormData();
      form.append('file', file);
      setProgress(60);
      const res = await api.post('/datasets', form);
      setProgress(100);
      dispatch({ type: 'SET_DATASET', payload: { ...res.data, currentId: res.data.id } });
      toast('success', `上传成功！${res.data.row_count} 行 × ${res.data.col_count} 列`);
      setTimeout(() => navigate(`/preview/${res.data.id}`), 500);
    } catch (e: any) {
      toast('error', e.message || '上传失败');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <PageShell title="导入数据集" subtitle="上传 CSV 或 Excel 文件开始分析">
      {uploading && <UploadProgress progress={progress} />}
      <div className="max-w-2xl mx-auto space-y-12">
        <DropZone onFile={handleFile} disabled={uploading} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <div className="relative flex justify-center"><span className="px-4 bg-slate-50 text-sm text-slate-400">或者使用示例数据</span></div>
        </div>

        <SampleDatasetPicker onSelect={(id) => toast('info', `示例数据集 "${id}" 即将上线`)} />
      </div>
    </PageShell>
  );
}
