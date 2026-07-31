import { 
  Users, 
  Clock, 
  UserCheck, 
  ArrowRight
} from 'lucide-react';

export interface ShiftSummary {
  name: string;
  supervisor: string;
  targetUnits: number;
  actualUnits: number;
  downtimeMinutes: number;
  oeePercentage: number;
  status: string; // COMPLETED, ACTIVE, UPCOMING
}

export interface ShiftPerformanceData {
  currentShift: string;
  activeSupervisor: string;
  currentShiftProgress: number;
  shifts: ShiftSummary[];
}

interface Props {
  data: ShiftPerformanceData;
}

export default function ShiftPerformanceWidget({ data }: Props) {
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'COMPLETED':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'UPCOMING':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="bg-card/70 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground tracking-tight">Shift Performance & Handover</h3>
            <p className="text-xs text-muted-foreground">Operational shift productivity, operator leads, downtime log, and shift-by-shift OEE</p>
          </div>
        </div>

        {/* Current Active Shift Badge */}
        <div className="bg-background/80 border border-border/80 rounded-xl p-3 flex items-center space-x-3">
          <UserCheck className="h-5 w-5 text-emerald-400" />
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold block">Active Supervisor</span>
            <span className="text-xs font-extrabold text-foreground">{data.activeSupervisor}</span>
          </div>
        </div>
      </div>

      {/* Active Shift Live Progress Bar */}
      <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground flex items-center space-x-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span>Current Active Shift: {data.currentShift}</span>
          </span>
          <span className="font-extrabold text-primary">{data.currentShiftProgress}% Time Elapsed</span>
        </div>
        <div className="w-full bg-secondary/20 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-purple-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${data.currentShiftProgress}%` }}
          />
        </div>
      </div>

      {/* Shift Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {data.shifts.map((shift, idx) => {
          const completion = Math.round((shift.actualUnits / shift.targetUnits) * 100);

          return (
            <div 
              key={idx}
              className="bg-background/60 border border-border/70 rounded-2xl p-5 hover:border-primary/50 transition-all shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-foreground">{shift.name}</span>
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-md border uppercase ${getStatusBadge(shift.status)}`}>
                    {shift.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span>Supervisor: </span>
                  <span className="text-foreground font-semibold">{shift.supervisor}</span>
                </div>

                {/* Target vs Actual */}
                <div className="p-3 bg-card/50 border border-border/40 rounded-xl space-y-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-muted-foreground">Produced Units</span>
                    <span className="font-extrabold text-foreground">{shift.actualUnits.toLocaleString()} / {shift.targetUnits.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${completion >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(completion, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground block text-right font-medium">{completion}% completion rate</span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-background/90 border border-border/50 rounded-xl">
                    <span className="text-[10px] text-muted-foreground block">Downtime</span>
                    <span className={`font-bold ${shift.downtimeMinutes > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {shift.downtimeMinutes} mins
                    </span>
                  </div>

                  <div className="p-2.5 bg-background/90 border border-border/50 rounded-xl">
                    <span className="text-[10px] text-muted-foreground block">Shift OEE</span>
                    <span className="font-bold text-primary">{shift.oeePercentage}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                <span>Handover Log</span>
                <span className="text-primary font-bold hover:underline cursor-pointer flex items-center">
                  View Notes <ArrowRight className="h-3 w-3 ml-1" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
