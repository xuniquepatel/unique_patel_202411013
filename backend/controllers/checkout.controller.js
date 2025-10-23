import { getProducts } from "../config/db.mongo.js";
import { createOrder } from "../models/order.model.js";
import { posInt } from "../middleware/validate.js";

async function resolveItems(items) {
  const col = getProducts();
  const out = [];
  for (const it of items) {
    const doc = await col.findOne({ _id: it.productId });
    if (!doc) throw new Error("bad_product");
    if (!posInt(it.quantity)) throw new Error("bad_qty");
    out.push({
      productId: String(doc._id),
      name: doc.name,
      price: Number(doc.price),
      quantity: it.quantity,
    });
  }
  return out;
}
export async function preview(req, res) {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  try {
    const resolved = await resolveItems(items);
    const enriched = resolved.map((x) => ({
      ...x,
      subtotal: x.price * x.quantity,
    }));
    const total = enriched.reduce((a, b) => a + b.subtotal, 0);
    res.json({ items: enriched, total });
  } catch (e) {
    res.status(400).json({ error: "invalid" });
  }
}
export async function checkout(req, res) {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  try {
    const resolved = await resolveItems(items);
    const order = await createOrder({ userId: req.user.id, items: resolved });
    res.status(201).json(order);
  } catch (e) {
    res.status(400).json({ error: "invalid" });
  }
}
