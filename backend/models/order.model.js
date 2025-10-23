import { sql } from "../config/db.sql.js";
export async function createOrder({ userId, items }) {
  const client = await sql.connect();
  try {
    await client.query("BEGIN");
    let total = 0;
    for (const it of items) {
      total += Number(it.price) * it.quantity;
    }
    const r = await client.query(
      "INSERT INTO orders(userid,total) VALUES($1,$2) RETURNING id,createdat",
      [userId, total]
    );
    const orderId = r.rows[0].id;
    for (const it of items) {
      await client.query(
        "INSERT INTO order_items(orderid,productid,quantity,priceatpurchase) VALUES($1,$2,$3,$4)",
        [orderId, String(it.productId), it.quantity, it.price]
      );
    }
    await client.query("COMMIT");
    return { orderId, total, createdAt: r.rows[0].createdat };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
export async function dailyRevenue() {
  const r = await sql.query(
    "SELECT to_char(createdat,'YYYY-MM-DD') as date, SUM(total)::float as total FROM orders GROUP BY 1 ORDER BY 1"
  );
  return r.rows;
}
