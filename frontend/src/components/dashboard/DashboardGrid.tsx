import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import StatCard from './StatCard';
import ChartCard from './ChartCard';
import Spinner from '../ui/Spinner';

interface Card { id: string; type: 'stat' | 'chart'; title: string; data: any; }

interface Props {
  cards: Card[];
  layout: any[];
  onLayoutChange: (layout: any[]) => void;
  loading: boolean;
  error: string | null;
}

export default function DashboardGrid({ cards, layout, onLayoutChange, loading, error }: Props) {
  if (loading) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8 text-indigo-600" /></div>;
  if (error) return <div className="text-center py-20 text-slate-400">{error}</div>;
  if (!cards.length) return <div className="text-center py-20 text-slate-400">暂无数据，请先上传数据集</div>;

  return (
    <GridLayout className="layout" layout={layout} cols={12} rowHeight={80}
      width={Math.min(window.innerWidth - 64, 1280)}
      onLayoutChange={onLayoutChange} draggableHandle=".drag-handle"
      margin={[16, 16]} compactType="vertical">
      {cards.map(card => (
        <div key={card.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="drag-handle flex items-center justify-between px-4 py-2.5 border-b border-slate-100 cursor-grab active:cursor-grabbing hover:bg-slate-50 transition-colors select-none">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 text-xs">⋮⋮</span>
              <h4 className="text-xs font-semibold text-slate-600">{card.title}</h4>
            </div>
          </div>
          <div className="flex-1 p-3 overflow-hidden">
            {card.type === 'stat' ? <StatCard title={card.title} data={card.data} /> : <ChartCard title={card.title} data={card.data} />}
          </div>
        </div>
      ))}
    </GridLayout>
  );
}
