import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import "./Container.css";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime } from "../../lib/utils";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const [messageList, setMessageList] = useState(messages);
  const messageEndRef = useRef(null);
  const [canScroll, setCanScroll] = useState(true);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  const handleDeleteMessage = async (messageId) => {
    try {
      // Hiển thị thông báo xóa
      alert("Đang xóa tin nhắn...");

      const response = await fetch(
        `http://localhost:5001/api/message/${messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert("Có lỗi khi xóa tin nhắn!");
        return;
      }

      const result = await response.json();
      if (result.success) {
        // Thay vì setMessageList, ta gọi lại getMessages để đồng bộ dữ liệu
        getMessages(selectedUser._id);
        toast.success("Tin nhắn đã được xóa thành công!");
      } else {
        alert(result.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Đã xảy ra lỗi khi xóa tin nhắn.");
    }
  };

  if (isMessagesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            {/* Ảnh đại diện */}
            <div className="chat-avatar">
              <img
                src={
                  message.senderId === authUser._id
                    ? authUser.profilePic || "/avatar.jpg"
                    : selectedUser.profilePic || "/avatar.jpg"
                }
                alt="Profile avatar"
              />
            </div>

            {/* Nội dung tin nhắn */}
            <div className="chat-content">
              <div className="chat-header">
                <time className="chat-time">
                  {formatMessageTime(message.createdAt)}
                </time>
                {/* Delete Button */}
                {message.senderId === authUser._id && (
                  <button
                    className="text-red-500 text-xs"
                    onClick={() => handleDeleteMessage(message._id)}
                  >
                    Xóa
                  </button>
                )}
              </div>

              <div className="chat-bubble">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p className="chat-text">{message.text}</p>}
              </div>
            </div>
          </div>
        ))}
        {/* Phần này dùng để cuộn xuống dưới */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
