import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Gắn kết tới ObjectId của người dùng
      ref: "User", // Tham chiếu tới model User
      required: true, // Bắt buộc
    },
    desc: {
      type: String,
      default: "", // Không bắt buộc, có giá trị mặc định
    },
    image: {
      type: String,
      default: "",
    },
    isLost: {
      type: Boolean,
      default: false,
    },
    isFound: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      default: "",
    },
    reports: {
      type: [
        {
          reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          reportedAt: { type: Date, default: Date.now },
        },
      ],
      default: [], // Thêm giá trị mặc định là mảng rỗng
    },
    contact: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v); // Số điện thoại từ 10-15 số
        },
        message: (props) => `${props.value} không phải số điện thoại hợp lệ!`,
      },
    },
    isApproved: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
  }
);

// Tạo mô hình PostModel
const PostModel = mongoose.model("Posts", postSchema);

export default PostModel;
