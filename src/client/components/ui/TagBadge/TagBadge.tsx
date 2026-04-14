import React from 'react';

interface TagBadgeProps {
  name: string;
  color: string;
  onRemove?: () => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function TagBadge({ name, color, onRemove, className = '', size = 'sm' }: TagBadgeProps) {
  // Use color-mix for background and border
  const style = {
    '--tag-color': color,
    backgroundColor: 'color-mix(in srgb, var(--tag-color), transparent 85%)',
    borderColor: 'color-mix(in srgb, var(--tag-color), transparent 60%)',
    color: color,
  } as React.CSSProperties;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span 
      style={style}
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider border rounded-full transition-all duration-200 hover:shadow-sm ${sizeClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--tag-color)] animate-pulse" />
      {name}
      {onRemove && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-red-500 transition-colors cursor-pointer"
          aria-label={`Remove tag ${name}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
