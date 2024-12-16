import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";
export const createPost = async (req, res) => {
  try {
    const { image, userId, desc, contact, location, isLost, isFound } =
      req.body;
    // Tìm thông tin người dùng dựa trên userId
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User không tìm thấy" });
    }
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
      username: user.username, // Lấy username từ UserModel và lưu vào bài đăng
      desc: req.body.desc,
      image: uploadResponse.secure_url, // Lưu URL ảnh từ Cloudinary
      category: req.body.category,
      location: req.body.location,
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
    const userId = req.params.id;
    const posts = await PostModel.find({ userId }); // Cần đảm bảo userId được lưu đúng
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
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
  //   const postId = req.params.id;
  //   const { userId } = req.body;
  //   try {
  //     const post = await PostModel.findById(postId);
  //     if (post.userId === userId) {
  //       await post.updateOne({ $set: req.body });
  //       res.status(200).json("Post update");
  //     } else {
  //       res.status(403).json("Unauthorized to update this post");
  //     }
  //   } catch (error) {
  //     res.status(500).json(error);
  //   }
  // };
  const { id } = req.params;
  const { desc, location, contact } = req.body; // Assuming these are the fields you're updating

  try {
    // Find the post by ID and update it
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { desc, location, contact },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating the post" });
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
  const { id } = req.params;
  try {
    // Find and delete the post by ID
    const post = await PostModel.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error });
  }
};

export const provinces = [
  { id: 1, name: "Hà Nội" },
  { id: 2, name: "Hồ Chí Minh" },
  { id: 3, name: "Đà Nẵng" },
  { id: 4, name: "Cần Thơ" },
  { id: 5, name: "Hải Phòng" },
  { id: 6, name: "Bình Dương" },
  { id: 7, name: "An Giang" },
  { id: 8, name: "Bắc Giang" },
  { id: 9, name: "Bắc Kạn" },
  { id: 10, name: "Bến Tre" },
  { id: 11, name: "Bình Định" },
  { id: 12, name: "Bình Phước" },
  { id: 13, name: "Bình Thuận" },
  { id: 14, name: "Cà Mau" },
  { id: 15, name: "Cao Bằng" },
  { id: 16, name: "Đắk Lắk" },
  { id: 17, name: "Đắk Nông" },
  { id: 18, name: "Điện Biên" },
  { id: 19, name: "Đồng Nai" },
  { id: 20, name: "Đồng Tháp" },
  { id: 21, name: "Gia Lai" },
  { id: 22, name: "Hà Giang" },
  { id: 23, name: "Hà Nam" },
  { id: 24, name: "Hà Tĩnh" },
  { id: 25, name: "Hải Dương" },
  { id: 26, name: "Hòa Bình" },
  { id: 27, name: "Hưng Yên" },
  { id: 28, name: "Khánh Hòa" },
  { id: 29, name: "Kiên Giang" },
  { id: 30, name: "Kon Tum" },
  { id: 31, name: "Lai Châu" },
  { id: 32, name: "Lâm Đồng" },
  { id: 33, name: "Lạng Sơn" },
  { id: 34, name: "Lào Cai" },
  { id: 35, name: "Long An" },
  { id: 36, name: "Nam Định" },
  { id: 37, name: "Nghệ An" },
  { id: 38, name: "Ninh Bình" },
  { id: 39, name: "Ninh Thuận" },
  { id: 40, name: "Phú Thọ" },
  { id: 41, name: "Phú Yên" },
  { id: 42, name: "Quảng Bình" },
  { id: 43, name: "Quảng Nam" },
  { id: 44, name: "Quảng Ngãi" },
  { id: 45, name: "Quảng Ninh" },
  { id: 46, name: "Sóc Trăng" },
  { id: 47, name: "Sơn La" },
  { id: 48, name: "Tây Ninh" },
  { id: 49, name: "Thái Bình" },
  { id: 50, name: "Thái Nguyên" },
  { id: 51, name: "Thanh Hóa" },
  { id: 52, name: "Thừa Thiên-Huế" },
  { id: 53, name: "Tiền Giang" },
  { id: 54, name: "Trà Vinh" },
  { id: 55, name: "Tuyên Quang" },
  { id: 56, name: "Vĩnh Long" },
  { id: 57, name: "Vĩnh Phúc" },
  { id: 58, name: "Yên Bái" },
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
  const { q, location, lostDate } = req.query; // Không cần lấy `status` từ req.query

  try {
    // Tạo điều kiện tìm kiếm động
    let query = {};

    // Tìm kiếm theo từ khóa trong mô tả
    if (q) {
      query.desc = { $regex: q, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
    }

    // Tìm kiếm theo vị trí
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Tìm kiếm theo ngày mất
    if (lostDate) {
      const date = new Date(lostDate);
      query.createdAt = { $gte: date };
    }

    // Mặc định tìm cả bài đăng bị mất và bài đăng tìm thấy
    query.$or = [{ isLost: true }, { isFound: true }];

    const posts = await PostModel.find(query);
    return res.json(posts); // Trả về kết quả tìm kiếm
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error fetching posts");
  }
};

// export const getAllPosts = async (req, res) => {
//   try {
//     // Truy vấn các bài đăng và sử dụng populate để lấy dữ liệu userId
//     const posts = await PostModel.find()
//       .sort({ createdAt: -1 })
//       .populate({
//         path: "userId", // Tên của trường cần populate
//         select: "username _id", // Lấy username và _id từ UserModel
//         match: { _id: { $type: "objectId" } }, // Đảm bảo rằng _id là ObjectId hợp lệ
//       });
//     if (posts.length === 0) {
//       return res.status(404).json({ message: "No posts found" });
//     }

//     // Tạo một mảng mới với số lượng báo cáo được thêm vào mỗi bài đăng
//     const postsWithReportCount = posts.map((post) => ({
//       ...post.toObject(),
//       reportsCount: post.reports.length, // Đếm số lượng báo cáo
//     }));

//     return res.json({
//       status: "Success",
//       data: postsWithReportCount, // Trả về danh sách bài đăng với thông tin báo cáo
//     });
//   } catch (error) {
//     console.log("Error:", error);
//     res.status(500).json({ message: "Error retrieving posts" });
//   }
// };
export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("userId", "username _id") // Trả cả username và _id từ UserModel
      .sort({ createdAt: -1 });

    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }

    // Tạo một mảng mới với số lượng báo cáo được thêm vào mỗi bài đăng
    const postsWithReportCount = posts.map((post) => ({
      ...post.toObject(),
      reportsCount: Array.isArray(post.reports) ? post.reports.length : 0, // Kiểm tra nếu reports là mảng
    }));

    return res.json({
      status: "Success",
      data: postsWithReportCount, // Trả về danh sách bài đăng với thông tin báo cáo
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving posts" });
  }
};

export const getPostApprove = async (req, res) => {
  // try {
  //   // Lọc bài viết có isApproved: false và sắp xếp theo createdAt mới nhất
  //   const posts = await PostModel.find({ isApproved: false }).sort({
  //     createdAt: -1,
  //   });

  //   console.log("Filtered Posts found:", posts); // Log để kiểm tra dữ liệu

  //   if (posts.length === 0) {
  //     return res.status(404).json({ message: "No posts found" });
  //   }

  //   return res.json({
  //     status: "Success",
  //     data: posts,
  //   });
  // } catch (error) {
  //   console.log("Error:", error);
  //   res.status(500).json({ message: "Error retrieving posts" });
  // }
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
