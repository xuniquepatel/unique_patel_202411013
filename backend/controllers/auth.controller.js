import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";
import { str } from "../middleware/validate.js";

export async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (!str(name, 1, 120) || !str(email, 3, 200) || !str(password, 8, 200))
    return res.status(400).json({ error: "invalid" });
  const exists = await findUserByEmail(email);
  if (exists) return res.status(409).json({ error: "exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, passwordHash });
  res.json(user);
}
export async function login(req, res) {
  const { email, password } = req.body || {};
  const u = await findUserByEmail(email);
  if (!u) return res.status(401).json({ error: "invalid" });
  const ok = await bcrypt.compare(password, u.passwordhash);
  if (!ok) return res.status(401).json({ error: "invalid" });
  const token = jwt.sign(
    { sub: u.id, name: u.name, role: u.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: { id: u.id, name: u.name, email: u.email, role: u.role },
  });
}
export async function me(req, res) {
  const u = await findUserById(req.user.id);
  if (!u) return res.status(404).json({ error: "notfound" });
  res.json(u);
}
export async function logout(req, res) {
  res.json({ ok: true });
}
