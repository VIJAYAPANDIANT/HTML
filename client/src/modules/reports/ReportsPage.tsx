import { useState } from 'react';
import { Download, FileSpreadsheet, Eye, X } from 'lucide-react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const reports = [
    { title: 'Global Resource Optimization Plan Q3', date: '2026-07-22', type: 'PDF Report', size: '2.4 MB' },
    { title: 'Liquidity & Capital Structure Stress Test', date: '2026-07-18', type: 'Excel Sheet', size: '15.1 MB' },
    { title: 'Threat Posture & Server Security Audits', date: '2026-07-15', type: 'PDF Report', size: '1.8 MB' },
  ];

  const handleDownload = (title: string, type: string) => {
    const isExcel = type.includes('Excel');
    const fileContent = `IntelliSphere Enterprise Decision AI Report\nReport: ${title}\nFormat: ${type}\nDate: ${new Date().toLocaleDateString()}\nStatus: Verified Secure`;
    const blob = new Blob([fileContent], { type: isExcel ? 'application/vnd.ms-excel' : 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}${isExcel ? '.xls' : '.pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Exported Reports</h3>
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
                  <FileSpreadsheet className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="font-medium text-foreground">{rep.title}</span>
                </td>
                <td className="p-4 text-muted-foreground">{rep.date}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted border border-border text-muted-foreground">
                    {rep.type}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{rep.size}</td>
                <td className="p-4 text-right space-x-2">
                  <button 
                    onClick={() => setSelectedReport(rep)}
                    className="p-1.5 hover:bg-muted/80 rounded border border-border text-muted-foreground hover:text-foreground transition-all"
                    title="View Report Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDownload(rep.title, rep.type)}
                    className="p-1.5 bg-primary hover:bg-primary/95 rounded text-white transition-all"
                    title="Download Report File"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Premium Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-foreground">{selectedReport.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Generated: {selectedReport.date} • {selectedReport.size} ({selectedReport.type})
                </p>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-lg transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="border-t border-border pt-4 text-xs text-muted-foreground space-y-3 leading-relaxed">
              <p className="font-semibold text-foreground">AI Executive Summary & Metadata:</p>
              <p>
                This document presents the detailed analytics, forecasts, and strategic optimization indexes computed by the IntelliSphere platform model engines.
              </p>
              <p>
                The neural logic loop has mapped risk mitigations and telemetry thresholds to optimize system yield by 14.2% while reducing carbon/environmental footprints globally. All simulated projections have been verified and cryptographically signed.
              </p>
            </div>
            
            <div className="flex justify-end pt-2 space-x-3">
              <button 
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-lg transition-colors"
              >
                Close Preview
              </button>
              <button 
                onClick={() => {
                  handleDownload(selectedReport.title, selectedReport.type);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Download Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
