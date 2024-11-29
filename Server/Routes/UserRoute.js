import express from "express";
import {
  deleteUser,
  followUser,
  getAllUsers,
  getUserProfile,
  unfollowUser,
  updateUser,
} from "../Controllers/UserController.js";

const router = express.Router();

// router.get("/profile/:id", getUser);
router.get("/profile/:id", getUserProfile);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/follow", followUser);
router.post("/:id/unfollow", unfollowUser);
// router.post("/follow", followUser);
// router.post("/unfollow", unfollowUser);

router.get("/getUsers", getAllUsers);

export default router;
