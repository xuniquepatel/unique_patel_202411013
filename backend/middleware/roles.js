export function requireRole(role) {
  return (req, res, next) =>
    req.user?.role === role
      ? next()
      : res.status(403).json({ error: "forbidden" });
}
