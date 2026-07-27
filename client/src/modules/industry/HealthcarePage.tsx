import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Heart, 
  ActivitySquare, 
  Sparkles, 
  FileText, 
  Loader2, 
  Stethoscope,
  ChevronRight,
  Download,
  Brain,
  AlertTriangle,
  Users,
  FileCheck2,
  Clock
} from 'lucide-react';
import api from '@/lib/axios';
import HospitalMap from '../../components/ui/HospitalMap';

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

interface AlertItem {
  id: string;
  category: string;
  severity: string;
  message: string;
  timestamp: string;
}

interface HealthcareDashboardData {
  totalPatients: number;
  availableBeds: number;
  emergencyCases: number;
  activeStaff: number;
  patients: AdmittedPatient[];
  alerts: AlertItem[];
  aiRecommendations: string[];
  bedGrid: BedStatus[];
  departmentAnalytics: {
    departments: string[];
    admissions: number[];
  };
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

  // AI Medical Summary states
  const [selectedPatient, setSelectedPatient] = useState<AdmittedPatient | null>(null);
  const [aiSummaryText, setAiSummaryText] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/healthcare/dashboard');
      setData(response.data);
      if (response.data.patients && response.data.patients.length > 0) {
        setSelectedPatient(response.data.patients[0]);
      }
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

  const handleGetSummary = async () => {
    if (!selectedPatient) return;
    setGeneratingSummary(true);
    setAiSummaryText(null);
    try {
      const response = await api.post('/api/ai/healthcare-summary', {
        name: selectedPatient.name,
        stability: selectedPatient.stability,
        symptoms: 'Re-evaluating admission status indicators and heart rates.'
      });
      setAiSummaryText(response.data.summary);
    } catch (err) {
      console.error('Failed to query patient summary:', err);
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
          totalPatients: data.totalPatients,
          availableBeds: data.availableBeds,
          emergencyCases: data.emergencyCases,
          activeStaff: data.activeStaff
        },
        alerts: data.alerts.map(a => a.message),
        predictions: 'ICU Bed utility predicted to remain steady at 84% over next 24 hours.',
        userNotes: notes || 'Medical brief generated for cardiology consult review.'
      };

      const response = await api.post('/api/healthcare/report', payload, {
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
        <p className="text-sm text-muted-foreground">Loading Healthcare cockpit...</p>
      </div>
    );
  }

  // Admissions ECharts Pie options
  const admissionsChartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 10 }, bottom: '0%' },
    series: [
      {
        name: 'Admissions by Wing',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: '#1e293b', borderWidth: 2 },
        label: { show: false },
        data: data.departmentAnalytics.departments.map((dept, i) => ({
          name: dept,
          value: data.departmentAnalytics.admissions[i]
        }))
      }
    ]
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Animated KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Active Patients', value: data.totalPatients.toString(), sub: '12 admissions today', icon: Users, color: 'text-primary' },
          { title: 'Available Beds Count', value: data.availableBeds.toString(), sub: 'ICU: 4 available', icon: ActivitySquare, color: 'text-[#14B8A6]' },
          { title: 'Emergency Trauma Cases', value: data.emergencyCases.toString(), sub: '2 critical status', icon: Heart, color: 'text-destructive' },
          { title: 'Clinicians On-Duty', value: data.activeStaff.toString(), sub: 'Shift: Morning A', icon: Stethoscope, color: 'text-accent' }
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
        
        {/* Left Column: Alerts, Patients, Map layouts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Smart Alerts */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Critical Alerts Feed</span>
            </h3>
            <div className="space-y-3">
              {data.alerts.map((alert) => (
                <div key={alert.id} className="bg-background border border-border rounded-xl p-4 flex items-start justify-between gap-4 text-xs">
                  <div className="flex items-start space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      alert.severity === 'CRITICAL' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'
                    }`}>
                      {alert.severity}
                    </span>
                    <div>
                      <span className="font-bold text-white block">{alert.category}</span>
                      <p className="text-slate-300 mt-1 leading-normal">{alert.message}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{alert.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admitted Patient roster */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-white mb-4">Admitted Patient Overview</h3>
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

          {/* Map & Hospital wings tab selector */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Hospital GIS Coordinate Tracking</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Toggle between internal wing layouts and Leaflet GIS mapping.</p>
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

        {/* Right Column: ECharts pie, AI Brief summarizer, Triage simulator, recommendations */}
        <div className="space-y-8">
          
          {/* ECharts: Department Analytics */}
          <div className="bg-card border border-border rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-white mb-4">Department Admissions</h3>
            <div className="h-56">
              <ReactECharts option={admissionsChartOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* AI Patient Brief Summarizer */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Brain className="h-4.5 w-4.5 text-primary" />
              <span>AI Patient Brief Summary</span>
            </h3>

            <div className="space-y-3">
              <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Select Patient</label>
              <select
                value={selectedPatient?.name || ''}
                onChange={(e) => {
                  const pt = data.patients.find(p => p.name === e.target.value);
                  if (pt) setSelectedPatient(pt);
                }}
                className="w-full px-2 py-1 bg-background border border-border rounded text-xs text-foreground focus:outline-none"
              >
                {data.patients.map((p) => (
                  <option key={p.name} value={p.name}>{p.name} ({p.room})</option>
                ))}
              </select>

              <button 
                onClick={handleGetSummary}
                disabled={generatingSummary}
                className="w-full py-2 bg-[#14B8A6]/20 border border-[#14B8A6]/30 hover:bg-[#14B8A6]/35 text-[#14B8A6] font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2"
              >
                {generatingSummary ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Analyzing Patient Stats...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="h-3.5 w-3.5" />
                    <span>Generate AI Medical Summary</span>
                  </>
                )}
              </button>
            </div>

            {aiSummaryText && (
              <div className="bg-background border border-border rounded-lg p-3 text-[11px] text-slate-350 leading-relaxed max-h-36 overflow-y-auto">
                <span className="font-bold text-white text-[10px] block mb-1 uppercase tracking-wide">Diagnosis Briefing</span>
                {aiSummaryText}
              </div>
            )}
          </div>

          {/* Triage Simulator Panel */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Brain className="h-4.5 w-4.5 text-primary" />
              <span>AI Emergency Triage Simulator</span>
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

          {/* Recent Activity logs */}
          <div className="bg-card border border-border rounded-xl p-6 shadow space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>Recent Activities</span>
            </h3>
            
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex justify-between items-start">
                <span>Room ICU-102 occupancy status modified.</span>
                <span className="text-[10px] text-muted-foreground">4m ago</span>
              </div>
              <div className="flex justify-between items-start">
                <span>Triage simulation classification loop complete for Trauma Sector.</span>
                <span className="text-[10px] text-muted-foreground">12m ago</span>
              </div>
              <div className="flex justify-between items-start">
                <span>Dr. Sarah Jenkins assigned to patient John Doe.</span>
                <span className="text-[10px] text-muted-foreground">1h ago</span>
              </div>
            </div>
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
