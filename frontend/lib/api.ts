export const API = process.env.NEXT_PUBLIC_API_BASE!;
export async function api(path: string, init?: RequestInit, evalSort?: 'asc'|'desc') {
  const headers = new Headers(init?.headers);
  if (evalSort) headers.set('X-Eval-Sort', evalSort);
  return fetch(`${API}${path}`, { ...init, headers, cache: 'no-store' });
}
