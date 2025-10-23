import { sql } from "../config/db.sql.js";
export async function createUser({
  name,
  email,
  passwordHash,
  role = "customer",
}) {
  const r = await sql.query(
    "INSERT INTO users(name,email,passwordhash,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role",
    [name, email, passwordHash, role]
  );
  return r.rows[0];
}
export async function findUserByEmail(email) {
  const r = await sql.query("SELECT * FROM users WHERE email=$1", [email]);
  return r.rows[0] || null;
}
export async function findUserById(id) {
  const r = await sql.query(
    "SELECT id,name,email,role FROM users WHERE id=$1",
    [id]
  );
  return r.rows[0] || null;
}
