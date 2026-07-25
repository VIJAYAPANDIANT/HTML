import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside components:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-[#F8FAFC] px-6 py-12">
          <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-xl p-8 text-center shadow-2xl">
            <div className="inline-flex p-3.5 bg-destructive/10 text-destructive rounded-full mb-6">
              <AlertTriangle className="h-8 w-8 animate-bounce" />
            </div>
            
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Platform Crash Intercepted</h1>
            
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              A rendering loop error occurred inside the layout. Our Error Boundary captured the crash details.
            </p>

            {this.state.error && (
              <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-3 mt-4 text-[10px] font-mono text-destructive text-left overflow-x-auto max-h-32">
                {this.state.error.stack || this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full mt-6 py-2.5 bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 text-xs shadow-md shadow-[#2563EB]/25"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset & Reload Platform</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
