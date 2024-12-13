import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useSearchStore = create((set) => ({
  provinces: [], // Danh sách tỉnh thành
  query: "",
  location: "",
  lostDate: "",
  searchResults: [],
  isLoading: false,
  error: null,

  // Tải danh sách tỉnh thành từ API
  fetchProvinces: async () => {
    try {
      const response = await axiosInstance.get("/post/provinces"); // Địa chỉ của API
      set({ provinces: response.data });
    } catch (error) {
      console.error("Error fetching provinces:", error);
      set({ error: "Không thể tải danh sách tỉnh thành." });
    }
  },

  setQuery: (query) => set({ query }),
  setLocation: (location) => set({ location }),
  setLostDate: (lostDate) => set({ lostDate }),

  // Gọi API tìm kiếm bài đăng
  searchPosts: async (query, location, lostDate) => {
    set({ isLoading: true, error: null }); // Đặt trạng thái loading
    try {
      const response = await axiosInstance.get(`/post/search`, {
        params: { q: query, location, lostDate }, // Gửi tất cả tham số tìm kiếm vào API
      });
      set({ searchResults: response.data, isLoading: false }); // Cập nhật kết quả tìm kiếm
    } catch (error) {
      set({ error: "Lỗi khi tìm kiếm bài đăng", isLoading: false });
    }
  },
}));
