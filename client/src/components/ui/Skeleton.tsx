interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-slate-800 rounded-lg ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
}
