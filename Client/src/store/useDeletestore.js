import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useDeletestore = create((set) => ({
  // Trạng thái ban đầu
  posts: [],
  approvedPosts: [],
  pendingPosts: [],
  isLoading: false,
  error: null,
  isDeleting: {}, // Trạng thái xóa bài (theo postId)

  // Hàm xóa bài viết
  deletePost: async (postId) => {
    const token = localStorage.getItem("token");
    const role = "admin";

    try {
      await axiosInstance.delete(`/post/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { userId: "admin-user-id", role: role },
      });

      // Cập nhật danh sách bài viết trong store
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId),
        approvedPosts: state.approvedPosts.filter(
          (post) => post._id !== postId
        ),
        pendingPosts: state.pendingPosts.filter((post) => post._id !== postId),
      }));

      toast.success("Bài viết đã được xóa thành công!");
    } catch (error) {
      console.error(
        "Error deleting post:",
        error.response?.data?.message || error.message
      );
      toast.error("Lỗi khi xóa bài viết!");
    }
  },

  // Hàm xóa bài viết
  deleteMinePost: async (postId) => {
    set({ isDeleting: true }); // Bắt đầu trạng thái xóa bài
    try {
      await axiosInstance.delete(`/post/user/${postId}`);
      // Cập nhật trạng thái "đang xóa" cho bài viết hiện tại
      set((state) => ({
        isDeleting: { ...state.isDeleting, [postId]: true },
      }));
      return true; // Trả về thành công
    } catch (error) {
      set({ isDeleting: false }); // Kết thúc trạng thái xóa bài
      console.error("Error deleting post:", error);
      toast.error("Có lỗi xảy ra khi xóa bài đăng.");
      throw error; // Ném lỗi để try...catch của handleDeletePost nhận diện được
    }
  },

  // Các hàm khác (fetchPosts, toggleApproval, ...)
}));
