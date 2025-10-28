type Item = { productId: string; quantity: number; name?: string; price?: number };
const KEY = 'cart_items';
export function readCart(): Item[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
export function writeCart(items: Item[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(items));
}
export function addToCart(productId: string, quantity = 1) {
  const items = readCart();
  const i = items.findIndex(x => x.productId === productId);
  if (i >= 0) items[i].quantity += quantity; else items.push({ productId, quantity });
  writeCart(items);
  return items;
}
export function setQty(productId: string, quantity: number) {
  const items = readCart().map(x => x.productId === productId ? { ...x, quantity } : x).filter(x => x.quantity > 0);
  writeCart(items); return items;
}
export function clearCart(){ writeCart([]); }
