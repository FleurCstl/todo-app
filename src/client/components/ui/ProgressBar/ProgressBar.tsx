

interface ProgressBarProps {
  progress: number;
  className?: string;
  showText?: boolean;
}

export function ProgressBar({ progress, className = '', showText = false }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Complétion</span>
          <span className="text-xs font-bold text-primary">{clampedProgress}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-border-subtle/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_color-mix(in_srgb,var(--color-primary),transparent_70%)]"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
