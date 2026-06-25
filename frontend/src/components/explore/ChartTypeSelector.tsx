const CHART_TYPES = [
  { type: 'bar', label: '柱状', icon: '📊' },
  { type: 'line', label: '折线', icon: '📈' },
  { type: 'scatter', label: '散点', icon: '🔵' },
  { type: 'pie', label: '饼图', icon: '🍩' },
  { type: 'histogram', label: '直方', icon: '📶' },
  { type: 'boxplot', label: '箱线', icon: '📦' },
  { type: 'heatmap', label: '热力', icon: '🔥' },
];

interface Props {
  selected: string;
  onSelect: (type: string) => void;
}

export default function ChartTypeSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {CHART_TYPES.map(chart => (
        <button key={chart.type} onClick={() => onSelect(chart.type)}
          className={`flex flex-col items-center gap-1 p-2.5 rounded-lg text-xs font-medium transition-all
            ${selected === chart.type
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
              : 'bg-slate-50 text-slate-500 border border-transparent hover:bg-slate-100'}`}>
          <span className="text-lg">{chart.icon}</span>
          {chart.label}
        </button>
      ))}
    </div>
  );
}
