import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useSearchStore = create((set) => ({
  query: "", // Từ khóa tìm kiếm
  searchResults: [], // Kết quả tìm kiếm
  isLoading: false, // Trạng thái tải tìm kiếm
  error: null, // Lỗi nếu có

  // Cập nhật từ khóa tìm kiếm
  setQuery: (query) => set({ query }),

  // Gọi API tìm kiếm bài đăng
  searchPosts: async (query) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/post/search?query=${query}`);
      set({ searchResults: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Lỗi khi tìm kiếm bài đăng", isLoading: false });
    }
  },
}));

// query: "", // Trạng thái mặc định của query
// results: [], // Kết quả tìm kiếm
// userResults: [], // Kết quả tìm kiếm người dùng
// setQuery: (newQuery) => set({ query: newQuery }), // Cập nhật query
// setResults: (newResults) => set({ results: newResults || [] }),
// setUserResults: (newUserResults) => set({ userResults: newUserResults || [] }),

// fetchSearchResults: async (searchQuery) => {
//   try {
//     const [postResponse, userResponse] = await Promise.all([
//       axiosInstance.get(`/user/search/posts?q=${searchQuery}`),
//       axiosInstance.get(`/user/search/users?q=${searchQuery}`),
//     ]);
//     set({ results: postResponse.data, userResults: userResponse.data });
//   } catch (error) {
//     console.error("Lỗi khi tìm kiếm:", error);
//     set({ results: [], userResults: [] });
//   }
// }
