import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useChatStore } from "../../store/useChatStore";

const AllUserChat = () => {
  const { messages, loading, error, fetchMessages, deleteMessage } =
    useChatStore();
  const chatContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const [filteredMessages, setFilteredMessages] = useState(messages); // Lọc tin nhắn

  // Gọi fetchMessages khi component được mount
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Hàm để định dạng thời gian tin nhắn (hiển thị ngày, tháng, năm và giờ, phút, giây)
  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    return (
      messageDate.toLocaleDateString("vi-VN", {
        weekday: "short", // Hiển thị thứ (T2, T3, v.v.)
        day: "2-digit", // Hiển thị ngày
        month: "2-digit", // Hiển thị tháng
        year: "numeric", // Hiển thị năm
      }) +
      " - " +
      messageDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight; // Cuộn xuống khi có tin nhắn mới
    }
  }, [messages]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMessages(messages); // Hiển thị tất cả tin nhắn nếu không có tìm kiếm
    } else {
      const filtered = messages.filter((msg) => {
        const senderUsername = msg.senderId?.username || "";
        const receiverUsername = msg.receiverId?.username || "";
        const messageText = msg.text || "";

        return (
          messageText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          senderUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
          receiverUsername.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });

      setFilteredMessages(filtered); // Lọc tin nhắn theo tìm kiếm
    }
  }, [searchQuery, messages]);

  // Xử lý xóa tin nhắn
  const handleDeleteMessage = async (messageId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa tin nhắn này?"
    );
    if (!confirmDelete) return;

    try {
      await deleteMessage(messageId); // Gọi API xóa tin nhắn
      alert("Xóa tin nhắn thành công!");
    } catch (err) {
      console.error("Lỗi xóa tin nhắn:", err);
      alert("Có lỗi xảy ra khi xóa tin nhắn");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500">Đang tải tin nhắn...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="chat-container bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Tất cả các tin nhắn</h3>

      {/* Input tìm kiếm */}
      <div className="search-bar mb-4">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm tin nhắn"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div
        ref={chatContainerRef}
        className="chat-box overflow-y-auto p-4 border border-gray-300 rounded-lg"
        style={{ height: "600px" }}
      >
        {filteredMessages
          .filter((msg) => msg.senderId && msg.receiverId) // Kiểm tra tồn tại
          .reverse() // Reverse the messages to show the newest at the top
          .map((msg, index) => (
            <div
              key={index}
              className="message-item mb-4 p-2 border-b border-gray-200"
            >
              <div className="font-medium text-blue-600">
                <Link
                  to={`/admin-dashboard/profile/${msg.senderId?._id}`}
                  className="underline"
                >
                  {msg.senderId?.username || "Không xác định"}
                </Link>
                {" -> "}
                <Link
                  to={`/admin-dashboard/profile/${msg.receiverId?._id}`}
                  className="underline"
                >
                  {msg.receiverId?.username || "Không xác định"}
                </Link>
              </div>
              <div className="text-gray-800 mt-1">
                {msg.text || "Không có nội dung"}
              </div>

              <div className="text-gray-500 text-sm mt-1">
                Nhắn vào lúc: {formatMessageTime(msg.createdAt)}
              </div>

              {msg.image && (
                <div className="mt-2">
                  <a
                    href={msg.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 no-underline"
                  >
                    Nhấn vào để xem ảnh
                  </a>
                </div>
              )}
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleDeleteMessage(msg._id)}
                  className="text-red-500 hover:underline"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllUserChat;
