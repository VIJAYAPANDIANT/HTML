import { 
  Gauge, 
  Target, 
  TrendingUp, 
  Cpu, 
  Users, 
  Layers 
} from 'lucide-react';

interface ProductionLine {
  id: string;
  name: string;
  status: string;
  target: number;
  actual: number;
  oee: number;
}

interface FactoryOverviewData {
  plantName: string;
  location: string;
  plantStatus: string;
  overallOee: number;
  availabilityScore: number;
  performanceScore: number;
  qualityScore: number;
  activeLinesCount: number;
  totalLinesCount: number;
  activeMachinesCount: number;
  totalMachinesCount: number;
  activeWorkersCount: number;
  dailyOutputTarget: number;
  currentDailyOutput: number;
  targetCompletionPercentage: number;
  productionLines: ProductionLine[];
}

interface Props {
  data: FactoryOverviewData;
  onSelectLine?: (lineName: string) => void;
}

export default function FactoryOverviewWidget({ data, onSelectLine }: Props) {
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPERATIONAL':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'DEGRADED':
      case 'WARNING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Overall OEE Card */}
        <div className="bg-card/70 border border-border/80 rounded-2xl p-5 backdrop-blur-md hover:border-primary/50 transition-all shadow-md group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overall OEE</span>
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
              <Gauge className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">{data.overallOee}%</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" /> +2.4% vs last week
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-1 pt-3 border-t border-border/50 text-[11px]">
            <div>
              <span className="text-muted-foreground block text-[10px]">Availability</span>
              <span className="font-bold text-foreground">{data.availabilityScore}%</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Performance</span>
              <span className="font-bold text-foreground">{data.performanceScore}%</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Quality</span>
              <span className="font-bold text-foreground">{data.qualityScore}%</span>
            </div>
          </div>
        </div>

        {/* Daily Production Output Card */}
        <div className="bg-card/70 border border-border/80 rounded-2xl p-5 backdrop-blur-md hover:border-primary/50 transition-all shadow-md group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Daily Output</span>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-foreground tracking-tight">
                {data.currentDailyOutput.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">Target: {data.dailyOutputTarget.toLocaleString()}</span>
            </div>
            <div className="w-full bg-secondary/20 h-2.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(data.targetCompletionPercentage, 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground mt-1.5 block text-right font-medium">
              {data.targetCompletionPercentage}% of target achieved
            </span>
          </div>
        </div>

        {/* Active Lines & Machines */}
        <div className="bg-card/70 border border-border/80 rounded-2xl p-5 backdrop-blur-md hover:border-primary/50 transition-all shadow-md group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plant Telemetry</span>
            <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform">
              <Cpu className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-muted-foreground block">Active Lines</span>
              <span className="text-xl font-bold text-foreground">{data.activeLinesCount} / {data.totalLinesCount}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Monitored CNCs</span>
              <span className="text-xl font-bold text-foreground">{data.activeMachinesCount} / {data.totalMachinesCount}</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span>Plant Status</span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase ${getStatusBadge(data.plantStatus)}`}>
              {data.plantStatus}
            </span>
          </div>
        </div>

        {/* Active Workforce */}
        <div className="bg-card/70 border border-border/80 rounded-2xl p-5 backdrop-blur-md hover:border-primary/50 transition-all shadow-md group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Floor Workforce</span>
            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">{data.activeWorkersCount}</span>
            <span className="text-xs text-muted-foreground ml-2">Operators & Engineers</span>
          </div>
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span>Shift 1 Active</span>
            <span className="text-foreground font-semibold">100% Staffed</span>
          </div>
        </div>

      </div>

      {/* Production Lines Overview Cards */}
      <div className="bg-card/70 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-md">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Production Line Operations</h3>
              <p className="text-xs text-muted-foreground">Real-time throughput, status badges, and line OEE efficiency ratings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.productionLines.map((line) => {
            const completion = Math.round((line.actual / line.target) * 100);
            return (
              <div 
                key={line.id} 
                onClick={() => onSelectLine && onSelectLine(line.name)}
                className="bg-background/60 border border-border/70 rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-foreground tracking-wide truncate">{line.name}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase ${getStatusBadge(line.status)}`}>
                    {line.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-muted-foreground">Output</span>
                    <span className="font-bold text-foreground">{line.actual.toLocaleString()} / {line.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-secondary/20 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${completion >= 90 ? 'bg-emerald-500' : completion >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                      style={{ width: `${Math.min(completion, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Line OEE</span>
                  <span className="font-extrabold text-primary">{line.oee}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
