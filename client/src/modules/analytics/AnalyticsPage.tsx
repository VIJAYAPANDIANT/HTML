import { AreaChart, Eye, Filter } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card border border-border rounded-xl p-4">
        <div className="flex space-x-3 items-center">
          <AreaChart className="h-6 w-6 text-secondary" />
          <div>
            <h3 className="font-bold text-white text-sm">Simulation Analytics Sandbox</h3>
            <p className="text-xs text-muted-foreground">Adjust simulation scenarios and chart real-time modeling probabilities.</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg text-xs transition-colors">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg text-xs transition-colors">
            <Eye className="h-3.5 w-3.5" />
            <span>Run Scenario</span>
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 h-96 flex flex-col items-center justify-center text-muted-foreground">
        <AreaChart className="h-16 w-16 mb-4 text-muted-foreground/30" />
        <p className="font-semibold text-lg text-white mb-1">Scenario Analyzer Graph</p>
        <p className="text-sm text-center max-w-sm mb-4">Launch a new decision optimization run to generate probability plots, risk distributions, and path graphs.</p>
        <div className="h-8 w-64 border border-dashed border-border rounded-full flex items-center justify-center text-[10px] uppercase font-bold tracking-wider">
          [Interactive ECharts Dynamic Canvas]
        </div>
      </div>
    </div>
  );
}
