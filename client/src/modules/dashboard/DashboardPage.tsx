import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Users, 
  Activity, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  Bell, 
  Coins, 
  Compass, 
  Truck, 
  Plus, 
  CheckCircle, 
  FileText, 
  X
} from 'lucide-react';

interface AlertItem {
  id: string;
  source: string;
  message: string;
  severity: 'WARNING' | 'CRITICAL' | 'INFO';
  time: string;
}

interface ActivityItem {
  id: string;
  type: 'AI_RUN' | 'CONFIG' | 'ALERT' | 'USER';
  message: string;
  time: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();

  // 1. Live Alerts state (Active Alerts count updates dynamically when resolved!)
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: 'al-1', source: 'Agriculture Engine', message: 'Low Soil hydration in Section 4B. Recommended: drip irrigation.', severity: 'WARNING', time: '10m ago' },
    { id: 'al-2', source: 'Smart Grid Monitor', message: 'Power grid load demand peak shunts activated.', severity: 'CRITICAL', time: '1h ago' },
    { id: 'al-3', source: 'Healthcare Scanner', message: 'Patient queue buffer capacity threshold exceeded.', severity: 'INFO', time: '3h ago' }
  ]);

  // 2. Activity Feed filter state
  const [activityFilter, setActivityFilter] = useState<'ALL' | 'AI_RUN' | 'USER'>('ALL');
  const [activities] = useState<ActivityItem[]>([
    { id: 'act-1', type: 'AI_RUN', message: 'Monte Carlo simulation completed: Asset Rebalancing.', time: '2m ago' },
    { id: 'act-2', type: 'USER', message: 'John Doe edited hosted OpenAI credentials.', time: '40m ago' },
    { id: 'act-3', type: 'AI_RUN', message: 'Healthcare clinic load balancing parameters calculated.', time: '2h ago' },
    { id: 'act-4', type: 'USER', message: 'Organization domain linked: global.intellisphere.com.', time: '1d ago' }
  ]);

  // 3. Live WebSocket Toast Simulator (Pulsates a toast alert every 15s)
  const [liveToast, setLiveToast] = useState<{ id: string; message: string } | null>(null);

  useEffect(() => {
    const toastItems = [
      'AI Recommendation: Recalibrate section 2B thermal sensors.',
      'Active Alert: Healthcare clinic load spiked by 12%.',
      'System Event: Daily report sheet Q3 exported successfully.',
      'Optimization: Factory floor downtime reduced by 4.2%.'
    ];

    const interval = setInterval(() => {
      const randomMsg = toastItems[Math.floor(Math.random() * toastItems.length)];
      setLiveToast({ id: String(Date.now()), message: randomMsg });
      
      // Auto-dismiss toast after 5s
      setTimeout(() => {
        setLiveToast(null);
      }, 5000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Dynamic values for KPIs
  const totalOrgs = '4';
  const activeAlertsCount = alerts.length;
  const totalPredictions = '1,420';
  const totalReports = '18';

  // ECharts Simulation Performance Line Chart Option
  const lineChartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } }
    },
    series: [
      {
        name: 'AI Confidence Index',
        type: 'line',
        smooth: true,
        data: [94.2, 95.8, 94.6, 96.9, 97.5, 98.2, 98.6],
        itemStyle: { color: '#2563EB' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.3)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.0)' }
            ]
          }
        }
      },
      {
        name: 'Sensor Precision Rate',
        type: 'line',
        smooth: true,
        data: [88.5, 89.2, 91.0, 90.5, 92.8, 93.5, 94.1],
        itemStyle: { color: '#14B8A6' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(20, 184, 166, 0.3)' },
              { offset: 1, color: 'rgba(20, 184, 166, 0.0)' }
            ]
          }
        }
      }
    ]
  };

  // ECharts Distribution Pie Chart Option
  const distributionChartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { bottom: '5%', left: 'center', textStyle: { color: '#94a3b8', fontSize: 10 } },
    series: [
      {
        name: 'Risk Allocation',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#1e293b', borderWidth: 2 },
        label: { show: false },
        data: [
          { value: 45, name: 'Agriculture Node', itemStyle: { color: '#2563EB' } },
          { value: 25, name: 'Healthcare Node', itemStyle: { color: '#14B8A6' } },
          { value: 20, name: 'Manufacturing Node', itemStyle: { color: '#F59E0B' } },
          { value: 10, name: 'Smart City Node', itemStyle: { color: '#EF4444' } }
        ]
      }
    ]
  };

  return (
    <div className="space-y-8 pb-16 relative">
      
      {/* Live Toast Notification Alert */}
      {liveToast && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-card border border-primary/20 rounded-xl p-4 shadow-2xl z-50 flex items-start space-x-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-bold text-white">Live AI Insight</p>
            <p className="text-xs text-slate-300 leading-normal mt-0.5">{liveToast.message}</p>
          </div>
          <button 
            onClick={() => setLiveToast(null)}
            className="p-1 text-muted-foreground hover:text-white rounded"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 1. KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Organizations', value: totalOrgs, icon: Users, color: 'text-primary bg-primary/5 border-primary/10' },
          { title: 'Active Alerts', value: String(activeAlertsCount), icon: AlertTriangle, color: activeAlertsCount > 0 ? 'text-destructive bg-destructive/5 border-destructive/10' : 'text-secondary bg-secondary/5 border-secondary/10' },
          { title: 'AI Predictions Run', value: totalPredictions, icon: Brain, color: 'text-accent bg-accent/5 border-accent/10' },
          { title: 'Reports Ingested', value: totalReports, icon: FileText, color: 'text-secondary bg-secondary/5 border-secondary/10' }
        ].map((card) => (
          <div key={card.title} className="bg-card border border-border rounded-xl p-6 shadow hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</span>
              <div className={`p-2 rounded-lg border ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Simulated and optimized in the current tenant.</p>
          </div>
        ))}
      </div>

      {/* 2. ECharts Performance Trends & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend line */}
        <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2 shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Simulation Load Metrics</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Real-time mapping of AI confidence levels vs IoT precision rates.</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={lineChartOption} style={{ height: '100%' }} />
          </div>
        </div>

        {/* Pie Distribution */}
        <div className="bg-card border border-border rounded-xl p-6 shadow">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-1">
            <Brain className="h-5 w-5 text-accent" />
            <span>AI Risk Distribution</span>
          </h3>
          <p className="text-xs text-muted-foreground mb-6">Relative prediction density per industry sector.</p>
          <div className="h-72">
            <ReactECharts option={distributionChartOption} style={{ height: '100%' }} />
          </div>
        </div>
      </div>

      {/* 3. Interactive Region Map & Risk Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2 shadow">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-1">
            <Compass className="h-5 w-5 text-secondary" />
            <span>Decision Node Heatmap</span>
          </h3>
          <p className="text-xs text-muted-foreground mb-6">Active nodes and localized threat indicators.</p>

          <div className="h-80 bg-background border border-border rounded-xl overflow-hidden relative flex items-center justify-center">
            {/* World Map Vector Background */}
            <svg viewBox="0 0 1000 500" className="w-full h-full opacity-10 fill-muted-foreground">
              <path d="M150,150 Q180,120 220,150 T300,180 T400,140 Q450,160 500,130 T600,150 T700,130 T850,160 L900,200 L950,250 L850,300 L750,350 L600,320 L500,380 L400,340 L300,420 L200,380 Z" />
              <circle cx="220" cy="180" r="40" />
              <circle cx="580" cy="220" r="60" />
              <circle cx="780" cy="300" r="50" />
            </svg>

            {/* Pulsating Heatmap Markers */}
            <div className="absolute top-[28%] left-[22%] flex items-center justify-center">
              <span className="absolute inline-flex h-8 w-8 rounded-full bg-primary/30 animate-ping" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-white" />
              <span className="absolute bg-card border border-border px-2.5 py-1.5 rounded text-[10px] text-white font-bold whitespace-nowrap -top-10 shadow-md">
                AgriNode-1 (Risk: LOW)
              </span>
            </div>

            <div className="absolute top-[35%] left-[52%] flex items-center justify-center">
              <span className="absolute inline-flex h-12 w-12 rounded-full bg-accent/30 animate-ping" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-accent border-2 border-white" />
              <span className="absolute bg-card border border-border px-2.5 py-1.5 rounded text-[10px] text-white font-bold whitespace-nowrap -top-10 shadow-md">
                HealthNode-2 (Risk: MEDIUM)
              </span>
            </div>

            <div className="absolute top-[48%] left-[75%] flex items-center justify-center">
              <span className="absolute inline-flex h-16 w-16 rounded-full bg-destructive/30 animate-ping" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive border-2 border-white" />
              <span className="absolute bg-card border border-border px-2.5 py-1.5 rounded text-[10px] text-white font-bold whitespace-nowrap -top-10 shadow-md">
                GridNode-3 (Risk: HIGH)
              </span>
            </div>
          </div>
        </div>

        {/* 4. Active Alerts Feed */}
        <div className="bg-card border border-border rounded-xl p-6 shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <span>Active System Alerts</span>
            </h3>
            {alerts.length > 0 ? (
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                {alerts.map((al) => (
                  <div key={al.id} className="bg-muted/10 border border-border rounded-lg p-3.5 text-xs flex justify-between space-x-3 hover:border-primary/30 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          al.severity === 'CRITICAL' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'
                        }`}>
                          {al.severity}
                        </span>
                        <span className="font-semibold text-white">{al.source}</span>
                      </div>
                      <p className="text-slate-300 leading-normal">{al.message}</p>
                      <span className="text-[9px] text-muted-foreground block">{al.time}</span>
                    </div>
                    <button 
                      onClick={() => handleResolveAlert(al.id)}
                      className="p-1 text-muted-foreground hover:text-secondary focus:outline-none flex-shrink-0 self-start"
                      title="Resolve Alert"
                    >
                      <CheckCircle className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 border border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                <CheckCircle className="h-8 w-8 text-secondary mb-2 animate-bounce" />
                <p className="font-semibold text-xs text-white">All alerts resolved</p>
                <p className="text-[10px]">No warning indicators logged.</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate('/notifications')}
            className="w-full mt-6 py-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-white border border-border rounded-lg text-xs transition-colors"
          >
            Inspect Activity Feed
          </button>
        </div>
      </div>

      {/* 5. Recent Activity Logs & Industry Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity feed */}
        <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2 shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Activity className="h-5 w-5 text-secondary" />
              <span>Workspace Activity Feed</span>
            </h3>
            <div className="flex bg-muted/40 p-0.5 rounded-lg border border-border">
              {(['ALL', 'AI_RUN', 'USER'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setActivityFilter(type)}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                    activityFilter === type 
                      ? 'bg-primary text-white' 
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  {type === 'ALL' ? 'All' : type === 'AI_RUN' ? 'AI' : 'User'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {activities
              .filter(act => activityFilter === 'ALL' || act.type === activityFilter)
              .map(act => (
                <div key={act.id} className="flex justify-between items-center text-xs leading-normal border-b border-border/40 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className={`h-2 w-2 rounded-full ${
                      act.type === 'AI_RUN' ? 'bg-primary' : 'bg-secondary'
                    }`} />
                    <p className="text-slate-200">{act.message}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{act.time}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Industry selector */}
        <div className="bg-card border border-border rounded-xl p-6 shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-4">
              <Plus className="h-5 w-5 text-primary" />
              <span>Quick Launch Modules</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Agriculture', path: '/industry', icon: Coins, color: 'text-primary bg-primary/5 hover:border-primary/40' },
                { name: 'Healthcare', path: '/industry', icon: Activity, color: 'text-secondary bg-secondary/5 hover:border-secondary/40' },
                { name: 'Manufacturing', path: '/industry', icon: Compass, color: 'text-accent bg-accent/5 hover:border-accent/40' },
                { name: 'Smart City', path: '/industry', icon: Truck, color: 'text-primary bg-primary/5 hover:border-primary/40' }
              ].map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(m.path)}
                  className={`border border-border p-4 rounded-xl text-left transition-colors flex flex-col justify-between h-24 ${m.color}`}
                >
                  <m.icon className="h-5 w-5" />
                  <span className="font-bold text-white text-xs block mt-2">{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
