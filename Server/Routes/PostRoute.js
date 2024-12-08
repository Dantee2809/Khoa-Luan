import express from "express";
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  getPostbyid,
  getOldestPosts,
  getRecentlyPosts,
  getAllPosts,
  approvePosts,
  search,
  provinces,
  reportPost,
  delete1UserPost,
} from "../Controllers/PostController.js";
import { protectRoute } from "../middleware/auth_middleware.js";

const router = express.Router();

router.post("/posts", createPost); // Để tạo bài viết
router.get("/posts/:id", getPost); // Để lấy một bài viết theo id
// router.get("/getFetch", fetchPosts); // Để lấy một bài viết theo id

router.put("/posts/:id", updatePost); // Để cập nhật bài viết
router.delete("/posts/:id", protectRoute, deletePost); // Để xóa bài viết
router.delete("/user/:id", protectRoute, delete1UserPost); // Để xóa bài viết

router.get("/postsId/allItems", getAllPosts); // Để lấy tất cả bài viết
// router.get("/search", searchPosts);
router.get("/provinces", (req, res) => {
  res.json(provinces); // Trả về dữ liệu tỉnh thành
});
router.post("/report/:postId", reportPost);
router.get("/search", search);
router.get("/posts/detail/:id", getPostbyid); // Để lấy bài viết theo id
router.get("/postsId/getRecently", getRecentlyPosts); // Để lấy bài viết theo id
router.get("/postsId/getOldest", getOldestPosts); // Để lấy bài viết theo id
router.put("/approve/:id", approvePosts);

export default router;
