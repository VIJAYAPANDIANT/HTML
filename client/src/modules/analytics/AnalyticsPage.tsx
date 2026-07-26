import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { BarChart3, Filter } from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCrop, setSelectedCrop] = useState('all');

  // Dynamic simulation multipliers based on filters
  const multiplier = timeRange === '30d' ? 4.2 : timeRange === '90d' ? 12.5 : 1.0;
  const cropOffset = selectedCrop === 'wheat' ? 5 : selectedCrop === 'corn' ? -3 : 0;

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
          { value: 65, name: 'Healthy Fades', itemStyle: { color: '#14B8A6' } },
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

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <BarChart3 className="h-5.5 w-5.5 text-primary" />
            <span>Agriculture Analytics Cockpit</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Cross-examine telemetry trends and model performance profiles.</p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center space-x-3 bg-card border border-border p-2 rounded-lg">
          <Filter className="h-4 w-4 text-muted-foreground ml-1" />
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-background border border-border rounded text-xs text-foreground px-2 py-1 focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <select 
            value={selectedCrop} 
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-background border border-border rounded text-xs text-foreground px-2 py-1 focus:outline-none"
          >
            <option value="all">All Crops</option>
            <option value="wheat">Wheat Only</option>
            <option value="corn">Corn Only</option>
          </select>
        </div>
      </div>

      {/* 6-Chart Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Crop Health */}
        <div className="bg-card border border-border rounded-xl p-5 shadow">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Crop Health Index</h4>
          <div className="h-56">
            <ReactECharts option={healthOption} style={{ height: '100%' }} />
          </div>
        </div>

        {/* Chart 2: Water Usage */}
        <div className="bg-card border border-border rounded-xl p-5 shadow">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Daily Water Usage</h4>
          <div className="h-56">
            <ReactECharts option={waterOption} style={{ height: '100%' }} />
          </div>
        </div>

        {/* Chart 3: Yield Trend */}
        <div className="bg-card border border-border rounded-xl p-5 shadow">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Yield Trend & Forecast</h4>
          <div className="h-56">
            <ReactECharts option={yieldOption} style={{ height: '100%' }} />
          </div>
        </div>

        {/* Chart 4: Disease Distribution */}
        <div className="bg-card border border-border rounded-xl p-5 shadow">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Disease Share Anomaly</h4>
          <div className="h-56">
            <ReactECharts option={diseaseOption} style={{ height: '100%' }} />
          </div>
        </div>

        {/* Chart 5: Risk Score Gauge */}
        <div className="bg-card border border-border rounded-xl p-5 shadow">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Localized Risk Score</h4>
          <div className="h-56">
            <ReactECharts option={riskOption} style={{ height: '100%' }} />
          </div>
        </div>

        {/* Chart 6: Monthly Performance radar */}
        <div className="bg-card border border-border rounded-xl p-5 shadow">
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">Soil Profile Comparison</h4>
          <div className="h-56">
            <ReactECharts option={performanceOption} style={{ height: '100%' }} />
          </div>
        </div>

      </div>

    </div>
  );
}
