import { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Wrench, 
  ShieldCheck,
  Bot
} from 'lucide-react';

export interface AIRecommendation {
  id: string;
  title: string;
  category: string; // PREDICTIVE_MAINTENANCE, ENERGY_SAVING, QUALITY_OPTIMIZATION, THROUGHPUT
  impact: string; // High, Medium, Low
  description: string;
  actionableStep: string;
  confidenceScore: number;
  estimatedSavings: string;
}

interface Props {
  recommendations: AIRecommendation[];
  onApplyRecommendation?: (rec: AIRecommendation) => void;
}

export default function AIRecommendationPanelWidget({ recommendations, onApplyRecommendation }: Props) {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const handleApply = (rec: AIRecommendation) => {
    setAppliedIds(prev => [...prev, rec.id]);
    if (onApplyRecommendation) {
      onApplyRecommendation(rec);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toUpperCase()) {
      case 'PREDICTIVE_MAINTENANCE':
        return <Wrench className="h-4 w-4 text-cyan-400" />;
      case 'ENERGY_SAVING':
        return <Zap className="h-4 w-4 text-amber-400" />;
      case 'QUALITY_OPTIMIZATION':
        return <ShieldCheck className="h-4 w-4 text-emerald-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-primary" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact.toUpperCase()) {
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-card/70 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-secondary/15 rounded-xl text-secondary">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground tracking-tight flex items-center space-x-2">
              <span>Decision AI Recommendation Engine</span>
              <span className="px-2 py-0.5 text-[10px] bg-secondary/20 text-secondary font-mono font-bold rounded-full">Active Model</span>
            </h3>
            <p className="text-xs text-muted-foreground">Autonomous anomaly detection, energy load shifts, and predictive maintenance optimizations</p>
          </div>
        </div>

        <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
          {recommendations.length} Active Recommendations
        </span>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {recommendations.map((rec) => {
          const isApplied = appliedIds.includes(rec.id);

          return (
            <div 
              key={rec.id}
              className={`bg-background/60 border rounded-2xl p-5 transition-all shadow-sm space-y-4 flex flex-col justify-between ${
                isApplied ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border/70 hover:border-primary/50'
              }`}
            >
              <div className="space-y-3">
                {/* Header Tag Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-foreground">
                    {getCategoryIcon(rec.category)}
                    <span className="text-[11px] font-mono uppercase text-muted-foreground">{rec.category.replace('_', ' ')}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${getImpactBadge(rec.impact)}`}>
                    {rec.impact} Impact
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-foreground leading-snug">{rec.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>

                {/* Actionable Step */}
                <div className="p-3 bg-card/60 border border-border/40 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase block">Recommended Action</span>
                  <p className="text-xs text-foreground font-semibold">{rec.actionableStep}</p>
                </div>

                {/* Savings & Confidence */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-semibold">Confidence</span>
                    <span className="font-extrabold text-primary">{rec.confidenceScore}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-semibold">Projected Value</span>
                    <span className="font-extrabold text-emerald-400">{rec.estimatedSavings}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-border/40">
                <button
                  onClick={() => handleApply(rec)}
                  disabled={isApplied}
                  className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center space-x-2 ${
                    isApplied 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                      : 'bg-primary hover:bg-primary/90 text-white shadow-md'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Optimization Enforced</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Execute AI Optimization</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
