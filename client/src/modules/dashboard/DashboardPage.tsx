import { Brain, Users, Activity, BarChart } from 'lucide-react';

export default function DashboardPage() {
  const cards = [
    { title: 'Active Decisions', value: '12', description: '8 analyzed, 4 in progress', icon: Brain, color: 'text-primary' },
    { title: 'Organizations', value: '4', description: 'Across 2 regions', icon: Users, color: 'text-secondary' },
    { title: 'AI Model Utility', value: '98.4%', description: 'Confidence index average', icon: Activity, color: 'text-accent' },
    { title: 'Simulations Run', value: '1,420', description: '+12% this week', icon: BarChart, color: 'text-primary' },
  ];

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-card border border-border rounded-xl p-6 shadow-md hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Analytics Placeholder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4">Decision Optimization Trends</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg text-muted-foreground">
            [Apache ECharts Line Chart Placeholder]
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">AI Confidence Distribution</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg text-muted-foreground">
            [Apache ECharts Pie Chart Placeholder]
          </div>
        </div>
      </div>
    </div>
  );
}
