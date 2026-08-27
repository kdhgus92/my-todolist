import { apiFetch } from '../../../shared/api/client';
import type { Category } from '../../../shared/types/domain';

export function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories');
}
