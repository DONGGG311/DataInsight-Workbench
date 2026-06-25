interface Props { title: string; data: { rowCount: number; colCount: number; missingTotal: number }; }

export default function StatCard({ title, data }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <h4 className="text-sm font-semibold text-slate-500 mb-4">{title}</h4>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-2xl font-bold text-indigo-600 font-mono">{data.rowCount.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-1">总行数</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-cyan-600 font-mono">{data.colCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">列数</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-600 font-mono">{data.missingTotal}</div>
          <div className="text-[10px] text-slate-400 mt-1">缺失值</div>
        </div>
      </div>
    </div>
  );
}
