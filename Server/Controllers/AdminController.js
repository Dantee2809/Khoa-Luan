import bcrypt from "bcrypt";
import UserModel from "../Models/userModel.js";
import { generateToken } from "../lib/utils.js";
import PostModel from "../Models/postModel.js";

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
