export default function CleanToolbar() {
  return (
    <div className="flex items-center gap-3 flex-wrap bg-white rounded-xl border border-slate-200 px-5 py-3">
      <button className="text-sm text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md">填充缺失值 ▾</button>
      <button className="text-sm text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md">去重</button>
      <button className="text-sm text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md">类型转换 ▾</button>
      <button className="text-sm text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md">删除所选列</button>
      <div className="w-px h-5 bg-slate-200 mx-1" />
      <button className="text-sm text-slate-400 px-2 py-1.5 rounded-md" disabled>↩ 撤销</button>
      <button className="text-sm text-slate-400 px-2 py-1.5 rounded-md" disabled>↪ 重做</button>
      <div className="flex-1" />
      <button className="text-sm text-slate-500 hover:text-red-500 px-3 py-1.5 rounded-md">重置数据</button>
    </div>
  );
}
