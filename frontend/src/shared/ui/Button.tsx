import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ variant = 'primary', style, ...props }: ButtonProps) {
  const variantStyle = {
    primary: { background: 'var(--color-ink)', color: 'var(--color-text-inverse)', border: 'none' },
    secondary: { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border-strong)' },
    danger: { background: 'var(--color-surface)', color: 'var(--color-danger)', border: '1px solid var(--color-danger)' },
  }[variant];

  return (
    <button
      {...props}
      style={{
        padding: '10px 20px',
        borderRadius: 'var(--radius-full)',
        font: 'var(--font-button)',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.4 : 1,
        ...variantStyle,
        ...style,
      }}
    />
  );
}
