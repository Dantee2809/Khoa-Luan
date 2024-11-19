import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt"

export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id)
        if (user) {
            const { password , ...otherDetail} = user._doc
            res.status(200).json(otherDetail);
            res.status(200).json(user); // Trả về toàn bộ dữ liệu user, bao gồm cả mật khẩu
        }
        else {
            res.status(404).json("User not found");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}


export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId , currentUserAdminStatus, password } = req.body;   
    if ( id === currentUserId || currentUserAdminStatus){
        try {
            if(password){
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(password, salt)
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new : true });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("Forbidden: Access denied");
    }
}

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
    const id = req.params.id
    const { currentUserId } = req.body  
    if ( currentUserId === id ){
        res.status(403).json("Forbidden: Access denied");
    }
    else{
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)
            if (!followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({$push: {followers:currentUserId}})
                await followingUser.updateOne({$push: {following: id}})
                res.status(200).json("User followed");
            }
            else{
                res.status(403).json("User is already following");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

export const getUsers = async (req, res, next) => {
    // if (!req.user.isAdmin) {
    //   return next(errorHandler(403, 'You are not allowed to see all users'));
    // }
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;
  
      const users = await UserModel.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const usersWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });
  
      const totalUsers = await UserModel.countDocuments();
  
      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthUsers = await UserModel.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
      });
    } catch (error) {
      next(error);
    }
  };