import { refreshAccessToken } from '../../../shared/api/client';
import { fetchMe } from '../api/users.api';
import { useAuthStore } from './authStore';

export async function bootstrapAuth(): Promise<void> {
  try {
    await refreshAccessToken();
    const user = await fetchMe();
    useAuthStore.getState().restoreSession(user);
  } catch {
    if (import.meta.env.DEV) console.log('[auth] no valid session to restore');
  }
}
