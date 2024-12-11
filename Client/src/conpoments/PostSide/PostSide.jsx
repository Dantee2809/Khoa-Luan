import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import Post from "../Post/Post";
import { useAuthStore } from "../../store/useAuthStore";
import Posts from "../Posts/Posts";

const PostSide = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser } = useAuthStore(); // 🟢 Không điều kiện hóa logic hooks

  useEffect(() => {
    const fetchPosts = async () => {
      if (!authUser) return; // ✅ Logic chạy bên trong hook, không gây lỗi hooks
      setLoading(true);
      setError(null);
      try {
        console.log("Gọi API để lấy bài viết của user:", authUser._id);
        const response = await axiosInstance.get(
          `/post/posts/user/${authUser._id}`
        );
        setPosts(response.data);
      } catch (error) {
        setError("Không thể tải bài viết của bạn. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts(); // 🟢 Luôn luôn được gọi
  }, [authUser]); // useEffect sẽ luôn luôn được gọi

  if (!authUser) {
    return <p>Đang tải thông tin người dùng...</p>; // 🟢 OK vì logic hooks không bị ngắt
  }

  return (
    <div className="PostSide">
      <h2>Bài viết của tôi</h2>

      {loading && <p>Đang tải bài viết của bạn...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && posts.length === 0 && <p>Chưa có bài viết nào.</p>}

      {!loading && !error && posts.length > 0 && (
        <div className="posts-list">
          {posts.map((post) => (
            <Post
              key={post._id}
              data={post}
              currentUserId={authUser._id}
              authUserId={authUser._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostSide;
