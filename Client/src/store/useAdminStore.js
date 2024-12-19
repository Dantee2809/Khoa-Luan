import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
  isCheckingAuth: true,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/getUsers");
      console.log("Fetched Users:", response.data); // Log dữ liệu trả về
      set({
        userProfile: response.data,
        following: response.data.following || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching users:", error.message);
      set({ error: "Failed to fetch users", isLoading: false });
    }
  },
}));
