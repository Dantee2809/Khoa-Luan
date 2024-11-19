import jwt from 'jsonwebtoken'
import PostModel from '../Models/postModel';

export const getApprovedPosts = async (req, res) => {
    try {
      const approvedPosts = await PostModel.find({ isApproved: true }); // Chỉ lấy bài đã được duyệt
      res.status(200).json(approvedPosts);
    } catch (error) {
      console.error("Error fetching approved posts:", error);
      res.status(500).json({ message: "Error fetching approved posts" });
    }
  };
  