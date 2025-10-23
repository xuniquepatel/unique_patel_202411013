export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(t: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', t);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}

export async function fetchMe() {
  const t = getToken();
  if (!t) return null;
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${t}` },
    cache: 'no-store'
  });
  if (!r.ok) return null;
  return r.json();
}
