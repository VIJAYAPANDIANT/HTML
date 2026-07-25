import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="h-64 border border-dashed border-border rounded-xl flex flex-col items-center justify-center p-6 text-center bg-card/20">
      <div className="p-3 bg-muted/40 rounded-full text-muted-foreground mb-4">
        <FolderOpen className="h-8 w-8" />
      </div>
      <h4 className="font-bold text-sm text-white">{title}</h4>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-normal">{description}</p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg transition-colors shadow"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
