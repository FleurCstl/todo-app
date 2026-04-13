import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, label, id, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id || defaultId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            flex h-10 w-full rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm
            file:border-0 file:bg-transparent file:text-sm file:font-medium
            placeholder:text-text-muted/60
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary
            disabled:cursor-not-allowed disabled:opacity-50 shadow-sm
            ${error ? 'border-error ring-error focus-visible:ring-error focus-visible:border-error text-error' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-error mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
