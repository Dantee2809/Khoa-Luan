import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import messageModel from "../Models/messageModel.js";
import nodemailer from "nodemailer";
export const registerUser = async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;

  try {
    // Kiểm tra xem username có tồn tại trong database không
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }
    // Nếu không trùng, tiếp tục hash mật khẩu và lưu người dùng
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      username,
      password: hashedPassword,
      email,
      firstname,
      lastname,
    });
    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const loginUser = async (req , res) => {
//     try {
//         // Kiểm tra xem có token trong request header không
//         const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header (nếu có)

//         if (token) {
//             // Nếu có token, kiểm tra tính hợp lệ của token
//             jwt.verify(token, "lostnfound", (err, decoded) => {
//                 if (err) {
//                     return res.status(400).json({message: "Token expired or invalid"});
//                 }
//                 // Nếu token hợp lệ, trả về thông báo người dùng đã đăng nhập
//                 return res.status(400).json({message: "You are already logged in"});
//             });
//         } else {
//             // Nếu không có token trong header, tiếp tục với quy trình đăng nhập
//             const {username , password} = req.body;

//             const existUser = await UserModel.findOne({username});
//             if(!existUser){
//                 return res.status(400).json({message:"User not found"});
//             }

//             await bcrypt.compare(password, existUser.password, (err, data) => {
//                 if(data) {
//                     const authClaims = [
//                         {name: existUser.username},
//                         {role: existUser.role}
//                     ];
//                     const token = jwt.sign({authClaims},"lostnfound",{expiresIn:"30d"});

//                     res.status(200).json({
//                         message: `Welcome back, ${existUser.username}! You are logged in as a ${existUser.role}.`,
//                         id: existUser._id,
//                         role: existUser.role,
//                         token: token
//                     });
//                 }
//                 else {
//                     res.status(400).json({message: "Wrong password"});
//                 }
//             });
//         }
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// }

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Lỗi không xác định" });
    }
    // Kiểm tra trạng thái bị block
    if (user.isBlocked) {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    generateToken(user._id, res);

    res.status(200).json(user); // Trả về toàn bộ dữ liệu người dùng
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ message: "user not registered" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    // Add your logic for password reset here (e.g., sending a reset link)
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "trungnguyenhs3105@gmail.com",
        pass: "ugtu fnsp xbqa vdff",
      },
    });

    var mailOptions = {
      from: "trungnguyenhs3105@gmail.com",
      to: email,
      subject: "Gửi token để đặt lại mã",
      text: `http://localhost:3000/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password, 10);
    await UserModel.findByIdAndUpdate({ _id: id }, { password: hashPassword });
    return res.json({ status: true, message: "Updated password success" });
  } catch (err) {
    return res.json("Token ko hợp lệ");
  }
};
export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id; // ID của user đăng nhập được lấy từ middleware authMiddleware

    // Xóa tài khoản khỏi database
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Xóa tất cả các đoạn chat liên quan đến user
    await messageModel.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    // Xóa cookie (logout)
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "Tài khoản đã được xóa !!!" });
  } catch (error) {
    console.log("Error in deleteAccount controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const authUser = async (req, res) => {
  try {
    const userId = req.headers["id"] || req.headers["x-id"]; // Kiểm tra header
    console.log("Received user ID:", userId);
    // Lấy token từ header 'Authorization'
    const token = req.headers.authorization?.split(" ")[1]; // Lấy token sau "Bearer"

    if (!token) {
      return res.status(400).json({ message: "Token không tồn tại" });
    }

    // Giải mã token để lấy thông tin người dùng
    const decoded = jwt.verify(token, "lostnfound"); // Đảm bảo key "lostnfound" đúng với key đã sử dụng để mã hóa token
    const username = decoded.authClaims[0].name; // Giả sử tên người dùng lưu trong authClaims

    // Tìm người dùng theo tên người dùng (username), không phải theo _id
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res.status(200).json(user); // Trả về thông tin người dùng
  } catch (error) {
    console.error("Lỗi khi xác thực người dùng:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
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