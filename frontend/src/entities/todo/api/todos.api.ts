import { apiFetch } from '../../../shared/api/client';
import type { Todo, TodoStatus } from '../../../shared/types/domain';

export interface TodoListFilters {
  categoryId?: string;
  status?: TodoStatus;
}

export function fetchTodos(filters: TodoListFilters = {}): Promise<Todo[]> {
  const params = new URLSearchParams();
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.status) params.set('status', filters.status);
  const qs = params.toString();
  return apiFetch<Todo[]>(`/todos${qs ? `?${qs}` : ''}`);
}
