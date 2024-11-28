import AdminModel from "../Models/adminModel.js";
import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetail } = user._doc;
      res.status(200).json(otherDetail);
      res.status(200).json(user); // Trả về toàn bộ dữ liệu user, bao gồm cả mật khẩu
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
// Get all users
export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Forbidden: Access denied");
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;

  if (currentUserId === id || currentUserAdminStatus) {
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json("User not found");
      }

      // Thực hiện xóa
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Forbidden: Access denied");
  }
};

// Follow user logic
// export const followUser = async (req, res) => {
//   const { currentUserId } = req.body;
//   const targetUserId = req.params.id;

//   try {
//     if (currentUserId === targetUserId) {
//       return res.status(403).json("Không thể theo dõi chính mình.");
//     }

//     const targetUser = await UserModel.findById(targetUserId);
//     const currentUser = await UserModel.findById(currentUserId);

//     if (!targetUser || !currentUser) {
//       return res.status(404).json("Không tìm thấy người dùng.");
//     }

//     if (targetUser.followers.includes(currentUserId)) {
//       return res.status(400).json("Đã theo dõi người dùng này.");
//     }

//     // Thêm người dùng vào danh sách followers của targetUser
//     await targetUser.updateOne({ $push: { followers: currentUserId } });
//     // Thêm targetUser vào danh sách following của currentUser
//     await currentUser.updateOne({ $push: { following: targetUserId } });

//     return res.status(200).json("Theo dõi thành công!");
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json("Lỗi server.");
//   }
// };

// changed
export const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  console.log(id, _id);
  if (_id == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("you are already following this id");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

// Unfollow a User
// changed
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if (_id === id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const unFollowUser = await UserModel.findById(id);
      const unFollowingUser = await UserModel.findById(_id);

      if (unFollowUser.followers.includes(_id)) {
        await unFollowUser.updateOne({ $pull: { followers: _id } });
        await unFollowingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("Unfollowed Successfully!");
      } else {
        res.status(403).json("You are not following this User");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// export const getUsers = async (req, res, next) => {
//   // if (!req.user.isAdmin) {
//   //   return next(errorHandler(403, 'You are not allowed to see all users'));
//   // }
//   try {
//     const startIndex = parseInt(req.query.startIndex) || 0;
//     const limit = parseInt(req.query.limit) || 9;
//     const sortDirection = req.query.sort === "asc" ? 1 : -1;

//     const users = await UserModel.find()
//       .sort({ createdAt: sortDirection })
//       .skip(startIndex)
//       .limit(limit);

//     const usersWithoutPassword = users.map((user) => {
//       const { password, ...rest } = user._doc;
//       return rest;
//     });

//     const totalUsers = await UserModel.countDocuments();

//     const now = new Date();

//     const oneMonthAgo = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate()
//     );
//     const lastMonthUsers = await UserModel.countDocuments({
//       createdAt: { $gte: oneMonthAgo },
//     });

//     res.status(200).json({
//       users: usersWithoutPassword,
//       totalUsers,
//       lastMonthUsers,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
