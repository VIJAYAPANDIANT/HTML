import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Coins, 
  Activity, 
  Compass, 
  Truck, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { title: 'Agriculture optimization', icon: Coins, desc: 'Optimize resource allocation and hydration levels based on dynamic AI predictors.' },
    { title: 'Healthcare Logistics', icon: Activity, desc: 'Analyze clinic schedules, track patient load curves, and prevent staff bottlenecks.' },
    { title: 'Manufacturing Diagnostics', icon: Compass, desc: 'Utilize predictive maintenance and thermal analysis on factory floor machines.' },
    { title: 'Smart City Infrastructure', icon: Truck, desc: 'Balance energy grid load shunts and manage traffic congestion indexes.' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between overflow-x-hidden">
      {/* Navbar */}
      <header className="h-20 border-b border-border flex items-center justify-between px-8 md:px-16 max-w-7xl w-full mx-auto">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-primary rounded-xl text-white shadow-md shadow-primary/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white leading-none">IntelliSphere</h1>
            <span className="text-[10px] text-secondary font-bold tracking-widest uppercase">Decision Intelligence</span>
          </div>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 hover:bg-card border border-transparent hover:border-border text-sm font-semibold rounded-lg transition-all"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg text-sm transition-all shadow-md shadow-primary/10"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center max-w-5xl mx-auto">
        {/* Glow Element */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center space-x-2 bg-card border border-border px-3 py-1 rounded-full text-xs font-semibold text-secondary mb-6 relative">
          <ShieldCheck className="h-4 w-4" />
          <span>V2.0 Active — Enterprise Decision AI</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6 max-w-4xl">
          Empower Enterprise Decisions with <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">State-of-the-Art AI</span>
        </h2>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          IntelliSphere leverages a shared, predictive AI simulation engine to manage risk, optimize capital, and forecast metrics across agriculture, healthcare, manufacturing, and smart grids.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center space-x-2 justify-center group"
          >
            <span>Launch Platform</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-card hover:bg-card/85 text-foreground border border-border hover:border-muted-foreground/30 font-bold rounded-lg transition-all"
          >
            Request Demo
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
          {features.map((feat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-md hover:border-primary/50 transition-all duration-300">
              <div className="p-3 bg-muted/40 rounded-lg text-secondary inline-block mb-4">
                <feat.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-sm mb-2">{feat.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-border flex items-center justify-between px-8 md:px-16 max-w-7xl w-full mx-auto text-xs text-muted-foreground flex-shrink-0">
        <span>© 2026 IntelliSphere Corp. All rights reserved.</span>
        <div className="space-x-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
