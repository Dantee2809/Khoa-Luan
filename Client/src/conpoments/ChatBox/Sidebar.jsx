import { useEffect, useState } from "react";
import { MessageCircle, Users } from "lucide-react";
import SidebarSkeleton from "../Skeletons/SidebarSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Import icon mũi tên từ react-icons

const Sidebar = ({ includeReturnButton }) => {
  const {
    getContacts,
    contacts,
    isLoading: isContactsLoading,
    selectedUser,
    setSelectedUser,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  // Lọc danh sách users
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isOnline = onlineUsers.includes(contact._id);

    return matchesSearch && (showOnlineOnly ? isOnline : true);
  });

  // Hiển thị skeleton khi đang tải dữ liệu
  if (isContactsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      {includeReturnButton && (
        <button onClick={() => navigate("/")} className="btn text-black">
          <FaArrowLeft size={20} />
          Trở về
        </button>
      )}

      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white rounded-full shadow-lg">
            <MessageCircle className="size-6 text-blue-500" />
          </div>
          <span className="text-lg font-semibold hidden lg:block">
            Tin nhắn
          </span>
        </div>

        {/* Input tìm kiếm người dùng */}
        <input
          type="text"
          placeholder="Nhập tên người dùng để tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-gray-500 rounded-lg p-2 w-full max-w-xs"
        />

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="hidden custom-checkbox"
            />
            <span className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded-md transition-all duration-300 hover:bg-gray-300">
              {showOnlineOnly && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="white"
                  className="w-4 h-4 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
            <span className="text-sm">Chỉ hiển thị online</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* Danh sách contacts */}
      <div className="overflow-y-auto w-full py-3">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <button
              key={contact._id}
              onClick={() => setSelectedUser(contact)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedUser?._id === contact._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
            >
              {/* Avatar người dùng */}
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={contact.profilePic || "/avatar.jpg"}
                  alt={contact.username}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(contact._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* Thông tin người dùng */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{contact.username}</div>
                <div className="text-sm text-zinc-400">
                  {contact.latestMessage
                    ? contact.latestMessage
                    : onlineUsers.includes(contact._id)
                    ? "Online"
                    : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-gray-500">
            Không có liên hệ nào phù hợp.
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
