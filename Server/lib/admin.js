export const checkAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "You do not have permission to perform this action" });
  }

  next();
};
