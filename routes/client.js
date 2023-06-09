import express from "express";
import { getProducts, getCustomers, getTransactions, getGeography } from "../controllers/client.js";
import ensureAuth from "../middleware/auth.js";

const router = express.Router();

router.get("/products",  getProducts);
router.get("/customers", ensureAuth, getCustomers);
router.get("/transactions", ensureAuth, getTransactions);
// router.get("/backlinks", ensureAuth, getBacklinks);
router.get("/geography", ensureAuth, getGeography);

export default router;