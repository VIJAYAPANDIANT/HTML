import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { BarChart3, Filter } from 'lucide-react';

export default function AnalyticsPage() {
  const [activeModule, setActiveModule] = useState<'agriculture' | 'manufacturing' | 'smartcity'>('agriculture');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedLine, setSelectedLine] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');

  // Dynamic simulation multipliers based on filters
  const multiplier = timeRange === '30d' ? 4.2 : timeRange === '90d' ? 12.5 : 1.0;
  const cropOffset = selectedCrop === 'wheat' ? 5 : selectedCrop === 'corn' ? -3 : 0;

  const mfgMultiplier = timeRange === '30d' ? 3.8 : timeRange === '90d' ? 11.2 : 1.0;
  const lineOffset = selectedLine === 'Line A' ? 4 : selectedLine === 'Line B' ? -2 : 0;

  const scMultiplier = timeRange === '30d' ? 4.0 : timeRange === '90d' ? 12.0 : 1.0;
  const zoneOffset = selectedZone === 'Loop' ? 12 : selectedZone === 'I-90' ? 24 : 0;

  // --- AGRICULTURE CHART OPTIONS ---
  const healthOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Sector 1A', 'Sector 2B', 'Sector 3C', 'Sector 4B'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', max: 100, axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Health Score',
        type: 'bar',
        barWidth: '40%',
        data: [
          Math.min(94 + cropOffset, 100),
          Math.min(88 + cropOffset, 100),
          Math.min(91 + cropOffset, 100),
          Math.max(58 + cropOffset, 0)
        ],
        itemStyle: {
          color: function (params: any) {
            return params.data < 60 ? '#EF4444' : '#14B8A6';
          },
          borderRadius: [5, 5, 0, 0]
        }
      }
    ]
  };

  const waterOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Water usage (Liters)',
        type: 'line',
        smooth: true,
        data: [1200, 1450, 1100, 1600, 1500, 1750, 1300].map(v => Math.round(v * multiplier)),
        itemStyle: { color: '#3B82F6' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' }
            ]
          }
        }
      }
    ]
  };

  const yieldTrendOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Yield Output (tons)',
        type: 'line',
        data: [42, 48, 55, 68, 72].map(v => Math.round(v * multiplier)),
        itemStyle: { color: '#10B981' },
        lineStyle: { width: 3 }
      }
    ]
  };

  const diseaseOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 9 }, bottom: '0%' },
    series: [
      {
        name: 'Disease Incidence share',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: 12, name: 'Leaf Rust' },
          { value: 8, name: 'Mildew' },
          { value: 4, name: 'Root Rot' }
        ],
        itemStyle: {
          borderRadius: 4,
          borderColor: '#0f172a',
          borderWidth: 2
        }
      }
    ]
  };

  const riskOption = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        radius: '90%',
        progress: { show: true, width: 12, itemStyle: { color: '#F59E0B' } },
        axisLine: { lineStyle: { width: 12, color: [[1, '#1e293b']] } },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, -10],
          fontSize: 22,
          fontWeight: 'bold',
          color: '#ffffff',
          formatter: '{value}%'
        },
        data: [{ value: 38 }]
      }
    ]
  };

  const soilRadarOption = {
    backgroundColor: 'transparent',
    radar: {
      indicator: [
        { name: 'Nitrogen (N)', max: 100 },
        { name: 'Phosphorus (P)', max: 100 },
        { name: 'Potassium (K)', max: 100 },
        { name: 'Moisture %', max: 100 },
        { name: 'Soil pH', max: 100 }
      ],
      shape: 'circle',
      splitNumber: 4,
      axisName: { color: '#94a3b8', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(71, 85, 105, 0.2)' } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: 'rgba(71, 85, 105, 0.2)' } }
    },
    series: [
      {
        name: 'Soil Profile Metrics',
        type: 'radar',
        data: [
          {
            value: [84, 76, 68, 62, 70],
            name: 'Optimal Profile',
            itemStyle: { color: '#3b82f6' },
            areaStyle: { color: 'rgba(59, 130, 246, 0.2)' }
          }
        ]
      }
    ]
  };

  // --- MANUFACTURING CHART OPTIONS ---
  const mfgProdTrendOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Shift 1', 'Shift 2', 'Shift 3'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Actual Output (units)',
        type: 'bar',
        barWidth: '35%',
        data: [3400, 3800, 3650].map(v => Math.round((v + lineOffset * 100) * mfgMultiplier)),
        itemStyle: { color: '#2563EB', borderRadius: [4, 4, 0, 0] }
      }
    ]
  };

  const mfgMachineUtilizationOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Press 500T', 'Weld-Arm 3', 'CNC Lathe 1', 'Paint Booth B'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', max: 100, axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Utilization %',
        type: 'bar',
        barWidth: '40%',
        data: [
          Math.min(92 + lineOffset, 100),
          Math.min(84 + lineOffset, 100),
          Math.min(78 + lineOffset, 100),
          Math.min(88 + lineOffset, 100)
        ],
        itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] }
      }
    ]
  };

  const mfgDowntimeAnalysisOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 9 }, bottom: '0%' },
    series: [
      {
        name: 'Downtime Factors Share',
        type: 'pie',
        radius: '65%',
        data: [
          { value: 45, name: 'Hydraulic Seal leak' },
          { value: 30, name: 'Calibration drift' },
          { value: 15, name: 'Operator setup latency' },
          { value: 10, name: 'Grid Tariff peak cuts' }
        ],
        itemStyle: { borderRadius: 4, borderColor: '#0f172a', borderWidth: 2 }
      }
    ]
  };

  const mfgEnergyConsumptionOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Line A', 'Line B', 'Line C'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'kWh', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Energy Load',
        type: 'bar',
        barWidth: '45%',
        data: [4200, 3800, 3100].map(v => Math.round(v * mfgMultiplier)),
        itemStyle: { color: '#F59E0B', borderRadius: [4, 4, 0, 0] }
      }
    ]
  };

  const mfgOeeTrendOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', max: 100, axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'OEE Index',
        type: 'line',
        smooth: true,
        data: [84.2, 86.8, 85.0, 89.4, 91.2],
        itemStyle: { color: '#14B8A6' },
        lineStyle: { width: 3 }
      }
    ]
  };

  const mfgMonthlyOutputOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Completed Units',
        type: 'bar',
        data: [64000, 78000, 84000, 92000, 108500].map(v => Math.round(v * mfgMultiplier)),
        itemStyle: { color: '#3B82F6', borderRadius: [4, 4, 0, 0] }
      }
    ]
  };

  const mfgMaintenanceCostOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Press 500T', 'Weld-Arm 3', 'CNC Lathe 1', 'Substation 7'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'USD ($)', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Calibration Cost',
        type: 'bar',
        stack: 'total',
        data: [12000, 8400, 4200, 6800],
        itemStyle: { color: '#3B82F6' }
      },
      {
        name: 'Spare Parts Cost',
        type: 'bar',
        stack: 'total',
        data: [8500, 6200, 3100, 4800],
        itemStyle: { color: '#EF4444' }
      }
    ]
  };

  // --- SMART CITY CHART OPTIONS (8 Charts) ---
  // 1. Traffic Trend Line Chart
  const scTrafficOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'Congestion %', max: 100, axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Congestion Trend',
        type: 'line',
        smooth: true,
        data: [42, 64, 48, 52, 78, 86, 54].map(v => Math.min(100, Math.max(0, v + zoneOffset))),
        itemStyle: { color: '#EF4444' },
        lineStyle: { width: 3 }
      }
    ]
  };

  // 2. Pollution Trend Area Chart
  const scPollutionOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'AQI Index', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'AQI Level',
        type: 'line',
        smooth: true,
        data: [54, 58, 72, 86, 64, 48, 52].map(v => Math.round(v * scMultiplier)),
        itemStyle: { color: '#14B8A6' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(20, 184, 166, 0.4)' },
              { offset: 1, color: 'rgba(20, 184, 166, 0)' }
            ]
          }
        }
      }
    ]
  };

  // 3. Water Consumption Chart
  const scWaterOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'Liters/Sec', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Water Supply Flow',
        type: 'line',
        step: 'middle',
        data: [1420, 1480, 1390, 1510, 1450, 1620, 1370].map(v => Math.round(v * scMultiplier)),
        itemStyle: { color: '#3B82F6' },
        lineStyle: { width: 2 }
      }
    ]
  };

  // 4. Energy Consumption actual vs capacity
  const scEnergyOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Grid A', 'Grid B', 'Grid C'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'Megawatts (MW)', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Operational Capacity',
        type: 'bar',
        data: [200, 200, 150],
        itemStyle: { color: '#475569', borderRadius: [3, 3, 0, 0] }
      },
      {
        name: 'Current Power Load',
        type: 'bar',
        data: [142.5, 186.2, 98.0].map(v => Math.round(v * scMultiplier)),
        itemStyle: { color: '#F59E0B', borderRadius: [3, 3, 0, 0] }
      }
    ]
  };

  // 5. Complaint Distribution Donut Chart
  const scComplaintsOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 9 }, bottom: '0%' },
    series: [
      {
        name: 'Citizen Complaints Allocation',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: 42, name: 'Traffic Signals Timing' },
          { value: 28, name: 'Garbage & Waste Bins' },
          { value: 18, name: 'Water Pipe Leaks' },
          { value: 12, name: 'Streetlights Outages' }
        ],
        itemStyle: { borderRadius: 4, borderColor: '#0f172a', borderWidth: 2 }
      }
    ]
  };

  // 6. Emergency Incidents
  const scIncidentsOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Jul 25', 'Jul 27', 'Jul 29', 'Jul 31', 'Aug 01'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'Incidents Count', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Logged Alarms',
        type: 'bar',
        barWidth: '40%',
        data: [4, 2, 5, 1, 2].map(v => Math.round(v * scMultiplier)),
        itemStyle: { color: '#EF4444', borderRadius: [3, 3, 0, 0] }
      }
    ]
  };

  // 7. Waste Collection
  const scWasteOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Zone A Bins', 'Zone B Bins', 'Zone C Bins', 'Zone D Bins'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'Tons Collected', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Tonnage Load',
        type: 'bar',
        barWidth: '35%',
        data: [22, 14, 18, 9].map(v => Math.round(v * scMultiplier)),
        itemStyle: { color: '#A855F7', borderRadius: [4, 4, 0, 0] }
      }
    ]
  };

  // 8. City Performance Radar Chart
  const scPerformanceOption = {
    backgroundColor: 'transparent',
    radar: {
      indicator: [
        { name: 'Mobility Routing', max: 100 },
        { name: 'Air Purity AQI', max: 100 },
        { name: 'Water flow rate', max: 100 },
        { name: 'Power Grid stability', max: 100 },
        { name: 'Infrastructure Health', max: 100 },
        { name: 'Citizen satisfaction', max: 100 }
      ],
      shape: 'circle',
      splitNumber: 4,
      axisName: { color: '#94a3b8', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(71, 85, 105, 0.2)' } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: 'rgba(71, 85, 105, 0.2)' } }
    },
    series: [
      {
        name: 'Metropolitan Indexes',
        type: 'radar',
        data: [
          {
            value: [82, 88, 91, 86, 94, 78],
            name: 'Metropolis Sector 7',
            itemStyle: { color: '#10B981' },
            areaStyle: { color: 'rgba(16, 185, 129, 0.2)' }
          }
        ]
      }
    ]
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header and Switcher */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-border pb-4 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <BarChart3 className="h-5.5 w-5.5 text-primary" />
            <span>Industrial & Municipal Analytics Cockpit</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Cross-examine telemetry trends and model performance profiles.</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-muted/20 p-1 rounded-lg border border-border self-start lg:self-auto">
          <button
            onClick={() => setActiveModule('agriculture')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeModule === 'agriculture' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white'
            }`}
          >
            Agriculture
          </button>
          <button
            onClick={() => setActiveModule('manufacturing')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeModule === 'manufacturing' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white'
            }`}
          >
            Manufacturing
          </button>
          <button
            onClick={() => setActiveModule('smartcity')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeModule === 'smartcity' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white'
            }`}
          >
            Smart City
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center space-x-3 bg-card border border-border p-3.5 rounded-xl shadow self-start">
        <Filter className="h-4 w-4 text-muted-foreground ml-1" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Metrics Filters</span>
        
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-background border border-border rounded text-xs text-foreground px-2 py-1.5 focus:outline-none"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>

        {activeModule === 'agriculture' && (
          <select 
            value={selectedCrop} 
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-background border border-border rounded text-xs text-foreground px-2 py-1.5 focus:outline-none"
          >
            <option value="all">All Crops</option>
            <option value="wheat">Wheat Only</option>
            <option value="corn">Corn Only</option>
          </select>
        )}

        {activeModule === 'manufacturing' && (
          <select 
            value={selectedLine} 
            onChange={(e) => setSelectedLine(e.target.value)}
            className="bg-background border border-border rounded text-xs text-foreground px-2 py-1.5 focus:outline-none"
          >
            <option value="all">All Assembly Lines</option>
            <option value="Line A">Line A (Stamping)</option>
            <option value="Line B">Line B (Welding)</option>
            <option value="Line C">Line C (Assembly)</option>
          </select>
        )}

        {activeModule === 'smartcity' && (
          <select 
            value={selectedZone} 
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-background border border-border rounded text-xs text-foreground px-2 py-1.5 focus:outline-none"
          >
            <option value="all">All Zones</option>
            <option value="Loop">Downtown Loop</option>
            <option value="I-90">Interstate-90 Expressway</option>
          </select>
        )}
      </div>

      {activeModule === 'agriculture' && (
        /* Agriculture Charts (6-grid) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Crop Health Index</h4>
            <div className="h-56">
              <ReactECharts option={healthOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Daily Water Usage</h4>
            <div className="h-56">
              <ReactECharts option={waterOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Yield Output Trend</h4>
            <div className="h-56">
              <ReactECharts option={yieldTrendOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Disease Incidence Breakdown</h4>
            <div className="h-56">
              <ReactECharts option={diseaseOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Drought Risk Meter</h4>
            <div className="h-56">
              <ReactECharts option={riskOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Soil Profile Parameters</h4>
            <div className="h-56">
              <ReactECharts option={soilRadarOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {activeModule === 'manufacturing' && (
        /* Manufacturing Charts (7-grid) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Production Trend (Actual Units)</h4>
            <div className="h-56">
              <ReactECharts option={mfgProdTrendOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Machine Utilization Output</h4>
            <div className="h-56">
              <ReactECharts option={mfgMachineUtilizationOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Downtime Share Factors</h4>
            <div className="h-56">
              <ReactECharts option={mfgDowntimeAnalysisOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Energy Grid Tariff loads</h4>
            <div className="h-56">
              <ReactECharts option={mfgEnergyConsumptionOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Operational efficiency (OEE)</h4>
            <div className="h-56">
              <ReactECharts option={mfgOeeTrendOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Monthly Target Completion</h4>
            <div className="h-56">
              <ReactECharts option={mfgMonthlyOutputOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow col-span-1 md:col-span-2 lg:col-span-3">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Total Maintenance Expenditures Allocation</h4>
            <div className="h-64">
              <ReactECharts option={mfgMaintenanceCostOption} style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {activeModule === 'smartcity' && (
        /* Smart City Charts (8-grid) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Traffic Trend */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Traffic Congestion Index</h4>
            <div className="h-56">
              <ReactECharts option={scTrafficOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 2: Pollution Trend */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Pollution Levels AQI</h4>
            <div className="h-56">
              <ReactECharts option={scPollutionOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 3: Water Consumption */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Water Supply Flow</h4>
            <div className="h-56">
              <ReactECharts option={scWaterOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 4: Energy Consumption */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Grid Load Demand</h4>
            <div className="h-56">
              <ReactECharts option={scEnergyOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 5: Complaint Distribution */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Citizen Complaints Allocation</h4>
            <div className="h-56">
              <ReactECharts option={scComplaintsOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 6: Emergency Incidents */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Emergency Incident Alarms</h4>
            <div className="h-56">
              <ReactECharts option={scIncidentsOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 7: Waste Collection */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Waste Tonnage Collected</h4>
            <div className="h-56">
              <ReactECharts option={scWasteOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 8: City Performance */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Municipal Performance Indexes</h4>
            <div className="h-56">
              <ReactECharts option={scPerformanceOption} style={{ height: '100%' }} />
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
