import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Coins, 
  Activity, 
  Compass, 
  CloudSun, 
  AlertTriangle, 
  Loader2, 
  Sparkles,
  FileText,
  Camera,
  Download
} from 'lucide-react';
import api from '@/lib/axios';

interface SoilCard {
  value: string;
  status: 'Optimal' | 'Warning' | 'Critical';
}

interface CropItem {
  crop: string;
  area: string;
  stage: string;
  health: string;
}

interface AgriDashboardData {
  activeArea: string;
  waterConsumption: string;
  soilHydration: string;
  yieldForecast: string;
  nitrogen: SoilCard;
  phosphorus: SoilCard;
  potassium: SoilCard;
  ph: SoilCard;
  moisture: SoilCard;
  temperature: SoilCard;
  weatherTemp: string;
  weatherHumidity: string;
  weatherWind: string;
  weatherOutlook: string;
  crops: CropItem[];
  irrigationSystem: string;
  activeAlerts: string[];
}

export default function AgriculturePage() {
  const [data, setData] = useState<AgriDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [diseaseScanning, setDiseaseScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Fetch Dashboard Data from Backend
  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/v1/industry/agriculture/dashboard');
      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load agriculture metrics:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // PDF report download request handler
  const handleDownloadPdf = async () => {
    if (!data) return;
    setGeneratingReport(true);
    try {
      const payload = {
        metrics: {
          activeArea: data.activeArea,
          waterConsumption: data.waterConsumption,
          soilHydration: data.soilHydration,
          yieldForecast: data.yieldForecast
        },
        alerts: data.activeAlerts,
        predictions: 'Low soil moisture anomaly in sector 4B predicted to impact crop yields by 6.5% if irrigation remains inactive.',
        userNotes: notes || 'Daily routine calibration complete.'
      };

      const response = await api.post('/api/v1/reports/generate-pdf', payload, {
        responseType: 'blob'
      });

      // Triggers browser download dialog
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'IntelliSphere_Agri_Report.pdf';
      link.click();
      setShowReportModal(false);
    } catch (err) {
      console.error('PDF generation request failed:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  // Disease Detection simulation
  const handleDiseaseScan = () => {
    setDiseaseScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setDiseaseScanning(false);
      setScanResult('Scan Complete: No anomalies or leaf rust detected in crop foliage. Chlorophyll level is normal.');
    }, 3000);
  };

  if (loading || !data) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading Agriculture parameters...</p>
      </div>
    );
  }

  // Moisture Level chart options
  const moistureChartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Sector 4B Hydration',
        type: 'line',
        smooth: true,
        data: [68, 67, 65, 62, 58, 61, 64],
        itemStyle: { color: '#2563EB' },
        lineStyle: { width: 3 }
      }
    ]
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Active Area', value: data.activeArea, icon: Compass, color: 'text-primary' },
          { title: 'Daily Water Consumption', value: data.waterConsumption, icon: Coins, color: 'text-[#14B8A6]' },
          { title: 'Soil Hydration Level', value: data.soilHydration, icon: Activity, color: 'text-secondary' },
          { title: 'Yield Forecast Confidence', value: data.yieldForecast, icon: Sparkles, color: 'text-accent' }
        ].map((card) => (
          <div key={card.title} className="bg-card border border-border rounded-xl p-6 shadow hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.title}</span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Crop Monitoring & Weather & Scanner */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Crop status list */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-white mb-4">Crop Monitoring</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                    <th className="pb-3">Crop Name</th>
                    <th className="pb-3">Cultivated Area</th>
                    <th className="pb-3">Growth Stage</th>
                    <th className="pb-3">Health Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {data.crops.map((c, i) => (
                    <tr key={i} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 font-semibold text-white">{c.crop}</td>
                      <td className="py-3">{c.area}</td>
                      <td className="py-3">{c.stage}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          c.health === 'Excellent' ? 'bg-[#14B8A6]/10 text-[#14B8A6]' : 'bg-accent/10 text-accent'
                        }`}>
                          {c.health}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SVG Crop Sector Map */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-white mb-1">Crop Sector Grid Map</h3>
            <p className="text-xs text-muted-foreground mb-4">Hover/Click sectors to review live moisture sensor feedback.</p>
            <div className="h-64 bg-background border border-border rounded-xl flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 600 300" className="w-full h-full p-4">
                <rect x="50" y="50" width="100" height="150" className="fill-[#2563EB]/15 stroke-primary stroke-2 hover:fill-[#2563EB]/30 transition-all cursor-pointer" />
                <text x="100" y="130" textAnchor="middle" className="fill-white text-[10px] font-bold">Sector 1A (Wheat)</text>
                
                <rect x="180" y="50" width="180" height="70" className="fill-[#14B8A6]/15 stroke-secondary stroke-2 hover:fill-[#14B8A6]/30 transition-all cursor-pointer" />
                <text x="270" y="90" textAnchor="middle" className="fill-white text-[10px] font-bold">Sector 2B (Corn)</text>

                <rect x="180" y="140" width="180" height="110" className="fill-[#EF4444]/15 stroke-destructive stroke-2 hover:fill-[#EF4444]/30 transition-all cursor-pointer animate-pulse" />
                <text x="270" y="200" textAnchor="middle" className="fill-white text-[10px] font-bold">Sector 4B (Warning)</text>

                <rect x="390" y="50" width="150" height="200" className="fill-[#F59E0B]/15 stroke-accent stroke-2 hover:fill-[#F59E0B]/30 transition-all cursor-pointer" />
                <text x="465" y="160" textAnchor="middle" className="fill-white text-[10px] font-bold">Sector 3C (Soy)</text>
              </svg>
            </div>
          </div>

          {/* Disease Detection simulation */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
              <Camera className="h-5 w-5 text-primary" />
              <span>Foliage Disease Diagnostics Scanner</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-6">Simulate visual crop leaf diagnostic routines via computer vision hooks.</p>

            <div className="border border-dashed border-border rounded-xl p-6 text-center space-y-4 bg-muted/5">
              <button 
                onClick={handleDiseaseScan}
                disabled={diseaseScanning}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center space-x-2 justify-center mx-auto"
              >
                {diseaseScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Foliage Image...</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    <span>Simulate Foliage Scan</span>
                  </>
                )}
              </button>

              {scanResult && (
                <div className="p-3.5 bg-secondary/5 border border-secondary/15 rounded-lg text-xs text-secondary leading-normal max-w-md mx-auto">
                  {scanResult}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Soil cards & ECharts & AI Recommendation panel */}
        <div className="space-y-8">
          
          {/* Soil health cards */}
          <div className="bg-card border border-border rounded-xl p-6 shadow space-y-4">
            <h3 className="text-lg font-bold text-white">Soil Health Cards</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Nitrogen (N)', val: data.nitrogen.value, status: data.nitrogen.status },
                { label: 'Phosphorus (P)', val: data.phosphorus.value, status: data.phosphorus.status },
                { label: 'Potassium (K)', val: data.potassium.value, status: data.potassium.status },
                { label: 'Soil pH', val: data.ph.value, status: data.ph.status },
                { label: 'Moisture', val: data.moisture.value, status: data.moisture.status },
                { label: 'Soil Temp', val: data.temperature.value, status: data.temperature.status }
              ].map((card, idx) => (
                <div key={idx} className="bg-background border border-border rounded-lg p-3 space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">{card.label}</span>
                  <div className="text-sm font-bold text-white">{card.val}</div>
                  <span className={`text-[9px] font-semibold ${
                    card.status === 'Optimal' ? 'text-secondary' : 'text-accent'
                  }`}>
                    {card.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hydration ECharts Line Chart */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-white mb-4">Moisture Rate Timeline</h3>
            <div className="h-44">
              <ReactECharts option={moistureChartOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* Weather & Irrigation panel */}
          <div className="bg-card border border-border rounded-xl p-6 shadow space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <CloudSun className="h-5 w-5 text-accent" />
              <span>Environment & System</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-background border border-border rounded-lg p-3">
                <span className="text-[9px] text-muted-foreground uppercase block font-bold">Outlook</span>
                <span className="font-semibold text-white mt-1 block">{data.weatherOutlook} ({data.weatherTemp})</span>
              </div>
              <div className="bg-background border border-border rounded-lg p-3">
                <span className="text-[9px] text-muted-foreground uppercase block font-bold">Irrigation status</span>
                <span className="font-semibold text-secondary mt-1 block">{data.irrigationSystem}</span>
              </div>
            </div>
          </div>

          {/* AI Recommendation panel */}
          <div className="bg-card border border-border rounded-xl p-6 shadow space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>AI Recommendations</span>
            </h3>

            <div className="space-y-3">
              {data.activeAlerts.map((alert, idx) => (
                <div key={idx} className="bg-muted/10 border border-border rounded-lg p-3 text-xs leading-normal flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300">{alert}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowReportModal(true)}
              className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-xs transition-all shadow-md shadow-primary/25 flex items-center justify-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Decision PDF Report</span>
            </button>
          </div>

        </div>

      </div>

      {/* PDF Generation Modal overlay */}
      {showReportModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <span>Compile Decision Report</span>
              </h3>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-muted-foreground hover:text-white"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Operator Action Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter actions taken or details (e.g. Drip irrigation scheduled for evening)..."
                className="w-full h-28 px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
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
                    <span>Compiling Report...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
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

// Inline Close helper icon
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
