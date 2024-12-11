import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";

export const usePostStore = create((set, get) => ({
  // posts: [], // Lưu danh sách bài đăng
  // post: null, // A single post
  // provinces: [],
  // isCreating: false, // Trạng thái đang tạo bài viết
  // createPostError: null,
  // createPostSuccess: false,
  // approvedPosts: [],
  // pendingPosts: [],
  // isLoading: false, // Trạng thái đang tải
  // error: null, // Lưu thông báo lỗi nếu có
  posts: [], // Lưu danh sách bài đăng
  post: null, // A single post
  provinces: [],
  isCreating: false, // Trạng thái đang tạo bài viết
  createPostError: null,
  createPostSuccess: false,
  approvedPosts: [],
  pendingPosts: [],
  isLoading: false, // Trạng thái đang tải
  error: null, // Lưu thông báo lỗi nếu có
  // Hàm tạo bài đăng
  createPost: async (formData) => {
    try {
      set({ isCreating: true });
      const response = await axiosInstance.post("/post/posts", formData);
      set((state) => ({
        posts: [response.data, ...state.posts], // Thêm bài viết mới vào danh sách
        createPostSuccess: true,
      }));
      toast.success("Bài viết đã được đăng thành công !");
      set({ isCreating: false });
      return response.data; // Trả về bài viết mới tạo
    } catch (error) {
      set({
        isCreating: false,
        createPostError: error.message,
        createPostSuccess: false,
      });
      return false; // Trả về false nếu có lỗi
    } finally {
      set({ isCreating: false });
    }
  },

  // Reset createPostSuccess sau khi thông báo đã được xử lý
  resetCreatePostSuccess: () => set({ createPostSuccess: false }),
  // Lấy bài viết theo ID
  getPostById: async (id) => {
    set({ isLoading: true, error: null }); // Bắt đầu loading
    try {
      const response = await axiosInstance.get(`/post/posts/detail/${id}`);
      if (response.data.status === "Success") {
        set({ post: response.data.data }); // Cập nhật bài viết vào state
      }
    } catch (error) {
      set({ error: "Error loading post", post: null }); // Nếu có lỗi
    } finally {
      set({ isLoading: false }); // Kết thúc loading
    }
  },
  // Phương thức để fetch bài đăng
  fetchPosts: async () => {
    set({ isLoading: true, error: null }); // Bắt đầu tải, đặt error về null
    try {
      const res = await axiosInstance.get("/post/postsId/allItems");
      set({ posts: res.data.data });
    } catch (error) {
      console.error("Error:", error);
      set({ error: "Có lỗi xảy ra khi tải bài đăng" }); // Lưu lỗi
    } finally {
      set({ isLoading: false }); // Kết thúc quá trình tải
    }
  },
  fetchPostSearch: async () => {
    set({ isLoading: true, error: null }); // Bắt đầu tải, đặt error về null
    try {
      const res = await axiosInstance.get("/post/getPostAp");
      set({ posts: res.data.data });
    } catch (error) {
      console.error("Error:", error);
      set({ error: "Có lỗi xảy ra khi tải bài đăng" }); // Lưu lỗi
    } finally {
      set({ isLoading: false }); // Kết thúc quá trình tải
    }
  },
  // Delete post
  deletePost: async (postId) => {
    try {
      await axiosInstance.delete(`/post/user/${postId}`); // API call to delete the post
      // Cập nhật danh sách bài viết bằng cách lọc ra bài bị xóa
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId), // Xóa bài khỏi danh sách
      }));
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error; // Rethrow error to handle it in the component
    }
  },
  fetchPendingPosts: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/admin/pendingPost"); // Lấy bài chưa duyệt
      console.log(response.data); // Kiểm tra dữ liệu trả về từ API
      if (response.data) {
        set({ pendingPosts: response.data, isLoading: false });
      } else {
        console.log("No pending posts found.");
      }
    } catch (error) {
      console.error("Error fetching pending posts:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  // Hàm fetch bài viết đã duyệt
  fetchApprovedPosts: async () => {
    set({ isLoading: true, error: null }); // Đặt trạng thái loading
    try {
      const response = await axiosInstance.get("/admin/approvePost");
      set({ approvedPosts: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching approved posts:", error);
      set({ error: "Error fetching approved posts", isLoading: false });
    }
  },
  toggleApproval: async (postId, currentStatus) => {
    try {
      const response = await axiosInstance.put(`/post/approve/${postId}`, {
        isApproved: !currentStatus, // Đảo ngược trạng thái
      });

      // Cập nhật danh sách bài viết trong state sau khi cập nhật thành công
      if (response.status === 200) {
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === postId ? { ...post, isApproved: !currentStatus } : post
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating post approval status:", error);
    }
  },
  // Hàm lấy dữ liệu tỉnh thành từ API
  fetchProvinces: async () => {
    set({ isLoading: true, error: null }); // Đặt trạng thái loading
    try {
      const response = await axiosInstance.get("/post/provinces"); // URL API
      set({ provinces: response.data, isLoading: false }); // Cập nhật danh sách tỉnh thành
    } catch (error) {
      set({ error: error.message, isLoading: false }); // Xử lý lỗi
    }
  },

  // Hàm lấy tên tỉnh thành theo ID
  getProvinceNameById: (id) => {
    return (
      get().provinces.find((p) => p.id === id)?.name || "Không có địa điểm"
    );
  },
  // Hàm báo cáo bài viết
  reportPost: async (postId, userId) => {
    set({ isLoading: true, error: null }); // Đặt trạng thái loading khi bắt đầu

    try {
      const response = await axiosInstance.post(`/post/report/${postId}`, {
        userId,
      });

      // Xử lý nếu báo cáo thành công
      set({ isLoading: false });
      toast.success(response.data.message); // Hiển thị thông báo thành công
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Có lỗi xảy ra khi báo cáo.",
      });
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi báo cáo."
      ); // Hiển thị thông báo lỗi
      console.error("Report failed:", error);
    }
  },

  // deletePost: async (postId) => {
  //   const token = localStorage.getItem("token"); // Đảm bảo bạn lấy token từ đúng nơi lưu trữ

  //   if (!token) {
  //     console.error("Token không có trong localStorage");
  //     return; // Nếu không có token thì dừng việc xóa bài
  //   }

  //   try {
  //     await axios.delete(`http://localhost:5001/api/post/posts/${postId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Đảm bảo gửi token đúng header
  //       },
  //     });
  //     console.log("Post deleted successfully!");
  //   } catch (error) {
  //     console.error(
  //       "Error deleting post:",
  //       error.response?.data?.message || error.message
  //     );
  //   }
  // },
  // Action to update the post
  updatePost: async (updatedPost) => {
    set({ isLoading: true, error: null });
    try {
      // Use axiosInstance.put() to update the post
      const response = await axiosInstance.put(
        `/post/update/${updatedPost._id}`,
        updatedPost,
        {
          headers: {
            "Content-Type": "application/json", // Optional, but you can include this if needed
          },
        }
      );

      // If the response is successful, update the store
      if (response.status === 200) {
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === updatedPost._id ? response.data : post
          ),
          post: response.data, // Update the current post
          isLoading: false,
        }));
        toast.success("Bài viết đã được cập nhật thành công!"); // Success message
      } else {
        set({ error: response.data.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error("Có lỗi xảy ra khi cập nhật bài viết.");
    }
  },
}));
