import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Leaf, 
  Sparkles, 
  ChevronRight,
  TrendingDown,
  Globe,
  Sun,
  Droplet,
  Recycle,
  Trees,
  Wind
} from 'lucide-react';

export default function SustainabilityDashboardPage() {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');

  // Dynamic values depending on selected time range
  const co2Emissions = timeRange === '30d' ? '12,420 Tons' : timeRange === '90d' ? '38,150 Tons' : '142,500 Tons';
  const renewableRatio = timeRange === '30d' ? '64.2%' : timeRange === '90d' ? '68.5%' : '72.1%';
  const waterConservation = timeRange === '30d' ? '4.8M Liters' : timeRange === '90d' ? '15.2M Liters' : '62.4M Liters';
  const recyclingRate = timeRange === '30d' ? '74.2%' : timeRange === '90d' ? '76.8%' : '78.5%';
  const multiplier = timeRange === '30d' ? 1.0 : timeRange === '90d' ? 2.9 : 11.4;

  // --- ECHARTS OPTION SPECIFICATIONS ---
  
  // 1. Carbon Emissions Trend Chart
  const co2Option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: timeRange === '1y' 
        ? ['Q1', 'Q2', 'Q3', 'Q4'] 
        : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'CO2 Tons', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Carbon Footprint',
        type: 'line',
        smooth: true,
        data: timeRange === '1y' 
          ? [38000, 36200, 34500, 32100] 
          : [3400, 3100, 2980, 2840],
        itemStyle: { color: '#EF4444' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(239, 68, 68, 0.3)' },
              { offset: 1, color: 'rgba(239, 68, 68, 0.0)' }
            ]
          }
        }
      }
    ]
  };

  // 2. Renewable Energy Mix Chart
  const renewableOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 9 }, bottom: '0%' },
    series: [
      {
        name: 'Renewable Power Mix',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: 42, name: 'Solar Array Arrays' },
          { value: 38, name: 'Wind Turbine Grids' },
          { value: 20, name: 'Hydraulic Reservoirs' }
        ],
        itemStyle: { borderRadius: 4, borderColor: '#0f172a', borderWidth: 2 }
      }
    ]
  };

  // 3. Water Conserved & Recycled Chart
  const waterOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'Megaliters (ML)', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Water Conserved',
        type: 'line',
        step: 'middle',
        data: [1.2, 1.5, 1.1, 1.8, 1.4, 1.9, 1.6].map(v => parseFloat((v * (multiplier / 4.0)).toFixed(1))),
        itemStyle: { color: '#3B82F6' },
        lineStyle: { width: 3 }
      }
    ]
  };

  // 4. Waste Recycling Progress Gauge
  const wasteGaugeOption = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        radius: '95%',
        progress: { show: true, width: 12, itemStyle: { color: '#A855F7' } },
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
        data: [{ value: parseFloat(recyclingRate) }]
      }
    ]
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header with Switcher */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-emerald-500 animate-pulse" />
            <span>Sustainability & ESG Command Dashboard</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Municipal emissions, resource depletion meters, and carbon offset logs.</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-muted/20 p-1 rounded-lg border border-border self-start lg:self-auto">
          {[
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' },
            { id: '1y', label: 'Yearly Trend' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeRange(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                timeRange === tab.id 
                  ? 'bg-primary text-white shadow' 
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive ESG Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Carbon Footprint', value: co2Emissions, sub: 'Target: 10% reductions', icon: Globe, color: 'text-destructive' },
          { title: 'Renewable Power Share', value: renewableRatio, sub: 'Solar, Wind & Reservoirs mix', icon: Wind, color: 'text-emerald-500' },
          { title: 'Water Saved Index', value: waterConservation, sub: 'Recycled pressure systems', icon: Droplet, color: 'text-primary' },
          { title: 'Waste Recycled Rate', value: recyclingRate, sub: 'Target: 80% recycling rate', icon: Recycle, color: 'text-purple-500' }
        ].map((card) => (
          <div key={card.title} className="premium-card relative overflow-hidden group cursor-pointer hover:border-primary/45">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight">{card.value}</div>
            <span className="text-[10px] text-muted-foreground block mt-1.5">{card.sub}</span>
          </div>
        ))}
      </div>

      {/* Grid containing charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: CO2 emissions and Renewable Mix */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Carbon Footprint Trend */}
            <div className="premium-card">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                <TrendingDown className="h-4.5 w-4.5 text-destructive animate-bounce" />
                <span>CO2 Emissions Trend</span>
              </h3>
              <div className="h-56">
                <ReactECharts option={co2Option} style={{ height: '100%' }} />
              </div>
            </div>

            {/* Renewable Power Mix */}
            <div className="premium-card">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
                <Sun className="h-4.5 w-4.5 text-emerald-500" />
                <span>Renewable Mix Share</span>
              </h3>
              <div className="h-56">
                <ReactECharts option={renewableOption} style={{ height: '100%' }} />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Water Saved Step Chart */}
            <div className="premium-card">
              <h3 className="text-sm font-bold text-white mb-4">Daily Water Conservation Logs</h3>
              <div className="h-56">
                <ReactECharts option={waterOption} style={{ height: '100%' }} />
              </div>
            </div>

            {/* Waste Recycling Progress Gauge */}
            <div className="premium-card flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white">Waste Recycling Rate Gauge</h3>
              <div className="h-44 my-auto">
                <ReactECharts option={wasteGaugeOption} style={{ height: '100%' }} />
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: AI recommendations, Green Zone circles */}
        <div className="space-y-8">
          
          {/* Green Zone coverage */}
          <div className="premium-card space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Trees className="h-4.5 w-4.5 text-emerald-500" />
              <span>Green Zone Coverage</span>
            </h3>

            <div className="space-y-4 text-xs text-slate-350">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Downtown Loop Parklands</span>
                  <span className="font-bold text-white">38.2% Cover</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '38.2%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Residential Boulevard Canopies</span>
                  <span className="font-bold text-white">52.4% Cover</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '52.4%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Madison Crossing Reserves</span>
                  <span className="font-bold text-white">64.0% Cover</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '64.0%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI recommendations */}
          <div className="premium-card space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              <span>AI Sustainability Recommendations</span>
            </h3>

            <div className="space-y-3.5">
              {[
                { title: 'Optimise Solar Panel Tilt angles', desc: 'Adjusting Sector 7 solar array coordinates by 8.5 degrees improves power yields by 4.2% daily.' },
                { title: 'Re-route Garbage Dispatch tracks', desc: 'Rerouting municipal trucks to empty filled bins first cuts fuel diesel emissions by 18%.' },
                { title: 'Rainwater collector reservoirs', desc: 'Expanding collection bins at Madison Crossing stores 2M liters during upcoming storm warnings.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-background border border-border p-3.5 rounded-xl text-xs leading-normal flex items-start space-x-2">
                  <ChevronRight className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">{item.title}</span>
                    <p className="text-slate-350 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
