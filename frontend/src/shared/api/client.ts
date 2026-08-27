let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;
let authFailureCallback: (() => void) | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function onAuthFailure(callback: () => void): void {
  authFailureCallback = callback;
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

async function rawFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  return fetch(`${BASE_URL}${path}`, { ...options, credentials: 'include', headers });
}

export async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const res = await fetch(`${BASE_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('refresh failed');
      const data = await res.json();
      setAccessToken(data.accessToken);
      return data.accessToken as string;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function logoutRequest(): Promise<void> {
  try {
    await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
  } catch {
    // best-effort: client-side token is cleared regardless of network outcome
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res = await rawFetch(path, options);

  if (res.status === 401 && path !== '/auth/login' && path !== '/auth/refresh') {
    if (import.meta.env.DEV) console.log('[api] 401 received, attempting refresh', path);
    try {
      await refreshAccessToken();
      res = await rawFetch(path, options);
    } catch {
      if (import.meta.env.DEV) console.log('[api] refresh failed, clearing session');
      setAccessToken(null);
      authFailureCallback?.();
      throw new ApiError(401, 'UNAUTHORIZED', '다시 로그인해 주세요.');
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const code = body?.error?.code ?? 'UNKNOWN_ERROR';
    const message = body?.error?.message ?? '요청 처리 중 오류가 발생했습니다.';
    if (import.meta.env.DEV) console.error('[api] request failed', res.status, code, message);
    throw new ApiError(res.status, code, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
