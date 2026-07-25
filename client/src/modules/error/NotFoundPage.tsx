import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-[#F8FAFC] px-6 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-xl p-8 text-center shadow-2xl relative z-10">
        <div className="inline-flex p-3.5 bg-secondary/10 text-secondary rounded-full mb-6">
          <HelpCircle className="h-8 w-8 animate-pulse" />
        </div>

        <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-white mt-2">Page Not Found</h2>
        
        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
          The requested URL path does not exist on the IntelliSphere platform or has been relocated to another workspace.
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-6 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 text-xs shadow-md shadow-primary/25"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
}
