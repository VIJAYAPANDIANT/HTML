import { useState } from 'react';
import { 
  Cpu, 
  Search, 
  Activity, 
  Thermometer, 
  RotateCw, 
  Gauge, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export interface MachineStatus {
  id: string;
  name: string;
  machineCode: string;
  type: string;
  productionLine: string;
  status: string; // OPERATIONAL, WARNING, CRITICAL, MAINTENANCE, IDLE
  healthScore: number; // 0 - 100
  temperature: number; // °C
  vibration: number; // mm/s
  spindleSpeed: number; // RPM
  hydraulicPressure: number; // PSI
  ageMonths: number;
  lastMaintenance: string;
  nextMaintenance: string;
  failureRisk: string;
}

interface Props {
  machines: MachineStatus[];
  onRunSimulation?: (machine: MachineStatus) => void;
}

export default function MachineMonitoringWidget({ machines, onRunSimulation }: Props) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredMachines = machines.filter(m => {
    const matchesStatus = filterStatus === 'ALL' || m.status.toUpperCase() === filterStatus;
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.machineCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.productionLine.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPERATIONAL':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: AlertTriangle
        };
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: ShieldAlert
        };
      case 'MAINTENANCE':
        return {
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          icon: Wrench
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          icon: Activity
        };
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
    if (score >= 65) return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/50 bg-rose-500/10';
  };

  return (
    <div className="bg-card/70 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground tracking-tight">Machine Telemetry & Monitoring</h3>
            <p className="text-xs text-muted-foreground">Real-time IoT sensor readings, thermal state, vibration harmonics, and AI health scores</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search machine, code, line..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background/80 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-background/80 p-1 border border-border rounded-xl text-xs">
            {['ALL', 'OPERATIONAL', 'WARNING', 'CRITICAL', 'MAINTENANCE'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterStatus === status 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Machine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMachines.map((machine) => {
          const statusInfo = getStatusBadge(machine.status);
          const StatusIcon = statusInfo.icon;
          const healthBadgeStyle = getHealthColor(machine.healthScore);

          return (
            <div 
              key={machine.id}
              className="bg-background/60 border border-border/70 rounded-2xl p-5 hover:border-primary/50 transition-all shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Machine Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm text-foreground">{machine.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[11px] font-mono text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">
                        {machine.machineCode}
                      </span>
                      <span className="text-[11px] text-muted-foreground">• {machine.type}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border flex items-center space-x-1 ${statusInfo.bg}`}>
                    <StatusIcon className="h-3 w-3" />
                    <span>{machine.status}</span>
                  </span>
                </div>

                <div className="mt-2 text-[11px] text-muted-foreground">
                  <span>Line: </span>
                  <span className="text-foreground font-semibold">{machine.productionLine}</span>
                </div>

                {/* Health Score & Failure Risk */}
                <div className="mt-4 p-3 bg-card/50 border border-border/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center font-extrabold text-sm ${healthBadgeStyle}`}>
                      {machine.healthScore}
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Health Score</span>
                      <span className="text-xs font-bold text-foreground">
                        {machine.healthScore >= 85 ? 'Optimal Condition' : machine.healthScore >= 65 ? 'Moderate Wear' : 'Action Required'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block font-semibold uppercase">Failure Risk</span>
                    <span className={`text-xs font-bold ${machine.failureRisk.includes('Severe') || machine.failureRisk.includes('High') ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {machine.failureRisk}
                    </span>
                  </div>
                </div>

                {/* Telemetry Metrics Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-background/90 border border-border/50 rounded-xl flex items-center space-x-2">
                    <Thermometer className={`h-4 w-4 ${machine.temperature > 85 ? 'text-rose-400' : 'text-amber-400'}`} />
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Temp</span>
                      <span className="font-bold text-foreground">{machine.temperature}°C</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-background/90 border border-border/50 rounded-xl flex items-center space-x-2">
                    <Activity className={`h-4 w-4 ${machine.vibration > 4.5 ? 'text-rose-400' : 'text-cyan-400'}`} />
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Vibration</span>
                      <span className="font-bold text-foreground">{machine.vibration} mm/s</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-background/90 border border-border/50 rounded-xl flex items-center space-x-2">
                    <RotateCw className="h-4 w-4 text-purple-400" />
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Spindle</span>
                      <span className="font-bold text-foreground">{machine.spindleSpeed} RPM</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-background/90 border border-border/50 rounded-xl flex items-center space-x-2">
                    <Gauge className="h-4 w-4 text-blue-400" />
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Pressure</span>
                      <span className="font-bold text-foreground">{machine.hydraulicPressure} PSI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-[10px] text-muted-foreground">Age: {machine.ageMonths} mos</span>
                <button
                  onClick={() => onRunSimulation && onRunSimulation(machine)}
                  className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-bold rounded-lg transition-all flex items-center space-x-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Diagnostics</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMachines.length === 0 && (
        <div className="p-12 text-center border border-dashed border-border rounded-2xl">
          <Cpu className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-foreground">No Machines Found</h4>
          <p className="text-xs text-muted-foreground">Try adjusting search term or status filter tab.</p>
        </div>
      )}
    </div>
  );
}
