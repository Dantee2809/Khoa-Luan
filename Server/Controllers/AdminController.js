import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import PostModel from '../Models/postModel.js';

export const approvePost = async (req, res) => {
    try {
      const postId = req.params.id; // Lấy id bài viết từ URL
      const post = await PostModel.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      post.isApproved = true; // Đánh dấu bài viết là đã được duyệt
      await post.save();
  
      res.status(200).json({ message: "Post approved successfully" });
    } catch (error) {
      console.error("Error approving post:", error);
      res.status(500).json({ message: "Error approving post" });
    }
  };

  export const getApprovedPosts = async (req, res) => {
    try {
      const approvedPosts = await PostModel.find({ isApproved: true }); // Chỉ lấy bài đã được duyệt
      res.status(200).json(approvedPosts);
    } catch (error) {
      console.error("Error fetching approved posts:", error);
      res.status(500).json({ message: "Error fetching approved posts" });
    }
  };
  
export const getPendingPosts = async (req, res) => {
    try {
        const pendingPosts = await PostModel.find({ isApproved: false }); // Lọc bài chưa được duyệt
        res.status(200).json(pendingPosts);
      } catch (error) {
        console.error("Error fetching pending posts:", error);
        res.status(500).json({ message: "Error fetching pending posts" });
      }
    };


    