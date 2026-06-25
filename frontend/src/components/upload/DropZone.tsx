import { useState, useCallback, DragEvent, ChangeEvent } from 'react';

interface Props {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export default function DropZone({ onFile, disabled }: Props) {
  const [dragging, setDragging] = useState(false);

  const handleDrag = useCallback((e: DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDragIn = useCallback((e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }, []);
  const handleDragOut = useCallback((e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragging(false); }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && !disabled) onFile(file);
  }, [onFile, disabled]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !disabled) onFile(file);
  }, [onFile, disabled]);

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200
        ${dragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      onDragEnter={handleDragIn} onDragLeave={handleDragOut} onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input id="file-input" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleChange} />
      <div className="space-y-4">
        <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-slate-700">
          拖拽文件到此处，或<span className="text-indigo-600">点击选择</span>
        </p>
        <p className="text-sm text-slate-400">支持 .csv / .xlsx / .xls · 最大 50MB</p>
      </div>
    </div>
  );
}
