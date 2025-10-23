import { dailyRevenue } from "../models/order.model.js";
import { aggregateByCategory } from "../models/product.model.js";
export async function sqlDailyRevenue(req, res) {
  res.json(await dailyRevenue());
}
export async function mongoByCategory(req, res) {
  res.json(await aggregateByCategory());
}
