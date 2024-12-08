import express from "express";
import {
  approvePost,
  blockUser,
  dashboard,
  getAllPostsByMonth,
  getAllUsers,
  getApprovedPosts,
  getPendingPosts,
  loginAdmin,
  logoutAdmin,
} from "../Controllers/AdminController.js";
import { protectRoute } from "../middleware/auth_middleware.js";
import { checkAuth, checkUserStatus } from "../lib/checkAuth.js";
import { getLostItemsCount } from "../Controllers/PostController.js";
const router = express.Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/approve/:id", approvePost);
router.get("/pendingPost", getPendingPosts);
router.get("/approvePost", getApprovedPosts);
router.get("/check", protectRoute, checkAuth);
router.get("/getUsers", getAllUsers);
router.get("/checkAuth/user/:id", checkUserStatus);
router.put("/block/:userId", protectRoute, blockUser);
router.get("/reports", dashboard);
router.get("/all-posts-by-month", getAllPostsByMonth);
router.get("/lost-items-count", getLostItemsCount);
export default router;
