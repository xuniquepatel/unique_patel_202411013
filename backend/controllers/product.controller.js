import {
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  findProductById,
} from "../models/product.model.js";
import { str, num, posInt } from "../middleware/validate.js";

export async function listProducts(req, res) {
  const q = (req.query.q || "").toString().slice(0, 64);
  const category = req.query.category
    ? req.query.category.toString().slice(0, 64)
    : undefined;
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(req.query.limit || "12", 10))
  );
  const override =
    (req.headers["x-eval-sort"] || req.query.evalSort || "")
      .toString()
      .toLowerCase() === "asc"
      ? "asc"
      : "desc";
  const data = await searchProducts({
    q: q || undefined,
    category,
    page,
    limit,
    sort: override,
  });
  res.json(data);
}
export async function getProduct(req, res) {
  const it = await findProductById(req.params.id);
  if (!it) return res.status(404).json({ error: "notfound" });
  res.json(it);
}
export async function createProductCtrl(req, res) {
  const { sku, name, price, category } = req.body || {};
  if (
    !str(sku, 1, 64) ||
    !str(name, 1, 200) ||
    !num(price) ||
    !str(category, 1, 64)
  )
    return res.status(400).json({ error: "invalid" });
  const created = await createProduct({
    sku,
    name,
    price: Number(price),
    category,
  });
  res.status(201).json(created);
}
export async function updateProductCtrl(req, res) {
  const { name, price, category } = req.body || {};
  const data = {};
  if (name) {
    if (!str(name, 1, 200)) return res.status(400).json({ error: "invalid" });
    data.name = name;
  }
  if (price !== undefined) {
    if (!num(price)) return res.status(400).json({ error: "invalid" });
    data.price = Number(price);
  }
  if (category) {
    if (!str(category, 1, 64))
      return res.status(400).json({ error: "invalid" });
    data.category = category;
  }
  const up = await updateProduct(req.params.id, data);
  if (!up) return res.status(404).json({ error: "notfound" });
  res.json(up);
}
export async function deleteProductCtrl(req, res) {
  await deleteProduct(req.params.id);
  res.json({ ok: true });
}
