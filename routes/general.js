import express from "express";
import  { logout, postLogin, test, postSignup }  from "../controllers/auth.js";
import ensureAuth from "../middleware/auth.js";
import { getUser, getDashboardStats, getAuthUser } from "../controllers/general.js";
const router = express.Router();

router.post("/login", postLogin);
router.get('/authUser',ensureAuth, getAuthUser);
router.post("/signup", postSignup);
router.get("/test", test);
router.get("/logout", logout);
router.get("/user/:id", getUser)
router.get("/dashboard", ensureAuth,getDashboardStats)

export default router;
