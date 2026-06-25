import Spinner from '../ui/Spinner';

export default function UploadProgress({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 w-96 text-center">
        <Spinner className="w-10 h-10 text-indigo-600 mx-auto" />
        <p className="font-semibold text-slate-800 mt-4">正在解析数据...</p>
        <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
          <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-2">{progress}%</p>
      </div>
    </div>
  );
}
