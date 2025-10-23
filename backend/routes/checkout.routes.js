import { Router } from "express";
import { preview, checkout } from "../controllers/checkout.controller.js";
import { requireAuth } from "../middleware/auth.js";
const r = Router();
r.post("/preview", requireAuth, preview);
r.post("/", requireAuth, checkout);
export default r;
