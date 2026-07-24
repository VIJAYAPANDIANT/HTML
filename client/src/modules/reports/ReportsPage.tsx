import { Download, FileSpreadsheet, Eye } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    { title: 'Global Resource Optimization Plan Q3', date: '2026-07-22', type: 'PDF Report', size: '2.4 MB' },
    { title: 'Liquidity & Capital Structure Stress Test', date: '2026-07-18', type: 'Excel Sheet', size: '15.1 MB' },
    { title: 'Threat Posture & Server Security Audits', date: '2026-07-15', type: 'PDF Report', size: '1.8 MB' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Exported Reports</h3>
        <p className="text-sm text-muted-foreground">Download, inspect, or generate document sheets based on AI simulations.</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
              <th className="p-4">Report Name</th>
              <th className="p-4">Generation Date</th>
              <th className="p-4">Format</th>
              <th className="p-4">Size</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground">
            {reports.map((rep) => (
              <tr key={rep.title} className="hover:bg-muted/10 transition-colors">
                <td className="p-4 flex items-center space-x-3">
                  <FileSpreadsheet className="h-5 w-5 text-secondary" />
                  <span className="font-medium text-white">{rep.title}</span>
                </td>
                <td className="p-4 text-muted-foreground">{rep.date}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted border border-border text-muted-foreground">
                    {rep.type}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{rep.size}</td>
                <td className="p-4 text-right space-x-2">
                  <button className="p-1.5 hover:bg-muted/80 rounded border border-border text-muted-foreground hover:text-white transition-all">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 bg-primary hover:bg-primary/95 rounded text-white transition-all">
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
