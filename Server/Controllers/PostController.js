import PostModel from "../Models/postModel.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";
export const createPost = async (req, res) => {
  try {
    const { image, userId, desc, contact, location, isLost, isFound } =
      req.body;
    // Kiểm tra nếu không có ảnh
    if (!image) {
      return res.status(400).json({ message: "Image bị thiếu" });
    }
    // Upload ảnh lên Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      resource_type: "auto", // Tự động nhận dạng loại file
    });

    // Tạo bài viết mới với URL ảnh từ Cloudinary
    const newPost = new PostModel({
      userId: req.body.userId,
      desc: req.body.desc,
      image: uploadResponse.secure_url, // Lưu URL ảnh từ Cloudinary
      category: req.body.category,
      contact: req.body.contact,
      isApproved: false, // Mặc định chưa duyệt
      isLost: isLost || false, // Mặc định là false nếu không được gửi
      isFound: isFound || false, // Mặc định là false nếu không được gửi
    });
    // Lưu bài viết vào cơ sở dữ liệu
    await newPost.save();
    // Gửi phản hồi
    res.status(200).json(newPost);
  } catch (error) {
    console.error("Error:Lỗi đăng bài", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra khi tạo bài viết",
      error: error.message,
    });
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

export const getPostToProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy ID người dùng từ URL

    // Lấy tất cả bài viết của người dùng này
    const posts = await PostModel.find({ author: userId }).sort({
      createdAt: -1,
    });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error retrieving posts" });
  }
};
// Backend - Cập nhật trong hàm fetch posts
// export const fetchPosts = async (req, res) => {
//   try {
//     const posts = await PostModel.find(); // Lấy tất cả bài viết
//     const postsWithReportCount = posts.map((post) => ({
//       ...post.toObject(),
//       reportsCount: post.reports.length, // Đếm số lượng báo cáo
//     }));
//     res.status(200).json(postsWithReportCount);
//   } catch (error) {
//     res.status(500).json({ message: "Có lỗi xảy ra khi lấy bài viết." });
//   }
// };

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
export const reportPost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại." });
    }

    // Kiểm tra xem người dùng đã báo cáo bài viết này chưa
    const alreadyReported = post.reports.some(
      (report) => report.reportedBy.toString() === userId
    );
    if (alreadyReported) {
      return res.status(400).json({ message: "Bạn đã báo cáo bài viết này." });
    }

    // Thêm báo cáo vào mảng reports
    post.reports.push({ reportedBy: userId });
    await post.save();

    res.status(200).json({ message: "Bài viết đã được báo cáo thành công." });
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra khi báo cáo bài viết." });
    console.error(error); // Ghi log lỗi
  }
};

// Backend code
export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const { userId, role } = req.body; // Lấy role từ body, role là thông tin quyền

  try {
    const post = await PostModel.findById(postId);
    if (role === "admin" || post.userId === userId) {
      // Admin có quyền xóa tất cả bài viết
      await post.deleteOne();
      res.status(200).json("Post deleted");
    } else {
      res.status(403).json("Unauthorized to delete this post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const delete1UserPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.query.userId;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.deleteOne();
      console.log("Post userId:", post.userId, "Request userId:", userId);
      res.status(200).json("Post deleted");
    } else {
      res.status(403).json("Unauthorized to delete this post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const provinces = [
  { id: 1, name: "Hà Nội" },
  { id: 2, name: "Hồ Chí Minh" },
  { id: 3, name: "Đà Nẵng" },
  { id: 4, name: "Cần Thơ" },
  { id: 5, name: "Hải Phòng" },
  { id: 6, name: "Bình Dương" },
  // Thêm các tỉnh thành khác của Việt Nam
];
// export const getTimelinepost = async (req, res) => {
//   const userId = req.params.id;
//   try {
//     const currentUserPosts = await PostModel.find({ userId: userId });
//     const followingPosts = await UserModel.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(userId),
//         },
//       },
//       {
//         $lookup: {
//           from: "posts",
//           localField: "following",
//           foreignField: "userId",
//           as: "followingPosts",
//         },
//       },
//       {
//         $project: {
//           followingPosts: 1,
//           _id: 0,
//         },
//       },
//     ]);
//     res.status(200).json(currentUserPosts.concat(...followingPosts));
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// API tìm kiếm bài viết
// export const searchPosts = async (req, res) => {
//   try {
//     const { query } = req.query; // Lấy từ khóa tìm kiếm từ query params

//     // Tìm kiếm theo mô tả (desc), liên hệ (contact) hoặc trạng thái (isLost/isFound)
//     const posts = await PostModel.find({
//       $or: [
//         { desc: { $regex: query, $options: "i" } }, // Tìm kiếm không phân biệt chữ hoa/thường
//         { contact: { $regex: query, $options: "i" } },
//         { isLost: query.toLowerCase() === "lost" },
//         { isFound: query.toLowerCase() === "found" },
//       ],
//     });

//     res.status(200).json(posts);
//   } catch (error) {
//     console.error("Error searching posts:", error);
//     res.status(500).json({ message: "Error searching posts" });
//   }
// };
// Tính ngày đầu và cuối tháng trước
const getLastMonthDateRange = () => {
  const now = new Date();

  // Ngày đầu tháng trước
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Ngày cuối tháng trước
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  return { firstDayLastMonth, lastDayLastMonth };
};

const getLostItemsCountInLastMonth = async () => {
  const { firstDayLastMonth, lastDayLastMonth } = getLastMonthDateRange();

  try {
    // Truy vấn MongoDB để đếm số bài viết trong tháng trước
    const lostItemsCount = await PostModel.countDocuments({
      createdAt: {
        $gte: firstDayLastMonth, // Ngày đầu tháng trước
        $lte: lastDayLastMonth, // Ngày cuối tháng trước
      },
    });

    console.log(`Số bài viết báo mất đồ trong tháng qua: ${lostItemsCount}`);
    return lostItemsCount;
  } catch (error) {
    console.error("Error fetching lost items count:", error);
    return 0;
  }
};

export const getLostItemsCount = async (req, res) => {
  try {
    const lostItemsCount = await getLostItemsCountInLastMonth();
    res.json({ lostItemsCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching lost items count", error });
  }
};

export const search = async (req, res) => {
  const { q } = req.query; // Lấy query từ request
  try {
    const posts = await PostModel.find({
      desc: { $regex: q, $options: "i" }, // Tìm theo mô tả (không phân biệt chữ hoa/thường)
    });
    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    const postsWithReportCount = posts.map((post) => ({
      ...post.toObject(),
      reportsCount: post.reports.length, // Đếm số lượng báo cáo
    }));
    return res.json({
      status: "Success",
      data: postsWithReportCount,
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
