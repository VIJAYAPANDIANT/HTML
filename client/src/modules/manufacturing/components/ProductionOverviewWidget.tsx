import { 
  BarChart3, 
  TrendingUp, 
  AlertOctagon, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export interface ProductionOverviewData {
  targetUnits: number;
  actualUnits: number;
  scrapUnits: number;
  yieldRate: number;
  defectRate: number;
  throughputPerHour: number;
  hourlyOutputTrend: Array<{ hour: string; target: number; actual: number; scrap: number }>;
  defectCategoryBreakdown: Array<{ category: string; count: number; percentage: number }>;
}

interface Props {
  data: ProductionOverviewData;
}

export default function ProductionOverviewWidget({ data }: Props) {
  const maxHourlyVal = Math.max(...data.hourlyOutputTrend.map(d => Math.max(d.target, d.actual)));

  return (
    <div className="bg-card/70 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-6">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground tracking-tight">Production Output & Defect Overview</h3>
            <p className="text-xs text-muted-foreground">Hourly throughput rate, yield percentage, scrap rate, and defect classification</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-background/80 px-3 py-1.5 border border-border rounded-xl text-xs font-bold">
          <span className="text-muted-foreground">Throughput Rate:</span>
          <span className="text-primary font-mono">{data.throughputPerHour.toLocaleString()} units/hr</span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Target Units</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-foreground">{data.targetUnits.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">100% baseline</span>
          </div>
        </div>

        <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Actual Produced</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">{data.actualUnits.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> {Math.round((data.actualUnits / data.targetUnits) * 100)}%
            </span>
          </div>
        </div>

        <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Yield Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-primary">{data.yieldRate}%</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <ShieldCheck className="h-3 w-3 mr-0.5" /> Optimal
            </span>
          </div>
        </div>

        <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Scrap & Defect</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-rose-400">{data.scrapUnits} units</span>
            <span className="text-xs font-bold text-rose-400">{data.defectRate}% defect</span>
          </div>
        </div>

      </div>

      {/* Hourly Production Graph & Defect Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Output Bar Visualization */}
        <div className="lg:col-span-2 bg-background/50 border border-border/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Hourly Output Trend (Target vs. Actual)</span>
            </h4>
            <div className="flex items-center space-x-4 text-[11px] font-semibold">
              <span className="flex items-center space-x-1">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-500/50" />
                <span className="text-muted-foreground">Target</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-foreground">Actual</span>
              </span>
            </div>
          </div>

          <div className="h-52 flex items-end justify-between gap-3 pt-6 px-2">
            {data.hourlyOutputTrend.map((item, idx) => {
              const targetHeight = Math.round((item.target / maxHourlyVal) * 100);
              const actualHeight = Math.round((item.actual / maxHourlyVal) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    {/* Target Bar */}
                    <div 
                      className="w-2.5 bg-slate-600/40 rounded-t-sm transition-all group-hover:bg-slate-500/60"
                      style={{ height: `${targetHeight}%` }}
                      title={`Target: ${item.target}`}
                    />
                    {/* Actual Bar */}
                    <div 
                      className={`w-3.5 rounded-t-sm transition-all ${
                        item.actual >= item.target ? 'bg-primary group-hover:bg-primary/90' : 'bg-amber-500 group-hover:bg-amber-400'
                      }`}
                      style={{ height: `${actualHeight}%` }}
                      title={`Actual: ${item.actual}`}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono mt-2">{item.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Defect Distribution Breakdown */}
        <div className="bg-background/50 border border-border/60 rounded-xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-foreground flex items-center space-x-2">
            <AlertOctagon className="h-4 w-4 text-rose-400" />
            <span>Defect Categorization</span>
          </h4>

          <div className="space-y-3">
            {data.defectCategoryBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{item.category}</span>
                  <span className="font-bold text-foreground">{item.count} units ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
            <span>AI Defect Reduction: </span>
            <span className="text-emerald-400 font-semibold">Micro-fissure welding thermal profile applied</span>
          </div>
        </div>

      </div>
    </div>
  );
}
