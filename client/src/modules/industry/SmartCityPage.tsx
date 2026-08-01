import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Building2, 
  Activity, 
  Sparkles, 
  FileText, 
  Loader2, 
  AlertTriangle, 
  ChevronRight,
  Download,
  Brain,
  Zap,
  CheckCircle,
  Gauge,
  ShieldAlert,
  Send,
  Droplet,
  Trash2,
  X
} from 'lucide-react';
import api from '@/lib/axios';
import SmartCityMap from '@/components/ui/SmartCityMap';

interface CityDetails {
  name: string;
  location: string;
  status: string;
  population: number;
}

interface PollutionMetrics {
  aqiIndex: number;
  pm25: number;
  pm10: number;
  co2: number;
  status: string;
}

interface SmartCityDashboardData {
  cityDetails: CityDetails;
  pollutionMetrics: PollutionMetrics;
  trafficZones: Array<{ id: string; name: string; status: string; averageSpeedKmh: number; congestion: number }>;
  wasteContainers: Array<{ id: string; location: string; fillPercentage: number; status: string }>;
  waterStations: Array<{ id: string; name: string; flowRateLps: number; pressureBar: number; purity: number; status: string }>;
  powerGrids: Array<{ id: string; name: string; loadMw: number; capacityMw: number; status: string }>;
  infrastructureAssets: Array<{ id: string; name: string; type: string; healthScore: number; status: string }>;
  citizenComplaints: Array<{ id: string; title: string; category: string; description: string; status: string; reporter: string }>;
  alerts: Array<{ id: string; title: string; category: string; severity: string; message: string; status: string; timestamp: string }>;
  recommendations: Array<{ id: string; title: string; category: string; impact: string; description: string; estimatedSavings: string }>;
  recentActivities: Array<{ id: string; title: string; description: string; type: string; timestamp: string; operator: string }>;
}

export default function SmartCityPage() {
  const [data, setData] = useState<SmartCityDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sensors' | 'citizen' | 'ai'>('dashboard');
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);

  // Report parameters
  const [showReportModal, setShowReportModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [notes, setNotes] = useState('');

  // Citizen Complaint submission
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('ENERGY');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintReporter, setComplaintReporter] = useState('');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [complaintLogged, setComplaintLogged] = useState<any | null>(null);

  // AI Optimizer parameters
  const [selZone, setSelZone] = useState('Interstate-90 Expressway');
  const [congestion, setCongestion] = useState(78);
  const [gridLoad, setGridLoad] = useState(186.2);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizerOutput, setOptimizerOutput] = useState<string | null>(null);
  const [optimizerMode, setOptimizerMode] = useState<'traffic' | 'grid'>('traffic');

  // AI Executive Summary
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/smartcity/dashboard');
      setData(response.data);
      setActiveAlerts(response.data.alerts);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load smart city cockpit:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTitle || !complaintDesc) return;
    setSubmittingComplaint(true);
    setComplaintLogged(null);
    try {
      const response = await api.post('/api/smartcity/complaints', {
        title: complaintTitle,
        category: complaintCategory,
        description: complaintDesc,
        reporterName: complaintReporter || 'Anonymous'
      });
      setComplaintLogged(response.data);
      // Append to local list
      if (data) {
        setData({
          ...data,
          citizenComplaints: [response.data, ...data.citizenComplaints]
        });
      }
      setComplaintTitle('');
      setComplaintDesc('');
      setComplaintReporter('');
    } catch (err) {
      console.error('Failed to submit citizen complaint:', err);
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      await api.post(`/api/smartcity/alerts/${id}/acknowledge`);
      setActiveAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await api.post(`/api/smartcity/alerts/${id}/resolve`);
      setActiveAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  const handleAiOptimize = async () => {
    setOptimizing(true);
    setOptimizerOutput(null);
    try {
      if (optimizerMode === 'traffic') {
        const response = await api.post('/api/ai/smartcity/optimize-traffic', {
          zone: selZone,
          congestionPercentage: congestion
        });
        setOptimizerOutput(response.data.aiDetours);
      } else {
        const response = await api.post('/api/ai/smartcity/optimize-grid', {
          loadMw: gridLoad,
          capacityMw: 200.0
        });
        setOptimizerOutput(response.data.aiStrategy);
      }
    } catch (err) {
      console.error('AI city optimizer optimization crash:', err);
    } finally {
      setOptimizing(false);
    }
  };

  const handleGetSummary = async () => {
    if (!data) return;
    setGeneratingSummary(true);
    setAiSummary(null);
    try {
      const response = await api.post('/api/ai/smartcity-summary', {
        aqiIndex: data.pollutionMetrics.aqiIndex,
        gridLoadMw: data.powerGrids[1].loadMw
      });
      setAiSummary(response.data.summary);
    } catch (err) {
      console.error('Failed to generate city executive briefing:', err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!data) return;
    setGeneratingReport(true);
    try {
      const payload = {
        metrics: {
          aqiIndex: `${data.pollutionMetrics.aqiIndex}`,
          gridLoad: `${data.powerGrids[1].loadMw} MW / 200 MW`,
          activeAlerts: `${activeAlerts.length} Active System Alerts`,
          cityStatus: data.cityDetails.status
        },
        alerts: activeAlerts.map(a => a.message),
        predictions: 'AI Signal Timing Detroit Bypass detour active. Grid load shedding scheduled for Substation 7.',
        userNotes: notes || 'Municipal brief compiled for city oversight.'
      };

      const response = await api.post('/api/smartcity/report', payload, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'IntelliSphere_SmartCity_Brief.pdf';
      link.click();
      setShowReportModal(false);
    } catch (err) {
      console.error('Failed to generate smart city PDF report:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading Smart City operations center...</p>
      </div>
    );
  }

  // ECharts Grid load actual vs capacity
  const gridOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 10 }, bottom: '0%' },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.powerGrids.map(g => g.name),
      axisLabel: { color: '#94a3b8', fontSize: 9 }
    },
    yAxis: { type: 'value', name: 'Megawatts (MW)', axisLabel: { color: '#94a3b8', fontSize: 9 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Operating Grid Capacity',
        type: 'bar',
        barGap: '20%',
        data: data.powerGrids.map(g => g.capacityMw),
        itemStyle: { color: '#475569', borderRadius: 3 }
      },
      {
        name: 'Current Power Load',
        type: 'bar',
        data: data.powerGrids.map(g => g.loadMw),
        itemStyle: { color: '#F59E0B', borderRadius: 3 }
      }
    ]
  };

  // ECharts AQI Level daily logs
  const pollutionTrendOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'AQI Index', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'AQI Score',
        type: 'line',
        smooth: true,
        data: [58, 62, 74, 86, 64, 48, 52],
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

  return (
    <div className="space-y-8 pb-16">
      
      {/* City header tab layout */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span>Smart City Operations Center</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Municipal infrastructure telemetry, AQI indices, power grid balance, and citizen portal.</p>
        </div>

        <div className="flex bg-muted/20 p-1 rounded-lg border border-border">
          {[
            { id: 'dashboard', label: 'Live Dashboard' },
            { id: 'sensors', label: 'Sensors Registry' },
            { id: 'citizen', label: 'Citizen Hub' },
            { id: 'ai', label: 'AI Optimizer' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === tab.id ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* Animated KPI summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Population', value: '840,000', sub: data.cityDetails.location, icon: Building2, color: 'text-primary' },
              { title: 'Air Quality (AQI)', value: `${data.pollutionMetrics.aqiIndex}`, sub: `Status: ${data.pollutionMetrics.status} (pm2.5: ${data.pollutionMetrics.pm25})`, icon: Gauge, color: 'text-[#14B8A6]' },
              { title: 'Peak Grid Load', value: `${data.powerGrids[1].loadMw} MW`, sub: `Capacity: ${data.powerGrids[1].capacityMw} MW`, icon: Zap, color: 'text-accent' },
              { title: 'Active City Alerts', value: `${activeAlerts.length}`, sub: '2 critical emergencies', icon: ShieldAlert, color: 'text-destructive' }
            ].map((card) => (
              <div key={card.title} className="bg-card border border-border rounded-xl p-6 shadow-lg hover:border-primary/40 transition-colors relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</span>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight">{card.value}</div>
                <span className="text-[10px] text-muted-foreground block mt-1.5">{card.sub}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Live city alerts, traffic zones congestion, infrastructure health */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Emergency alerts center */}
              <div className="bg-card border border-border rounded-xl p-6 shadow">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-destructive animate-bounce" />
                  <span>Emergency Dispatch Alerts</span>
                </h3>
                <div className="space-y-3">
                  {activeAlerts.map((alert) => (
                    <div key={alert.id} className="bg-background border border-border rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-start space-x-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          alert.severity === 'CRITICAL' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'
                        }`}>
                          {alert.severity}
                        </span>
                        <div>
                          <span className="font-bold text-white block">{alert.title} ({alert.category})</span>
                          <p className="text-slate-350 mt-1 leading-normal">{alert.message}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {alert.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded text-[10px] transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-500 font-semibold rounded text-[10px] transition-colors"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))}
                  {activeAlerts.length === 0 && (
                    <div className="text-center py-6 text-xs text-muted-foreground flex flex-col items-center space-y-2">
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                      <p>All city systems running within safe bounds.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Traffic Monitoring & GIS Map */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card border border-border rounded-xl p-6 shadow">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Traffic Congestion Index</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-300">
                      <thead>
                        <tr className="border-b border-border/80 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                          <th className="pb-3">Traffic Zone</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Congestion %</th>
                          <th className="pb-3">Average Speed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {data.trafficZones.map((z) => (
                          <tr key={z.id} className="hover:bg-muted/10 transition-colors">
                            <td className="py-3 font-semibold text-white">
                              <span>{z.name}</span>
                              <span className="block text-[10px] text-muted-foreground">{z.id}</span>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                z.status === 'BLOCKED' 
                                  ? 'bg-destructive/10 text-destructive' 
                                  : z.status === 'CONGESTED' 
                                  ? 'bg-accent/10 text-accent' 
                                  : 'bg-emerald-600/10 text-emerald-500'
                              }`}>
                                {z.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className={`font-bold ${z.congestion > 50 ? 'text-destructive' : 'text-slate-200'}`}>{z.congestion}%</span>
                            </td>
                            <td className="py-3">{z.averageSpeedKmh} km/h</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="h-[280px] rounded-xl overflow-hidden border border-border">
                  <SmartCityMap />
                </div>
              </div>

              {/* Citizen complaints preview */}
              <div className="bg-card border border-border rounded-xl p-6 shadow">
                <h3 className="text-lg font-bold text-white mb-4">Recent Citizen Complaints</h3>
                <div className="space-y-4">
                  {data.citizenComplaints.map((c) => (
                    <div key={c.id} className="bg-background border border-border p-4 rounded-xl flex items-start justify-between text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-xs">{c.title}</span>
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-350 rounded text-[9px] uppercase font-bold">{c.category}</span>
                        </div>
                        <p className="text-slate-400 mt-1 leading-normal">{c.description}</p>
                        <span className="text-[10px] text-muted-foreground mt-2 block">Filed by: {c.reporter}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        c.status === 'OPEN' ? 'bg-destructive/10 text-destructive' : 'bg-emerald-600/10 text-emerald-500'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: ECharts power grids load, AQI lines, AI summary briefs */}
            <div className="space-y-8">
              
              {/* ECharts: Power grid megawatts loads */}
              <div className="bg-card border border-border rounded-xl p-6 shadow">
                <h3 className="text-lg font-bold text-white mb-4">Grid Load Demand</h3>
                <div className="h-56">
                  <ReactECharts option={gridOption} style={{ height: '100%' }} />
                </div>
              </div>

              {/* AI Executive Summary Brief */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-md space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Brain className="h-4.5 w-4.5 text-primary" />
                  <span>AI Executive Sustainability Brief</span>
                </h3>

                <button 
                  onClick={handleGetSummary}
                  disabled={generatingSummary}
                  className="w-full py-2 bg-[#14B8A6]/20 border border-[#14B8A6]/30 hover:bg-[#14B8A6]/35 text-[#14B8A6] font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2"
                >
                  {generatingSummary ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Synthesizing city stats...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="h-3.5 w-3.5" />
                      <span>Compile City Sustainability Brief</span>
                    </>
                  )}
                </button>

                {aiSummary && (
                  <div className="bg-background border border-border rounded-lg p-3 text-[11px] text-slate-350 leading-relaxed max-h-36 overflow-y-auto">
                    {aiSummary}
                  </div>
                )}
              </div>

              {/* ECharts: Pollution index levels */}
              <div className="bg-card border border-border rounded-xl p-6 shadow">
                <h3 className="text-lg font-bold text-white mb-4">Daily Pollution Trend (AQI)</h3>
                <div className="h-44">
                  <ReactECharts option={pollutionTrendOption} style={{ height: '100%' }} />
                </div>
              </div>

              {/* AI City recommendations list */}
              <div className="bg-card border border-border rounded-xl p-6 shadow space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>AI Recommendations</span>
                </h3>

                <div className="space-y-3">
                  {data.recommendations.map((rec) => (
                    <div key={rec.id} className="bg-muted/10 border border-border rounded-lg p-3 text-xs leading-normal flex items-start space-x-2">
                      <ChevronRight className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">{rec.title}</span>
                        <p className="text-slate-350 mt-1">{rec.description}</p>
                        <span className="text-[10px] text-secondary font-bold mt-1.5 block">{rec.estimatedSavings}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowReportModal(true)}
                  className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-xs transition-all shadow-md shadow-primary/25 flex items-center justify-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Generate Operations Report</span>
                </button>
              </div>

            </div>

          </div>
        </>
      )}

      {activeTab === 'sensors' && (
        /* Sensors registry listing waste fill levels, flow rates, grid load, infra health */
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Waste containers sensors */}
            <div className="bg-card border border-border rounded-xl p-6 shadow">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                <Trash2 className="h-4.5 w-4.5 text-primary" />
                <span>Waste Bins Capacity Sensors</span>
              </h3>
              <div className="space-y-4">
                {data.wasteContainers.map((bin) => (
                  <div key={bin.id} className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">{bin.location} ({bin.id})</span>
                      <span className={`font-bold ${bin.fillPercentage > 85 ? 'text-destructive' : 'text-slate-300'}`}>
                        {bin.fillPercentage}% Full
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${bin.fillPercentage > 85 ? 'bg-destructive' : bin.fillPercentage > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${bin.fillPercentage}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Water station pressure flow metrics */}
            <div className="bg-card border border-border rounded-xl p-6 shadow">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                <Droplet className="h-4.5 w-4.5 text-primary" />
                <span>Water Supply Stations Telemetry</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground uppercase text-[9px] font-bold">
                      <th className="pb-3">Station</th>
                      <th className="pb-3">Flow Rate</th>
                      <th className="pb-3">Pressure</th>
                      <th className="pb-3">Purity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {data.waterStations.map((w) => (
                      <tr key={w.id}>
                        <td className="py-3 font-semibold text-white">{w.name}</td>
                        <td className="py-3">{w.flowRateLps} L/s</td>
                        <td className="py-3">{w.pressureBar} bar</td>
                        <td className="py-3 text-secondary font-bold">{w.purity}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Public infrastructure assets health scores */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h3 className="text-sm font-bold text-white mb-4">Infrastructure Asset Health Indexes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.infrastructureAssets.map((asset) => (
                <div key={asset.id} className="bg-background border border-border p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-xs text-white block">{asset.name}</span>
                      <span className="text-[10px] text-muted-foreground">{asset.type} • {asset.id}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      asset.status === 'OPERATIONAL' ? 'bg-emerald-600/10 text-emerald-500' : 'bg-amber-600/10 text-amber-500'
                    }`}>
                      {asset.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Health Index</span>
                      <span className="font-bold text-white">{asset.healthScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${asset.healthScore > 85 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${asset.healthScore}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeTab === 'citizen' && (
        /* Citizen complaints portal logging complaints */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Complaint logging form */}
          <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6 shadow h-fit space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Log Citizen Service Request</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Submit localized municipal complaints or emergency alerts.</p>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Service Category</label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                  className="w-full px-2 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none"
                >
                  <option value="TRAFFIC">Traffic & Signals</option>
                  <option value="POLLUTION">AQI & Air Quality</option>
                  <option value="WASTE">Garbage & Waste Bins</option>
                  <option value="WATER">Water Pipe Leaks</option>
                  <option value="ENERGY">Streetlights & Grids</option>
                  <option value="INFRASTRUCTURE">Bridge & Subway Repairs</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Brief Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overflowing garbage bin on 5th Ave"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Detailed Description</label>
                <textarea
                  required
                  placeholder="Enter details of the issue..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  className="w-full h-24 px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Reporter Name</label>
                <input
                  type="text"
                  placeholder="Anonymous (Optional)"
                  value={complaintReporter}
                  onChange={(e) => setComplaintReporter(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={submittingComplaint}
                className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2"
              >
                {submittingComplaint ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Filing Complaint...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Citizen Report</span>
                  </>
                )}
              </button>
            </form>

            {complaintLogged && (
              <div className="bg-[#14B8A6]/10 border border-[#14B8A6]/20 p-3 rounded-lg text-[11px] text-[#14B8A6] flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Complaint logged successfully: {complaintLogged.complaintNumber}</span>
              </div>
            )}
          </div>

          {/* Complaints list */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow h-[550px] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Municipal Service Complaint Register</h3>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {data.citizenComplaints.map((c) => (
                <div key={c.id} className="bg-background border border-border p-4 rounded-xl flex items-start justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-xs">{c.title}</span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-350 rounded text-[9px] uppercase font-bold">{c.category}</span>
                    </div>
                    <p className="text-slate-400 mt-1 leading-normal">{c.description}</p>
                    <span className="text-[10px] text-muted-foreground mt-2 block">Filed by: {c.reporter}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    c.status === 'OPEN' ? 'bg-destructive/10 text-destructive' : 'bg-emerald-600/10 text-emerald-500'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeTab === 'ai' && (
        /* AI Operations Optimizer running Gemini traffic detouring and grid load-shedding models */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Optimization parameters panel */}
          <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6 shadow space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Sparkles className="h-5.5 w-5.5 text-primary" />
                <span>AI Municipal Optimizer</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle parameters to evaluate dynamic routing or power grid load optimization strategies.</p>
            </div>

            <div className="space-y-4 my-4 text-xs">
              <div className="flex bg-slate-850 p-1 rounded-lg border border-border">
                <button
                  onClick={() => { setOptimizerMode('traffic'); setOptimizerOutput(null); }}
                  className={`flex-1 py-1.5 font-semibold text-[10px] rounded-md transition-all ${
                    optimizerMode === 'traffic' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  Traffic Détour
                </button>
                <button
                  onClick={() => { setOptimizerMode('grid'); setOptimizerOutput(null); }}
                  className={`flex-1 py-1.5 font-semibold text-[10px] rounded-md transition-all ${
                    optimizerMode === 'grid' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  Power Grid load
                </button>
              </div>

              {optimizerMode === 'traffic' ? (
                <>
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Target Congested Zone</label>
                    <select
                      value={selZone}
                      onChange={(e) => setSelZone(e.target.value)}
                      className="w-full px-2 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none"
                    >
                      <option value="Interstate-90 Expressway">I-90 Expressway</option>
                      <option value="Downtown Loop">Downtown Loop</option>
                      <option value="Residential Boulevard">Residential Boulevard</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-350">Congestion Ratio</span>
                      <span className="font-bold text-white">{congestion}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={congestion}
                      onChange={(e) => setCongestion(parseInt(e.target.value))}
                      className="w-full accent-primary bg-slate-800 h-1 rounded-lg cursor-pointer"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Target Power Grid</label>
                    <select
                      className="w-full px-2 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none"
                      disabled
                    >
                      <option>Metropolitan Grid B</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-350">Grid Megawatts load</span>
                      <span className="font-bold text-white">{gridLoad} MW</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="200"
                      step="0.5"
                      value={gridLoad}
                      onChange={(e) => setGridLoad(parseFloat(e.target.value))}
                      className="w-full accent-primary bg-slate-800 h-1 rounded-lg cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleAiOptimize}
              disabled={optimizing}
              className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2"
            >
              {optimizing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Evaluating Optimization models...</span>
                </>
              ) : (
                <>
                  <Brain className="h-3.5 w-3.5" />
                  <span>Run Operational AI Optimizer</span>
                </>
              )}
            </button>
          </div>

          {/* AI Optimizer output text panel */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow h-[400px] flex flex-col justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Operations Detour Strategy</h3>

            {optimizing ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <p className="text-xs text-muted-foreground">Running Gemini model evaluation...</p>
              </div>
            ) : optimizerOutput ? (
              <div className="flex-1 bg-background border border-border rounded-xl p-4 text-xs text-slate-350 leading-relaxed overflow-y-auto my-4">
                {optimizerOutput}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center space-y-2 text-center my-4">
                <Brain className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs font-bold text-white block">Awaiting Optimization parameters</span>
                <p className="text-[10px] text-muted-foreground max-w-xs">Adjust sliders on the left and click "Run Operational AI Optimizer" to query Gemini suggestions.</p>
              </div>
            )}

            <div className="border-t border-border pt-3 flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Estimate savings metric:</span>
              <span className="font-bold text-emerald-500">14 mins average trip drop / $3,400 peak cost drop</span>
            </div>
          </div>

        </div>
      )}

      {/* PDF Exporter Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <span>Compile Operations Report Brief</span>
              </h3>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Calibration Consult Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter actions taken or details (e.g. Traffic light adjustments, grid substation allocations)..."
                className="w-full h-28 px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground resize-none"
              />
            </div>

            <div className="flex space-x-3 justify-end pt-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={generatingReport}
                className="px-5 py-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-xs transition-colors flex items-center space-x-2 shadow"
              >
                {generatingReport ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Compiling Brief...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Operations Brief</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
