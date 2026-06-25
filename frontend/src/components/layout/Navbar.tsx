import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: '首页' },
  { path: '/upload', label: '数据集' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex gap-0.5">
            <span className="w-2 h-2 rounded-sm bg-indigo-600" />
            <span className="w-2 h-2 rounded-sm bg-cyan-500" />
            <span className="w-2 h-2 rounded-sm bg-amber-500" />
          </span>
          <span className="font-bold text-slate-800 text-lg">DataInsight</span>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${pathname === item.path ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
