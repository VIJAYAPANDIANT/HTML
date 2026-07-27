import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Heart, 
  Activity, 
  ActivitySquare, 
  Sparkles, 
  FileText, 
  Loader2, 
  Stethoscope,
  ChevronRight,
  Download,
  Brain
} from 'lucide-react';
import api from '@/lib/axios';
import HospitalMap from '../../components/ui/HospitalMap';

interface EmergencyCase {
  id: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  triage: string;
  arrival: string;
}

interface AdmittedPatient {
  id: string;
  name: string;
  room: string;
  doctor: string;
  stability: string;
}

interface BedStatus {
  room: string;
  type: string;
  status: 'OCCUPIED' | 'OCCUPIED_CRITICAL' | 'UNOCCUPIED';
}

interface HealthcareDashboardData {
  bedOccupancy: string;
  activeEmergencies: string;
  avgWaitTime: string;
  activeStaff: string;
  emergencies: EmergencyCase[];
  patients: AdmittedPatient[];
  bedGrid: BedStatus[];
  aiRecommendations: string[];
}

export default function HealthcarePage() {
  const [data, setData] = useState<HealthcareDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [mapTab, setMapTab] = useState<'grid' | 'gis'>('grid');
  
  // Triage simulator state
  const [symptoms, setSymptoms] = useState('Patient reports severe chest pressure and numbness in left arm');
  const [simulatingTriage, setSimulatingTriage] = useState(false);
  const [triageOutput, setTriageOutput] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/healthcare/dashboard');
      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load healthcare metrics:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSimulateTriage = async () => {
    setSimulatingTriage(true);
    setTriageOutput(null);
    try {
      const response = await api.post('/api/healthcare/simulate-triage', { symptoms });
      setTriageOutput(response.data.triageOutput);
    } catch (err) {
      console.error('Triage simulation request failed:', err);
    } finally {
      setSimulatingTriage(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!data) return;
    setGeneratingReport(true);
    try {
      const payload = {
        metrics: {
          bedOccupancy: data.bedOccupancy,
          activeEmergencies: data.activeEmergencies,
          avgWaitTime: data.avgWaitTime,
          activeStaff: data.activeStaff
        },
        alerts: [
          'ICU ventilator capacity reaches 90% peak threshold limit.',
          'Critical trauma alert on emergency bay Sector 2.'
        ],
        predictions: 'ER queue queue-load predicted to jump by 24% over next 45 minutes.',
        userNotes: notes || 'Medical brief generated for cardiology consult review.'
      };

      const response = await api.post('/api/ai/report', payload, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'IntelliSphere_Healthcare_Brief.pdf';
      link.click();
      setShowReportModal(false);
    } catch (err) {
      console.error('Failed to export medical PDF:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading Healthcare dashboard...</p>
      </div>
    );
  }

  // ER wait time line options
  const waitTimeChartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: { type: 'value', name: 'Mins', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'ER Average Wait Time',
        type: 'line',
        smooth: true,
        data: [14, 18, 25, 30, 22, 18, 15],
        itemStyle: { color: '#EF4444' },
        lineStyle: { width: 3 }
      }
    ]
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Overview statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Bed Occupancy Rate', value: data.bedOccupancy, icon: ActivitySquare, color: 'text-primary' },
          { title: 'Active Emergencies', value: data.activeEmergencies, icon: Heart, color: 'text-destructive' },
          { title: 'Avg ER Wait Time', value: data.avgWaitTime, icon: Activity, color: 'text-secondary' },
          { title: 'Doctors On-Duty', value: data.activeStaff, icon: Stethoscope, color: 'text-accent' }
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
        
        {/* Left Column: Emergency, Patients lists, SVG bed grid */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Emergency case monitoring list */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-white mb-4">Emergency Cases Monitor</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                    <th className="pb-3">Diagnosis / Case</th>
                    <th className="pb-3">Severity</th>
                    <th className="pb-3">AI Triage Classification</th>
                    <th className="pb-3">Arrival Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {data.emergencies.map((e) => (
                    <tr key={e.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 font-semibold text-white">{e.category}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          e.severity === 'Critical' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'
                        }`}>
                          {e.severity}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">{e.triage}</td>
                      <td className="py-3">{e.arrival}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admitted Patient roster */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-white mb-4">Admitted Patient roster</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                    <th className="pb-3">Patient Name</th>
                    <th className="pb-3">Room</th>
                    <th className="pb-3">Assigned Physician</th>
                    <th className="pb-3">Stability Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {data.patients.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 font-semibold text-white">{p.name}</td>
                      <td className="py-3">{p.room}</td>
                      <td className="py-3 text-slate-400">{p.doctor}</td>
                      <td className="py-3">
                        <span className="text-secondary font-bold">{p.stability}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Map and Hospital wings tab selector */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Hospital Spatial Tracking</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Toggle between internal emergency wing plans and Leaflet GIS branches.</p>
              </div>

              {/* Tab toggler buttons */}
              <div className="flex bg-muted/20 p-0.5 rounded-lg border border-border">
                <button
                  onClick={() => setMapTab('grid')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    mapTab === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  Internal Wings
                </button>
                <button
                  onClick={() => setMapTab('gis')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    mapTab === 'gis' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  GIS Map
                </button>
              </div>
            </div>

            <div className="h-72 bg-background border border-border rounded-xl flex items-center justify-center relative overflow-hidden">
              {mapTab === 'grid' ? (
                <svg viewBox="0 0 600 300" className="w-full h-full p-4">
                  {/* ICU wing */}
                  <rect x="50" y="50" width="180" height="90" className="fill-primary/10 stroke-primary stroke-2 hover:fill-primary/20 transition-all cursor-pointer" />
                  <text x="140" y="100" textAnchor="middle" className="fill-white text-[10px] font-bold">ICU (Intensive Care)</text>
                  
                  {/* Cardiac wing */}
                  <rect x="250" y="50" width="150" height="90" className="fill-secondary/10 stroke-secondary stroke-2 hover:fill-secondary/20 transition-all cursor-pointer" />
                  <text x="325" y="100" textAnchor="middle" className="fill-white text-[10px] font-bold">Cardiac Wing</text>

                  {/* Trauma Bay ER */}
                  <rect x="50" y="160" width="350" height="90" className="fill-destructive/10 stroke-destructive stroke-2 hover:fill-destructive/20 transition-all cursor-pointer animate-pulse" />
                  <text x="225" y="210" textAnchor="middle" className="fill-white text-[10px] font-bold">Emergency Bay (Critical Trauma)</text>

                  {/* Radiology */}
                  <rect x="420" y="50" width="130" height="200" className="fill-accent/10 stroke-accent stroke-2 hover:fill-accent/20 transition-all cursor-pointer" />
                  <text x="485" y="150" textAnchor="middle" className="fill-white text-[10px] font-bold">Radiology & Lab</text>
                </svg>
              ) : (
                <div className="w-full h-full text-slate-800 z-10">
                  <HospitalMap />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Wait time charts, Bed visual grid, Triage Simulator, AI recommendations */}
        <div className="space-y-8">
          
          {/* Triage Simulator Panel */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Brain className="h-4.5 w-4.5 text-primary" />
              <span>Gemini AI Triage Assistant</span>
            </h3>
            
            <div className="space-y-2">
              <textarea 
                value={symptoms} 
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Enter patient symptoms and complaints..."
                className="w-full h-20 px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground resize-none"
              />
              <button 
                onClick={handleSimulateTriage}
                disabled={simulatingTriage}
                className="w-full py-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2 shadow"
              >
                {simulatingTriage ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Analyzing Symptoms...</span>
                  </>
                ) : (
                  <>
                    <ActivitySquare className="h-3.5 w-3.5" />
                    <span>Classify Patient Triage</span>
                  </>
                )}
              </button>
            </div>

            {triageOutput && (
              <div className="bg-background border border-border rounded-lg p-3 text-[11px] text-slate-350 leading-relaxed max-h-36 overflow-y-auto">
                <span className="font-bold text-white text-[10px] block mb-1 uppercase tracking-wide">Triage Output</span>
                {triageOutput}
              </div>
            )}
          </div>

          {/* Bed Occupancy Grid */}
          <div className="bg-card border border-border rounded-xl p-6 shadow space-y-4">
            <h3 className="text-lg font-bold text-white">ICU Bed Layout</h3>
            <div className="grid grid-cols-3 gap-3">
              {data.bedGrid.map((bed, idx) => (
                <div 
                  key={idx} 
                  className={`border rounded-lg p-2.5 text-center transition-all ${
                    bed.status === 'OCCUPIED_CRITICAL' 
                      ? 'bg-destructive/10 border-destructive/30 text-destructive animate-pulse'
                      : bed.status === 'OCCUPIED'
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'bg-background border-border text-slate-500'
                  }`}
                >
                  <span className="text-[10px] font-bold block">Room {bed.room}</span>
                  <span className="text-[9px] block opacity-80">{bed.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wait Time Timeline ECharts */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-white mb-4">Average ER Wait Time</h3>
            <div className="h-44">
              <ReactECharts option={waitTimeChartOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* AI Clinical Recommendations panel */}
          <div className="bg-card border border-border rounded-xl p-6 shadow space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>AI Recommendations</span>
            </h3>

            <div className="space-y-3">
              {data.aiRecommendations.map((rec, idx) => (
                <div key={idx} className="bg-muted/10 border border-border rounded-lg p-3 text-xs leading-normal flex items-start space-x-2">
                  <ChevronRight className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-slate-350">{rec}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowReportModal(true)}
              className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-xs transition-all shadow-md shadow-primary/25 flex items-center justify-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Patient Medical Brief</span>
            </button>
          </div>

        </div>

      </div>

      {/* PDF Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <span>Compile Medical Brief</span>
              </h3>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-muted-foreground hover:text-white"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clinical Consult Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter actions taken or details (e.g. Schedule neurology scan, confirm ECG status)..."
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
                    <span>Download Medical Brief</span>
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
