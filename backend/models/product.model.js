import { getProducts } from "../config/db.mongo.js";
export async function searchProducts({
  q,
  category,
  page = 1,
  limit = 12,
  sort = "desc",
}) {
  const col = getProducts();
  const filter = {};
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { sku: { $regex: q, $options: "i" } },
    ];
  }
  if (category) {
    filter.category = category;
  }
  const s = sort === "asc" ? { price: 1, _id: 1 } : { price: -1, _id: 1 };
  const total = await col.countDocuments(filter);
  const items = await col
    .find(filter)
    .sort(s)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  return { items, total, totalPages: Math.ceil(total / limit), page };
}
export async function findProductById(id) {
  const col = getProducts();
  return col.findOne({ _id: id });
}
export async function createProduct(data) {
  const col = getProducts();
  data.updatedAt = new Date();
  const r = await col.insertOne(data);
  return { ...data, _id: r.insertedId };
}
export async function updateProduct(id, data) {
  const col = getProducts();
  data.updatedAt = new Date();
  await col.updateOne({ _id: id }, { $set: data });
  return await col.findOne({ _id: id });
}
export async function deleteProduct(id) {
  const col = getProducts();
  await col.deleteOne({ _id: id });
  return { ok: true };
}
export async function aggregateByCategory() {
  const col = getProducts();
  return col
    .aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          sumPrice: { $sum: "$price" },
        },
      },
      { $project: { category: "$_id", _id: 0, count: 1, sumPrice: 1 } },
    ])
    .toArray();
}
