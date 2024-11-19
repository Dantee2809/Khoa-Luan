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
    category: {
      type: String,
      enum: [
        "electronics", // Đồ công nghệ
        "personal_documents", // Giấy tờ tùy thân
        "wallet", // Ví
        "money", // Tiền
      ], // Chỉ định danh mục hợp lệ
    },
    image: {
      type: String,
      default: null, // Đường dẫn hình ảnh, không bắt buộc
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
    location: {
      province: { type: String }, // Tên tỉnh
      district: { type: String }, // Tên quận/huyện
      ward: { type: String }, // Tên phường/xã
      latitude: { type: Number }, // Tọa độ latitude
      longitude: { type: Number }, // Tọa độ longitude
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
