import { useQuery } from '@tanstack/react-query';
import { fetchTodos, type TodoListFilters } from '../api/todos.api';

export function useTodoList(filters: TodoListFilters = {}) {
  return useQuery({
    queryKey: ['todos', filters.categoryId ?? null, filters.status ?? null],
    queryFn: () => fetchTodos(filters),
  });
}
