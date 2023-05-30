import express from "express";
import { getSales, searchSales, searchProducts } from "../controllers/sales.js"
import ensureAuth from "../middleware/auth.js";

const router = express.Router();

router.get("/sales", ensureAuth, getSales)
router.get("/searchSales", ensureAuth, searchSales)
router.get("/searchProducts", ensureAuth, searchProducts)

export default router;