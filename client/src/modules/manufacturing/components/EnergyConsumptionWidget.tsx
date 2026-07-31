import { 
  Zap, 
  AlertTriangle, 
  TrendingDown, 
  Sparkles, 
  Layers
} from 'lucide-react';

export interface EnergyConsumptionData {
  currentKwh: number;
  dailyKwhTotal: number;
  costTodayUsd: number;
  efficiencyKwhPerUnit: number;
  peakDemandMw: number;
  carbonFootprintKg: number;
  peakWarning: boolean;
  energyRating: string;
  hourlyUsageTrend: Array<{ time: string; kwh: number; cost: number }>;
  lineEnergyBreakdown: Array<{ line: string; kwh: number; share: number }>;
}

interface Props {
  data: EnergyConsumptionData;
  onOptimizeEnergy?: () => void;
  optimizing?: boolean;
}

export default function EnergyConsumptionWidget({ data, onOptimizeEnergy, optimizing }: Props) {
  const maxKwh = Math.max(...data.hourlyUsageTrend.map(d => d.kwh));

  return (
    <div className="bg-card/70 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground tracking-tight">Energy Consumption & Efficiency</h3>
            <p className="text-xs text-muted-foreground">Power grid load, kWh cost tracking, peak demand tariffs, and carbon footprint telemetry</p>
          </div>
        </div>

        {/* AI Optimize Button */}
        <button
          onClick={onOptimizeEnergy}
          disabled={optimizing}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          <span>{optimizing ? 'Optimizing Grid Load...' : 'Run AI Energy Optimization'}</span>
        </button>
      </div>

      {/* Peak Demand Warning Alert Banner */}
      {data.peakWarning && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3 text-amber-400 text-xs font-semibold">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>Peak Demand Notice: Plant grid load at {data.peakDemandMw} MW. High tariff rate active (14:00 - 16:00).</span>
          </div>
          <span className="text-[11px] text-amber-300 font-bold underline cursor-pointer">View Load Shift Strategy</span>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Power Load (Now)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-400">{data.currentKwh.toLocaleString()} kWh</span>
            <span className="text-xs text-muted-foreground font-mono">{data.peakDemandMw} MW</span>
          </div>
        </div>

        <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Energy Cost Today</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-foreground">${data.costTodayUsd.toLocaleString()}</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <TrendingDown className="h-3 w-3 mr-0.5" /> -8.2% vs avg
            </span>
          </div>
        </div>

        <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Efficiency per Unit</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-primary">{data.efficiencyKwhPerUnit} kWh</span>
            <span className="text-xs text-muted-foreground">per unit output</span>
          </div>
        </div>

        <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Carbon Impact</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">{data.carbonFootprintKg.toLocaleString()} kg</span>
            <span className="text-xs font-bold text-emerald-400">{data.energyRating}</span>
          </div>
        </div>

      </div>

      {/* Hourly Trend & Line Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly kWh Graph */}
        <div className="lg:col-span-2 bg-background/50 border border-border/60 rounded-xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-foreground flex items-center space-x-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Hourly Power Draw (kWh Trend)</span>
          </h4>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {data.hourlyUsageTrend.map((item, idx) => {
              const heightPct = Math.round((item.kwh / maxKwh) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div 
                    className="w-full bg-amber-500/80 group-hover:bg-amber-400 rounded-t-md transition-all relative"
                    style={{ height: `${heightPct}%` }}
                    title={`${item.kwh} kWh ($${item.cost})`}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-card px-1.5 py-0.5 rounded border font-mono text-foreground whitespace-nowrap">
                      {item.kwh} kWh
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono mt-2">{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Line Energy Breakdown */}
        <div className="bg-background/50 border border-border/60 rounded-xl p-5 space-y-4">
          <h4 className="text-sm font-bold text-foreground flex items-center space-x-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Line Consumption Share</span>
          </h4>

          <div className="space-y-3">
            {data.lineEnergyBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{item.line}</span>
                  <span className="font-bold text-foreground">{item.kwh.toLocaleString()} kWh ({item.share}%)</span>
                </div>
                <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all" 
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Eco Rating: </span>
            <span className="text-emerald-400 font-extrabold">{data.energyRating}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
