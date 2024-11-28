import express from "express";
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  getTimelinepost,
  getPostbyid,
  getOldestPosts,
  getRecentlyPosts,
  searchPost,
  getAllPosts,
} from "../Controllers/PostController.js";

const router = express.Router();

router.post("/posts", createPost); // Để tạo bài viết
router.get("/posts/:id", getPost); // Để lấy một bài viết theo id
router.put("/posts/:id", updatePost); // Để cập nhật bài viết
router.delete("/posts/:id", deletePost); // Để xóa bài viết
router.get("/posts/timeline/:id", getTimelinepost); // Để lấy timeline bài viết
router.get("/postsId/allItems", getAllPosts); // Để lấy tất cả bài viết
router.get("/posts/detail/:id", getPostbyid); // Để lấy bài viết theo id
router.get("/postsId/getRecently", getRecentlyPosts); // Để lấy bài viết theo id
router.get("/postsId/getOldest", getOldestPosts); // Để lấy bài viết theo id
router.get("/postsId/searchById", searchPost); // Để lấy bài viết theo id

export default router;
