import { refreshAccessToken } from '../../../shared/api/client';
import { decodeJwtPayload } from '../../../shared/lib/jwt';
import { useAuthStore } from './authStore';

export async function bootstrapAuth(): Promise<void> {
  try {
    const token = await refreshAccessToken();
    const payload = decodeJwtPayload(token);
    if (!payload) return;
    useAuthStore.getState().restoreSession({ id: payload.id, email: payload.email, name: '', createdAt: '' });
  } catch {
    if (import.meta.env.DEV) console.log('[auth] no valid session to restore');
  }
}
