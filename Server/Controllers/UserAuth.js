import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  //   const authHeader = req.headers["authorization"];
  //   const token = authHeader && authHeader.split(" ")[1];

  //   if (token == null) {
  //     return res.status(401).json({ message: "Token is required" });
  //   }

  //   jwt.verify(token, "lostnfound", (err, user) => {
  //     if (err) {
  //       return res
  //         .status(403)
  //         .json({
  //           message: "Invalid token.Please enter a valid token or try again.",
  //         });
  //     }
  //     req.user = user;
  //     next();
  //   });
  // };

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc bị thiếu" });
  }

  const token = authHeader.split(" ")[1]; // Tách token từ header

  try {
    // Xác thực token với JWT_SECRET từ môi trường
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Kiểm tra token với secret
    req.user = decoded; // Lưu thông tin user vào req.user
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Token hết hạn hoặc không hợp lệ" });
  }
};

export default authenticateToken;
