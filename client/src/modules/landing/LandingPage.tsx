import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  ChevronDown, 
  Coins, 
  Activity, 
  Compass, 
  Truck, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Users, 
  Zap,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  // Pricing toggle state
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  // FAQ accordion open/close state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Industry Tab selector state
  const [activeIndTab, setActiveIndTab] = useState<'agri' | 'health' | 'mfg' | 'city'>('agri');

  const industries = [
    { id: 'agri', name: 'Agriculture', icon: Coins, desc: 'Hydration and soil parameter simulations.', metric: 'Irrigation cost reduced by 18%' },
    { id: 'health', name: 'Healthcare', icon: Activity, desc: 'Patient traffic and staff shift allocations.', metric: 'Patient wait-times slashed by 24%' },
    { id: 'mfg', name: 'Manufacturing', icon: Compass, desc: 'Machine thermal tracking and wear diagnostics.', metric: 'Factory machine downtime cut by 32%' },
    { id: 'city', name: 'Smart City', icon: Truck, desc: 'Traffic flow optimizations and grid load shunts.', metric: 'Power grid load shunts balanced by 99.4%' },
  ];

  const features = [
    { title: 'Decision Simulations', desc: 'Run Monte Carlo and linear regression simulations before deploying operational budgets.', icon: Zap },
    { title: 'Shared AI Service', desc: 'Centralized model processing utilizing unified Spring AI prompt patterns.', icon: Cpu },
    { title: 'Relational Traceability', desc: 'Audit trails logging all operator actions, telemetry logs, and risk alerts.', icon: Database },
    { title: 'Multi-Tenant Workspaces', desc: 'Isolate team databases with customizable RBAC roles and organization entities.', icon: Users },
  ];

  const faqItems = [
    { q: 'How does the shared AI Engine process model telemetry?', a: 'IntelliSphere backend maps telemetry datasets directly to specialized Spring AI chat components. The models evaluate confidence index thresholds and return prioritized mitigations in real time.' },
    { q: 'Is my enterprise data isolated under multi-tenancy?', a: 'Yes. Our database schema enforces strict foreign key relations mapping assets, sensors, and predictions directly to isolated organization workspaces.' },
    { q: 'Can I integrate external IoT sensor feeds into the system?', a: 'Absolutely. We provide REST endpoints to ingest live sensor readings and upload CSV/Excel files to compile automated report sheets.' },
    { q: 'Is there a setup guide for localized self-hosting?', a: 'Yes, our repository includes standard Docker Compose files configuring PostgreSQL 15, Redis 7, and the maven compiler target release 21.' }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col justify-between overflow-x-hidden select-none font-sans scroll-smooth">
      
      {/* 1. Header Navbar */}
      <header className="sticky top-0 h-20 border-b border-[#1E293B] bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-between px-8 md:px-16 max-w-7xl w-full mx-auto z-40">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#2563EB] rounded-xl text-white shadow-md shadow-[#2563EB]/20">
            <Logo className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white leading-none">IntelliSphere</h1>
            <span className="text-[9px] text-[#14B8A6] font-bold tracking-widest uppercase">Decision Intelligence</span>
          </div>
        </div>

        <nav className="hidden md:flex space-x-8 text-xs font-bold text-slate-300">
          <a href="#features" className="hover:text-[#14B8A6] transition-colors">Features</a>
          <a href="#industries" className="hover:text-[#14B8A6] transition-colors">Industries</a>
          <a href="#ai-engine" className="hover:text-[#14B8A6] transition-colors">AI Engine</a>
          <a href="#pricing" className="hover:text-[#14B8A6] transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-[#14B8A6] transition-colors">FAQ</a>
        </nav>

        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 hover:bg-[#1E293B] border border-transparent hover:border-[#1E293B] text-xs font-semibold rounded-lg transition-all"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-semibold rounded-lg text-xs transition-all shadow-md shadow-[#2563EB]/10"
          >
            Register
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative py-28 px-4 text-center max-w-5xl mx-auto flex flex-col items-center">
        {/* Glow visual background */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[550px] h-[250px] bg-[#2563EB]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center space-x-2 bg-[#1E293B] border border-[#334155] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#14B8A6] mb-8 relative">
          <ShieldCheck className="h-4 w-4" />
          <span>V2.0 Active — Enterprise Decision AI</span>
        </div>

        <h2 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white leading-none mb-6 max-w-4xl">
          Empower Decisions with <br />
          <span className="bg-gradient-to-r from-[#2563EB] to-[#14B8A6] bg-clip-text text-transparent">State-of-the-Art AI</span>
        </h2>
        
        <p className="text-sm md:text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          IntelliSphere leverages a central, predictive simulation engine to optimize capital, identify risks, and calculate mitigation forecasts across major industry domains.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-[#2563EB] hover:bg-[#2563EB]/95 text-white font-bold rounded-lg transition-all shadow-lg shadow-[#2563EB]/20 flex items-center space-x-2 justify-center group animate-glow-pulse"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-[#1E293B] hover:bg-[#1E293B]/80 text-[#F8FAFC] border border-[#334155] font-bold rounded-lg transition-all"
          >
            Request Demo
          </button>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-24 border-y border-[#1E293B] bg-[#0F172A] relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-3xl font-extrabold text-white">Full-Stack Intelligence Features</h3>
            <p className="text-xs text-slate-400 mt-2">A unified ecosystem mapping data modeling to actionable execution paths.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-md hover:border-[#2563EB]/50 transition-all duration-300">
                  <div className="p-3 bg-slate-800 rounded-lg text-[#14B8A6] inline-block mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-2">{feat.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Industries Section */}
      <section id="industries" className="py-24 bg-[#0F172A]/50 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-3xl font-extrabold text-white">Configured Industry Simulations</h3>
            <p className="text-xs text-slate-400 mt-2">Run specialized models calibrated for distinct infrastructure setups.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Left side: Tab navigation */}
            <div className="space-y-4">
              {industries.map((ind) => {
                const Icon = ind.icon;
                const isActive = activeIndTab === ind.id;
                return (
                  <button
                    key={ind.id}
                    onClick={() => setActiveIndTab(ind.id as any)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-start space-x-3.5 focus:outline-none ${
                      isActive 
                        ? 'bg-[#1E293B] border-[#2563EB] ring-1 ring-[#2563EB]' 
                        : 'bg-transparent border-transparent hover:bg-[#1E293B]/40 hover:border-[#334155]'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg flex-shrink-0 ${isActive ? 'bg-[#2563EB] text-white' : 'bg-[#1E293B] text-slate-400'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{ind.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">{ind.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right side: Selected industry metrics details */}
            <div className="lg:col-span-2 bg-[#1E293B] border border-[#334155] rounded-xl p-8 shadow-xl min-h-[300px] flex flex-col justify-between">
              <div>
                <span className="text-[9px] text-[#14B8A6] font-bold tracking-widest uppercase block mb-2">Simulated Outcome</span>
                <h3 className="text-2xl font-extrabold text-white">
                  Optimizing {industries.find(i => i.id === activeIndTab)?.name} Parameters
                </h3>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  By running custom decision loops inside the model playground, operators evaluate variables (like grid loads, machine hours, or patient queues) against historical trend lines.
                </p>
              </div>

              <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-4 mt-6">
                <div className="flex items-center space-x-2 text-[#14B8A6] text-xs font-bold">
                  <CheckCircle className="h-4 w-4" />
                  <span>{industries.find(i => i.id === activeIndTab)?.metric}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI Engine Section */}
      <section id="ai-engine" className="py-24 border-y border-[#1E293B] bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[9px] text-[#2563EB] font-bold tracking-widest uppercase block mb-2">Service Layer Core</span>
            <h3 className="text-3xl font-extrabold text-white">The Shared AI Engine</h3>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              At the heart of the platform sits `AIService.java`, a centralized Spring AI service. This service processes parameter DTOs, analyzes risks, and computes forecasting paths across all domains:
            </p>
            <ul className="space-y-3 mt-6 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
                <span>**Risk Prediction**: Assesses asset reliability levels.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
                <span>**Mitigation Suggestions**: Returns prioritized recommendations.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
                <span>**Trend Forecasting**: Calculates linear values over timeline matrices.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 font-mono text-[11px] text-[#14B8A6] leading-relaxed shadow-lg overflow-x-auto">
            <span className="text-slate-500 block mb-2">// AIService.java Method Interfaces</span>
            <span className="text-primary font-bold">public interface</span> AIService &#123; <br />
            &nbsp;&nbsp;SummaryResponse <span className="text-white">summarize</span>(Document doc); <br />
            &nbsp;&nbsp;RiskPrediction <span className="text-white">predictRisk</span>(Map&lt;String, Object&gt; params); <br />
            &nbsp;&nbsp;List&lt;Recommendation&gt; <span className="text-white">generateSuggestions</span>(Prediction pred); <br />
            &nbsp;&nbsp;ForecastResult <span className="text-white">calculateTrends</span>(Dataset data); <br />
            &#125;
          </div>
        </div>
      </section>

      {/* 6. System Architecture Section */}
      <section className="py-24 bg-[#0F172A]/50">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <span className="text-[9px] text-[#14B8A6] font-bold tracking-widest uppercase block mb-2">Monorepo Schemas</span>
          <h3 className="text-3xl font-extrabold text-white mb-8">Platform Data Flow</h3>
          <p className="text-xs text-slate-400 mb-12 max-w-xl mx-auto">
            IntelliSphere routes telemetry inputs from client forms through Spring Security filters directly into the PostgreSQL relational engine and JPA caching layers.
          </p>

          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 font-mono text-xs text-left text-slate-300 space-y-3 leading-normal shadow overflow-x-auto">
            <div className="flex items-center space-x-2">
              <span className="text-[#2563EB] font-bold">[Client Forms]</span>
              <span>---&gt;</span>
              <span className="text-[#14B8A6] font-bold">[Axios JWT Header]</span>
              <span>---&gt;</span>
              <span className="text-[#2563EB] font-bold">[Spring Security Filter]</span>
            </div>
            <div className="pl-16">|</div>
            <div className="flex items-center space-x-2 pl-8">
              <span>v</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#14B8A6] font-bold">[JPA UserRepository]</span>
              <span>&lt;---&gt;</span>
              <span className="text-white font-bold">[PostgreSQL: 13 Tables]</span>
              <span>&lt;---&gt;</span>
              <span className="text-[#F59E0B] font-bold">[Spring AI Core]</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing Section (Demo Tiers) */}
      <section id="pricing" className="py-24 border-y border-[#1E293B] bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-3xl font-extrabold text-white">Transparent SaaS Pricing</h3>
            <p className="text-xs text-slate-400 mt-2">Pick the tier calibrated for your workspace size.</p>
            
            {/* Billing period switcher */}
            <div className="inline-flex bg-[#1E293B] border border-[#334155] p-0.5 rounded-lg mt-6">
              <button 
                onClick={() => setBillingPeriod('monthly')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  billingPeriod === 'monthly' ? 'bg-[#2563EB] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingPeriod('annual')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  billingPeriod === 'annual' ? 'bg-[#2563EB] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual (-20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Developer', price: billingPeriod === 'monthly' ? '$49' : '$39', desc: 'Single-operator sandbox for local development testing.', features: ['1 Workspace', '100 Monthly AI Runs', 'Local SQLite support', 'Community support'] },
              { name: 'Professional', price: billingPeriod === 'monthly' ? '$149' : '$119', desc: 'Complete toolkit for active operations and IoT telemetry.', features: ['3 Workspaces', '2,500 Monthly AI Runs', 'PostgreSQL integration', 'Email support (24h)'] },
              { name: 'Enterprise', price: 'Custom', desc: 'Custom database architectures and dedicated prompt tuning.', features: ['Unlimited Workspaces', 'Unlimited AI runs', 'Dedicated database seeds', 'Dedicated Slack support'] }
            ].map((tier, idx) => (
              <div key={idx} className="bg-[#1E293B] border border-[#334155] rounded-xl p-8 flex flex-col justify-between hover:border-[#2563EB] transition-colors relative">
                {idx === 1 && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#14B8A6] text-white font-extrabold text-[9px] uppercase px-3 py-1 rounded-full tracking-widest shadow">
                    Most Popular
                  </span>
                )}
                <div>
                  <h4 className="font-extrabold text-white text-base mb-2">{tier.name}</h4>
                  <p className="text-xs text-slate-400 mb-6 min-h-[40px]">{tier.desc}</p>
                  <div className="mb-6 flex items-baseline space-x-1">
                    <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                    {tier.price !== 'Custom' && (
                      <span className="text-xs text-slate-400">/mo</span>
                    )}
                  </div>
                  <ul className="space-y-3 border-t border-[#334155] pt-6 mb-8 text-xs text-slate-300">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-[#14B8A6]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  onClick={() => navigate('/register')}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                    idx === 1 
                      ? 'bg-[#2563EB] hover:bg-[#2563EB]/95 text-white shadow shadow-[#2563EB]/25' 
                      : 'bg-slate-800 hover:bg-slate-700 text-[#F8FAFC]'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="py-24 bg-[#0F172A]/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-3xl font-extrabold text-white">Endorsed by Industry Leaders</h3>
            <p className="text-xs text-slate-400 mt-2">See what lead administrators say about our decision intelligence loops.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Sarah Jenkins', role: 'Operations Lead, AgriCorp', comment: 'Configuring soil hydration metrics and running linear forecasts saved our team thousands of dollars in annual crop irrigation waste.' },
              { name: 'Marcus Vance', role: 'CTO, City Grid Solutions', comment: 'IntelliSphere central AI service load-balancing prediction accuracy exceeds 98%. It is the backbone of our smart grid shunt allocation.' }
            ].map((t, idx) => (
              <div key={idx} className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-md">
                <div className="flex items-center space-x-1.5 text-[#F59E0B] mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#F59E0B]" />)}
                </div>
                <p className="text-xs italic text-slate-300 leading-relaxed mb-6">"{t.comment}"</p>
                <div>
                  <h4 className="font-bold text-white text-xs">{t.name}</h4>
                  <span className="text-[10px] text-slate-400">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section id="faq" className="py-24 border-t border-[#1E293B] bg-[#0F172A]">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400 mt-2">Have questions about integrations or relational data schemas?</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center text-white focus:outline-none"
                  >
                    <span className="font-bold text-xs">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-xs text-slate-400 leading-relaxed border-t border-[#334155] pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="border-t border-[#1E293B] bg-[#0F172A] py-12">
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#2563EB] rounded-lg text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-white block">IntelliSphere Corp.</span>
              <span className="text-[10px] text-slate-500">Decision Intelligence Systems</span>
            </div>
          </div>

          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="mailto:support@intellisphere.com" className="hover:text-white transition-colors">Support</a>
          </div>

          <div>
            <span>© 2026 IntelliSphere Corp. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
