import PostModel from "../Models/postModel.js";
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

// Get a User by ID
export const getUserProfile = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params
  try {
    const user = await UserModel.findById(userId);

    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails); // Trả về thông tin người dùng (không bao gồm mật khẩu)
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile" });
  }
};

// export const updateUser = async (req, res) => {
//   const id = req.params.id;
//   const { currentUserId, currentUserAdminStatus, password } = req.body;
//   if (id === currentUserId || currentUserAdminStatus) {
//     try {
//       if (password) {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(password, salt);
//       }
//       const user = await UserModel.findByIdAndUpdate(id, req.body, {
//         new: true,
//       });
//       res.status(200).json(user);
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   } else {
//     res.status(403).json("Forbidden: Access denied");
//   }
// };

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

export const followUser = async (req, res) => {
  const userId = req.params.id; // Lấy userId từ URL
  const { _id } = req.body; // Lấy ID người theo dõi từ body

  if (!userId || !_id) {
    return res.status(400).json({ message: "Missing user IDs" });
  }

  try {
    const followUser = await UserModel.findOne({ _id: userId }); // Tìm user bằng userId
    const followingUser = await UserModel.findOne({ _id }); // Tìm user bằng _id (ID người theo dõi)

    if (!followUser) {
      return res
        .status(404)
        .json({ message: "Người dùng không tìm thấy hoặc đã xóa tài khoản" });
    }

    if (!followingUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    if (!followUser.followers.includes(_id)) {
      // Cập nhật danh sách followers và following
      await followUser.updateOne({ $push: { followers: _id } });
      await followingUser.updateOne({ $push: { following: userId } });
      res.status(200).json("Theo dõi thành công!");
    } else {
      res.status(403).json("Bạn đã theo dõi người này");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller bỏ theo dõi user
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if (_id === id) {
    return res.status(403).json({ message: "Bạn ko thể unfollow chính mình" });
  }

  try {
    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(_id);

    if (followUser.followers.includes(_id)) {
      await followUser.updateOne({ $pull: { followers: _id } });
      await followingUser.updateOne({ $pull: { following: id } });

      return res.status(200).json({ message: "Bỏ theo dõi thành công!" });
    } else {
      return res.status(403).json({ message: "Bạn chưa theo dõi người này!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to unfollow the user!" });
  }
};
// Kiểm tra trạng thái follow giữa hai người dùng
export const fetchFollowingStatus = async (req, res) => {
  const { currentUserId } = req.query; // Lấy currentUserId từ query
  const { targetUserId } = req.params; // Lấy targetUserId từ params

  try {
    // Kiểm tra nếu cả hai userId được truyền
    if (!currentUserId || !targetUserId) {
      return res.status(400).send({ message: "Missing parameters" });
    }

    // Tìm user được theo dõi
    const targetUser = await UserModel.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found." });
    }

    // Kiểm tra currentUserId có trong danh sách followers không
    const isFollowing = targetUser.followers.includes(currentUserId);

    return res.status(200).json({ isFollowing }); // Trả về trạng thái follow
  } catch (error) {
    console.error("Error fetching follow status:", error);
    return res
      .status(500)
      .json({ message: "Lỗi user đã xóa tài khoản hoặc không kết nối được." });
  }
};
export const searchUser = async (req, res) => {
  try {
    const query = req.query.q || "";
    const users = await UserModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { firstname: { $regex: query, $options: "i" } },
        { lastname: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tìm kiếm người dùng" });
  }
};
export const searchPost = async (req, res) => {
  try {
    const query = req.query.q || "";
    const posts = await PostModel.find({
      desc: { $regex: query, $options: "i" },
    }).populate("userId", "username profilePic");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tìm kiếm bài đăng" });
  }
};
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;

  // Kiểm tra xem mật khẩu cũ và mới đã được nhập đầy đủ chưa
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }

  // Kiểm tra độ dài của mật khẩu mới
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
  }

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
    }

    // Băm mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    await user.save();

    // Trả về thông báo thành công
    res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi thay đổi mật khẩu" });
  }
};
// Follow a User
// export const followUser = async (req, res) => {
//   const { currentUserId, followId } = req.body;

//   // Kiểm tra nếu người dùng hiện tại và người cần follow là giống nhau
//   if (currentUserId === followId) {
//     return res.status(403).json("Cannot follow yourself");
//   }

//   try {
//     const userToFollow = await UserModel.findById(followId);
//     const followingUser = await UserModel.findById(currentUserId);

//     // Kiểm tra nếu người dùng đã follow người này chưa
//     if (!userToFollow.followers.includes(currentUserId)) {
//       await userToFollow.updateOne({ $push: { followers: currentUserId } });
//       await followingUser.updateOne({ $push: { following: followId } });
//       return res.status(200).json("User followed successfully");
//     } else {
//       return res.status(400).json("You are already following this user");
//     }
//   } catch (error) {
//     res.status(500).json("Error following user: " + error.message);
//   }
// };

// Follow a User
// Controller logic
// const followUser = async (req, res) => {
//   try {
//     const { currentUserId, targetUserId } = req.params;

//     // Kiểm tra giá trị đầu vào
//     if (!currentUserId || !targetUserId) {
//       return res.status(400).json({ message: "Invalid user IDs" });
//     }

//     // Tìm user cần follow
//     const userToFollow = await UserModel.findById(targetUserId);
//     const currentUser = await UserModel.findById(currentUserId);

//     if (!userToFollow || !currentUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Kiểm tra nếu đã follow trước đó
//     if (userToFollow.followers.includes(currentUserId)) {
//       return res.status(400).json({ message: "Already following this user" });
//     }

//     // Thêm currentUserId vào danh sách followers
//     userToFollow.followers.push(currentUserId);
//     await userToFollow.save();

//     // Thêm targetUserId vào danh sách following của currentUser
//     currentUser.following.push(targetUserId);
//     await currentUser.save();

//     res.status(200).json({ message: "Followed successfully" });
//   } catch (error) {
//     console.error("Error in followUser:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const unfollowUser = async (req, res) => {
//   try {
//     const { id: targetUserId } = req.params; // ID của người cần unfollow
//     const { userId } = req.body; // ID của người đang thực hiện unfollow

//     if (!userId || !targetUserId) {
//       return res
//         .status(400)
//         .json({ message: "Missing userId or targetUserId" });
//     }

//     if (userId === targetUserId) {
//       return res.status(400).json({ message: "You cannot unfollow yourself" });
//     }

//     // Tìm người dùng hiện tại và người cần unfollow
//     const user = await UserModel.findById(userId);
//     const targetUser = await UserModel.findById(targetUserId);

//     if (!user || !targetUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Xóa targetUserId khỏi danh sách `following` của user
//     user.following = user.following.filter(
//       (id) => id.toString() !== targetUserId
//     );

//     // Xóa userId khỏi danh sách `followers` của targetUser
//     targetUser.followers = targetUser.followers.filter(
//       (id) => id.toString() !== userId
//     );

//     // Lưu thay đổi vào database
//     await user.save();
//     await targetUser.save();

//     res.status(200).json({
//       message: "Unfollowed successfully",
//       user,
//       targetUser,
//     });
//   } catch (error) {
//     console.error("Error in unfollowUser:", error);
//     res.status(500).json({ message: "Something went wrong", error });
//   }
// };

// Unfollow a User
// export const unfollowUser = async (req, res) => {
//   const { userId, followId } = req.body;

//   if (userId === followId) {
//     return res.status(403).json({ message: "You cannot unfollow yourself" });
//   }

//   try {
//     const userToUnfollow = await UserModel.findById(followId);
//     const currentUser = await UserModel.findById(userId);

//     if (!userToUnfollow || !currentUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Kiểm tra nếu người dùng đang theo dõi chưa
//     if (userToUnfollow.followers.includes(userId)) {
//       await userToUnfollow.updateOne({ $pull: { followers: userId } }); // Xoá người dùng khỏi followers
//       await currentUser.updateOne({ $pull: { following: followId } }); // Xoá người dùng khỏi following

//       res.status(200).json({ message: "Unfollowed successfully" });
//     } else {
//       return res
//         .status(400)
//         .json({ message: "You are not following this user" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error unfollowing user" });
//   }
// };

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
// export const followUser = async (req, res) => {
//   const id = req.params.id;
//   const { _id } = req.body;
//   console.log(id, _id);
//   if (_id == id) {
//     res.status(403).json("Action Forbidden");
//   } else {
//     try {
//       const followUser = await UserModel.findById(id);
//       const followingUser = await UserModel.findById(_id);

//       if (!followUser.followers.includes(_id)) {
//         await followUser.updateOne({ $push: { followers: _id } });
//         await followingUser.updateOne({ $push: { following: id } });
//         res.status(200).json("User followed!");
//       } else {
//         res.status(403).json("you are already following this id");
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(500).json(error);
//     }
//   }
// };

// Unfollow a User
// changed
// export const unfollowUser = async (req, res) => {
//   const id = req.params.id;
//   const { _id } = req.body;

//   if (_id === id) {
//     res.status(403).json("Action Forbidden");
//   } else {
//     try {
//       const unFollowUser = await UserModel.findById(id);
//       const unFollowingUser = await UserModel.findById(_id);

//       if (unFollowUser.followers.includes(_id)) {
//         await unFollowUser.updateOne({ $pull: { followers: _id } });
//         await unFollowingUser.updateOne({ $pull: { following: id } });
//         res.status(200).json("Unfollowed Successfully!");
//       } else {
//         res.status(403).json("You are not following this User");
//       }
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   }
// };

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
