import { Component, ReactNode } from 'react';

interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-slate-800 mb-2">出错了</h1>
            <p className="text-slate-500 mb-4">{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              刷新页面
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
