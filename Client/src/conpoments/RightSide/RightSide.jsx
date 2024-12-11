import React, { useState } from "react";
import "./RightSide.css";
import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import AdvCard from "../AdvCard/AdvCard";
import ShareModal from "../ShareModal/ShareModal";
import { usePostStore } from "../../store/usePostStore";
import { MdOutlinePostAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const { createPost, isCreatingPost, createPostError, createPostSuccess } =
    usePostStore();
  const { authUser } = useAuthStore(); // Sử dụng Zustand store để lấy thông tin người dùng
  const isAdmin = authUser?.role === "admin"; // Nếu là admin thì không được phép đăng bài

  const handleSubmit = async (formData) => {
    const newPost = await createPost(formData); // Tạo bài viết mới
    if (newPost) {
      setModalOpened(false); // Đóng modal nếu tạo bài thành công
    }
  };

  return (
    <div className="RightSide">
      {/* Navigation Icons */}
      <div className="navIcons">
        <Link to="/">
          <img
            src={Home}
            alt="Home"
            className="w-8 h-8 hover:scale-110 transition-transform"
          />
        </Link>
        <Link to="/chatbox">
          <img
            src={Comment}
            alt="Chatbox"
            className="w-8 h-8 hover:scale-110 transition-transform"
          />
        </Link>
      </div>

      {/* Advertisement Card */}
      <AdvCard />

      <div className="a-bottom">
        {/* Chỉ hiển thị nút "Thêm Bài Đăng mới" nếu không phải admin */}
        {!isAdmin && (
          <button
            className="button r-button"
            onClick={() => setModalOpened(true)}
          >
            <MdOutlinePostAdd />
            Thêm Bài Đăng mới
          </button>
        )}

        <ShareModal
          modalOpened={modalOpened}
          setModalOpened={setModalOpened}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default RightSide;
