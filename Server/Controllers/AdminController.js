import bcrypt from "bcrypt";
import UserModel from "../Models/userModel.js";
import { generateToken } from "../lib/utils.js";
import PostModel from "../Models/postModel.js";
import messageModel from "../Models/messageModel.js";

export const registerAdmin = async (req, res) => {
  const { username, password, email, firstname, lastname } = req.body;

  try {
    // Kiểm tra email đã tồn tại hay chưa
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash mật khẩu và lưu tài khoản admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new UserModel({
      username,
      password: hashedPassword,
      email,
      firstname,
      lastname,
      role: "admin", // Chỉ định tài khoản này là admin
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin account created successfully",
      admin: {
        _id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        firstname: newAdmin.firstname,
        lastname: newAdmin.lastname,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm admin theo email
    const admin = await UserModel.findOne({ email, role: "admin" }); // Kiểm tra role admin

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Kiểm tra mật khẩu
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Tạo token
    generateToken(admin._id, res);

    res.status(200).json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.log("Error in loginAdmin controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Tìm tất cả người dùng không phải admin
    let users = await UserModel.find({ role: "user" });
    // Loại bỏ trường `password` khỏi kết quả trả về
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users); // Trả về danh sách người dùng
  } catch (error) {
    res.status(500).json(error); // Trả về lỗi nếu có
  }
};

// API duyệt bài viết
export const approvePost = async (req, res) => {
  const { postId } = req.body; // ID bài viết cần duyệt

  try {
    // Kiểm tra xem người dùng có phải là admin không
    const { userRole } = req.user; // Lấy role của người dùng từ token (admin hoặc user)

    if (userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to approve posts." });
    }

    // Tìm bài viết theo ID và cập nhật trường `isApproved` thành true
    const post = await PostModel.findByIdAndUpdate(
      postId,
      { isApproved: true }, // Đặt isApproved = true khi duyệt
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post approved successfully",
      post,
    });
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
// export const  = async (req, res) => {
//   try {
//     const approvedPosts = await PostModel.find({ isApproved: true }); // Chỉ lấy bài đã được duyệt
//     res.status(200).json(approvedPosts);
//   } catch (error) {
//     console.error("Error fetching approved posts:", error);
//     res.status(500).json({ message: "Error fetching approved posts" });
//   }
// };

export const getPendingPosts = async (req, res) => {
  try {
    const pendingPosts = await PostModel.find({ isApproved: false }); // Lọc bài chưa được duyệt
    res.status(200).json(pendingPosts);
  } catch (error) {
    console.error("Error fetching pending posts:", error);
    res.status(500).json({ message: "Error fetching pending posts" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllPostsByMonth = async (req, res) => {
  try {
    // Sử dụng Aggregate để nhóm các bài đăng theo tháng và đếm số bài viết
    const allPosts = await PostModel.aggregate([
      {
        $project: {
          year: { $year: "$createdAt" }, // Trích xuất năm
          month: { $month: "$createdAt" }, // Trích xuất tháng
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" }, // Nhóm theo năm và tháng
          totalPosts: { $sum: 1 }, // Đếm số bài viết
        },
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }, // Sắp xếp theo tháng và năm
      },
    ]);

    res.status(200).json(allPosts); // Trả về kết quả
  } catch (error) {
    console.error("Error fetching all posts data:", error);
    res.status(500).json({ message: "Failed to fetch posts data" });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ req.params

    // Tìm kiếm người dùng trong cơ sở dữ liệu, ẩn mật khẩu
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    res.status(200).json(user); // Trả về thông tin người dùng
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ." });
  }
};
export const dashboard = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments({ role: "user" });
    const totalIncidents = await PostModel.countDocuments();
    const totalLostItems = await PostModel.countDocuments({ isLost: true });
    const totalFoundItems = await PostModel.countDocuments({ isFound: true });

    res.json({
      totalUsers,
      totalIncidents,
      totalLostItems, // Tổng đồ bị mất
      totalFoundItems, // Tổng đồ đã tìm thấy
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Failed to fetch report data" });
  }
};

export const allchatUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await messageModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra quyền truy cập (Chỉ admin mới có thể block/unblock)
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to block users" });
    }

    // Đảo trạng thái block
    user.isBlocked = !user.isBlocked;
    await user.save();

    // Trả về thông báo và dữ liệu mới sau khi cập nhật
    res.status(200).json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    // Ghi lại lỗi và trả về thông báo lỗi
    console.error("Error updating user block status:", error);
    res.status(500).json({
      message: "Error updating user block status",
      error: error.message,
    });
  }
};
export const getAllMessages = async (req, res) => {
  try {
    const messages = await messageModel
      .find()
      .populate("senderId", "username") // Lấy thông tin người gửi
      .populate("receiverId", "username"); // Lấy thông tin người nhận
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Lỗi khi lấy tin nhắn" });
  }
};
export const banUsers = async (req, res) => {
  const { senderId, receiverId } = req.body; // Lấy ID người gửi và người nhận từ body của request

  try {
    // Cập nhật trạng thái người dùng bị ban
    const sender = await UserModel.findById(senderId);
    const receiver = await UserModel.findById(receiverId);

    if (!sender || !receiver) {
      return res
        .status(404)
        .json({ error: "Một trong hai người dùng không tồn tại" });
    }

    // Đánh dấu tài khoản bị ban
    sender.isBlocked = true; // Giả sử bạn có trường `isBanned` trong model
    receiver.isBlocked = true; // Cập nhật cho người nhận

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Cả hai người dùng đã bị ban thành công" });
  } catch (error) {
    console.error("Error banning users:", error);
    res.status(500).json({ error: "Lỗi khi ban người dùng" });
  }
};
// Controller để xóa tin nhắn
export const deleteMessage = async (req, res) => {
  const { id } = req.params; // Lấy ID của tin nhắn từ request params

  try {
    const message = await messageModel.findById(id); // Tìm tin nhắn theo ID

    if (!message) {
      return res.status(404).json({ message: "Không tìm thấy tin nhắn" });
    }

    await message.deleteOne(); // Xóa tin nhắn khỏi cơ sở dữ liệu
    res.status(200).json({ message: "Xóa tin nhắn thành công" });
  } catch (err) {
    console.error("Lỗi xóa tin nhắn:", err);
    res.status(500).json({ message: "Lỗi khi xóa tin nhắn" });
  }
};

export const blockUser = async (req, res) => {
  const { userId } = req.params;

  // Kiểm tra nếu userId tồn tại
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra quyền truy cập (Chỉ admin mới có thể block/unblock)
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to block users" });
    }

    // Đảo trạng thái block
    user.isBlocked = !user.isBlocked;
    await user.save();

    // Trả về thông báo và dữ liệu mới sau khi cập nhật
    res.status(200).json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    // Ghi lại lỗi và trả về thông báo lỗi
    console.error("Error updating user block status:", error);
    res.status(500).json({
      message: "Error updating user block status",
      error: error.message,
    });
  }
};
