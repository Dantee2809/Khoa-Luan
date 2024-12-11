import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../conpoments/ChatBox/Sidebar.jsx";
import NoChatSelected from "../../conpoments/ChatBox/NoChatSelected.jsx";
import ChatContainer from "../../conpoments/ChatBox/ChatContainer.jsx";

const Chat = () => {
  const { selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/"); // Navigate back to home or previous page
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-base-300">
      <div className="bg-base-100 rounded-lg shadow-lg w-full h-full flex">
        <div className="flex h-full w-full overflow-hidden">
          {/* Sidebar with Return Button inside */}
          <Sidebar includeReturnButton />

          {/* Chat Container or No Chat Selected */}
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default Chat;
