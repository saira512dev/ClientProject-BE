import express from "express";
import { getSales, searchSales, searchProducts } from "../controllers/sales.js"
import ensureAuth from "../middleware/auth.js";

const router = express.Router();

router.get("/sales",  getSales)
router.get("/searchSales",  searchSales)
router.get("/searchProducts", searchProducts)

export default router;