const SAMPLE_DATASETS = [
  { id: 'supermarket', name: '超市销售数据', emoji: '🛒', rows: '1,500', cols: '8' },
  { id: 'temps', name: '全球气温数据', emoji: '🌡️', rows: '2,300', cols: '6' },
  { id: 'stocks', name: '股票收益数据', emoji: '📈', rows: '800', cols: '10' },
];

interface Props {
  onSelect: (id: string) => void;
}

export default function SampleDatasetPicker({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {SAMPLE_DATASETS.map(ds => (
        <button key={ds.id} onClick={() => onSelect(ds.id)}
          className="bg-white border border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md hover:bg-indigo-50/30 transition-all text-left group">
          <span className="text-2xl">{ds.emoji}</span>
          <h3 className="font-semibold text-slate-800 mt-3 group-hover:text-indigo-700">{ds.name}</h3>
          <p className="text-xs text-slate-400 mt-1">{ds.rows} 行 · {ds.cols} 列</p>
          <span className="inline-block mt-3 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">试用 →</span>
        </button>
      ))}
    </div>
  );
}
