import jwt from 'jsonwebtoken'

export const isAdmin = (req, res, next) => {
    const user = req.user; // Giả sử `req.user` chứa thông tin người dùng từ JWT
    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
  
  