import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Bell, 
  ShieldAlert, 
  Clock, 
  Loader2,
  Trash2,
  Check
} from 'lucide-react';
import api from '@/lib/axios';

interface ManufacturingAlert {
  id: string;
  title: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  machineCode: string;
  status: string;
  timestamp: string;
}

interface SmartCityAlert {
  id: string;
  title: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  status: string;
  timestamp: string;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'system' | 'manufacturing' | 'smartcity'>('system');
  const [mfgAlerts, setMfgAlerts] = useState<ManufacturingAlert[]>([]);
  const [scAlerts, setScAlerts] = useState<SmartCityAlert[]>([]);
  const [loading, setLoading] = useState(false);

  // System alerts mock
  const [sysAlerts, setSysAlerts] = useState([
    { id: 1, text: 'Model optimization run completed successfully: Asset Rebalancing.', type: 'success', time: '10 mins ago', icon: CheckCircle2, color: 'text-secondary bg-secondary/10' },
    { id: 2, text: 'Unusual boundary inputs detected in Monte Carlo pipeline. Results may be skewed.', type: 'warning', time: '1 hour ago', icon: AlertTriangle, color: 'text-accent bg-accent/10' },
    { id: 3, text: 'Daily database backup cron job completed.', type: 'info', time: '5 hours ago', icon: Info, color: 'text-primary bg-primary/10' },
  ]);

  const fetchMfgAlerts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/manufacturing/dashboard');
      if (response.data && response.data.alerts) {
        setMfgAlerts(response.data.alerts);
      }
    } catch (err) {
      console.error('Failed to load manufacturing alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchScAlerts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/smartcity/dashboard');
      if (response.data && response.data.alerts) {
        setScAlerts(response.data.alerts);
      }
    } catch (err) {
      console.error('Failed to load smart city alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMfgAlerts();
    fetchScAlerts();
  }, []);

  const handleAcknowledgeMfg = async (id: string) => {
    try {
      await api.post(`/api/v1/manufacturing/alerts/${id}/acknowledge`);
      setMfgAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const handleResolveMfg = async (id: string) => {
    try {
      await api.post(`/api/v1/manufacturing/alerts/${id}/resolve`);
      setMfgAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  const handleAcknowledgeSc = async (id: string) => {
    try {
      await api.post(`/api/smartcity/alerts/${id}/acknowledge`);
      setScAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a));
    } catch (err) {
      console.error('Failed to acknowledge smart city alert:', err);
    }
  };

  const handleResolveSc = async (id: string) => {
    try {
      await api.post(`/api/smartcity/alerts/${id}/resolve`);
      setScAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to resolve smart city alert:', err);
    }
  };

  const handleClearAllSys = () => {
    setSysAlerts([]);
  };

  // Severities counts
  const criticalCountMfg = mfgAlerts.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
  const highCountMfg = mfgAlerts.filter(a => a.severity === 'HIGH' && a.status === 'ACTIVE').length;
  const warningCountMfg = mfgAlerts.filter(a => (a.severity === 'MEDIUM' || a.severity === 'LOW') && a.status === 'ACTIVE').length;

  const criticalCountSc = scAlerts.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
  const highCountSc = scAlerts.filter(a => a.severity === 'HIGH' && a.status === 'ACTIVE').length;
  const warningCountSc = scAlerts.filter(a => (a.severity === 'MEDIUM' || a.severity === 'LOW') && a.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      
      {/* Header and Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Bell className="h-5.5 w-5.5 text-primary" />
            <span>Alert & Notification Hub</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Review operational diagnostics, webhook updates, and smart machinery notifications.</p>
        </div>

        <div className="flex bg-muted/20 p-1 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'system' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white'
            }`}
          >
            System Logs ({sysAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab('manufacturing')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'manufacturing' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white'
            }`}
          >
            Mfg Smart Alerts ({mfgAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab('smartcity')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'smartcity' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white'
            }`}
          >
            Smart City Alerts ({scAlerts.length})
          </button>
        </div>
      </div>

      {activeTab === 'system' && (
        /* System Alerts View */
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">Recent server events</span>
            {sysAlerts.length > 0 && (
              <button 
                onClick={handleClearAllSys}
                className="text-secondary hover:underline font-semibold flex items-center space-x-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear all notifications</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {sysAlerts.map((al) => (
              <div key={al.id} className="bg-card border border-border rounded-xl p-4 flex items-start space-x-4 shadow">
                <div className={`p-2 rounded-lg flex-shrink-0 ${al.color}`}>
                  <al.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white leading-relaxed">{al.text}</p>
                  <span className="text-[10px] text-muted-foreground mt-1 block">{al.time}</span>
                </div>
              </div>
            ))}
            {sysAlerts.length === 0 && (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No pending system notifications.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'manufacturing' && (
        /* Manufacturing Smart Alerts View */
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Critical Failures</span>
                <span className="text-2xl font-extrabold text-white mt-1 block">{criticalCountMfg}</span>
              </div>
              <ShieldAlert className="h-7 w-7 text-destructive animate-pulse" />
            </div>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">High Priority</span>
                <span className="text-2xl font-extrabold text-white mt-1 block">{highCountMfg}</span>
              </div>
              <AlertTriangle className="h-7 w-7 text-accent" />
            </div>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Warnings</span>
                <span className="text-2xl font-extrabold text-white mt-1 block">{warningCountMfg}</span>
              </div>
              <Info className="h-7 w-7 text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Real-time Smart Telemetry Alerts</span>
              <button 
                onClick={fetchMfgAlerts}
                className="text-secondary hover:underline font-semibold flex items-center space-x-1"
              >
                <span>Refresh notifications</span>
              </button>
            </div>

            {loading ? (
              <div className="h-32 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Polling alerts stream...</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {mfgAlerts.map((alert) => {
                  const isCritical = alert.severity === 'CRITICAL';
                  const isHigh = alert.severity === 'HIGH';

                  return (
                    <div 
                      key={alert.id} 
                      className={`bg-card border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow transition-all ${
                        isCritical 
                          ? 'border-destructive/30 hover:border-destructive/50' 
                          : isHigh 
                          ? 'border-accent/30 hover:border-accent/50' 
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative mt-1">
                          <span className={`h-2.5 w-2.5 rounded-full block ${
                            isCritical ? 'bg-destructive' : isHigh ? 'bg-accent' : 'bg-primary'
                          }`} />
                          {isCritical && (
                            <span className="absolute -inset-0.5 rounded-full bg-destructive animate-ping opacity-75" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-white">{alert.title}</span>
                            <span className="text-[10px] text-muted-foreground font-bold">•</span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{alert.machineCode}</span>
                            <span className="text-[10px] text-muted-foreground font-bold">•</span>
                            <span className="text-[9px] text-muted-foreground uppercase font-semibold">{alert.category}</span>
                          </div>
                          
                          <p className="text-xs text-slate-350 leading-relaxed pr-6">{alert.message}</p>
                          
                          <div className="flex items-center space-x-2 pt-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{alert.timestamp}</span>
                            <span>•</span>
                            <span className={`font-semibold ${
                              isCritical ? 'text-destructive' : isHigh ? 'text-accent' : 'text-primary'
                            }`}>
                              {alert.severity} SEVERITY
                            </span>
                            {alert.status !== 'ACTIVE' && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-500 font-bold uppercase tracking-wider flex items-center space-x-0.5">
                                  <Check className="h-3 w-3" />
                                  <span>{alert.status}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 sm:self-center self-end">
                        {alert.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleAcknowledgeMfg(alert.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-350 font-bold rounded-lg text-[10px] transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => handleResolveMfg(alert.id)}
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-500 font-bold rounded-lg text-[10px] transition-colors"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  );
                })}
                {mfgAlerts.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No pending manufacturing alerts.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'smartcity' && (
        /* Smart City Smart Alerts View */
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Critical Emergencies</span>
                <span className="text-2xl font-extrabold text-white mt-1 block">{criticalCountSc}</span>
              </div>
              <ShieldAlert className="h-7 w-7 text-destructive animate-pulse" />
            </div>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">High Priority</span>
                <span className="text-2xl font-extrabold text-white mt-1 block">{highCountSc}</span>
              </div>
              <AlertTriangle className="h-7 w-7 text-accent" />
            </div>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Warnings</span>
                <span className="text-2xl font-extrabold text-white mt-1 block">{warningCountSc}</span>
              </div>
              <Info className="h-7 w-7 text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Real-time Municipal Alerts Stream</span>
              <button 
                onClick={fetchScAlerts}
                className="text-secondary hover:underline font-semibold flex items-center space-x-1"
              >
                <span>Refresh notifications</span>
              </button>
            </div>

            {loading ? (
              <div className="h-32 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Polling alerts stream...</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {scAlerts.map((alert) => {
                  const isCritical = alert.severity === 'CRITICAL';
                  const isHigh = alert.severity === 'HIGH';

                  return (
                    <div 
                      key={alert.id} 
                      className={`bg-card border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow transition-all ${
                        isCritical 
                          ? 'border-destructive/30 hover:border-destructive/50' 
                          : isHigh 
                          ? 'border-accent/30 hover:border-accent/50' 
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative mt-1">
                          <span className={`h-2.5 w-2.5 rounded-full block ${
                            isCritical ? 'bg-destructive' : isHigh ? 'bg-accent' : 'bg-primary'
                          }`} />
                          {isCritical && (
                            <span className="absolute -inset-0.5 rounded-full bg-destructive animate-ping opacity-75" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-white">{alert.title}</span>
                            <span className="text-[10px] text-muted-foreground font-bold">•</span>
                            <span className="text-[9px] text-muted-foreground uppercase font-semibold">{alert.category}</span>
                          </div>
                          
                          <p className="text-xs text-slate-350 leading-relaxed pr-6">{alert.message}</p>
                          
                          <div className="flex items-center space-x-2 pt-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{alert.timestamp}</span>
                            <span>•</span>
                            <span className={`font-semibold ${
                              isCritical ? 'text-destructive' : isHigh ? 'text-accent' : 'text-primary'
                            }`}>
                              {alert.severity} SEVERITY
                            </span>
                            {alert.status !== 'ACTIVE' && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-500 font-bold uppercase tracking-wider flex items-center space-x-0.5">
                                  <Check className="h-3 w-3" />
                                  <span>{alert.status}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 sm:self-center self-end">
                        {alert.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleAcknowledgeSc(alert.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-350 font-bold rounded-lg text-[10px] transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => handleResolveSc(alert.id)}
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-500 font-bold rounded-lg text-[10px] transition-colors"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  );
                })}
                {scAlerts.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No pending smart city alerts.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
