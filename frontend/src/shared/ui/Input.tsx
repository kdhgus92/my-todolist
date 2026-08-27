import type { InputHTMLAttributes } from 'react';
import { FormFieldError } from './FormFieldError';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} style={{ font: 'var(--font-label)', color: 'var(--color-text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={className ? `shared-input ${className}` : 'shared-input'}
        {...props}
        style={{
          width: '100%',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          background: props.disabled ? 'var(--color-surface-hover)' : 'var(--color-surface)',
          color: props.disabled ? 'var(--color-text-muted)' : 'var(--color-text)',
          cursor: props.disabled ? 'not-allowed' : undefined,
          font: 'var(--font-body)',
        }}
      />
      <FormFieldError message={error} />
    </div>
  );
}
