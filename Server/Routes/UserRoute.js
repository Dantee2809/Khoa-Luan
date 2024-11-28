import express from "express";
import {
  deleteUser,
  followUser,
  getAllUsers,
  getUser,
  unfollowUser,
  updateUser,
} from "../Controllers/UserController.js";
import { protectRoute } from "../middleware/auth_middleware.js";

const router = express.Router();

router.get("/getUser/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);
router.get("/getUsers", getAllUsers);

export default router;
