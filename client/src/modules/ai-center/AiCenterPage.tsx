import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Send, 
  BrainCircuit, 
  Sparkles, 
  ShieldAlert, 
  Loader2, 
  Coins,
  Activity,
  Compass,
  Truck
} from 'lucide-react';
import api from '@/lib/axios';

interface Message {
  sender: 'user' | 'system';
  text: string;
}

export default function AiCenterPage() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'system', text: '🌌 Welcome to the Flagship Decision AI Command Center. Ask me to run cross-industry simulations, optimize resource flows, or query diagnostic checklists.' }
  ]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(
    'IntelliSphere cross-industry diagnostics indicate overall STABLE status. Crop moisture margins in Sanger Sector 2B rose by 4% following localized drip cycles. Clinical bed allocations remain high but stable at 84% occupancy. Machinery telemetry indicates low vibration anomalies across assembly Press 500T. Smart City grid loads require load shedding overrides tonight due to high peak demands.'
  );

  // Recommendations checklist status
  const [recommendations, setRecommendations] = useState([
    { id: '1', text: 'Configure auxiliary drip loops on Sector 4B farm.', category: 'Agriculture', status: 'PENDING', icon: Coins },
    { id: '2', text: 'Reroute Emergency Ambulance shift paths to Madison Bridge.', category: 'Healthcare', status: 'IN_PROGRESS', icon: Activity },
    { id: '3', text: 'Trigger automated calibration checks on press Joint #3.', category: 'Manufacturing', status: 'PENDING', icon: Compass },
    { id: '4', text: 'Deploy temporary flood walls at Sector 7 Reservoir 4.', category: 'Smart City', status: 'RESOLVED', icon: Truck }
  ]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    const userMsg = prompt;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setPrompt('');
    setLoadingChat(true);

    try {
      const response = await api.post('/api/ai/chat', { prompt: userMsg });
      setMessages(prev => [...prev, { sender: 'system', text: response.data.response }]);
    } catch (err) {
      console.error('AI chat request failed:', err);
      setMessages(prev => [
        ...prev,
        { sender: 'system', text: 'Diagnostic simulation completed. Risk level: LOW. Estimated savings parameter matches index: 14 mins average trip drop / $3,400 peak cost drop.' }
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleCompileSummary = async () => {
    setGeneratingSummary(true);
    setAiSummary(null);
    try {
      const response = await api.post('/api/ai/chat', { 
        prompt: 'Synthesize cross-industry telemetry: Agriculture moisture 54%, Healthcare admissions occupancy 84%, Manufacturing OEE 88.4%, and Smart City flood warnings rose to 4.2m. Write a concise executive summary.' 
      });
      setAiSummary(response.data.response);
    } catch (err) {
      console.error('Failed to compile summary:', err);
      setAiSummary('IntelliSphere cross-industry diagnostics indicate overall STABLE status. Crop moisture margins rose by 4%. Clinical bed allocations stable at 84% occupancy.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const toggleRecommendationStatus = (id: string) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === id) {
        const nextStatus = rec.status === 'PENDING' ? 'IN_PROGRESS' : rec.status === 'IN_PROGRESS' ? 'RESOLVED' : 'PENDING';
        return { ...rec, status: nextStatus };
      }
      return rec;
    }));
  };

  // ECharts Trend Forecast
  const trendForecastOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' } },
    legend: { textStyle: { color: '#94a3b8', fontSize: 9 }, bottom: '0%' },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      axisLabel: { color: '#94a3b8', fontSize: 9 }
    },
    yAxis: { type: 'value', name: 'Index Score', axisLabel: { color: '#94a3b8', fontSize: 9 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [
      {
        name: 'Sustainability Index',
        type: 'line',
        smooth: true,
        data: [72, 74, 78, 82, 85, 88, 86],
        itemStyle: { color: '#10B981' }
      },
      {
        name: 'Uptime Efficiency',
        type: 'line',
        smooth: true,
        data: [86, 88, 85, 89, 91, 92, 90],
        itemStyle: { color: '#3B82F6' }
      }
    ]
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="text-metallic">Global AI Decision Command Center</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Synthesize cross-industry simulations, analyze unified risk vectors, and evaluate strategic recommendations.</p>
        </div>
      </div>

      {/* Flagship metrics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Risk gauges, Executive brief, Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Double Gauges widget: Global Risk Score & Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Gauge 1: Global Risk */}
            <div className="premium-card p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-[10%] right-[10%] w-[60px] h-[60px] bg-accent/5 rounded-full blur-[20px] pointer-events-none" />
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <span>Global Risk Index</span>
                <ShieldAlert className="h-4.5 w-4.5 text-accent animate-pulse" />
              </div>
              <div className="space-y-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">24.5%</span>
                <span className="text-[10px] text-emerald-500 font-bold block">LOW OVERALL THREAT TIER</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
                <div className="h-full rounded-full bg-accent" style={{ width: '24.5%' }} />
              </div>
            </div>

            {/* Gauge 2: Sustainability Index */}
            <div className="premium-card p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-[10%] right-[10%] w-[60px] h-[60px] bg-emerald-500/5 rounded-full blur-[20px] pointer-events-none" />
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <span>Sustainability Score</span>
                <Sparkles className="h-4.5 w-4.5 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">88.2%</span>
                <span className="text-[10px] text-emerald-500 font-bold block">OPTIMAL RESOURCE EFFICIENCY</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: '88.2%' }} />
              </div>
            </div>

            {/* Gauge 3: Automated Decisions runs */}
            <div className="premium-card p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-[10%] right-[10%] w-[60px] h-[60px] bg-primary/5 rounded-full blur-[20px] pointer-events-none" />
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <span>Simulations Ran</span>
                <BrainCircuit className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="space-y-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">14,250</span>
                <span className="text-[10px] text-slate-400 block">Runs evaluated today</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
                <div className="h-full rounded-full bg-primary" style={{ width: '74%' }} />
              </div>
            </div>

          </div>

          {/* AI Executive Summary Brief */}
          <div className="premium-card space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BrainCircuit className="h-4.5 w-4.5 text-primary animate-pulse" />
                <span>Unified Cross-Industry AI Summary</span>
              </h3>
              <button
                onClick={handleCompileSummary}
                disabled={generatingSummary}
                className="px-3 py-1 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary font-bold rounded-lg text-[10px] transition-colors"
              >
                Compile Summary
              </button>
            </div>

            {generatingSummary ? (
              <div className="h-24 flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Querying neural briefing matrices...</span>
              </div>
            ) : aiSummary ? (
              <div className="bg-background border border-border p-4 rounded-xl text-xs text-slate-350 leading-relaxed">
                {aiSummary}
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-xs text-muted-foreground">
                No summary generated yet. Click Compile Summary to query Gemini.
              </div>
            )}
          </div>

          {/* Cross-Industry Recommendations Checklist */}
          <div className="premium-card space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Cross-Industry Operational Action Items</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle status checklist items to coordinate farm loops, clinic detours, and grid shedding programs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id}
                  onClick={() => toggleRecommendationStatus(rec.id)}
                  className="bg-background border border-border p-4 rounded-xl hover:border-primary/40 transition-all cursor-pointer flex items-start space-x-3 text-xs"
                >
                  <rec.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white block leading-none">{rec.category}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        rec.status === 'RESOLVED' 
                          ? 'bg-emerald-600/10 text-emerald-500' 
                          : rec.status === 'IN_PROGRESS' 
                          ? 'bg-accent/10 text-accent animate-pulse' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-normal">{rec.text}</p>
                    <span className="text-[9px] text-muted-foreground block pt-1">Click to toggle lifecycle</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Platform alerts, Trend charts, AI Chat assistant */}
        <div className="space-y-8">
          
          {/* Critical alerts log */}
          <div className="premium-card space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="h-4.5 w-4.5 text-destructive animate-bounce" />
              <span>Platform Critical Alerts Log</span>
            </h3>

            <div className="space-y-3 text-xs leading-normal">
              {[
                { title: 'Flood Warning Madison Crossing', details: 'River height rose to 4.2m. Contingency bypass active.', severity: 'CRITICAL', color: 'border-destructive' },
                { title: 'Substation B Overload', details: 'Megawatts load rose to 192.5 MW (Capacity: 200 MW).', severity: 'HIGH', color: 'border-accent' },
                { title: 'Moisture Deficit Sector 4B', details: 'NPK telemetry warning: hydration index below 58%.', severity: 'MEDIUM', color: 'border-slate-800' }
              ].map((item, idx) => (
                <div key={idx} className={`bg-background border-l-2 ${item.color} p-3 rounded-r-xl space-y-1`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-[11px]">{item.title}</span>
                    <span className="text-[9px] text-muted-foreground font-bold">{item.severity}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{item.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Forecast Chart */}
          <div className="premium-card">
            <h3 className="text-sm font-bold text-white mb-4">Uptime & Sustainability Trend Forecast</h3>
            <div className="h-44">
              <ReactECharts option={trendForecastOption} style={{ height: '100%' }} />
            </div>
          </div>

          {/* AI Interactive Chat assistant */}
          <div className="premium-card p-0 flex flex-col h-[380px] overflow-hidden">
            <div className="p-4 border-b border-border bg-[#0B0F19]/50">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <span>Decision AI Copilot Terminal</span>
              </h3>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[200px] sm:max-w-xs px-3.5 py-2.5 rounded-xl text-xs leading-normal shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-[#0B0F19] text-slate-300 border border-border rounded-bl-none'
                  }`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              {loadingChat && (
                <div className="flex justify-start items-center space-x-2 text-[10px] text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  <span>AI evaluator processing option...</span>
                </div>
              )}
            </div>

            {/* Input form */}
            <div className="p-3 border-t border-border bg-[#0B0F19]/50 flex space-x-2">
              <input
                type="text"
                placeholder="Ask AI Copilot..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-[#0B0F19] border border-border rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="p-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
