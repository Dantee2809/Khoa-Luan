import express from "express";
import {
  changePassword,
  deleteUser,
  fetchFollowingStatus,
  followUser,
  getUserProfile,
  searchPost,
  searchUser,
  unfollowUser,
} from "../Controllers/UserController.js";
import { protectRoute } from "../middleware/auth_middleware.js";
const router = express.Router();

// router.get("/profile/:id", getUser);
router.get("/profile/:id", getUserProfile);
router.get("/search/users", searchUser);
router.get("/search/posts", searchPost);
// router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);
router.get("/:targetUserId/is-following", fetchFollowingStatus);
router.post("/change-password", protectRoute, changePassword);
// router.post("/follow", followUser);
// router.post("/unfollow", unfollowUser);

export default router;
