import type { Category } from '../../../shared/types/domain';

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      style={{
        background: 'var(--color-surface-hover)',
        color: 'var(--color-text-muted)',
        borderRadius: 'var(--radius-sm)',
        padding: '2px 8px',
        fontSize: 12,
      }}
    >
      {category.name}
    </span>
  );
}
