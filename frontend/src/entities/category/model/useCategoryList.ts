import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api/categories.api';

export const categoryListQueryKey = ['categories'] as const;

export function useCategoryList() {
  return useQuery({ queryKey: categoryListQueryKey, queryFn: fetchCategories });
}
