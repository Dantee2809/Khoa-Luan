import express from "express";
import {
  approvePost,
  getApprovedPosts,
  getPendingPosts,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
} from "../Controllers/AdminController.js";
import { protectRoute } from "../middleware/auth_middleware.js";
import { checkAuth } from "../Controllers/AuthController.js";
const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/approve/:id", approvePost);
router.get("/pendingPost", getPendingPosts);
router.get("/approvePost", getApprovedPosts);
router.get("/check", protectRoute, checkAuth);

export default router;
