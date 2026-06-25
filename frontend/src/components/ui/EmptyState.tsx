export default function EmptyState({ icon = '📊', title, description }: { icon?: string; title: string; description: string }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-600">{title}</h3>
      <p className="text-sm text-slate-400 mt-1">{description}</p>
    </div>
  );
}
