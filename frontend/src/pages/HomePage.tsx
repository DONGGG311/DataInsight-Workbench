import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const FEATURES = [
  { icon: '📤', title: '数据接入', desc: 'CSV/Excel 拖拽上传，内置经典示例数据集', color: 'bg-indigo-50' },
  { icon: '📊', title: '自动分析', desc: '一键生成完整数据画像，7 种图表全方位洞察', color: 'bg-cyan-50' },
  { icon: '📋', title: '仪表板报告', desc: '自由拖拽排列图表卡片，一键导出数据报告', color: 'bg-amber-50' },
];

export default function HomePage() {
  return (
    <div className="space-y-20">
      <section className="text-center py-16 space-y-8">
        <div className="flex justify-center gap-1 text-4xl">
          <span className="text-indigo-600">◆</span>
          <span className="text-cyan-500">◆</span>
          <span className="text-amber-500">◆</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">数据洞察工作台</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">上传 → 分析 → 探索 → 报告，无需编程</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link to="/upload" className="inline-flex items-center justify-center h-12 px-10 rounded-lg font-semibold text-slate-800 bg-amber-500 hover:bg-amber-600 transition-colors shadow-md">🚀 开始分析</Link>
          <Link to="/upload?sample=1" className="inline-flex items-center justify-center h-12 px-8 rounded-lg font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">📦 试用示例数据</Link>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(f => (
            <Card key={f.title} className="hover:shadow-md transition-shadow p-8 text-center">
              <div className={`w-14 h-14 ${f.color} rounded-xl flex items-center justify-center mx-auto mb-5 text-2xl`}>{f.icon}</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-12">三步开始分析</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          {[{ n: '①', l: '上传', d: '拖拽 CSV 或 Excel' }, { n: '②', l: '分析', d: '一键生成数据画像' }, { n: '③', l: '报告', d: '仪表板自由排列导出' }].map(s => (
            <div key={s.n} className="text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold mx-auto mb-3">{s.n}</div>
              <div className="font-semibold text-slate-800">{s.l}</div>
              <div className="text-sm text-slate-400">{s.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
