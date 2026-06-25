import ChartTypeSelector from './ChartTypeSelector';

interface ColumnInfo { name: string; dtype: string; }
interface Props {
  columns: ColumnInfo[];
  config: { chartType: string; xField: string; yField: string; groupBy: string; filters: any[] };
  onChange: (key: string, value: any) => void;
  onAddFilter: () => void;
  onRemoveFilter: (i: number) => void;
  onRefresh: () => void;
}

export default function FieldPanel({ columns, config, onChange, onAddFilter, onRemoveFilter, onRefresh }: Props) {
  const numCols = columns.filter(c => c.dtype === 'numeric');
  const catCols = columns.filter(c => c.dtype === 'categorical' || c.dtype === 'datetime');
  const allCols = [...numCols, ...catCols];

  return (
    <aside className="w-[280px] shrink-0">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-3">图表类型</label>
          <ChartTypeSelector selected={config.chartType} onSelect={v => onChange('chartType', v)} />
        </div>

        <SelectField label="X 轴" value={config.xField}
          options={allCols} onChange={v => onChange('xField', v)} placeholder="选择字段..." />
        <SelectField label="Y 轴" value={config.yField}
          options={numCols} onChange={v => onChange('yField', v)} placeholder="选择字段..." />
        <SelectField label="分组 (可选)" value={config.groupBy}
          options={catCols} onChange={v => onChange('groupBy', v)} placeholder="无分组" optional />

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">筛选条件</label>
          {config.filters.map((f, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <select value={f.column} onChange={e => { const nf = [...config.filters]; nf[i].column = e.target.value; onChange('filters', nf); }}
                className="flex-1 h-9 px-2 rounded-md border border-slate-200 text-xs bg-white outline-none">
                <option value="">字段</option>
                {allCols.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <select value={f.op} onChange={e => { const nf = [...config.filters]; nf[i].op = e.target.value; onChange('filters', nf); }}
                className="w-16 h-9 px-2 rounded-md border border-slate-200 text-xs bg-white outline-none">
                <option value="=">=</option><option value="!=">≠</option>
              </select>
              <input value={f.value} onChange={e => { const nf = [...config.filters]; nf[i].value = e.target.value; onChange('filters', nf); }}
                className="flex-1 h-9 px-2 rounded-md border border-slate-200 text-xs bg-white outline-none" />
              <button onClick={() => onRemoveFilter(i)} className="text-slate-400 hover:text-red-500">×</button>
            </div>
          ))}
          <button onClick={onAddFilter} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">+ 添加条件</button>
        </div>

        <hr className="border-slate-200" />
        <div className="flex gap-2">
          <button onClick={onRefresh} className="flex-1 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">刷新图表</button>
        </div>
      </div>
    </aside>
  );
}

function SelectField({ label, value, options, onChange, placeholder, optional }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm outline-none
                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/20 transition-colors
                   ${optional ? 'text-slate-400' : 'text-slate-700'}`}>
        <option value="">{placeholder}</option>
        {options.map((c: any) => <option key={c.name} value={c.name}>{c.name}</option>)}
      </select>
    </div>
  );
}
