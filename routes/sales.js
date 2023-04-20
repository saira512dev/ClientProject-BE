import express from "express";
import { getSales, searchSales } from "../controllers/sales.js"
import ensureAuth from "../middleware/auth.js";

const router = express.Router();

router.get("/sales", ensureAuth, getSales)
router.get("/searchSales", ensureAuth, searchSales)

export default router;