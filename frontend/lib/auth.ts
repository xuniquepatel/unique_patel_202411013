export function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}
export function setToken(t: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', t);
}
export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}
