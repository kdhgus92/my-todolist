import { apiFetch } from '../../../shared/api/client';
import type { User } from '../../../shared/types/domain';

export function updateMe(name: string): Promise<User> {
  return apiFetch<User>('/users/me', { method: 'PATCH', body: JSON.stringify({ name }) });
}

export function fetchMe(): Promise<User> {
  return apiFetch<User>('/users/me');
}
