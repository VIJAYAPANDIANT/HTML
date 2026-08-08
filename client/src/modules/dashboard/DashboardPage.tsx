import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  CloudSun, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Compass, 
  Activity, 
  BrainCircuit,
  UploadCloud,
  ChevronRight,
  X
} from 'lucide-react';
import api from '@/lib/axios';

interface WeatherInfo {
  temperature: string;
  humidity: string;
  windSpeed: string;
  rainProbability: string;
  outlook: string;
  cachedAt: string;
}

interface SmartAlert {
  id: string;
  category: 'Disease Risk' | 'Water Shortage' | 'Weather Warning' | 'Equipment Issue';
  severity: 'Critical' | 'Medium' | 'Low';
  message: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [alerts, setAlerts] = useState<SmartAlert[]>([
    { id: '1', category: 'Water Shortage', severity: 'Critical', message: 'Severe crop dehydration warning flagged in Sector 4B.', timestamp: '10m ago' },
    { id: '2', category: 'Disease Risk', severity: 'Medium', message: 'Foliage density scan indicates potential leaf rust risk in Sector 1A.', timestamp: '1h ago' },
    { id: '3', category: 'Weather Warning', severity: 'Medium', message: 'High wind advisory: gusts up to 45 km/h predicted over next 12h.', timestamp: '3h ago' },
    { id: '4', category: 'Equipment Issue', severity: 'Low', message: 'Battery warning: soil moisture detector #12 telemetry low power state.', timestamp: '5h ago' }
  ]);

  const [recentPredictions] = useState([
    { id: 'p1', model: 'Spring AI Forecasting', outcome: 'Sector 4B yield output forecast lowered by 6.5% due to soil moisture deficit.', confidence: '91.2%' },
    { id: 'p2', model: 'Risk Assessment Loop', outcome: 'Optimal harvest schedules identified for Sector 1A (Wheat) between Aug 12-15.', confidence: '94.5%' }
  ]);

  const [aiRecommendations] = useState([
    'Configure auxiliary drip loops on Sector 4B for 45 minutes.',
    'Execute localized soil NPK analysis in Sector 2B.',
    'Verify physical connection of moisture sensor device #12.'
  ]);

  const [recentUploads] = useState([
    { name: 'sensor_readings_q2.csv', size: '142 KB', time: '14m ago' },
    { name: 'soil_report_zone4.pdf', size: '2.4 MB', time: '1h ago' }
  ]);

  // Fetch Weather API from Backend
  const fetchWeather = async () => {
    try {
      const response = await api.get('/api/v1/weather/current');
      setWeather(response.data);
    } catch (err) {
      console.error('Failed to load weather indicators:', err);
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // ECharts Risk Heatmap configuration
  const heatmapOption = {
    backgroundColor: 'transparent',
    tooltip: { position: 'top', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    grid: { height: '70%', top: '10%' },
    xAxis: {
      type: 'category',
      data: ['Sec 1A', 'Sec 2B', 'Sec 3C', 'Sec 4B'],
      splitArea: { show: true },
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: {
      type: 'category',
      data: ['Moisture', 'Pest Risk', 'NPK Level'],
      splitArea: { show: true },
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      textStyle: { color: '#94a3b8', fontSize: 9 },
      inRange: {
        color: ['#14B8A6', '#F59E0B', '#EF4444']
      }
    },
    series: [
      {
        name: 'Risk Level %',
        type: 'heatmap',
        data: [
          [0, 0, 85], [1, 0, 78], [2, 0, 80], [3, 0, 32], // Moisture row
          [0, 1, 15], [1, 1, 20], [2, 1, 10], [3, 1, 88], // Pest Risk row
          [0, 2, 90], [1, 2, 58], [2, 2, 85], [3, 2, 70]  // NPK row
        ],
        label: { show: true, color: '#ffffff', fontSize: 9 },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' }
        }
      }
    ]
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Animated KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Farms', value: '4 Active', desc: 'Across 250 Acres', icon: Compass, color: 'text-primary border-primary/20 hover:border-primary/50' },
          { title: 'Soil Hydration', value: '62.4%', desc: 'Optimal Threshold: 65%', icon: Activity, color: 'text-[#14B8A6] border-[#14B8A6]/20 hover:border-[#14B8A6]/50' },
          { title: 'AI Recommendations', value: `${aiRecommendations.length} Actions`, desc: '3 unresolved anomalies', icon: Sparkles, color: 'text-accent border-accent/20 hover:border-accent/50' },
          { title: 'Critical Warnings', value: `${alerts.filter(a => a.severity === 'Critical').length} Alert`, desc: 'Requires immediate irrigation', icon: AlertTriangle, color: 'text-destructive border-destructive/20 hover:border-destructive/50' }
        ].map((card) => (
          <div 
            key={card.title} 
            className={`premium-card p-6 relative overflow-hidden group cursor-pointer ${card.color}`}
          >
            {/* Visual glow background inside hover group */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</span>
              <card.icon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-extrabold text-foreground tracking-tight">{card.value}</div>
            <span className="text-[10px] text-muted-foreground block mt-1.5">{card.desc}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Weather widget & Alerts feed & Risk Heatmap */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Weather Widget connected to Weather API */}
          <div className="premium-card relative overflow-hidden">
            <div className="absolute top-[20%] right-[10%] w-[120px] h-[120px] bg-primary/10 rounded-full blur-[40px] pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center space-x-2">
                  <CloudSun className="h-5.5 w-5.5 text-accent animate-pulse" />
                  <span>Real-time Weather Overlay</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Live conditions synced via Open-Meteo REST service.</p>
              </div>
              <button 
                onClick={fetchWeather} 
                className="text-xs font-semibold text-primary hover:text-primary/95 hover:underline"
              >
                Refresh
              </button>
            </div>

            {loadingWeather ? (
              <div className="h-24 flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                <span className="text-xs text-muted-foreground">Fetching Open-Meteo conditions...</span>
              </div>
            ) : weather ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="bg-background border border-border rounded-lg p-3">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold block">Outlook</span>
                  <span className="text-sm font-bold text-foreground mt-1 block">{weather.outlook}</span>
                </div>
                <div className="bg-background border border-border rounded-lg p-3">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold block">Temperature</span>
                  <span className="text-sm font-bold text-foreground mt-1 block">{weather.temperature}</span>
                </div>
                <div className="bg-background border border-border rounded-lg p-3">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold block">Humidity</span>
                  <span className="text-sm font-bold text-foreground mt-1 block">{weather.humidity}</span>
                </div>
                <div className="bg-background border border-border rounded-lg p-3">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold block">Wind Speed</span>
                  <span className="text-sm font-bold text-foreground mt-1 block">{weather.windSpeed}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Failed to parse weather parameters.</p>
            )}
          </div>

          {/* Smart Alerts Feed */}
          <div className="premium-card">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <AlertTriangle className="h-5.5 w-5.5 text-destructive" />
                <span>Smart Alerts</span>
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {alerts.length} unresolved actions
              </span>
            </h3>

            {alerts.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center p-6 border border-dashed border-border rounded-lg text-center bg-card/25">
                <CheckCircle2 className="h-8 w-8 text-secondary mb-2" />
                <h4 className="font-bold text-sm text-foreground">All Clear</h4>
                <p className="text-xs text-muted-foreground mt-0.5">No unresolved risk anomalies logged.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="bg-background border border-border rounded-xl p-4 flex items-start justify-between gap-4 text-xs transition-colors hover:bg-muted/5"
                  >
                    <div className="flex items-start space-x-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        alert.severity === 'Critical' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'
                      }`}>
                        {alert.severity}
                      </span>
                      <div>
                        <span className="font-bold text-foreground block">{alert.category}</span>
                        <p className="text-muted-foreground mt-1 leading-normal">{alert.message}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span className="text-[10px] text-muted-foreground">{alert.timestamp}</span>
                      <button 
                        onClick={() => dismissAlert(alert.id)}
                        className="text-muted-foreground hover:text-white transition-colors"
                        title="Dismiss Warning"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risk Heatmap grid */}
          <div className="premium-card">
            <h3 className="text-lg font-bold text-foreground mb-2">Sector Risk Heatmap</h3>
            <p className="text-xs text-muted-foreground mb-4">Coordinates NPK indexes, pest risks, and moisture ratios per active zone.</p>
            <div className="h-64">
              <ReactECharts option={heatmapOption} style={{ height: '100%' }} />
            </div>
          </div>

        </div>

        {/* Right Column: AI Predictions & Recommendations & Upload logs */}
        <div className="space-y-8">
          
          {/* AI Predictions */}
          <div className="premium-card space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center space-x-2">
              <BrainCircuit className="h-5.5 w-5.5 text-primary" />
              <span>AI Predictions</span>
            </h3>

            <div className="space-y-3">
              {recentPredictions.map((pred) => (
                <div key={pred.id} className="bg-background border border-border rounded-lg p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground uppercase text-[10px] tracking-wide">{pred.model}</span>
                    <span className="text-[10px] text-secondary font-bold">Confidence: {pred.confidence}</span>
                  </div>
                  <p className="text-muted-foreground leading-normal text-[11px]">{pred.outcome}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="premium-card space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center space-x-2">
              <Sparkles className="h-5.5 w-5.5 text-accent" />
              <span>AI Recommendations</span>
            </h3>

            <ul className="space-y-3 text-xs text-foreground/80">
              {aiRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start space-x-2.5 bg-background border border-border p-2.5 rounded-lg">
                  <ChevronRight className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  <span className="leading-normal">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ingestion logs / Uploads tracker */}
          <div className="premium-card space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center space-x-2">
              <UploadCloud className="h-5.5 w-5.5 text-muted-foreground" />
              <span>Latest Ingestion Logs</span>
            </h3>

            <div className="space-y-3">
              {recentUploads.map((up, i) => (
                <div key={i} className="bg-background border border-border rounded-lg p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <span className="font-bold text-foreground block max-w-[120px] truncate" title={up.name}>
                        {up.name}
                      </span>
                      <span className="text-[9px] text-muted-foreground block mt-0.5">{up.size}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{up.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
