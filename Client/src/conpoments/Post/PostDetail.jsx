import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePostStore } from "../../store/usePostStore"; // Import zustand store
import "./PostDetail.css"; // Thêm file CSS vào
import { useAuthStore } from "../../store/useAuthStore";

const PostDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate(); // Dùng để điều hướng
  const {
    getPostById,
    post,
    isLoading,
    error,
    followUser,
    unfollowUser,
    isFollowing,
  } = usePostStore(); // Lấy các trạng thái và hành động từ zustand store

  // const currentUserId = localStorage.getItem("userId");
  const { authUser } = useAuthStore(); // Lấy thông tin người dùng hiện tại (có thể lưu trong store)
  const [user, setUser] = useState(null);
  // Lấy dữ liệu bài viết khi có thay đổi id
  useEffect(() => {
    if (id) {
      getPostById(id); // Gọi hàm từ store để lấy dữ liệu bài viết theo id
    }
  }, [id, getPostById]);
  const handleGoBack = () => {
    // Chức năng quay lại (có thể điều hướng về trang trước đó hoặc trang chủ)
    navigate(-1); // Quay lại trang trước đó
  };
  // Thêm SDK Facebook vào trang
  useEffect(() => {
    // Tạo một script để tải SDK Facebook
    const script = document.createElement("script");
    script.src =
      "https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v21.0";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Cleanup khi component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Post not found!</div>;
  }

  // const handleFollow = () => {
  //   followUser(currentUserId, post.userId); // Theo dõi người dùng
  // };

  // const handleUnfollow = () => {
  //   unfollowUser(currentUserId, post.userId); // Hủy theo dõi người dùng
  // };

  return (
    <div className="post-detail">
      <div className="post-header">
        <h1>{user ? user.username : "Người dùng ẩn danh"}</h1>{" "}
        {/* Hiển thị tên người dùng */}
        {/* Ẩn nút "Quay lại" nếu là admin */}
        <button className="go-back-btn" onClick={handleGoBack}>
          Quay lại
        </button>
      </div>
      <p className="post-description">{post.desc}</p>
      {post.image && <img src={post.image} alt="Post" className="post-image" />}
      <p className="post-contact">Liên hệ: {post.contact}</p>
      <p className="post-location">Địa điểm: {post.location}</p>

      {/* <div className="post-actions">
        {isFollowing ? (
          <button className="follow-btn unfollow" onClick={handleUnfollow}>
            Hủy theo dõi
          </button>
        ) : (
          <button className="follow-btn follow" onClick={handleFollow}>
            Theo dõi
          </button>
        )}
      </div> */}

      {/* Plugin chia sẻ Facebook */}
      <div id="fb-root"></div>
      <div
        className="fb-share-button"
        data-href={`http://localhost:3000/post/${post._id}`} // Không mã hóa URL
        data-layout="button_count"
        data-size="large"
      >
        <a
          target="_blank"
          href={`https://www.facebook.com/sharer/sharer.php?u=http://localhost:3000/post/${post._id}`} // Không mã hóa URL
          className="fb-xfbml-parse-ignore"
        >
          Chia sẻ
        </a>
      </div>
    </div>
  );
};

export default PostDetail;
