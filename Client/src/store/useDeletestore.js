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
  // Các hàm khác (fetchPosts, toggleApproval, ...)
}));
