import PostModel from "../Models/postModel.js";
import cloudinary from "../lib/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    // Lấy các tham số từ req.body
    const { image, userId, desc, contact, isLost, isFound } = req.body;
    // Kiểm tra nếu không có ảnh
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    if (isLost && isFound) {
      return res
        .status(400)
        .json({ message: "A post cannot be both lost and found." });
    }
    // Upload ảnh lên Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      resource_type: "auto", // Tự động nhận dạng loại file
    });

    // Tạo bài viết mới với URL ảnh từ Cloudinary
    const newPost = new PostModel({
      userId, // ID người dùng
      desc, // Mô tả bài viết
      image: uploadResponse.secure_url, // Lưu URL ảnh từ Cloudinary
      contact, // Liên hệ
      isLost: isLost || false, // Mặc định là false nếu không được gửi
      isFound: isFound || false, // Mặc định là false nếu không được gửi
      isApproved: false, // Mặc định là chưa được phê duyệt
    });

    // Lưu bài viết vào cơ sở dữ liệu
    await newPost.save();

    // Gửi phản hồi
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
