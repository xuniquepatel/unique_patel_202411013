export function str(v, min = 1, max = 255) {
  return typeof v === "string" && v.length >= min && v.length <= max;
}
export function posInt(v) {
  return Number.isInteger(v) && v > 0;
}
export function num(v) {
  return typeof v === "number" && Number.isFinite(v);
}
