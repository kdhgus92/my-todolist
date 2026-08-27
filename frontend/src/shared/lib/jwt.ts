export function decodeJwtPayload(token: string): { id: string; email: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (typeof payload.id !== 'string' || typeof payload.email !== 'string') return null;
    return { id: payload.id, email: payload.email };
  } catch {
    return null;
  }
}
