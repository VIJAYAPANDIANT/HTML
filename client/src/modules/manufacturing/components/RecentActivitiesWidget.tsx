import { 
  Activity, 
  Cpu, 
  Wrench, 
  Users, 
  Bell, 
  CheckCircle2,
  Clock
} from 'lucide-react';

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  type: string; // MACHINE, MAINTENANCE, SHIFT, ALERT, SYSTEM
  timestamp: string;
  operator: string;
}

interface Props {
  activities: ActivityLog[];
}

export default function RecentActivitiesWidget({ activities }: Props) {
  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'MACHINE':
        return <Cpu className="h-4 w-4 text-cyan-400" />;
      case 'MAINTENANCE':
        return <Wrench className="h-4 w-4 text-amber-400" />;
      case 'SHIFT':
        return <Users className="h-4 w-4 text-purple-400" />;
      case 'ALERT':
        return <Bell className="h-4 w-4 text-rose-400" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <div className="bg-card/70 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-5">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-foreground tracking-tight">Recent Plant Audit & Events Log</h3>
            <p className="text-xs text-muted-foreground">Chronological audit stream of machine status changes and operator actions</p>
          </div>
        </div>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
        {activities.map((act) => (
          <div key={act.id} className="relative flex items-start justify-between bg-background/50 border border-border/50 rounded-xl p-3.5 hover:border-primary/40 transition-all text-xs">
            
            {/* Timeline node icon */}
            <div className="absolute -left-[23px] top-4 p-1 rounded-full bg-card border border-border shadow-sm">
              {getTypeIcon(act.type)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-foreground">{act.title}</span>
                <span className="text-[10px] font-mono text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
                  {act.type}
                </span>
              </div>
              <p className="text-muted-foreground text-xs">{act.description}</p>
              <span className="text-[10px] text-primary font-semibold block pt-0.5">Operator: {act.operator}</span>
            </div>

            <div className="text-[10px] text-muted-foreground font-mono flex items-center space-x-1 whitespace-nowrap ml-4">
              <Clock className="h-3 w-3" />
              <span>{act.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
