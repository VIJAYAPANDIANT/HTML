import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Wrench, 
  Activity, 
  Cpu, 
  Sparkles, 
  FileText, 
  Loader2, 
  AlertTriangle, 
  ChevronRight,
  Download,
  Brain,
  Zap,
  Building,
  CheckCircle,
  Gauge,
  Clock,
  Search
} from 'lucide-react';
import api from '@/lib/axios';

interface MachineStatus {
  id: string;
  name: string;
  machineCode: string;
  type: string;
  productionLine: string;
  status: 'OPERATIONAL' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE';
  healthScore: number;
  temperature: number;
  vibration: number;
  spindleSpeed: number;
  hydraulicPressure: number;
  failureRisk: string;
  lastMaintenance: string;
  nextMaintenance: string;
  ageMonths: number;
}

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  machineName: string;
  issueDescription: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
  failureProbability: number;
  assignedTechnician: string;
  scheduledDate: string;
}

interface ManufacturingAlert {
  id: string;
  title: string;
  category: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  machineCode: string;
  status: string;
  timestamp: string;
}

interface ActivityLog {
  id: string;
  title: string;
  description: string;
  type: string;
  timestamp: string;
  operator: string;
}

interface ManufacturingDashboardData {
  factoryOverview: {
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
  };
  machines: MachineStatus[];
  productionOverview: {
    targetUnits: number;
    actualUnits: number;
    scrapUnits: number;
    yieldRate: number;
    defectRate: number;
    throughputPerHour: number;
    hourlyOutputTrend: Array<{ hour: string; target: number; actual: number; scrap: number }>;
    defectCategoryBreakdown: Array<{ category: string; count: number; percentage: number }>;
  };
  shiftPerformance: {
    currentShift: string;
    activeSupervisor: string;
    currentShiftProgress: number;
  };
  energyConsumption: {
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
  };
  maintenanceOverview: {
    mtbfHours: number;
    mttrHours: number;
    pendingWorkOrdersCount: number;
    criticalWorkOrdersCount: number;
    predictiveMaintenanceAccuracy: number;
    workOrders: WorkOrder[];
  };
  aiRecommendations: Array<{
    id: string;
    title: string;
    category: string;
    impact: string;
    description: string;
    actionableStep: string;
    confidenceScore: number;
    estimatedSavings: string;
  }>;
  alerts: ManufacturingAlert[];
  recentActivities: ActivityLog[];
}

export default function ManufacturingPage() {
  const [data, setData] = useState<ManufacturingDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<ManufacturingAlert[]>([]);
  const [activeTab, setActiveTab] = useState<'cockpit' | 'monitoring'>('cockpit');

  // Interactive Filters for Machine Monitoring
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterLine, setFilterLine] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMachine, setSelectedMachine] = useState<MachineStatus | null>(null);

  // Telemetry AI Predictor state
  const [selMachine, setSelMachine] = useState('PRESS-301');
  const [temperature, setTemperature] = useState(94.8);
  const [vibration, setVibration] = useState(7.2);
  const [spindleSpeed] = useState(1200);
  const [predicting, setPredicting] = useState(false);
  const [predictionOutput, setPredictionOutput] = useState<string | null>(null);
  const [predictedRisk, setPredictedRisk] = useState<string | null>(null);

  // AI Summary stats
  const [aiSummaryText, setAiSummaryText] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/v1/manufacturing/dashboard');
      setData(response.data);
      setActiveAlerts(response.data.alerts);
      if (response.data.machines && response.data.machines.length > 0) {
        setSelectedMachine(response.data.machines[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to load manufacturing metrics:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handlePredictFailure = async () => {
    setPredicting(true);
    setPredictionOutput(null);
    try {
      const response = await api.post('/api/ai/manufacturing/predictive-maintenance', {
        machine: selMachine,
        temperature,
        vibration,
        spindleSpeed
      });
      setPredictionOutput(response.data.telemetryAnalysis);
      setPredictedRisk(response.data.riskLevel);
    } catch (err) {
      console.error('Predictive maintenance request failed:', err);
    } finally {
      setPredicting(false);
    }
  };

  const handleGetSummary = async () => {
    if (!data) return;
    setGeneratingSummary(true);
    setAiSummaryText(null);
    try {
      const response = await api.post('/api/ai/manufacturing/production-summary', {
        overallOee: data.factoryOverview.overallOee,
        currentDailyOutput: data.factoryOverview.currentDailyOutput,
        scrapUnits: data.productionOverview.scrapUnits
      });
      setAiSummaryText(response.data.summary);
    } catch (err) {
      console.error('Failed to generate production summary:', err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      await api.post(`/api/v1/manufacturing/alerts/${id}/acknowledge`);
      setActiveAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      await api.post(`/api/v1/manufacturing/alerts/${id}/resolve`);
      setActiveAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  const handleDownloadPdf = async () => {
    if (!data) return;
    setGeneratingReport(true);
    try {
      const payload = {
        metrics: {
          overallOee: `${data.factoryOverview.overallOee}%`,
          dailyOutput: `${data.factoryOverview.currentDailyOutput} / ${data.factoryOverview.dailyOutputTarget} units`,
          activeMachines: `${data.factoryOverview.activeMachinesCount} / ${data.factoryOverview.totalMachinesCount}`,
          plantStatus: data.factoryOverview.plantStatus
        },
        alerts: activeAlerts.map(a => a.message),
        predictions: 'Predictive maintenance recommended on Stamping Press PRESS-301 to avoid valve seal failure.',
        userNotes: notes || 'Production brief generated for Michigan plant oversight.'
      };

      const response = await api.post('/api/v1/manufacturing/report', payload, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'IntelliSphere_Manufacturing_Brief.pdf';
      link.click();
      setShowReportModal(false);
    } catch (err) {
      console.error('Failed to export manufacturing PDF:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading Manufacturing cockpit...</p>
      </div>
    );
  }

  // Hourly Output line options
  const hourlyOutputOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 10 }, bottom: '0%' },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.productionOverview.hourlyOutputTrend.map(t => t.hour),
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'Units', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Target Output',
        type: 'line',
        step: 'middle',
        data: data.productionOverview.hourlyOutputTrend.map(t => t.target),
        itemStyle: { color: '#94a3b8' },
        lineStyle: { width: 1, type: 'dashed' }
      },
      {
        name: 'Actual Output',
        type: 'line',
        smooth: true,
        data: data.productionOverview.hourlyOutputTrend.map(t => t.actual),
        itemStyle: { color: '#2563EB' },
        lineStyle: { width: 3 }
      }
    ]
  };

  // Energy usage options
  const energyUsageOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 10 }, bottom: '0%' },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.energyConsumption.hourlyUsageTrend.map(t => t.time),
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'kWh', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Energy Load',
        type: 'bar',
        barWidth: '40%',
        data: data.energyConsumption.hourlyUsageTrend.map(t => t.kwh),
        itemStyle: { color: '#F59E0B', borderRadius: 4 }
      }
    ]
  };

  // Filtered machines for Monitoring Center
  const filteredMachines = data.machines.filter(m => {
    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;
    const matchesLine = filterLine === 'ALL' || m.productionLine.toLowerCase().includes(filterLine.toLowerCase());
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.machineCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesLine && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Tab selection header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Detroit Production Hub</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time automotive assembly lines & predictive maintenance telemetry.</p>
        </div>

        <div className="flex bg-muted/20 p-1 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'cockpit' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white'
            }`}
          >
            Production Cockpit
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'monitoring' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white'
            }`}
          >
            Machine Monitoring Center
          </button>
        </div>
      </div>

      {activeTab === 'cockpit' ? (
        <>
          {/* 1. Animated KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Factories', value: '1 Hub', sub: data.factoryOverview.plantName, icon: Building, color: 'text-primary' },
              { title: 'Active Machines Utility', value: `${data.factoryOverview.activeMachinesCount} / ${data.factoryOverview.totalMachinesCount}`, sub: '2 lines operating warning', icon: Cpu, color: 'text-[#14B8A6]' },
              { title: 'Production OEE Rate', value: `${data.factoryOverview.overallOee}%`, sub: `Quality: ${data.factoryOverview.qualityScore}%`, icon: Gauge, color: 'text-secondary' },
              { title: 'Today\'s Total Power', value: `${data.energyConsumption.dailyKwhTotal} kWh`, sub: `Peak demand: ${data.energyConsumption.peakDemandMw} MW`, icon: Zap, color: 'text-accent' }
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
            
            {/* Left Column: Live alerts, telemetry status grids */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Live Alerts feed */}
              <div className="bg-card border border-border rounded-xl p-6 shadow">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span>Active Plant Alerts</span>
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
                          <span className="font-bold text-white block">{alert.title} ({alert.machineCode})</span>
                          <p className="text-slate-350 mt-1 leading-normal">{alert.message}</p>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
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
                      <p>All machine sensors reporting normal. Plant operational.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Machine Health & Telemetry Status Grid */}
              <div className="bg-card border border-border rounded-xl p-6 shadow">
                <h3 className="text-lg font-bold text-white mb-4">Machine Telemetry Monitor</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead>
                      <tr className="border-b border-border/80 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                        <th className="pb-3">Machine Code</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Health Score</th>
                        <th className="pb-3">Temp</th>
                        <th className="pb-3">Vibration</th>
                        <th className="pb-3">Hydraulic PSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {data.machines.map((m) => (
                        <tr key={m.id} className="hover:bg-muted/10 transition-colors">
                          <td className="py-3 font-semibold text-white">
                            <span>{m.name}</span>
                            <span className="block text-[10px] text-muted-foreground">{m.machineCode}</span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              m.status === 'CRITICAL' 
                                ? 'bg-destructive/10 text-destructive' 
                                : m.status === 'WARNING' 
                                ? 'bg-accent/10 text-accent' 
                                : 'bg-emerald-600/10 text-emerald-500'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`font-bold ${m.healthScore > 85 ? 'text-emerald-500' : 'text-amber-500'}`}>{m.healthScore}%</span>
                          </td>
                          <td className="py-3">{m.temperature} °C</td>
                          <td className="py-3 text-slate-400">{m.vibration} mm/s</td>
                          <td className="py-3 text-slate-400">{m.hydraulicPressure} PSI</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Defect Analysis / Work Orders */}
              <div className="bg-card border border-border rounded-xl p-6 shadow">
                <h3 className="text-lg font-bold text-white mb-4">Pending Predictive Maintenance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead>
                      <tr className="border-b border-border/80 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                        <th className="pb-3">Work Order</th>
                        <th className="pb-3">Priority</th>
                        <th className="pb-3">Assigned Technician</th>
                        <th className="pb-3">Scheduled Date</th>
                        <th className="pb-3">Failure Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {data.maintenanceOverview.workOrders.map((wo) => (
                        <tr key={wo.id} className="hover:bg-muted/10 transition-colors">
                          <td className="py-3 font-semibold text-white">
                            <span>{wo.workOrderNumber}</span>
                            <span className="block text-[10px] text-muted-foreground">{wo.machineName}</span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              wo.priority === 'CRITICAL' ? 'bg-destructive/10 text-destructive' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {wo.priority}
                            </span>
                          </td>
                          <td className="py-3 text-slate-400">{wo.assignedTechnician}</td>
                          <td className="py-3">{wo.scheduledDate}</td>
                          <td className="py-3 text-secondary font-bold">{wo.failureProbability}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Column: ECharts output lines, AI briefing summary, Telemetry Predictor, Energy charts */}
            <div className="space-y-8">
              
              {/* ECharts: Production Trends */}
              <div className="bg-card border border-border rounded-xl p-6 shadow">
                <h3 className="text-lg font-bold text-white mb-4">Hourly Production Target</h3>
                <div className="h-56">
                  <ReactECharts option={hourlyOutputOption} style={{ height: '100%' }} />
                </div>
              </div>

              {/* AI Plant Summarizer */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-md space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Brain className="h-4.5 w-4.5 text-primary" />
                  <span>AI Executive Plant Summary</span>
                </h3>

                <button 
                  onClick={handleGetSummary}
                  disabled={generatingSummary}
                  className="w-full py-2 bg-[#14B8A6]/20 border border-[#14B8A6]/30 hover:bg-[#14B8A6]/35 text-[#14B8A6] font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2"
                >
                  {generatingSummary ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Analyzing Plant Metrics...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="h-3.5 w-3.5" />
                      <span>Compile Plant Production Summary</span>
                    </>
                  )}
                </button>

                {aiSummaryText && (
                  <div className="bg-background border border-border rounded-lg p-3 text-[11px] text-slate-350 leading-relaxed max-h-36 overflow-y-auto">
                    <span className="font-bold text-white text-[10px] block mb-1 uppercase tracking-wide">Analysis Summary</span>
                    {aiSummaryText}
                  </div>
                )}
              </div>

              {/* AI Telemetry Predictor Panel */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-md space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Wrench className="h-4.5 w-4.5 text-primary" />
                  <span>AI Machine Failure Predictor</span>
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Select Machine</label>
                    <select
                      value={selMachine}
                      onChange={(e) => setSelMachine(e.target.value)}
                      className="w-full px-2 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none"
                    >
                      <option value="PRESS-301">Stamping Press 500T (PRESS-301)</option>
                      <option value="WELD-204">Robotic Weld-Arm 4 (WELD-204)</option>
                      <option value="CNC-101">CNC Lathe Ultra 5X (CNC-101)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Operating Temp (°C)</label>
                      <input
                        type="number"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Vibration (mm/s)</label>
                      <input
                        type="number"
                        value={vibration}
                        onChange={(e) => setVibration(parseFloat(e.target.value))}
                        className="w-full px-2 py-1 bg-background border border-border rounded text-xs text-foreground"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handlePredictFailure}
                    disabled={predicting}
                    className="w-full py-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2 shadow"
                  >
                    {predicting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Analyzing Failure Models...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="h-3.5 w-3.5" />
                        <span>Predict Anomaly Risk</span>
                      </>
                    )}
                  </button>
                </div>

                {predictionOutput && (
                  <div className="bg-background border border-border rounded-lg p-3 text-[11px] text-slate-350 leading-relaxed max-h-36 overflow-y-auto">
                    <span className="font-bold text-white text-[10px] block mb-1 uppercase tracking-wide">
                      Triage:{' '}
                      <span className={predictedRisk === 'HIGH' ? 'text-destructive' : 'text-emerald-500'}>
                        {predictedRisk} RISK
                      </span>
                    </span>
                    {predictionOutput}
                  </div>
                )}
              </div>

              {/* ECharts: Energy Consumption */}
              <div className="bg-card border border-border rounded-xl p-6 shadow">
                <h3 className="text-lg font-bold text-white mb-4">Hourly Energy usage</h3>
                <div className="h-44">
                  <ReactECharts option={energyUsageOption} style={{ height: '100%' }} />
                </div>
              </div>

              {/* AI Recommendations panel */}
              <div className="bg-card border border-border rounded-xl p-6 shadow space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>AI Recommendations</span>
                </h3>

                <div className="space-y-3">
                  {data.aiRecommendations.map((rec) => (
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
                  <span>Generate Production Report</span>
                </button>
              </div>

              {/* Recent Activity logs */}
              <div className="bg-card border border-border rounded-xl p-6 shadow space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>Recent Activities</span>
                </h3>
                
                <div className="space-y-3 text-xs text-slate-400">
                  {data.recentActivities.map((act) => (
                    <div key={act.id} className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-white">{act.title}</span>
                        <p className="text-[10px] text-slate-500">{act.description}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{act.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </>
      ) : (
        /* 2. Machine Monitoring Center */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Interactive Machine List & Filters */}
          <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6 shadow h-[650px] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Machine Registry</h3>
            
            {/* Filter controls */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by code or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-1">Status Filter</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-2 py-1 bg-background border border-border rounded text-[10px] text-foreground focus:outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="OPERATIONAL">Operational</option>
                    <option value="WARNING">Warning</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-muted-foreground uppercase mb-1">Assembly Line</label>
                  <select
                    value={filterLine}
                    onChange={(e) => setFilterLine(e.target.value)}
                    className="w-full px-2 py-1 bg-background border border-border rounded text-[10px] text-foreground focus:outline-none"
                  >
                    <option value="ALL">All Lines</option>
                    <option value="Line A">Line A (Stamping)</option>
                    <option value="Line B">Line B (Welding)</option>
                    <option value="Line C">Line C (Assembly)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List container */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredMachines.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMachine(m)}
                  className={`border p-3.5 rounded-lg cursor-pointer transition-all ${
                    selectedMachine?.id === m.id 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-background/40 border-border/80 hover:bg-muted/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-xs text-white block">{m.name}</span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">{m.machineCode} • {m.type}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      m.status === 'CRITICAL' 
                        ? 'bg-destructive/10 text-destructive' 
                        : m.status === 'WARNING' 
                        ? 'bg-accent/10 text-accent' 
                        : 'bg-emerald-600/10 text-emerald-500'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  {/* Micro health progress */}
                  <div className="mt-3 flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Health Score</span>
                    <span className={`font-bold ${m.healthScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{m.healthScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${m.healthScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${m.healthScore}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Detailed Machine card with progress indicators and dynamic AI recommendations */}
          <div className="lg:col-span-2 space-y-8">
            {selectedMachine ? (
              <div className="bg-card border border-border rounded-xl p-6 shadow space-y-6">
                
                {/* Machine title status */}
                <div className="flex justify-between items-start border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                      <Cpu className="h-5.5 w-5.5 text-primary" />
                      <span>{selectedMachine.name}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedMachine.machineCode} • {selectedMachine.productionLine}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedMachine.status === 'CRITICAL' 
                      ? 'bg-destructive/10 text-destructive' 
                      : selectedMachine.status === 'WARNING' 
                      ? 'bg-accent/10 text-accent' 
                      : selectedMachine.status === 'MAINTENANCE'
                      ? 'bg-amber-600/10 text-amber-500'
                      : 'bg-emerald-600/10 text-emerald-500'
                  }`}>
                    {selectedMachine.status}
                  </span>
                </div>

                {/* Progress Indicators: Health Score and Failure probability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Health score progress */}
                  <div className="bg-background border border-border rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Asset Health Score</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-white">{selectedMachine.healthScore}%</span>
                      <span className="text-xs text-emerald-500">OPERATIONAL RANGE</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          selectedMachine.healthScore > 80 ? 'bg-emerald-500' : selectedMachine.healthScore > 60 ? 'bg-amber-500' : 'bg-destructive'
                        }`} 
                        style={{ width: `${selectedMachine.healthScore}%` }} 
                      />
                    </div>
                  </div>

                  {/* Failure risk progress */}
                  <div className="bg-background border border-border rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Predictive Failure Probability</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-white">{selectedMachine.failureRisk}</span>
                      <span className="text-xs text-destructive">MTBF THRESHOLD LIMIT</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-destructive" 
                        style={{ 
                          width: `${
                            selectedMachine.failureRisk.includes('Severe') 
                              ? 78 
                              : selectedMachine.failureRisk.includes('High') 
                              ? 38 
                              : selectedMachine.failureRisk.includes('Medium')
                              ? 18
                              : 4
                          }%` 
                        }} 
                      />
                    </div>
                  </div>

                </div>

                {/* Machine sensors parameters */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live IoT Telemetry</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-background border border-border p-3.5 rounded-lg">
                      <span className="text-[10px] text-muted-foreground block">Operating Temp</span>
                      <span className="text-sm font-bold text-white block mt-1">{selectedMachine.temperature} °C</span>
                    </div>
                    <div className="bg-background border border-border p-3.5 rounded-lg">
                      <span className="text-[10px] text-muted-foreground block">Vibration Frequency</span>
                      <span className="text-sm font-bold text-white block mt-1">{selectedMachine.vibration} mm/s</span>
                    </div>
                    <div className="bg-background border border-border p-3.5 rounded-lg">
                      <span className="text-[10px] text-muted-foreground block">Spindle Speed</span>
                      <span className="text-sm font-bold text-white block mt-1">{selectedMachine.spindleSpeed} RPM</span>
                    </div>
                    <div className="bg-background border border-border p-3.5 rounded-lg">
                      <span className="text-[10px] text-muted-foreground block">Hydraulic Pressure</span>
                      <span className="text-sm font-bold text-white block mt-1">{selectedMachine.hydraulicPressure} PSI</span>
                    </div>
                  </div>
                </div>

                {/* Maintenance details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-background/40 border border-border p-4 rounded-xl">
                    <span className="text-muted-foreground block">Operating Age</span>
                    <span className="text-sm font-bold text-white mt-1 block">{selectedMachine.ageMonths} Months</span>
                  </div>
                  <div className="bg-background/40 border border-border p-4 rounded-xl">
                    <span className="text-muted-foreground block">Last Service Completed</span>
                    <span className="text-sm font-bold text-white mt-1 block">{selectedMachine.lastMaintenance}</span>
                  </div>
                  <div className="bg-background/40 border border-border p-4 rounded-xl">
                    <span className="text-muted-foreground block">Next Preventative Cycle</span>
                    <span className="text-sm font-bold text-white mt-1 block text-primary">{selectedMachine.nextMaintenance}</span>
                  </div>
                </div>

                {/* AI Machine Recommendation panel */}
                <div className="bg-[#2563EB]/5 border border-[#2563EB]/15 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-[#2563EB] uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="h-4 w-4" />
                    <span>AI Maintenance Recommendation</span>
                  </h4>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    {selectedMachine.status === 'CRITICAL' 
                      ? 'Critical overheating and vibration anomaly spike detected. Pause production line and dispatch technician Alex Mercer for immediate valve calibration.'
                      : selectedMachine.status === 'WARNING'
                      ? 'Motor housing thermal decay warning on Joint #3. Schedule preventative vibration damper adjustments before August 2nd.'
                      : 'Asset performance values within nominal boundaries. Maintain schedule calibration audits.'}
                  </p>
                </div>

              </div>
            ) : (
              <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-xl">
                <p className="text-xs text-muted-foreground">Select a machine from the registry to view monitoring sensors.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* PDF Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <span>Compile Industrial Production Brief</span>
              </h3>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-muted-foreground hover:text-white"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Calibration Consult Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter actions taken or details (e.g. Confirm CNC Spindle speeds, recalibrate weld torque limits)..."
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
                    <span>Download Production Brief</span>
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

// Close icon helper
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
