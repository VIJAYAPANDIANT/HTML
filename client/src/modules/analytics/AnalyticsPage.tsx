import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { BarChart3, Filter } from 'lucide-react';

export default function AnalyticsPage() {
  const [activeModule, setActiveModule] = useState<'agriculture' | 'manufacturing'>('agriculture');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedLine, setSelectedLine] = useState('all');

  // Dynamic simulation multipliers based on filters
  const multiplier = timeRange === '30d' ? 4.2 : timeRange === '90d' ? 12.5 : 1.0;
  const cropOffset = selectedCrop === 'wheat' ? 5 : selectedCrop === 'corn' ? -3 : 0;

  const mfgMultiplier = timeRange === '30d' ? 3.8 : timeRange === '90d' ? 11.2 : 1.0;
  const lineOffset = selectedLine === 'Line A' ? 4 : selectedLine === 'Line B' ? -2 : 0;

  // --- AGRICULTURE CHART OPTIONS ---
  // 1. Crop Health Chart (Bar Chart)
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

  // 2. Water Usage Chart (Area Chart)
  const waterOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Water Consumed (Gal)',
        type: 'line',
        smooth: true,
        data: [42 * multiplier, 45 * multiplier, 40 * multiplier, 48 * multiplier, 52 * multiplier, 38 * multiplier, 45 * multiplier],
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
      }
    ]
  };

  // 3. Yield Trend (Line / Area Chart)
  const yieldOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 10 }, bottom: '0%' },
    xAxis: {
      type: 'category',
      data: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Historical Yield (Tons)',
        type: 'line',
        smooth: true,
        data: [12, 14, 15, 18, 16, 22],
        itemStyle: { color: '#14B8A6' },
        lineStyle: { width: 3 }
      },
      {
        name: 'Forecast Yield (Tons)',
        type: 'line',
        smooth: true,
        dashed: true,
        data: [null, null, null, null, 18, 24],
        itemStyle: { color: '#F59E0B' },
        lineStyle: { width: 3, type: 'dashed' }
      }
    ]
  };

  // 4. Disease Distribution (Donut Chart)
  const diseaseOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { show: false },
    series: [
      {
        name: 'Disease Anomaly Share',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: '#1e293b', borderWidth: 2 },
        label: { show: true, color: '#94a3b8', fontSize: 9 },
        data: [
          { value: 65, name: 'Healthy Crops', itemStyle: { color: '#14B8A6' } },
          { value: 20, name: 'Leaf Rust (Wheat)', itemStyle: { color: '#F59E0B' } },
          { value: 10, name: 'Stem Blight', itemStyle: { color: '#EF4444' } },
          { value: 5, name: 'Undetermined Anomaly', itemStyle: { color: '#8B5CF6' } }
        ]
      }
    ]
  };

  // 5. Risk Score Gauge (Radial Donut)
  const riskOption = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'],
        radius: '90%',
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 8,
            color: [
              [0.3, '#14B8A6'],
              [0.7, '#F59E0B'],
              [1, '#EF4444']
            ]
          }
        },
        pointer: { icon: 'path://M12.8,0.7l12,20.1c0.6,1,0.3,2.3-0.7,2.9c-0.4,0.2-0.8,0.3-1.2,0.3H0.9c-1.1,0-2-0.9-2-2c0-0.4,0.1-0.8,0.3-1.2l12-20.1C11.8-0.3,13-0.3,12.8,0.7z', width: 6, length: '60%', offsetCenter: [0, 8] },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 9, distance: -35 },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#ffffff',
          fontSize: 18,
          offsetCenter: [0, -10]
        },
        data: [{ value: 34 + cropOffset, name: 'Aggregate Risk' }]
      }
    ]
  };

  // 6. Monthly Performance (Radar Chart)
  const performanceOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    radar: {
      indicator: [
        { name: 'Water Ratio', max: 100 },
        { name: 'Yield Weight', max: 100 },
        { name: 'Soil PH', max: 100 },
        { name: 'NPK Balance', max: 100 },
        { name: 'Humidity Index', max: 100 }
      ],
      shape: 'circle',
      axisName: { color: '#94a3b8', fontSize: 9 },
      splitArea: { show: false },
      splitLine: { lineStyle: { color: '#334155' } },
      axisLine: { lineStyle: { color: '#334155' } }
    },
    series: [
      {
        name: 'Target Profile vs Actual',
        type: 'radar',
        data: [
          {
            value: [80, 88, 70, 75, 82],
            name: 'Wheat Sector 1A',
            itemStyle: { color: '#2563EB' },
            lineStyle: { width: 2 },
            areaStyle: { color: 'rgba(37, 99, 235, 0.2)' }
          }
        ]
      }
    ]
  };


  // --- MANUFACTURING CHART OPTIONS ---
  // 1. Production Trend
  const mfgProdTrendOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 10 }, bottom: '0%' },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Target Output (Units)',
        type: 'line',
        step: 'middle',
        data: [1500 * mfgMultiplier, 1500 * mfgMultiplier, 1500 * mfgMultiplier, 1500 * mfgMultiplier, 1500 * mfgMultiplier, 1200 * mfgMultiplier, 800 * mfgMultiplier],
        itemStyle: { color: '#94a3b8' },
        lineStyle: { width: 1, type: 'dashed' }
      },
      {
        name: 'Actual Output (Units)',
        type: 'line',
        smooth: true,
        data: [
          (1480 + lineOffset) * mfgMultiplier, 
          (1420 + lineOffset) * mfgMultiplier, 
          (1310 + lineOffset) * mfgMultiplier, 
          (1490 + lineOffset) * mfgMultiplier, 
          (1380 + lineOffset) * mfgMultiplier, 
          (1180 + lineOffset) * mfgMultiplier, 
          (740 + lineOffset) * mfgMultiplier
        ],
        itemStyle: { color: '#2563EB' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.2)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.0)' }
            ]
          }
        }
      }
    ]
  };

  // 2. Machine Utilization
  const mfgMachineUtilityOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['CNC Lathe', 'Robotic Arm', 'Stamping Press', 'Hydraulic Pump', 'Conveyor'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', max: 100, axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Utilization %',
        type: 'bar',
        barWidth: '45%',
        data: [
          Math.min(92 + lineOffset, 100),
          Math.min(84 + lineOffset, 100),
          Math.min(78 + lineOffset, 100),
          Math.min(65 + lineOffset, 100),
          Math.min(89 + lineOffset, 100)
        ],
        itemStyle: {
          color: '#14B8A6',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  };

  // 3. Downtime Analysis
  const mfgDowntimeOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 9 }, bottom: '0%' },
    series: [
      {
        name: 'Downtime Factors',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: '#1e293b', borderWidth: 2 },
        label: { show: false },
        data: [
          { value: 45, name: 'Mechanical Wear', itemStyle: { color: '#EF4444' } },
          { value: 25, name: 'Electrical Calibration', itemStyle: { color: '#F59E0B' } },
          { value: 20, name: 'Peak Grid Shift Throttles', itemStyle: { color: '#2563EB' } },
          { value: 10, name: 'Planned Maintenance', itemStyle: { color: '#14B8A6' } }
        ]
      }
    ]
  };

  // 4. Energy Consumption
  const mfgEnergyConsumptionOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'kWh', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Peak Power Load',
        type: 'bar',
        barWidth: '40%',
        data: [380, 490, 580, 560, 610, 590, 440, 310],
        itemStyle: { color: '#F59E0B', borderRadius: 4 }
      }
    ]
  };

  // 5. Efficiency Trend (OEE Index)
  const mfgOeeTrendOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 9 }, bottom: '0%' },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', max: 100, axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Availability Score',
        type: 'line',
        smooth: true,
        data: [91, 92, 89, 93, 90, 94, 91],
        itemStyle: { color: '#2563EB' }
      },
      {
        name: 'Performance Score',
        type: 'line',
        smooth: true,
        data: [93, 94, 88, 92, 91, 95, 93],
        itemStyle: { color: '#14B8A6' }
      },
      {
        name: 'Quality Score',
        type: 'line',
        smooth: true,
        data: [97, 98, 96, 98, 97, 99, 98],
        itemStyle: { color: '#F59E0B' }
      }
    ]
  };

  // 6. Monthly Output
  const mfgMonthlyOutputOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 10 }, bottom: '0%' },
    xAxis: {
      type: 'category',
      data: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Target (k Units)',
        type: 'bar',
        data: [35, 38, 40, 42, 45, 48],
        itemStyle: { color: '#94a3b8' }
      },
      {
        name: 'Completed (k Units)',
        type: 'bar',
        data: [34, 39, 38, 43, 44, 49],
        itemStyle: { color: '#14B8A6' }
      }
    ]
  };

  // 7. Maintenance Cost
  const mfgMaintenanceCostOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 9 }, bottom: '0%' },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: '$k', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Preventative Maintenance Cost',
        type: 'line',
        smooth: true,
        data: [12, 14, 15, 18, 16, 22],
        itemStyle: { color: '#14B8A6' },
        lineStyle: { width: 3 },
        areaStyle: { color: 'rgba(20, 184, 166, 0.15)' }
      },
      {
        name: 'Unplanned Failure Damage Repair',
        type: 'line',
        smooth: true,
        data: [42, 38, 56, 12, 28, 14],
        itemStyle: { color: '#EF4444' },
        lineStyle: { width: 3 },
        areaStyle: { color: 'rgba(239, 68, 68, 0.1)' }
      }
    ]
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header and Domain Tab Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <BarChart3 className="h-5.5 w-5.5 text-primary" />
            <span>Industrial & Agriculture Analytics Cockpit</span>
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
            Agriculture Analytics
          </button>
          <button
            onClick={() => setActiveModule('manufacturing')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeModule === 'manufacturing' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:text-white'
            }`}
          >
            Manufacturing Analytics
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

        {activeModule === 'agriculture' ? (
          <select 
            value={selectedCrop} 
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-background border border-border rounded text-xs text-foreground px-2 py-1.5 focus:outline-none"
          >
            <option value="all">All Crops</option>
            <option value="wheat">Wheat Only</option>
            <option value="corn">Corn Only</option>
          </select>
        ) : (
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
      </div>

      {activeModule === 'agriculture' ? (
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
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Yield Trend & Forecast</h4>
            <div className="h-56">
              <ReactECharts option={yieldOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Disease Share Anomaly</h4>
            <div className="h-56">
              <ReactECharts option={diseaseOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Localized Risk Score</h4>
            <div className="h-56">
              <ReactECharts option={riskOption} style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Soil Profile Comparison</h4>
            <div className="h-56">
              <ReactECharts option={performanceOption} style={{ height: '100%' }} />
            </div>
          </div>

        </div>
      ) : (
        /* Manufacturing Charts (7-grid) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Production Trend */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Daily Production Output</h4>
            <div className="h-56">
              <ReactECharts option={mfgProdTrendOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 2: Machine Utilization */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Asset Machine Utilization</h4>
            <div className="h-56">
              <ReactECharts option={mfgMachineUtilityOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 3: Downtime Analysis */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Operational Downtime Share</h4>
            <div className="h-56">
              <ReactECharts option={mfgDowntimeOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 4: Energy Consumption */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Grid Peak tariff draw</h4>
            <div className="h-56">
              <ReactECharts option={mfgEnergyConsumptionOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 5: Efficiency Trend */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Operational efficiency (OEE)</h4>
            <div className="h-56">
              <ReactECharts option={mfgOeeTrendOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 6: Monthly Output */}
          <div className="bg-card border border-border rounded-xl p-5 shadow">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Monthly Target Completion</h4>
            <div className="h-56">
              <ReactECharts option={mfgMonthlyOutputOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Chart 7: Maintenance Cost */}
          <div className="bg-card border border-border rounded-xl p-5 shadow col-span-1 md:col-span-2 lg:col-span-3">
            <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Total Maintenance Expenditures Allocation</h4>
            <div className="h-64">
              <ReactECharts option={mfgMaintenanceCostOption} style={{ height: '100%' }} />
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
