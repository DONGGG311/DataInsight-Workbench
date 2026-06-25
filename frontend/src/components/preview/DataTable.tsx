interface Props {
  columns: string[];
  rows: (string | number | null)[][];
  totalRows: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function DataTable({ columns, rows, totalRows, page, pageSize, onPageChange, loading }: Props) {
  const totalPages = Math.ceil(totalRows / pageSize);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 w-12">#</th>
              {columns.map(col => (
                <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length + 1} className="text-center py-12 text-slate-400">加载中...</td></tr>
            ) : rows.map((row, i) => (
              <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-indigo-50/30 transition-colors`}>
                <td className="px-4 py-3 text-sm text-slate-400">{(page - 1) * pageSize + i + 1}</td>
                {row.map((cell, j) => (
                  <td key={j} className={`px-4 py-3 text-sm ${cell === null ? 'bg-amber-50 text-amber-700 italic' : 'text-slate-700'}`}>
                    {cell === null ? '— 缺失 —' : String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50/50">
        <span className="text-sm text-slate-500">共 {totalRows.toLocaleString()} 行</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50">上一页</button>
          <span className="text-sm font-medium text-slate-700">{page} / {totalPages}</span>
          <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50">下一页</button>
        </div>
      </div>
    </div>
  );
}
