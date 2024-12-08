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

const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const { createPost, isCreatingPost, createPostError, createPostSuccess } =
    usePostStore();

  // Hàm handleSubmit gửi form dữ liệu đến store
  const handleSubmit = async (formData) => {
    const success = await createPost(formData);
    if (success) {
      setModalOpened(false); // Đóng modal nếu tạo bài thành công
    }
  };

  return (
    <div className="RightSide bg-base-100 rounded-xl">
      {/* Navigation Icons */}
      <div className="navIcons">
        <Link to="/">
          <img
            src={Home}
            alt="Home"
            className="w-8 h-8 hover:scale-110 transition-transform"
          />
        </Link>
        <Link to="/">
          <img src={Noti} alt="" />
        </Link>
        {/* Modal for Creating Posts */}
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

      <div className="">
        <button
          className="button r-button"
          onClick={() => setModalOpened(true)}
        >
          <MdOutlinePostAdd />
          Thêm Bài Đăng mới{" "}
        </button>
        <ShareModal
          modalOpened={modalOpened}
          setModalOpened={setModalOpened}
          onSubmit={handleSubmit}
        />
      </div>
      {/* Feedback Notifications */}
      {/* <div className="mt-4">
        {isCreatingPost && (
          <p className="text-sm text-blue-600 animate-pulse">
            Đang tạo bài đăng...
          </p>
        )}
        {createPostError && (
          <p className="text-sm text-red-500">❌ Lỗi: {createPostError}</p>
        )}
        {createPostSuccess && (
          <p className="text-sm text-green-600">✔️ Tạo bài đăng thành công!</p>
        )}
      </div> */}
    </div>
  );
};

export default RightSide;
