import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTodoList, TodoCard } from '../../../entities/todo';
import { useCategoryList } from '../../../entities/category';
import { apiFetch } from '../../../shared/api/client';
import { DeleteTodoButton } from '../../../features/delete-todo';
import type { Todo } from '../../../shared/types/domain';

export function TodoBoard() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId') || undefined;
  const status = (searchParams.get('status') || undefined) as Todo['status'] | undefined;
  const { data: todos, isLoading } = useTodoList({ categoryId, status });
  const { data: categories } = useCategoryList();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: (todo: Todo) => apiFetch<Todo>(`/todos/${todo.id}`, { method: 'PATCH', body: JSON.stringify({ isDone: !todo.isDone }) }),
    onSuccess: (updated) => {
      if (import.meta.env.DEV) console.log('[todo-board] toggle success', updated.id, updated.isDone);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (err) => {
      if (import.meta.env.DEV) console.error('[todo-board] toggle failed', err);
    },
  });

  if (isLoading) return <p style={{ font: 'var(--font-body)', color: 'var(--color-text-muted)' }}>불러오는 중...</p>;
  if (!todos || todos.length === 0) return <p style={{ font: 'var(--font-body)', color: 'var(--color-text-muted)' }}>표시할 할일이 없습니다.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {todos.map((todo) => (
        <div key={todo.id} onClick={() => navigate(`/todos/${todo.id}/edit`)} style={{ cursor: 'pointer' }}>
          <div className="todo-row" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
              <TodoCard
                todo={todo}
                category={categories?.find((c) => c.id === todo.categoryId)}
                onToggleDone={() => toggleMutation.mutate(todo)}
              />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <DeleteTodoButton todoId={todo.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
