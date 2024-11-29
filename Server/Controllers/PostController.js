import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    // Tải ảnh lên Cloudinary
    let imageUrl = "";
    if (req.body.image) {
      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: "posts", // Tùy chọn thư mục lưu ảnh
      });
      imageUrl = result.secure_url; // URL ảnh sau khi tải lên
    }

    // Tạo bài viết mới
    const newPost = new PostModel({
      userId: req.body.userId,
      desc: req.body.desc,
      image: imageUrl, // Lưu URL ảnh từ Cloudinary
      category: req.body.category,
      contact: req.body.contact,
      isApproved: false, // Mặc định chưa duyệt
    });

    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post" });
  }
};

export const getPost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await PostModel.findById(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post update");
    } else {
      res.status(403).json("Unauthorized to update this post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted");
    } else {
      res.status(403).json("Unauthorized to delete this post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getTimelinepost = async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json(currentUserPosts.concat(...followingPosts));
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });

    console.log("Posts found:", posts); // Log để kiểm tra dữ liệu

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    return res.json({
      status: "Success",
      data: posts,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error retrieving posts" });
  }
};
export const getPostApprove = async (req, res) => {
  try {
    // Lọc bài viết có isApproved: false và sắp xếp theo createdAt mới nhất
    const posts = await PostModel.find({ isApproved: false }).sort({
      createdAt: -1,
    });

    console.log("Filtered Posts found:", posts); // Log để kiểm tra dữ liệu

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    return res.json({
      status: "Success",
      data: posts,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error retrieving posts" });
  }
};
export const searchPost = async (req, res) => {
  try {
    const { category, keyword, latitude, longitude, radius } = req.query;

    // Tạo bộ lọc tìm kiếm
    const filter = {};

    // Lọc theo danh mục nếu có
    if (category) {
      filter.category = category;
    }

    // Tìm kiếm từ khóa trong mô tả
    if (keyword) {
      filter.desc = { $regex: keyword, $options: "i" }; // `$options: "i"` để không phân biệt hoa thường
    }

    // Lọc theo vị trí (nếu có tọa độ và bán kính)
    if (latitude && longitude && radius) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const radInKm = parseFloat(radius) / 6371; // Bán kính trái đất là 6371 km

      filter.location = {
        $geoWithin: {
          $centerSphere: [[lng, lat], radInKm], // [kinh độ, vĩ độ]
        },
      };
    }

    // Tìm kiếm trong cơ sở dữ liệu
    const results = await PostModel.find(filter);

    // Trả kết quả
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: err.message });
  }
};

export const getPostbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({
      status: "Success",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};

export const getRecentlyPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).limit(5);

    return res.json({
      status: "Success",
      data: posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};
export const getOldestPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: 1 }).limit(5);

    return res.json({
      status: "Success",
      data: posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};

export const approvePosts = async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body;

  try {
    const post = await PostModel.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post approval status updated", post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Error updating post" });
  }
};
