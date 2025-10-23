import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
} from "../controllers/product.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
const r = Router();
r.get("/", listProducts);
r.get("/:id", getProduct);
r.post("/", requireAuth, requireRole("admin"), createProductCtrl);
r.put("/:id", requireAuth, requireRole("admin"), updateProductCtrl);
r.delete("/:id", requireAuth, requireRole("admin"), deleteProductCtrl);
export default r;
