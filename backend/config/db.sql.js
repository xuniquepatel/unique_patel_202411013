import pg from "pg";
import { SQL_URL } from "./env.js";

function needsSSL(url) {
  if (!url) return false;
  return !/localhost|127\.0\.0\.1|::1/.test(url);
}

export const sql = new pg.Pool({
  connectionString: SQL_URL,
  ssl: needsSSL(SQL_URL) ? { rejectUnauthorized: false } : false,
});

export async function initSql() {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordhash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      createdat TIMESTAMP NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS orders(
      id SERIAL PRIMARY KEY,
      userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
      total NUMERIC(10,2) NOT NULL,
      createdat TIMESTAMP NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS order_items(
      id SERIAL PRIMARY KEY,
      orderid INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      productid TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      priceatpurchase NUMERIC(10,2) NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_orders_userid_createdat ON orders(userid,createdat);
    CREATE INDEX IF NOT EXISTS idx_order_items_orderid ON order_items(orderid);
  `);
}
