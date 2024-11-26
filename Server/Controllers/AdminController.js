import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import PostModel from '../Models/postModel.js';

export const registerAdmin = async (req, res) => {
  const { username, email, password, profilePic } = req.body;

  try {
    // Kiểm tra xem email hoặc username đã tồn tại hay chưa
    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ message: "Email or username already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo admin user mới
    const newAdmin = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      profilePic,
      role: "admin", // Đặt role là admin
    });

    // Gửi phản hồi
    res.status(201).json({
      _id: newAdmin._id,
      username: newAdmin.username,
      email: newAdmin.email,
      profilePic: newAdmin.profilePic,
      role: newAdmin.role,
    });
  } catch (error) {
    console.log("Error in admin registration:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,

    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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


    