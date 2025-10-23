import express from "express";
import cors from "cors";
import { PORT, CORS_ORIGIN } from "./config/env.js";
import { initSql } from "./config/db.sql.js";
import { initMongo } from "./config/db.mongo.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/reports", reportRoutes);

export async function boot() {
  await initSql();
  await initMongo();
  const srv = app.listen(PORT, () => {});
  return srv;
}
if (process.env.NODE_ENV !== "test") {
  boot();
}
export default app;
