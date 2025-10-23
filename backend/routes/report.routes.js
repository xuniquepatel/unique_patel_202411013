import { Router } from "express";
import {
  sqlDailyRevenue,
  mongoByCategory,
} from "../controllers/report.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
const r = Router();
r.get("/sql/daily-revenue", requireAuth, requireRole("admin"), sqlDailyRevenue);
r.get("/mongo/category", requireAuth, requireRole("admin"), mongoByCategory);
export default r;
