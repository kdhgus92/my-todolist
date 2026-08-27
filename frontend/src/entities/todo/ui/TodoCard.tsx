import type { Todo, Category, TodoStatus } from '../../../shared/types/domain';

const STATUS_COLOR: Record<TodoStatus, { color: string; bg: string }> = {
  '시작전': { color: 'var(--color-text-muted)', bg: 'var(--color-neutral-subtle)' },
  '진행중': { color: 'var(--color-accent-hover)', bg: 'var(--color-accent-subtle)' },
  '완료': { color: 'var(--color-success)', bg: 'var(--color-success-subtle)' },
  '기한초과': { color: 'var(--color-danger)', bg: 'var(--color-danger-subtle)' },
};

export interface TodoCardProps {
  todo: Todo;
  category?: Category;
  onToggleDone?: () => void;
}

export function TodoCard({ todo, category, onToggleDone }: TodoCardProps) {
  const statusStyle = STATUS_COLOR[todo.status];
  return (
    <div className="todo-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <input type="checkbox" checked={todo.isDone} onChange={onToggleDone} readOnly={!onToggleDone} />
      <div style={{ flex: 1 }}>
        <div style={{ textDecoration: todo.isDone ? 'line-through' : 'none', color: todo.isDone ? 'var(--color-text-muted)' : 'var(--color-text)' }}>
          {todo.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          {category?.name} · {todo.startDate} ~ {todo.endDate}
        </div>
      </div>
      <span style={{ color: statusStyle.color, background: statusStyle.bg, borderRadius: 'var(--radius-sm)', padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
        {todo.status}
      </span>
    </div>
  );
}
