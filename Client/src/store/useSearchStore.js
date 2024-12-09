import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useSearchStore = create((set) => ({
  query: "",
  searchResults: [],
  setQuery: (query) => set({ query }),
  setSearchResults: (results) => set({ searchResults: results }),
  searchPosts: async (query) => {
    try {
      const response = await axiosInstance.get(`/post/search?q=${query}`);
      // Kiểm tra nếu dữ liệu trả về là mảng
      return Array.isArray(response.data.posts) ? response.data.posts : [];
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  },
}));
