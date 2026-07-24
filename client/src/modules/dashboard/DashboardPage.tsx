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
  ChevronRight, 
  Coins, 
  Compass, 
  Truck 
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();

  // KPI Metrics Data
  const kpis = [
    { title: 'Active Decisions', value: '18', change: '+24%', desc: 'Simulations running in production', icon: Brain, color: 'text-primary border-primary/20 bg-primary/5' },
    { title: 'Active Workspaces', value: '6', change: '+50%', desc: 'Collaborating organizations', icon: Users, color: 'text-secondary border-secondary/20 bg-secondary/5' },
    { title: 'AI Model Accuracy', value: '98.6%', change: '+0.2%', desc: 'Shared engine confidence index', icon: Activity, color: 'text-accent border-accent/20 bg-accent/5' },
    { title: 'Risk Anomalies', value: '2', change: '-40%', desc: 'Mitigated in the last 24h', icon: AlertTriangle, color: 'text-destructive border-destructive/20 bg-destructive/5' },
  ];

  // ECharts Trend Option
  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: { color: '#94a3b8' },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8' },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } }
    },
    series: [
      {
        name: 'AI Confidence Index',
        type: 'line',
        smooth: true,
        data: [94, 95, 94.8, 96.2, 97.4, 98.1, 98.6],
        itemStyle: { color: '#2563EB' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.4)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.0)' }
            ]
          }
        }
      },
      {
        name: 'Simulation Load Rate',
        type: 'line',
        smooth: true,
        data: [72, 79, 81, 75, 88, 92, 95],
        itemStyle: { color: '#14B8A6' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(20, 184, 166, 0.4)' },
              { offset: 1, color: 'rgba(20, 184, 166, 0.0)' }
            ]
          }
        }
      }
    ]
  };

  // Industry Selector Cards
  const industryModules = [
    { name: 'Agriculture', path: '/industry', desc: 'Crop yield models', icon: Coins, color: 'text-primary border-primary/10 hover:border-primary/50' },
    { name: 'Healthcare', path: '/industry', desc: 'Clinic capacity flow', icon: Activity, color: 'text-secondary border-secondary/10 hover:border-secondary/50' },
    { name: 'Manufacturing', path: '/industry', desc: 'Predictive maintenance', icon: Compass, color: 'text-accent border-accent/10 hover:border-accent/50' },
    { name: 'Smart City', path: '/industry', desc: 'Power grid balancing', icon: Truck, color: 'text-primary border-primary/10 hover:border-primary/50' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.title} className={`bg-card border rounded-xl p-6 shadow hover:shadow-lg transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{kpi.title}</span>
              <div className={`p-2 rounded-lg border ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{kpi.value}</span>
              <span className="text-xs font-bold text-secondary">{kpi.change}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{kpi.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Trend Chart */}
        <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2 shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Simulation Performance Trend</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Real-time model accuracy vs load capacity rates.</p>
            </div>
          </div>
          <div className="h-72">
            <ReactECharts option={chartOption} style={{ height: '100%' }} />
          </div>
        </div>

        {/* 3. AI Insights Panel */}
        <div className="bg-card border border-border rounded-xl p-6 shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-4">
              <Sparkles className="h-5 w-5 text-accent" />
              <span>AI Engine Insights</span>
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 border border-border rounded-lg">
                <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Agriculture Model Alert</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Severe soil hydration anomaly detected in Section 4B. Recommended: trigger drip irrigation cycle.
                </p>
              </div>
              <div className="p-4 bg-muted/30 border border-border rounded-lg">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Smart Grid Load balancing</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Peak demand predicted at 18:30. Commencing predictive load shunts to prevent secondary thermal spikes.
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/ai-center')}
            className="w-full mt-6 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1"
          >
            <span>Consult AI Center</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 4. Interactive Region Map & Risk Heatmap */}
        <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2 shadow">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-1">
              <Compass className="h-5 w-5 text-secondary" />
              <span>Global Decision Risk Heatmap</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-6">Active nodes and localized threat indicators.</p>
          </div>
          
          {/* Custom SVG interactive map visualizer overlay */}
          <div className="h-80 bg-background border border-border rounded-xl overflow-hidden relative flex items-center justify-center">
            {/* World Map Vector Background */}
            <svg viewBox="0 0 1000 500" className="w-full h-full opacity-10 fill-muted-foreground">
              <path d="M150,150 Q180,120 220,150 T300,180 T400,140 Q450,160 500,130 T600,150 T700,130 T850,160 L900,200 L950,250 L850,300 L750,350 L600,320 L500,380 L400,340 L300,420 L200,380 Z" />
              <circle cx="220" cy="180" r="40" />
              <circle cx="580" cy="220" r="60" />
              <circle cx="780" cy="300" r="50" />
            </svg>

            {/* Pulsating Heatmap Markers */}
            {/* Node 1: Agriculture (North America) */}
            <div className="absolute top-[28%] left-[22%] flex items-center justify-center">
              <span className="absolute inline-flex h-8 w-8 rounded-full bg-primary/30 animate-ping" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-white" />
              <span className="absolute bg-card border border-border px-2 py-1 rounded text-[10px] text-white font-bold whitespace-nowrap -top-8 shadow-md">
                AgriNode-1 (Risk: LOW)
              </span>
            </div>

            {/* Node 2: Healthcare (Europe) */}
            <div className="absolute top-[35%] left-[52%] flex items-center justify-center">
              <span className="absolute inline-flex h-12 w-12 rounded-full bg-accent/30 animate-ping" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-accent border-2 border-white" />
              <span className="absolute bg-card border border-border px-2 py-1 rounded text-[10px] text-white font-bold whitespace-nowrap -top-8 shadow-md">
                HealthNode-2 (Risk: MEDIUM)
              </span>
            </div>

            {/* Node 3: Smart Grid (Asia) */}
            <div className="absolute top-[48%] left-[75%] flex items-center justify-center">
              <span className="absolute inline-flex h-16 w-16 rounded-full bg-destructive/30 animate-ping" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive border-2 border-white" />
              <span className="absolute bg-card border border-border px-2 py-1 rounded text-[10px] text-white font-bold whitespace-nowrap -top-8 shadow-md">
                GridNode-3 (Risk: HIGH)
              </span>
            </div>
          </div>
        </div>

        {/* 5. Alerts & Activity Feed */}
        <div className="bg-card border border-border rounded-xl p-6 shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <span>Activity Log & Alerts</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-xs leading-normal">
                <div className="h-2 w-2 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-slate-200">Simulation completed successfully for **Smart Grid**.</p>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">3 mins ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs leading-normal">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-slate-200">User John Doe edited **OpenAI hosted gateway configuration**.</p>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">1 hour ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs leading-normal">
                <div className="h-2 w-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-slate-200">High latency warning: Spring AI connection timeout shunt activated.</p>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">4 hours ago</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/notifications')}
            className="w-full mt-6 py-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-white border border-border rounded-lg text-xs transition-colors"
          >
            Inspect Logs
          </button>
        </div>
      </div>

      {/* 6. Industry Selector */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Launch Industry Models</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industryModules.map((m, idx) => (
            <button
              key={idx}
              onClick={() => navigate(m.path)}
              className={`bg-card border rounded-xl p-5 text-left transition-all duration-300 focus:outline-none flex justify-between items-center ${m.color}`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-muted/40 rounded-lg">
                  <m.icon className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">{m.name}</h5>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
