import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DatasetProvider } from './context/DatasetContext';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
        <p className="text-slate-400">页面开发中...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DatasetProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
            <Routes>
              <Route path="/" element={<PlaceholderPage title="首页" />} />
              <Route path="/upload" element={<PlaceholderPage title="数据上传" />} />
              <Route path="/preview/:id" element={<PlaceholderPage title="数据预览" />} />
              <Route path="/explore/:id" element={<PlaceholderPage title="图表探索" />} />
              <Route path="/dashboard/:id" element={<PlaceholderPage title="仪表板报告" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </DatasetProvider>
  );
}
