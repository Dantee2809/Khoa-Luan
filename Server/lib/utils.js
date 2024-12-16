import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Gửi cookie trong response
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // Bắt buộc khi dùng HTTPS (ngrok dùng HTTPS)
    sameSite: "None", // Cross-site cần SameSite=None
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  });

  return token;
};
