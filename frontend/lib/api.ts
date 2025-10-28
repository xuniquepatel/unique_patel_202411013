const BASE = process.env.NEXT_PUBLIC_API_BASE;
if (!BASE) throw new Error('NEXT_PUBLIC_API_BASE is missing');

export async function api(path: string, init?: RequestInit, evalSort?: 'asc'|'desc') {
  const headers = new Headers(init?.headers);
  if (evalSort) headers.set('X-Eval-Sort', evalSort);
  const res = await fetch(`${BASE}${path}`, { ...init, headers, cache: 'no-store' });
  const ct = res.headers.get('content-type') || '';
  if (!res.ok) { const t = await res.text(); throw new Error(`API ${res.status}: ${t.slice(0,200)}`); }
  if (!ct.includes('application/json')) { const t = await res.text(); throw new Error(`Non-JSON from API: ${t.slice(0,200)}`); }
  return res;
}
