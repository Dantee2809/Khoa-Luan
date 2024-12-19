import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { fetchAllMessages } from "../lib/fetch";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  contacts: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  loading: false, // Biến trạng thái loading
  error: null, // Biến lưu lỗi nếu có
  fetchMessages: async () => {
    set({ loading: true, error: null }); // Đặt loading thành true khi đang lấy dữ liệu
    try {
      const messages = await fetchAllMessages(); // Gọi API để lấy tin nhắn
      set({ messages, loading: false }); // Cập nhật danh sách tin nhắn và tắt loading
    } catch (error) {
      set({ error: "Không thể tải tin nhắn", loading: false }); // Nếu có lỗi, cập nhật error
    }
  },
  // Phương thức xóa tin nhắn
  deleteMessage: async (messageId) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/message/${messageId}`
      ); // Gọi API xóa tin nhắn
      if (response.status === 200) {
        // Nếu API trả về thành công, xóa tin nhắn trong state
        set((state) => ({
          messages: state.messages.filter((msg) => msg._id !== messageId),
        }));
        toast.success("Xóa tin nhắn thành công!");
      }
    } catch (error) {
      console.error("Lỗi xóa tin nhắn:", error);
      toast.error("Có lỗi xảy ra khi xóa tin nhắn");
      throw error; // Ném lỗi để component bắt lỗi
    }
  },
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  // Lấy danh sách những người đã follow
  getContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];

      console.log(token); // Xem token có hợp lệ không

      const response = await axiosInstance.get("/message/users", {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
        withCredentials: true, // Đảm bảo cookie được gửi
      });
      set({ contacts: response.data, isUsersLoading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi";
      set({ registerError: errorMessage }); // Lưu thông báo lỗi
      toast.error(errorMessage);
      set({ isUsersLoading: false });
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      //   const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      //   if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  // setSelectedUser: (selectedUser) => set({ selectedUser }),
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
