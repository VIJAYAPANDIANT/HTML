import { useState, useEffect } from 'react';
import { 
  Factory, 
  Cpu, 
  BarChart3, 
  Zap, 
  Wrench, 
  Sparkles, 
  RefreshCw, 
  Play, 
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import api from '@/lib/axios';

import FactoryOverviewWidget from './components/FactoryOverviewWidget';
import MachineMonitoringWidget from './components/MachineMonitoringWidget';
import type { MachineStatus } from './components/MachineMonitoringWidget';
import ProductionOverviewWidget from './components/ProductionOverviewWidget';
import ShiftPerformanceWidget from './components/ShiftPerformanceWidget';
import EnergyConsumptionWidget from './components/EnergyConsumptionWidget';
import MaintenanceOverviewWidget from './components/MaintenanceOverviewWidget';
import AIRecommendationPanelWidget from './components/AIRecommendationPanelWidget';
import RecentActivitiesWidget from './components/RecentActivitiesWidget';
import AlertsPanelWidget from './components/AlertsPanelWidget';
import ManufacturingSimulationModal from './components/ManufacturingSimulationModal';

export default function ManufacturingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'machines' | 'production' | 'energy' | 'maintenance' | 'ai'>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // Modal states
  const [showSimModal, setShowSimModal] = useState(false);
  const [selectedMachineForSim, setSelectedMachineForSim] = useState<MachineStatus | undefined>(undefined);
  const [exportingReport, setExportingReport] = useState(false);
  const [optimizingEnergy, setOptimizingEnergy] = useState(false);

  // Fetch Dashboard Telemetry from Spring Boot backend
  const fetchDashboardData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const response = await api.get('/api/v1/manufacturing/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      console.warn('Backend endpoint unreached, using local fallback telemetry dataset:', err);
      // Rich local fallback matching backend DTO structure
      setDashboardData({
        factoryOverview: {
          plantName: "IntelliSphere Plant 01 - Detroit Hub",
          location: "Detroit, MI - USA",
          plantStatus: "OPERATIONAL",
          overallOee: 88.4,
          availabilityScore: 92.1,
          performanceScore: 94.5,
          qualityScore: 98.2,
          activeLinesCount: 4,
          totalLinesCount: 4,
          activeMachinesCount: 22,
          totalMachinesCount: 24,
          activeWorkersCount: 142,
          dailyOutputTarget: 12000.0,
          currentDailyOutput: 10850.0,
          targetCompletionPercentage: 90.4,
          productionLines: [
            { id: "LINE-A", name: "Line A - Stamping", status: "OPERATIONAL", target: 3000, actual: 2890, oee: 91.2 },
            { id: "LINE-B", name: "Line B - Robotic Welding", status: "DEGRADED", target: 3000, actual: 2540, oee: 81.5 },
            { id: "LINE-C", name: "Line C - Final Assembly", status: "OPERATIONAL", target: 4000, actual: 3780, oee: 89.8 },
            { id: "LINE-D", name: "Line D - Quality Inspection", status: "OPERATIONAL", target: 2000, actual: 1640, oee: 94.0 }
          ]
        },
        machines: [
          {
            id: "11111111-1111-1111-1111-111111111111",
            name: "CNC Lathe Ultra 5X",
            machineCode: "CNC-101",
            type: "CNC Lathe",
            productionLine: "Line A - Stamping",
            status: "OPERATIONAL",
            healthScore: 96,
            temperature: 68.5,
            vibration: 1.4,
            spindleSpeed: 3200,
            hydraulicPressure: 1450,
            ageMonths: 14,
            lastMaintenance: "2026-07-15",
            nextMaintenance: "2026-08-15",
            failureRisk: "Low (4.2%)"
          },
          {
            id: "22222222-2222-2222-2222-222222222222",
            name: "KUKA Robotic Weld-Arm 4",
            machineCode: "WELD-204",
            type: "Robotic Arm",
            productionLine: "Line B - Robotic Welding",
            status: "WARNING",
            healthScore: 74,
            temperature: 86.2,
            vibration: 4.8,
            spindleSpeed: 0,
            hydraulicPressure: 1820,
            ageMonths: 32,
            lastMaintenance: "2026-06-10",
            nextMaintenance: "2026-08-02",
            failureRisk: "High (38.5%)"
          },
          {
            id: "33333333-3333-3333-3333-333333333333",
            name: "Schuler Stamping Press 500T",
            machineCode: "PRESS-301",
            type: "Stamping Press",
            productionLine: "Line A - Stamping",
            status: "CRITICAL",
            healthScore: 52,
            temperature: 94.8,
            vibration: 7.2,
            spindleSpeed: 1200,
            hydraulicPressure: 2100,
            ageMonths: 48,
            lastMaintenance: "2026-05-20",
            nextMaintenance: "2026-07-30",
            failureRisk: "Severe (78.2%)"
          },
          {
            id: "44444444-4444-4444-4444-444444444444",
            name: "Bosch Rexroth Pump H2",
            machineCode: "PUMP-402",
            type: "Hydraulic Pump",
            productionLine: "Line C - Final Assembly",
            status: "MAINTENANCE",
            healthScore: 60,
            temperature: 72.0,
            vibration: 2.1,
            spindleSpeed: 1800,
            hydraulicPressure: 1600,
            ageMonths: 28,
            lastMaintenance: "2026-07-31",
            nextMaintenance: "2026-08-10",
            failureRisk: "Medium (18.0%)"
          },
          {
            id: "55555555-5555-5555-5555-555555555555",
            name: "FlexLink Conveyor System C-3",
            machineCode: "CONV-503",
            type: "Conveyor Assembly",
            productionLine: "Line C - Final Assembly",
            status: "OPERATIONAL",
            healthScore: 92,
            temperature: 62.4,
            vibration: 1.1,
            spindleSpeed: 950,
            hydraulicPressure: 850,
            ageMonths: 18,
            lastMaintenance: "2026-07-01",
            nextMaintenance: "2026-09-01",
            failureRisk: "Low (2.8%)"
          }
        ],
        productionOverview: {
          targetUnits: 12000,
          actualUnits: 10850,
          scrapUnits: 195,
          yieldRate: 98.2,
          defectRate: 1.8,
          throughputPerHour: 1356.25,
          hourlyOutputTrend: [
            { hour: "06:00", target: 1500, actual: 1480, scrap: 12 },
            { hour: "08:00", target: 1500, actual: 1420, scrap: 24 },
            { hour: "10:00", target: 1500, actual: 1310, scrap: 42 },
            { hour: "12:00", target: 1500, actual: 1490, scrap: 18 },
            { hour: "14:00", target: 1500, actual: 1380, scrap: 31 },
            { hour: "16:00", target: 1500, actual: 1450, scrap: 20 },
            { hour: "18:00", target: 1500, actual: 1180, scrap: 38 },
            { hour: "20:00", target: 1500, actual: 1140, scrap: 10 }
          ],
          defectCategoryBreakdown: [
            { category: "Welding Micro-Fissure", count: 78, percentage: 40.0 },
            { category: "Surface Scratch", count: 45, percentage: 23.0 },
            { category: "Dimensional Variance", count: 38, percentage: 19.5 },
            { category: "Stamping Burr", count: 34, percentage: 17.5 }
          ]
        },
        shiftPerformance: {
          currentShift: "Shift 1 - Morning (06:00 - 14:00)",
          activeSupervisor: "Marcus Vance (Lead Engineer)",
          currentShiftProgress: 87.5,
          shifts: [
            { name: "Shift 1 - Morning", supervisor: "Marcus Vance", targetUnits: 4500, actualUnits: 4320, downtimeMinutes: 22, oeePercentage: 91.5, status: "ACTIVE" },
            { name: "Shift 2 - Afternoon", supervisor: "Elena Rostova", targetUnits: 4500, actualUnits: 4180, downtimeMinutes: 48, oeePercentage: 86.2, status: "UPCOMING" },
            { name: "Shift 3 - Night", supervisor: "David Kim", targetUnits: 3000, actualUnits: 2350, downtimeMinutes: 75, oeePercentage: 78.4, status: "COMPLETED" }
          ]
        },
        energyConsumption: {
          currentKwh: 4250.8,
          dailyKwhTotal: 34200.0,
          costTodayUsd: 4104.0,
          efficiencyKwhPerUnit: 3.15,
          peakDemandMw: 4.8,
          carbonFootprintKg: 14250.0,
          peakWarning: true,
          energyRating: "A- Class",
          hourlyUsageTrend: [
            { time: "06:00", kwh: 380, cost: 45.6 },
            { time: "08:00", kwh: 490, cost: 58.8 },
            { time: "10:00", kwh: 580, cost: 69.6 },
            { time: "12:00", kwh: 560, cost: 67.2 },
            { time: "14:00", kwh: 610, cost: 73.2 },
            { time: "16:00", kwh: 590, cost: 70.8 },
            { time: "18:00", kwh: 440, cost: 52.8 }
          ],
          lineEnergyBreakdown: [
            { line: "Line A Stamping", kwh: 12500, share: 36.5 },
            { line: "Line B Welding", kwh: 11200, share: 32.7 },
            { line: "Line C Assembly", kwh: 7800, share: 22.8 },
            { line: "Line D Inspection", kwh: 2700, share: 8.0 }
          ]
        },
        maintenanceOverview: {
          mtbfHours: 148.5,
          mttrHours: 2.4,
          pendingWorkOrdersCount: 6,
          criticalWorkOrdersCount: 2,
          predictiveMaintenanceAccuracy: 96.8,
          workOrders: [
            { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", workOrderNumber: "WO-9082", machineName: "Schuler Stamping Press 500T", issueDescription: "Hydraulic fluid temperature spike & high vibration anomaly", priority: "CRITICAL", status: "SCHEDULED", failureProbability: 78.2, assignedTechnician: "Alex Rivera", estimatedDurationHours: 3, scheduledDate: "2026-07-31 14:00" },
            { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", workOrderNumber: "WO-9078", machineName: "KUKA Robotic Weld-Arm 4", issueDescription: "Joint #3 motor housing thermal decay prediction", priority: "HIGH", status: "IN_PROGRESS", failureProbability: 38.5, assignedTechnician: "Sarah Jenkins", estimatedDurationHours: 2, scheduledDate: "2026-07-31 11:30" },
            { id: "cccccccc-cccc-cccc-cccc-cccccccccccc", workOrderNumber: "WO-9065", machineName: "Bosch Rexroth Pump H2", issueDescription: "Routine seal calibration and filter mesh check", priority: "MEDIUM", status: "SCHEDULED", failureProbability: 18.0, assignedTechnician: "Kenji Sato", estimatedDurationHours: 1, scheduledDate: "2026-08-01 09:00" }
          ]
        },
        aiRecommendations: [
          { id: "REC-01", title: "Predictive Maintenance Override - Stamping Press 500T", category: "PREDICTIVE_MAINTENANCE", impact: "High", description: "Press 500T hydraulic pressure fluctuation detected at 2,100 PSI with 94.8°C thermal rise. Performing immediate valve seal replacement avoids catastrophic main pump failure.", actionableStep: "Dispatch technician Alex Rivera & pause Line A for 45 mins.", confidenceScore: 96.4, estimatedSavings: "Avoids $85,000 unplanned downtime cost" },
          { id: "REC-02", title: "Dynamic Energy Load Shifting - Peak Demand Reduction", category: "ENERGY_SAVING", impact: "Medium", description: "Grid demand load is projected to hit peak tariffs between 14:00 - 16:00. Throttling Line B welding power buffer by 12% during peak window cuts demand charges.", actionableStep: "Enable AI Smart Grid Throttle mode.", confidenceScore: 92.8, estimatedSavings: "$3,400 per shift in peak demand surcharges" },
          { id: "REC-03", title: "Robotic Arm Weld-Speed Calibration", category: "QUALITY_OPTIMIZATION", impact: "Medium", description: "Micro-fissures in Line B welds reduced by 40% when robotic feed speed is lowered from 450 mm/s to 420 mm/s.", actionableStep: "Apply automated robot trajectory profile updates.", confidenceScore: 94.1, estimatedSavings: "Increase overall yield from 98.2% to 99.4%" }
        ],
        alerts: [
          { id: "10000000-0000-0000-0000-000000000001", title: "High Temperature Warning", category: "Overheating", severity: "CRITICAL", message: "Schuler Stamping Press 500T operating temperature exceeded 94.8°C (threshold: 90.0°C).", machineCode: "PRESS-301", status: "ACTIVE", timestamp: "12m ago" },
          { id: "20000000-0000-0000-0000-000000000002", title: "Vibration Anomaly Detected", category: "Vibration Spike", severity: "WARNING", message: "KUKA Robotic Weld-Arm 4 vibration increased to 4.8 mm/s on Joint 3.", machineCode: "WELD-204", status: "ACKNOWLEDGED", timestamp: "45m ago" },
          { id: "30000000-0000-0000-0000-000000000003", title: "Peak Energy Tariff Notice", category: "Power Surge", severity: "INFO", message: "Industrial grid peak tariff window initiated. Demand currently at 4.8 MW.", machineCode: "GRID- Detroit", status: "ACTIVE", timestamp: "1h ago" }
        ],
        recentActivities: [
          { id: "ACT-101", title: "Machine Telemetry Calibrated", description: "CNC Lathe Ultra 5X spindle speed sensor recalibrated successfully.", type: "MACHINE", timestamp: "15m ago", operator: "John Doe (Tech)" },
          { id: "ACT-102", title: "Shift 1 Progress Sync", description: "Morning shift logged 4,320 completed automotive units (91.5% OEE).", type: "SHIFT", timestamp: "40m ago", operator: "Marcus Vance (Lead)" },
          { id: "ACT-103", title: "Predictive Work Order Created", description: "Work Order WO-9082 automatically issued by AI Decision Engine.", type: "MAINTENANCE", timestamp: "1h ago", operator: "AI Decision Engine" }
        ]
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // PDF Report Download
  const handleExportPdfReport = async () => {
    setExportingReport(true);
    try {
      const payload = {
        metrics: {
          overallOee: `${dashboardData?.factoryOverview?.overallOee || 88.4}%`,
          dailyOutput: `${dashboardData?.factoryOverview?.currentDailyOutput || 10850} / ${dashboardData?.factoryOverview?.dailyOutputTarget || 12000} units`,
          activeMachines: `${dashboardData?.factoryOverview?.activeMachinesCount || 22} / ${dashboardData?.factoryOverview?.totalMachinesCount || 24}`,
          plantStatus: dashboardData?.factoryOverview?.plantStatus || "OPERATIONAL"
        },
        alerts: dashboardData?.alerts?.map((a: any) => `${a.title} on ${a.machineCode}: ${a.message}`) || [
          "Stamping Press 500T operating temperature exceeded 94.8°C"
        ],
        predictions: "AI Decision Engine predicts high probability of main valve seal degradation on Press 500T. Dispatch technician within 24 hours.",
        userNotes: "Shift 1 routine calibration completed. Overall plant OEE at 88.4%."
      };

      const response = await api.post('/api/v1/manufacturing/report', payload, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'IntelliSphere_Manufacturing_Report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export PDF report:', err);
    } finally {
      setExportingReport(false);
    }
  };

  // AI Energy Optimization Action
  const handleOptimizeEnergy = async () => {
    setOptimizingEnergy(true);
    try {
      await api.post('/api/v1/manufacturing/optimize-energy');
    } catch (err) {
      console.error('Energy optimization trigger:', err);
    } finally {
      setTimeout(() => {
        setOptimizingEnergy(false);
        fetchDashboardData(true);
      }, 1000);
    }
  };

  // Work Order Creation Handler
  const handleCreateWorkOrder = async (machineName: string, issueDescription: string, priority: string) => {
    try {
      await api.post('/api/v1/manufacturing/work-orders', {
        machineName,
        issueDescription,
        priority
      });
    } catch (err) {
      console.error('Create work order:', err);
    } finally {
      fetchDashboardData(true);
    }
  };

  const handleOpenSimForMachine = (machine: MachineStatus) => {
    setSelectedMachineForSim(machine);
    setShowSimModal(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <span className="text-sm font-bold text-foreground">Initializing Manufacturing Telemetry Suite...</span>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Factory },
    { id: 'machines', name: 'Machine Telemetry', icon: Cpu },
    { id: 'production', name: 'Production & Shifts', icon: BarChart3 },
    { id: 'energy', name: 'Energy & Carbon', icon: Zap },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench },
    { id: 'ai', name: 'AI Decision Center', icon: Sparkles },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Command Control Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-inner">
              <Factory className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Smart Manufacturing Intelligence</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Live Telemetry
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                AI-driven factory floor optimization, predictive maintenance, energy load balancing, and OEE analytics
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="px-3.5 py-2 bg-background/80 hover:bg-card border border-border rounded-xl text-xs font-bold text-foreground transition-all flex items-center space-x-2 shadow-sm"
            title="Refresh Telemetry Data"
          >
            <RefreshCw className={`h-4 w-4 text-primary ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Sync</span>
          </button>

          <button
            onClick={() => {
              setSelectedMachineForSim(undefined);
              setShowSimModal(true);
            }}
            className="px-4 py-2 bg-secondary/15 hover:bg-secondary/25 border border-secondary/30 text-secondary font-extrabold rounded-xl text-xs transition-all flex items-center space-x-2 shadow-sm"
          >
            <Play className="h-4 w-4" />
            <span>Launch AI Simulator</span>
          </button>

          <button
            onClick={handleExportPdfReport}
            disabled={exportingReport}
            className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
          >
            {exportingReport ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export Executive Brief</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-border/60 pb-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/10' 
                  : 'text-muted-foreground hover:bg-card hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Views */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <FactoryOverviewWidget 
            data={dashboardData.factoryOverview} 
            onSelectLine={() => setActiveTab('production')}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ProductionOverviewWidget data={dashboardData.productionOverview} />
              <AIRecommendationPanelWidget 
                recommendations={dashboardData.aiRecommendations}
                onApplyRecommendation={() => fetchDashboardData(true)}
              />
            </div>

            <div className="space-y-8">
              <AlertsPanelWidget 
                alerts={dashboardData.alerts} 
                onAcknowledgeAlert={() => fetchDashboardData(true)}
                onResolveAlert={() => fetchDashboardData(true)}
              />
              <RecentActivitiesWidget activities={dashboardData.recentActivities} />
            </div>
          </div>
        </div>
      )}

      {/* 2. MACHINES TAB */}
      {activeTab === 'machines' && (
        <MachineMonitoringWidget 
          machines={dashboardData.machines}
          onRunSimulation={handleOpenSimForMachine}
        />
      )}

      {/* 3. PRODUCTION TAB */}
      {activeTab === 'production' && (
        <div className="space-y-8">
          <ProductionOverviewWidget data={dashboardData.productionOverview} />
          <ShiftPerformanceWidget data={dashboardData.shiftPerformance} />
        </div>
      )}

      {/* 4. ENERGY TAB */}
      {activeTab === 'energy' && (
        <EnergyConsumptionWidget 
          data={dashboardData.energyConsumption}
          onOptimizeEnergy={handleOptimizeEnergy}
          optimizing={optimizingEnergy}
        />
      )}

      {/* 5. MAINTENANCE TAB */}
      {activeTab === 'maintenance' && (
        <MaintenanceOverviewWidget 
          data={dashboardData.maintenanceOverview}
          onCreateWorkOrder={handleCreateWorkOrder}
        />
      )}

      {/* 6. AI INSIGHTS TAB */}
      {activeTab === 'ai' && (
        <div className="space-y-8">
          <AIRecommendationPanelWidget 
            recommendations={dashboardData.aiRecommendations}
            onApplyRecommendation={() => fetchDashboardData(true)}
          />

          <div className="bg-card/70 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-foreground">Interactive AI Telemetry Simulator</h3>
                <p className="text-xs text-muted-foreground">Test machine operating temperatures, vibration spikes, and spindle speeds against Gemini AI predictive risk models.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedMachineForSim(undefined);
                  setShowSimModal(true);
                }}
                className="px-4 py-2.5 bg-primary text-white font-extrabold rounded-xl text-xs flex items-center space-x-2 shadow-md hover:bg-primary/90"
              >
                <Sparkles className="h-4 w-4" />
                <span>Open Simulator Console</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Telemetry Simulation Modal */}
      <ManufacturingSimulationModal 
        isOpen={showSimModal}
        onClose={() => setShowSimModal(false)}
        initialMachine={selectedMachineForSim}
      />
    </div>
  );
}
