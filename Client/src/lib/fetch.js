import { axiosInstance } from "./axios";

// Hàm lấy tất cả tin nhắn từ API
export const fetchAllMessages = async () => {
  try {
    const response = await axiosInstance.get("/admin/messages"); // Đảm bảo đường dẫn này là chính xác
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
