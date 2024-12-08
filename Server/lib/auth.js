import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  //   const authHeader = req.headers.authorization;

  //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //     return res
  //       .status(401)
  //       .json({ message: "Token không hợp lệ hoặc bị thiếu" });
  //   }

  //   const token = authHeader.split(" ")[1]; // Tách token từ header

  //   try {
  //     // Xác thực token với JWT_SECRET từ môi trường
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Kiểm tra token với secret
  //     req.user = decoded; // Lưu thông tin user vào req.user
  //     next();
  //   } catch (error) {
  //     console.error("Token verification failed:", error.message);
  //     return res.status(403).json({ message: "Token hết hạn hoặc không hợp lệ" });
  //   }
  // };

  const token = req.header("Authorization")?.split(" ")[1]; // Lấy token từ header

  if (!token) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token hết hạn hoặc không hợp lệ" });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
