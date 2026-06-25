interface ColumnInfo {
  name: string;
  dtype: string;
  missing_count: number;
}

export default function ColumnStatsPanel({ columns }: { columns: ColumnInfo[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {columns.map(col => (
        <div key={col.name} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm hover:border-indigo-300 transition-all cursor-pointer">
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold text-slate-800 truncate">{col.name}</span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
              col.dtype === 'numeric' ? 'bg-indigo-50 text-indigo-600' :
              col.dtype === 'datetime' ? 'bg-cyan-50 text-cyan-600' :
              'bg-amber-50 text-amber-600'}`}>
              {col.dtype === 'numeric' ? '数字' : col.dtype === 'datetime' ? '日期' : '分类'}
            </span>
          </div>
          {col.missing_count > 0 ? (
            <p className="text-xs text-amber-600 mt-2">⚠ {col.missing_count} 个缺失值</p>
          ) : (
            <p className="text-xs text-emerald-600 mt-2">✓ 数据完整</p>
          )}
        </div>
      ))}
    </div>
  );
}
