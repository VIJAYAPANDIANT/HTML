import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function NotificationsPage() {
  const alerts = [
    { text: 'Model optimization run completed successfully: Asset Rebalancing.', type: 'success', time: '10 mins ago', icon: CheckCircle2, color: 'text-secondary bg-secondary/10' },
    { text: 'Unusual boundary inputs detected in Monte Carlo pipeline. Results may be skewed.', type: 'warning', time: '1 hour ago', icon: AlertTriangle, color: 'text-accent bg-accent/10' },
    { text: 'Daily database backup cron job completed.', type: 'info', time: '5 hours ago', icon: Info, color: 'text-primary bg-primary/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">System Notifications</h3>
          <p className="text-sm text-muted-foreground">Recent messages, webhook triggers, and WebSocket status logs.</p>
        </div>
        <button className="text-xs font-semibold text-secondary hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-4">
        {alerts.map((al, idx) => (
          <div key={idx} className="bg-card border border-border rounded-xl p-4 flex items-start space-x-4 shadow">
            <div className={`p-2 rounded-lg flex-shrink-0 ${al.color}`}>
              <al.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white leading-relaxed">{al.text}</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">{al.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
