import { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  Check,
  CheckCheck
} from 'lucide-react';

export interface ManufacturingAlert {
  id: string;
  title: string;
  category: string;
  severity: string; // CRITICAL, WARNING, INFO
  message: string;
  machineCode: string;
  status: string; // ACTIVE, ACKNOWLEDGED, RESOLVED
  timestamp: string;
}

interface Props {
  alerts: ManufacturingAlert[];
  onAcknowledgeAlert?: (alertId: string) => void;
  onResolveAlert?: (alertId: string) => void;
}

export default function AlertsPanelWidget({ alerts, onAcknowledgeAlert, onResolveAlert }: Props) {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [localAlerts, setLocalAlerts] = useState<ManufacturingAlert[]>(alerts);

  const filteredAlerts = localAlerts.filter(a => {
    return severityFilter === 'ALL' || a.severity.toUpperCase() === severityFilter;
  });

  const handleAck = (id: string) => {
    setLocalAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a));
    if (onAcknowledgeAlert) onAcknowledgeAlert(id);
  };

  const handleResolve = (id: string) => {
    setLocalAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'RESOLVED' } : a));
    if (onResolveAlert) onResolveAlert(id);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: ShieldAlert
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: AlertTriangle
        };
      default:
        return {
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          icon: Info
        };
    }
  };

  return (
    <div className="bg-card/70 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-6">
      
      {/* Header & Severity Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground tracking-tight">Active Plant Anomaly & Alerts Feed</h3>
            <p className="text-xs text-muted-foreground">Thermal spikes, vibration harmonics, quality drifts, and power surge notices</p>
          </div>
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center bg-background/80 p-1 border border-border rounded-xl text-xs">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                severityFilter === sev 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const sevInfo = getSeverityBadge(alert.severity);
          const SevIcon = sevInfo.icon;
          const isResolved = alert.status === 'RESOLVED';
          const isAcked = alert.status === 'ACKNOWLEDGED';

          return (
            <div 
              key={alert.id}
              className={`bg-background/60 border rounded-2xl p-4 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isResolved ? 'opacity-50 border-border/40' : 'border-border/70 hover:border-primary/40'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2.5 rounded-xl border flex-shrink-0 mt-0.5 ${sevInfo.bg}`}>
                  <SevIcon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-foreground">{alert.title}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${sevInfo.bg}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded">
                      {alert.machineCode}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                  <div className="flex items-center space-x-3 text-[10px] text-muted-foreground">
                    <span>Category: <strong className="text-foreground">{alert.category}</strong></span>
                    <span>•</span>
                    <span>Time: <strong className="text-foreground">{alert.timestamp}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 flex-shrink-0 self-end md:self-center">
                {isResolved ? (
                  <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center space-x-1">
                    <CheckCheck className="h-4 w-4" />
                    <span>Resolved</span>
                  </span>
                ) : (
                  <>
                    {!isAcked && (
                      <button
                        onClick={() => handleAck(alert.id)}
                        className="px-3 py-1.5 bg-background border border-border hover:border-primary/50 text-foreground font-bold rounded-xl text-xs transition-all flex items-center space-x-1"
                      >
                        <Check className="h-3.5 w-3.5 text-primary" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 font-bold rounded-xl text-xs transition-all flex items-center space-x-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="p-8 text-center border border-dashed border-border rounded-2xl text-xs text-muted-foreground">
            No alerts matching the selected severity filter.
          </div>
        )}
      </div>
    </div>
  );
}
