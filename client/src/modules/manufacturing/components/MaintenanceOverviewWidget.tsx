import React, { useState } from 'react';
import { 
  Wrench, 
  Clock, 
  Plus, 
  UserCheck, 
  Calendar
} from 'lucide-react';

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  machineName: string;
  issueDescription: string;
  priority: string; // CRITICAL, HIGH, MEDIUM, LOW
  status: string; // SCHEDULED, IN_PROGRESS, COMPLETED
  failureProbability: number;
  assignedTechnician: string;
  estimatedDurationHours: number;
  scheduledDate: string;
}

export interface MaintenanceOverviewData {
  mtbfHours: number;
  mttrHours: number;
  pendingWorkOrdersCount: number;
  criticalWorkOrdersCount: number;
  predictiveMaintenanceAccuracy: number;
  workOrders: WorkOrder[];
}

interface Props {
  data: MaintenanceOverviewData;
  onCreateWorkOrder?: (machineName: string, issue: string, priority: string) => void;
}

export default function MaintenanceOverviewWidget({ data, onCreateWorkOrder }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [machineName, setMachineName] = useState('Schuler Stamping Press 500T');
  const [issueDescription, setIssueDescription] = useState('');
  const [priority, setPriority] = useState('HIGH');

  const handleSubmitWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreateWorkOrder && issueDescription.trim()) {
      onCreateWorkOrder(machineName, issueDescription, priority);
      setIssueDescription('');
      setShowModal(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s.toUpperCase()) {
      case 'IN_PROGRESS':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-primary/10 text-primary border-primary/30';
    }
  };

  return (
    <div className="bg-card/70 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground tracking-tight">Predictive Maintenance & Work Orders</h3>
            <p className="text-xs text-muted-foreground">MTBF/MTTR metrics, machine failure probability %, technician dispatches, and work order tracking</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Work Order</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">MTBF (Mean Time Between Failures)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-foreground">{data.mtbfHours} hrs</span>
            <span className="text-xs text-emerald-400 font-semibold">+12% vs target</span>
          </div>
        </div>

        <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">MTTR (Mean Time To Repair)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-cyan-400">{data.mttrHours} hrs</span>
            <span className="text-xs text-muted-foreground">Fast response</span>
          </div>
        </div>

        <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Pending Work Orders</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-400">{data.pendingWorkOrdersCount}</span>
            <span className="text-xs text-rose-400 font-bold">{data.criticalWorkOrdersCount} Critical</span>
          </div>
        </div>

        <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">AI Predictive Accuracy</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">{data.predictiveMaintenanceAccuracy}%</span>
            <span className="text-xs text-emerald-400 font-bold">High Precision</span>
          </div>
        </div>

      </div>

      {/* Work Orders List */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-foreground flex items-center space-x-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>Active & Scheduled Maintenance Work Orders</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.workOrders.map((wo) => (
            <div 
              key={wo.id}
              className="bg-background/60 border border-border/70 rounded-2xl p-5 hover:border-primary/50 transition-all shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {wo.workOrderNumber}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${getPriorityBadge(wo.priority)}`}>
                      {wo.priority}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${getStatusBadge(wo.status)}`}>
                      {wo.status}
                    </span>
                  </div>
                </div>

                <h5 className="font-bold text-sm text-foreground">{wo.machineName}</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">{wo.issueDescription}</p>

                <div className="p-2.5 bg-card/60 border border-border/40 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Failure Risk:</span>
                  <span className={`font-extrabold ${wo.failureProbability > 50 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {wo.failureProbability}%
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                  <span>{wo.assignedTechnician}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{wo.scheduledDate}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Creating Work Order */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground flex items-center space-x-2">
                <Wrench className="h-5 w-5 text-primary" />
                <span>Create Maintenance Work Order</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleSubmitWorkOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Target Machine</label>
                <select 
                  value={machineName}
                  onChange={(e) => setMachineName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Schuler Stamping Press 500T">Schuler Stamping Press 500T (PRESS-301)</option>
                  <option value="KUKA Robotic Weld-Arm 4">KUKA Robotic Weld-Arm 4 (WELD-204)</option>
                  <option value="CNC Lathe Ultra 5X">CNC Lathe Ultra 5X (CNC-101)</option>
                  <option value="Bosch Rexroth Pump H2">Bosch Rexroth Pump H2 (PUMP-402)</option>
                  <option value="FlexLink Conveyor System C-3">FlexLink Conveyor System C-3 (CONV-503)</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Priority Level</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="CRITICAL">CRITICAL (Emergency Downtime)</option>
                  <option value="HIGH">HIGH (Predictive Thermal/Vibration Risk)</option>
                  <option value="MEDIUM">MEDIUM (Scheduled Inspection)</option>
                  <option value="LOW">LOW (Calibration & Cleaning)</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Issue Description</label>
                <textarea 
                  rows={3}
                  placeholder="Describe machine symptom, telemetry anomaly, or maintenance requirement..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="pt-3 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-md"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
