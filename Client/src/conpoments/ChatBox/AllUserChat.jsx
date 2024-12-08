import { useEffect, useState } from "react";
import axios from "axios";
import { axiosInstance } from "../../lib/axios";
import { useChatStore } from "../../store/useChatStore";
import { Link } from "react-router-dom";

const ChatBox = () => {
  const { messages, loading, error, fetchMessages } = useChatStore(); // Sử dụng store từ Zustand

  useEffect(() => {
    fetchMessages(); // Khi component được mount, gọi fetchMessages để lấy tin nhắn
  }, [fetchMessages]);

  if (loading) {
    return <div>Đang tải tin nhắn...</div>; // Hiển thị khi đang tải dữ liệu
  }

  if (error) {
    return <div>{error}</div>; // Hiển thị lỗi nếu có
  }

  return (
    <div className="chat-container">
      <h3>Tất cả các tin nhắn</h3>
      <div
        style={{
          width: "100%",
          height: "400px",
          padding: "10px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        {messages
          .filter((msg) => msg.senderId && msg.receiverId) // Kiểm tra senderId và receiverId có tồn tại
          .map((msg, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <span>
                [
                <Link
                  to={`/admin-dashboard/profile/${msg.senderId._id}`}
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  {msg.senderId.username}
                </Link>
                {" -> "}
                <Link
                  to={`/admin-dashboard/profile/${msg.receiverId._id}`}
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  {msg.receiverId.username}
                </Link>
                ]:
              </span>
              <span> {msg.text}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatBox;
