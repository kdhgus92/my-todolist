export function FormFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p style={{ font: 'var(--font-caption)', color: 'var(--color-danger)', margin: '4px 0 0' }}>⚠ {message}</p>;
}
