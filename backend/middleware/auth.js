import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
export function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!t) return res.status(401).json({ error: "unauthorized" });
  try {
    const p = jwt.verify(t, JWT_SECRET);
    req.user = { id: p.sub, name: p.name, role: p.role };
    next();
  } catch {
    res.status(401).json({ error: "unauthorized" });
  }
}
