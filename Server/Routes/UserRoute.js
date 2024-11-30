import express from "express";
import {
  deleteUser,
  followUser,
  getUserProfile,
  unfollowUser,
  updateUser,
} from "../Controllers/UserController.js";

const router = express.Router();

// router.get("/profile/:id", getUser);
router.get("/profile/:id", getUserProfile);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/follow/:id1/:id2", followUser);
router.put("/unfollow/:id1/:id2", unfollowUser);
// router.post("/follow", followUser);
// router.post("/unfollow", unfollowUser);

export default router;
