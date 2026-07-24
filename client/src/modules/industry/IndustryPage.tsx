import { Shield, Coins, Truck, Heart } from 'lucide-react';

export default function IndustryPage() {
  const modules = [
    { title: 'Financial Modeling', icon: Coins, desc: 'Optimize asset allocation, options pricing risk models, and liquidity management projections.', active: true },
    { title: 'Supply Chain & Logistics', icon: Truck, desc: 'Simulate route disruptions, supplier bottleneck costs, and warehouse storage allocations.', active: true },
    { title: 'Defense & Threat Security', icon: Shield, desc: 'Evaluate cyber risk posture indices, network failure modes, and response plans.', active: false },
    { title: 'Healthcare Logistics', icon: Heart, desc: 'Optimize patient dispatch schedules, pharmaceutical inventories, and clinic staffing models.', active: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Industry Modules</h3>
        <p className="text-sm text-muted-foreground">Select and configure industry-specific analytical models tuned with domain-expert AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((m) => (
          <div key={m.title} className="bg-card border border-border rounded-xl p-6 shadow flex space-x-4">
            <div className={`p-3 rounded-lg flex-shrink-0 h-12 w-12 flex items-center justify-center ${
              m.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              <m.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-lg font-bold text-white">{m.title}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                  m.active ? 'bg-secondary/15 text-secondary' : 'bg-muted text-muted-foreground'
                }`}>
                  {m.active ? 'Active' : 'Locked'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{m.desc}</p>
              <button 
                disabled={!m.active}
                className="text-sm font-semibold text-primary hover:text-primary/80 disabled:text-muted-foreground/50 transition-colors"
              >
                {m.active ? 'Configure Models →' : 'Upgrade License'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
